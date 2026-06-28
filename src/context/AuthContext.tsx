"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useStore } from "./StoreContext";
import { setCookie, getCookie, eraseCookie, COOKIE_NAMES } from "@/lib/cookie-utils";
import { api } from "@/lib/api-client";

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: "admin" | "superadmin";
  isActive: boolean;
  createdAt: string;
}

interface CustomerUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  loyaltyPoints: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: AdminUser | CustomerUser | null;
  userType: "admin" | "customer" | null;
  login: (username: string, password: string) => Promise<boolean>;
  customerLogin: (email: string, password: string) => Promise<boolean>;
  customerSignup: (name: string, email: string, phone: string, password: string, address: string) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'github') => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cookie names for customer
const CUSTOMER_COOKIE_NAMES = {
  IS_LOGGED_IN: 'himmat_customer_logged_in',
  SESSION_TOKEN: 'himmat_customer_session',
  CURRENT_USER: 'himmat_customer_user'
} as const;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { verifyAdminCredentials, customers, addCustomer } = useStore();
  
  // Validate existing session on load
  const validateSession = (): { 
    isValid: boolean; 
    user: AdminUser | CustomerUser | null; 
    userType: "admin" | "customer" | null 
  } => {
    if (typeof window === "undefined") {
      return { isValid: false, user: null, userType: null };
    }
    
    // Check admin first
    const adminToken = getCookie(COOKIE_NAMES.SESSION_TOKEN);
    const adminLoggedIn = getCookie(COOKIE_NAMES.IS_LOGGED_IN);
    const adminUserStr = getCookie(COOKIE_NAMES.CURRENT_USER);
    
    if (adminToken && adminLoggedIn === 'true' && adminUserStr) {
      try {
        const tokenData = JSON.parse(atob(adminToken));
        const now = Date.now();
        const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000;
        
        if (now - tokenData.timestamp > FOUR_DAYS_MS) {
          clearAdminCookies();
          return { isValid: false, user: null, userType: null };
        }
        return { isValid: true, user: JSON.parse(adminUserStr), userType: "admin" };
      } catch (e) {
        clearAdminCookies();
      }
    }
    
    // Check customer
    const customerToken = getCookie(CUSTOMER_COOKIE_NAMES.SESSION_TOKEN);
    const customerLoggedIn = getCookie(CUSTOMER_COOKIE_NAMES.IS_LOGGED_IN);
    const customerUserStr = getCookie(CUSTOMER_COOKIE_NAMES.CURRENT_USER);
    
    if (customerToken && customerLoggedIn === 'true' && customerUserStr) {
      try {
        const tokenData = JSON.parse(atob(customerToken));
        const now = Date.now();
        const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000;
        
        if (now - tokenData.timestamp > FOUR_DAYS_MS) {
          clearCustomerCookies();
          return { isValid: false, user: null, userType: null };
        }
        return { isValid: true, user: JSON.parse(customerUserStr), userType: "customer" };
      } catch (e) {
        clearCustomerCookies();
      }
    }
    
    return { isValid: false, user: null, userType: null };
  };

  const clearAdminCookies = () => {
    if (typeof window !== "undefined") {
      eraseCookie(COOKIE_NAMES.SESSION_TOKEN);
      eraseCookie(COOKIE_NAMES.IS_LOGGED_IN);
      eraseCookie(COOKIE_NAMES.CURRENT_USER);
    }
  };
  
  const clearCustomerCookies = () => {
    if (typeof window !== "undefined") {
      eraseCookie(CUSTOMER_COOKIE_NAMES.SESSION_TOKEN);
      eraseCookie(CUSTOMER_COOKIE_NAMES.IS_LOGGED_IN);
      eraseCookie(CUSTOMER_COOKIE_NAMES.CURRENT_USER);
    }
  };
  
  const clearAuthStorage = () => {
    clearAdminCookies();
    clearCustomerCookies();
  };
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | CustomerUser | null>(null);
  const [userType, setUserType] = useState<"admin" | "customer" | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from cookies on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = validateSession();
      setIsLoggedIn(session.isValid);
      setCurrentUser(session.user);
      setUserType(session.userType);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      if (isLoggedIn && currentUser) {
        if (userType === "admin") {
          setCookie(COOKIE_NAMES.IS_LOGGED_IN, "true", 4);
          setCookie(COOKIE_NAMES.CURRENT_USER, JSON.stringify(currentUser), 4);
        } else if (userType === "customer") {
          setCookie(CUSTOMER_COOKIE_NAMES.IS_LOGGED_IN, "true", 4);
          setCookie(CUSTOMER_COOKIE_NAMES.CURRENT_USER, JSON.stringify(currentUser), 4);
        }
      } else {
        clearAuthStorage();
      }
    }
  }, [isLoggedIn, currentUser, userType, isInitialized]);

  // Admin login
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.success && response.user) {
        clearCustomerCookies();
        setIsLoggedIn(true);
        setCurrentUser(response.user);
        setUserType("admin");
        if (typeof window !== "undefined") {
          const sessionToken = btoa(JSON.stringify({ userId: response.user.id, timestamp: Date.now() }));
          setCookie(COOKIE_NAMES.SESSION_TOKEN, sessionToken, 4);
        }
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
    return false;
  };
  
  // Customer login
  const customerLogin = async (email: string, password: string): Promise<boolean> => {
    // Simple password check - in real app this would be hashed
    const customer = customers.find(c => c.email === email && c.name === password); // demo: name as password
    if (customer) {
      clearAdminCookies();
      setIsLoggedIn(true);
      setCurrentUser(customer);
      setUserType("customer");
      if (typeof window !== "undefined") {
        const sessionToken = btoa(JSON.stringify({ customerId: customer.id, timestamp: Date.now() }));
        setCookie(CUSTOMER_COOKIE_NAMES.SESSION_TOKEN, sessionToken, 4);
      }
      return true;
    }
    return false;
  };
  
  // Customer signup
  const customerSignup = async (name: string, email: string, phone: string, password: string, address: string): Promise<boolean> => {
    const existingCustomer = customers.find(c => c.email === email);
    if (existingCustomer) return false;
    
    const newCustomer: CustomerUser = {
      id: Date.now(),
      name,
      email,
      phone,
      address,
      loyaltyPoints: 0,
      tier: "Bronze",
      ordersCount: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString()
    };
    
    await addCustomer(newCustomer);
    clearAdminCookies();
    setIsLoggedIn(true);
    setCurrentUser(newCustomer);
    setUserType("customer");
    if (typeof window !== "undefined") {
      const sessionToken = btoa(JSON.stringify({ customerId: newCustomer.id, timestamp: Date.now() }));
      setCookie(CUSTOMER_COOKIE_NAMES.SESSION_TOKEN, sessionToken, 4);
    }
    
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserType(null);
    clearAuthStorage();
  };

  const socialLogin = async (provider: 'google' | 'github'): Promise<boolean> => {
    // Simulate social login (in real app, this would be OAuth flow)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data based on provider
    const mockName = provider === 'google' 
      ? 'Google User' 
      : 'GitHub User';
    const mockEmail = `${provider.toLowerCase()}@example.com`;
    
    // Check if user already exists
    const existingCustomer = customers.find(c => c.email === mockEmail);
    if (existingCustomer) {
      // Login existing user
      clearAdminCookies();
      setIsLoggedIn(true);
      setCurrentUser(existingCustomer);
      setUserType('customer');
      if (typeof window !== 'undefined') {
        const sessionToken = btoa(JSON.stringify({ 
          customerId: existingCustomer.id, 
          provider, 
          timestamp: Date.now() 
        }));
        setCookie(CUSTOMER_COOKIE_NAMES.SESSION_TOKEN, sessionToken, 4);
      }
      return true;
    } else {
      // Create new user
      const newCustomer: CustomerUser = {
        id: Date.now(),
        name: mockName,
        email: mockEmail,
        phone: '',
        address: '',
        loyaltyPoints: 0,
        tier: 'Bronze',
        ordersCount: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString()
      };
      
      await addCustomer(newCustomer);
      clearAdminCookies();
      setIsLoggedIn(true);
      setCurrentUser(newCustomer);
      setUserType('customer');
      if (typeof window !== 'undefined') {
        const sessionToken = btoa(JSON.stringify({ 
          customerId: newCustomer.id, 
          provider, 
          timestamp: Date.now() 
        }));
        setCookie(CUSTOMER_COOKIE_NAMES.SESSION_TOKEN, sessionToken, 4);
      }
      return true;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      currentUser, 
      userType, 
      login, 
      customerLogin, 
      customerSignup, 
      socialLogin, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
