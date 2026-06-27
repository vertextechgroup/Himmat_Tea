'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { 
  ArrowRight, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Github,
  Chrome
} from "lucide-react";

export default function CustomerAuth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  
  const { customerLogin, customerSignup, socialLogin, isLoggedIn, userType } = useAuth();
  
  // Redirect if already logged in
  if (isLoggedIn) {
    if (userType === 'customer') {
      router.replace('/account');
    } else {
      router.replace('/');
    }
    return null;
  }

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await customerLogin(loginForm.email, loginForm.password);
      if (success) {
        router.push(redirectTo);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await customerSignup(
        signupForm.name,
        signupForm.email,
        signupForm.phone,
        signupForm.password,
        signupForm.address
      );
      
      if (success) {
        router.push(redirectTo);
      } else {
        setError('Email already exists');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setError('');
    setSocialLoading(provider);
    
    try {
      const success = await socialLogin(provider);
      if (success) {
        router.push(redirectTo);
      } else {
        setError(`Failed to login with ${provider}`);
      }
    } catch (err) {
      setError(`Failed to login with ${provider}`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f7f4]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navigation />
      <main className="pt-[180px] pb-24">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold mb-3">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </p>
            <h1 
              className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-semibold text-[#1c1917]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {mode === 'login' ? 'Sign In' : 'Join Us'}
            </h1>
            <p className="text-[#78746e] mt-3 max-w-md mx-auto">
              {mode === 'login' 
                ? 'Sign in to access your account, track orders, and more.'
                : 'Create an account to save your details and checkout faster.'}
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[rgba(28,25,23,0.06)]">
            {/* Social Login Buttons */}
            <div className="space-y-3 mb-8">
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={!!socialLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-[rgba(28,25,23,0.15)] rounded-xl hover:bg-[#f9f7f4] transition-all text-sm font-medium text-[#1c1917] disabled:opacity-50 cursor-pointer"
              >
                {socialLoading === 'google' ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-[#1c1917] border-t-transparent"></span>
                ) : (
                  <Chrome className="h-5 w-5 text-red-500" />
                )}
                Continue with Google
              </button>
              
              <button
                onClick={() => handleSocialLogin('github')}
                disabled={!!socialLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[#1c1917] text-white border border-[#1c1917] rounded-xl hover:bg-[#333] transition-all text-sm font-medium disabled:opacity-50 cursor-pointer"
              >
                {socialLoading === 'github' ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                ) : (
                  <Github className="h-5 w-5" />
                )}
                Continue with GitHub
              </button>
            </div>
            
            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[rgba(28,25,23,0.1)]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#78746e]">or continue with email</span>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex mb-8 bg-[#f9f7f4] p-1 rounded-xl">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'login'
                    ? 'bg-white text-[#2d5a3d] shadow-sm'
                    : 'text-[#78746e] hover:text-[#1c1917]'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-[#2d5a3d] shadow-sm'
                    : 'text-[#78746e] hover:text-[#1c1917]'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Login Form */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#1c1917] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78746e]" />
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-[rgba(28,25,23,0.12)] bg-[#f9f7f4] text-[#1c1917] focus:outline-none focus:border-[#2d5a3d] transition-colors text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1c1917] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78746e]" />
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Your name (demo mode)"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-[rgba(28,25,23,0.12)] bg-[#f9f7f4] text-[#1c1917] focus:outline-none focus:border-[#2d5a3d] transition-colors text-sm"
                      required
                    />
                  </div>
                  <p className="text-xs text-[#78746e] mt-2">
                    Demo: Use email from our customers list, password = customer name
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#2d5a3d] text-white font-semibold rounded-xl hover:bg-[#234832] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                  {!loading && <ArrowRight className="h-5 w-5" />}
                </button>
              </form>
            )}

            {/* Signup Form */}
            {mode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#1c1917] mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78746e]" />
                    <input
                      type="text"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-[rgba(28,25,23,0.12)] bg-[#f9f7f4] text-[#1c1917] focus:outline-none focus:border-[#2d5a3d] transition-colors text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1c1917] mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78746e]" />
                      <input
                        type="email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="john@example.com"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[rgba(28,25,23,0.12)] bg-[#f9f7f4] text-[#1c1917] focus:outline-none focus:border-[#2d5a3d] transition-colors text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1c1917] mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78746e]" />
                      <input
                        type="tel"
                        value={signupForm.phone}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+977 98XXXXXXXX"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[rgba(28,25,23,0.12)] bg-[#f9f7f4] text-[#1c1917] focus:outline-none focus:border-[#2d5a3d] transition-colors text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1c1917] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78746e]" />
                    <input
                      type="password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Create a password"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-[rgba(28,25,23,0.12)] bg-[#f9f7f4] text-[#1c1917] focus:outline-none focus:border-[#2d5a3d] transition-colors text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1c1917] mb-1.5">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3 h-4 w-4 text-[#78746e]" />
                    <textarea
                      value={signupForm.address}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Your delivery address"
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-[rgba(28,25,23,0.12)] bg-[#f9f7f4] text-[#1c1917] focus:outline-none focus:border-[#2d5a3d] transition-colors text-sm resize-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#2d5a3d] text-white font-semibold rounded-xl hover:bg-[#234832] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                  {!loading && <ArrowRight className="h-5 w-5" />}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-[#78746e]">
                {mode === 'login' 
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="ml-2 text-[#2d5a3d] font-semibold hover:underline"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
