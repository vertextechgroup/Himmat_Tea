'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { 
  LogOut, 
  ShoppingBag, 
  User, 
  MapPin, 
  Mail, 
  Phone,
  Star,
  History
} from "lucide-react";

export default function CustomerAccount() {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const { currentUser, userType, logout } = useAuth();
  const { orders } = useStore();
  const router = useRouter();

  if (!currentUser || userType !== 'customer') {
    router.replace('/customer-auth?redirect=/account');
    return null;
  }

  const customer = currentUser as any;
  const customerOrders = orders.filter(order => order.customerEmail === customer.email);

  const statusColors: Record<string, string> = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Shipped': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Refunded': 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="min-h-screen bg-[#f9f7f4]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navigation />
      <main className="pt-[180px] pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold mb-3">
              My Account
            </p>
            <h1 
              className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-semibold text-[#1c1917]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Hello, {customer.name}!
            </h1>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-10">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[rgba(28,25,23,0.06)] overflow-hidden sticky top-32">
                <div className="p-6 border-b border-[rgba(28,25,23,0.06)]">
                  <div className="w-16 h-16 rounded-full bg-[#2d5a3d] flex items-center justify-center mb-4">
                    <span className="text-2xl font-semibold text-white">
                      {customer.name.charAt(0)}
                    </span>
                  </div>
                  <p className="font-semibold text-[#1c1917]">{customer.name}</p>
                  <p className="text-sm text-[#78746e]">{customer.email}</p>
                  {customer.tier && (
                    <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-[#c8a96e]/10 rounded-full">
                      <Star className="h-3 w-3 text-[#c8a96e]" />
                      <span className="text-xs font-semibold text-[#c8a96e]">
                        {customer.tier} Member
                      </span>
                    </div>
                  )}
                </div>

                <nav className="p-4 space-y-1">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === 'orders'
                        ? 'bg-[#2d5a3d] text-white'
                        : 'text-[#78746e] hover:text-[#1c1917] hover:bg-[#f9f7f4]'
                    }`}
                  >
                    <History className="h-4 w-4" />
                    Order History
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === 'profile'
                        ? 'bg-[#2d5a3d] text-white'
                        : 'text-[#78746e] hover:text-[#1c1917] hover:bg-[#f9f7f4]'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    Profile Details
                  </button>

                  <div className="h-px bg-[rgba(28,25,23,0.06)] my-3" />

                  <button
                    onClick={() => {
                      logout();
                      router.push('/');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-1">
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-2xl border border-[rgba(28,25,23,0.06)] p-8">
                  <h2 className="text-xl font-semibold text-[#1c1917] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Order History
                  </h2>

                  {customerOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-12 w-12 text-[#78746e] mx-auto mb-4" />
                      <p className="text-lg font-medium text-[#1c1917] mb-2">No orders yet</p>
                      <p className="text-sm text-[#78746e] mb-6">Once you place an order, it will show up here.</p>
                      <Link 
                        href="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#2d5a3d] text-white font-semibold rounded-xl hover:bg-[#234832] transition-colors"
                      >
                        Shop Now
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {customerOrders.map((order) => (
                        <div key={order.id} className="border border-[rgba(28,25,23,0.08)] rounded-xl overflow-hidden">
                          <div className="p-5 bg-[#f9f7f4] flex items-center justify-between flex-wrap gap-3">
                            <div>
                              <p className="text-sm font-semibold text-[#1c1917]">
                                Order {order.id}
                              </p>
                              <p className="text-xs text-[#78746e]">
                                {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="text-xs text-[#78746e]">Total</p>
                                <p className="font-semibold text-[#1c1917]">
                                  Rs. {order.grandTotal?.toLocaleString() || order.total?.toLocaleString()}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>

                          <div className="p-5">
                            <div className="space-y-3">
                              {order.items?.map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#2d5a3d]/10 flex items-center justify-center shrink-0">
                                      <span className="text-sm font-semibold text-[#2d5a3d]">
                                        {item.name.charAt(0)}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-[#1c1917]">
                                        {item.name}
                                      </p>
                                      <p className="text-xs text-[#78746e]">
                                        Qty: {item.quantity} × Rs. {item.price?.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-sm font-semibold text-[#1c1917]">
                                    Rs. {((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {order.shippingAddress && (
                              <div className="mt-4 pt-4 border-t border-[rgba(28,25,23,0.08)]">
                                <p className="text-xs font-semibold text-[#78746e] uppercase tracking-wider mb-2">
                                  Shipping Address
                                </p>
                                <p className="text-sm text-[#1c1917]">
                                  {order.shippingAddress}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl border border-[rgba(28,25,23,0.06)] p-8">
                  <h2 className="text-xl font-semibold text-[#1c1917] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Profile Details
                  </h2>

                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[#78746e] text-sm">
                          <User className="h-4 w-4" />
                          <span>Full Name</span>
                        </div>
                        <p className="font-semibold text-[#1c1917]">{customer.name}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[#78746e] text-sm">
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </div>
                        <p className="font-semibold text-[#1c1917]">{customer.email}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[#78746e] text-sm">
                          <Phone className="h-4 w-4" />
                          <span>Phone Number</span>
                        </div>
                        <p className="font-semibold text-[#1c1917]">{customer.phone || 'Not set'}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[#78746e] text-sm">
                          <MapPin className="h-4 w-4" />
                          <span>Address</span>
                        </div>
                        <p className="font-semibold text-[#1c1917]">{customer.address || 'Not set'}</p>
                      </div>
                    </div>

                    {customer.loyaltyPoints !== undefined && (
                      <div className="p-5 bg-[#c8a96e]/10 rounded-xl border border-[#c8a96e]/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-[#1c1917]">Loyalty Points</p>
                            <p className="text-3xl font-bold text-[#c8a96e]">{customer.loyaltyPoints}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[#78746e]">Member Tier</p>
                            <p className="font-semibold text-[#1c1917]">{customer.tier || 'Bronze'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
