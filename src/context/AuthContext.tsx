"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  customerLogin: (email: string, password: string) => Promise<boolean>;
  customerSignup: (name: string, email: string, phone: string, password: string, address: string) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'github') => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>({
  isLoggedIn: false,
  currentUser: null,
  userType: null,
  isLoading: true,
  login: async () => false,
  customerLogin: async () => false,
  customerSignup: async () => false,
  socialLogin: async () => false,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | CustomerUser | null>(null);
  const [userType, setUserType] = useState<"admin" | "customer" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = async () => {
    console.log("AuthContext: Checking session...");
    try {
      const response = await api.get('/auth/me');
      console.log("AuthContext: checkSession response:", response);
      if (response.success && response.user) {
        const user = response.user;
        setCurrentUser(user);
        setIsLoggedIn(true);
        if ('username' in user) {
          setUserType('admin');
        } else {
          setUserType('customer');
        }
        console.log("AuthContext: Session restored, user type:", 'username' in user ? 'admin' : 'customer');
      }
    } catch (e) {
      console.log("AuthContext: No active session found");
    } finally {
      console.log("AuthContext: Finished checking session, setting isLoading to false");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  // Admin login
  const login = async (username: string, password: string): Promise<boolean> => {
    console.log("AuthContext: Attempting login with username:", username);
    try {
      const response = await api.post('/auth/login', { username, password });
      console.log("AuthContext: Login response:", response);
      if (response.success && response.user) {
        console.log("AuthContext: Login successful, setting user");
        setCurrentUser(response.user);
        setIsLoggedIn(true);
        setUserType("admin");
        return true;
      }
    } catch (error) {
      console.error("AuthContext: Login failed:", error);
    }
    return false;
  };

  // Customer login
  const customerLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/customer/login', { email, password });
      if (response.success && response.user) {
        setCurrentUser(response.user);
        setIsLoggedIn(true);
        setUserType("customer");
        return true;
      }
    } catch (error) {
      console.error("Customer login failed:", error);
    }
    return false;
  };

  // Customer signup
  const customerSignup = async (name: string, email: string, phone: string, password: string, address: string): Promise<boolean> => {
    try {
      const response = await api.post('/customer/signup', { name, email, phone, password, address });
      if (response.success && response.user) {
        setCurrentUser(response.user);
        setIsLoggedIn(true);
        setUserType("customer");
        return true;
      }
    } catch (error) {
      console.error("Customer signup failed:", error);
    }
    return false;
  };

  const socialLogin = async (provider: 'google' | 'github'): Promise<boolean> => {
    // Simulate social login (in real app, this would be OAuth flow)
    return false;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (e) {
      console.error("Logout API error:", e);
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      currentUser, 
      userType,
      isLoading, 
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
