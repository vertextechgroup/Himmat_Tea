'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowRight, Check, Lock, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const STEPS = [
  { num: 1, label: "Shipping" },
  { num: 2, label: "Payment" },
  { num: 3, label: "Confirmation" },
];

const PAYMENT_METHODS = [
  {
    key: "esewa",
    label: "eSewa",
    description: "Pay securely with eSewa",
    icon: "💳",
  },
  {
    key: "khalti",
    label: "Khalti",
    description: "Pay with Khalti digital wallet",
    icon: "💜",
  },
  {
    key: "card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, and local cards",
    icon: "💳",
  },
];

function Field({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1c1917] mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border bg-[#f9f7f4] text-[#1c1917] placeholder:text-[#78746e]/50 focus:outline-none transition-colors text-sm ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-[rgba(28,25,23,0.12)] focus:border-[#2d5a3d]"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function Checkout() {
  const { t } = useTranslation();
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { addOrder, settings } = useStore();
  const { isLoggedIn, userType, currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [saveAddress, setSaveAddress] = useState(false);
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill from customer profile if logged in
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postal: "",
    country: "np"
  });

  useEffect(() => {
    if (isLoggedIn && userType === 'customer' && currentUser) {
      const customer = currentUser as any;
      setFormData(prev => ({
        ...prev,
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
      }));
    }
  }, [isLoggedIn, userType, currentUser]);

  // If not logged in as customer, show login prompt
  if (!isLoggedIn || userType !== 'customer') {
    return (
      <div className="min-h-screen bg-[#f9f7f4]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Navigation />
        <main className="pt-[180px] pb-24">
          <div className="max-w-2xl mx-auto px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-[rgba(28,25,23,0.06)] p-10 text-center">
              <Lock className="h-16 w-16 text-[#2d5a3d] mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-[#1c1917] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Sign in to Checkout
              </h2>
              <p className="text-[#78746e] mb-8">
                Please sign in or create an account to complete your order.
              </p>
              <Link
                href="/customer-auth?redirect=/checkout"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#2d5a3d] text-white font-semibold rounded-xl hover:bg-[#234832] transition-all"
              >
                <User className="h-5 w-5" />
                Sign In / Create Account
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[+]?[0-9\s-]{8,}$/;
    return phoneRegex.test(phone);
  };

  const validatePostal = (postal: string) => {
    const postalRegex = /^[0-9]{4,10}$/;
    return postalRegex.test(postal);
  };

  const validateCardNumber = (number: string) => {
    const cleanNumber = number.replace(/\s/g, "");
    return cleanNumber.length >= 13 && cleanNumber.length <= 19;
  };

  const validateExpiry = (expiry: string) => {
    const expiryRegex = /^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/;
    if (!expiryRegex.test(expiry)) return false;
    
    const [month, year] = expiry.split("/").map(s => parseInt(s.trim(), 10));
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;
    
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    
    return true;
  };

  const validateCVV = (cvv: string) => {
    const cvvRegex = /^[0-9]{3,4}$/;
    return cvvRegex.test(cvv);
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!formData.province.trim()) {
      newErrors.province = "Province is required";
    }
    
    if (!formData.postal.trim()) {
      newErrors.postal = "Postal code is required";
    } else if (!validatePostal(formData.postal)) {
      newErrors.postal = "Please enter a valid postal code";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (paymentMethod === "card") {
      const newErrors: Record<string, string> = {};
      
      if (!cardData.number.trim()) {
        newErrors.cardNumber = "Card number is required";
      } else if (!validateCardNumber(cardData.number)) {
        newErrors.cardNumber = "Please enter a valid card number";
      }
      
      if (!cardData.expiry.trim()) {
        newErrors.expiry = "Expiry date is required";
      } else if (!validateExpiry(cardData.expiry)) {
        newErrors.expiry = "Please enter a valid expiry date (MM / YY)";
      }
      
      if (!cardData.cvv.trim()) {
        newErrors.cvv = "CVV is required";
      } else if (!validateCVV(cardData.cvv)) {
        newErrors.cvv = "Please enter a valid CVV";
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (errors[e.target.name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (errors[e.target.name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)} / ${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    handleCardInputChange({ ...e, target: { ...e.target, name: "number", value: formatted } });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    handleCardInputChange({ ...e, target: { ...e.target, name: "expiry", value: formatted } });
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    handleCardInputChange({ ...e, target: { ...e.target, name: "cvv", value: v } });
  };

  function handlePlaceOrder() {
    if (!validateStep2()) {
      return;
    }
    
    const tax = cartTotal * (settings.taxRate / 100);
    addOrder({
      customerId: Date.now(),
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      items: cart.map(item => ({
        id: Date.now() + Math.random(),
        productId: parseInt(item.id) || 1,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: cartTotal,
      tax: tax,
      grandTotal: cartTotal + tax,
      status: "Pending",
      paymentStatus: paymentMethod === "card" ? "Paid" : "Unpaid",
      shippingAddress: `${formData.address}, ${formData.city}, ${formData.province}, ${formData.postal}, ${formData.country}`
    });
    clearCart();
    router.push("/order-confirmed");
  }

  const handleContinueToPayment = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f9f7f4]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Navigation />
      <main className="pt-[180px] pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* ── Page Header ── */}
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold mb-3">
              Purchase
            </p>
            <h1
              className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-semibold text-[#1c1917]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Checkout
            </h1>
          </div>

          {/* ── Step Progress Indicator ── */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-0">
              {STEPS.map((s, i) => (
                <div key={s.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                        step > s.num
                          ? "bg-[#2d5a3d] text-white"
                          : step === s.num
                            ? "bg-[#2d5a3d] text-white ring-4 ring-[#2d5a3d]/20"
                            : "bg-white border-2 border-[rgba(28,25,23,0.15)] text-[#78746e]"
                      }`}
                    >
                      {step > s.num ? <Check className="h-5 w-5" /> : s.num}
                    </div>
                    <span
                      className={`text-xs mt-1.5 font-medium whitespace-nowrap ${
                        step >= s.num ? "text-[#2d5a3d]" : "text-[#78746e]"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`w-24 h-0.5 mb-5 mx-3 transition-all ${
                        step > s.num
                          ? "bg-[#2d5a3d]"
                          : "bg-[rgba(28,25,23,0.1)]"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* ── Form Panel ── */}
            <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-[rgba(28,25,23,0.06)]">
              {/* STEP 1 — Shipping */}
              {step === 1 && (
                <div>
                  <h2
                    className="text-xl font-semibold text-[#1c1917] mb-7"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Shipping Information
                  </h2>
                  <div className="space-y-4">
                    <Field
                      label="Full Name"
                      name="name"
                      placeholder="Aarav Sharma"
                      value={formData.name}
                      onChange={handleInputChange}
                      error={errors.name}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="aarav@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={errors.email}
                      />
                      <Field
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        placeholder="+977 98XXXXXXXX"
                        value={formData.phone}
                        onChange={handleInputChange}
                        error={errors.phone}
                      />
                    </div>
                    <Field
                      label="Address"
                      name="address"
                      placeholder="House No., Street Name, Area"
                      value={formData.address}
                      onChange={handleInputChange}
                      error={errors.address}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field 
                        label="City" 
                        name="city" 
                        placeholder="Kathmandu" 
                        value={formData.city}
                        onChange={handleInputChange}
                        error={errors.city}
                      />
                      <Field
                        label="Province"
                        name="province"
                        placeholder="Bagmati"
                        value={formData.province}
                        onChange={handleInputChange}
                        error={errors.province}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="Postal Code"
                        name="postal"
                        placeholder="44600"
                        value={formData.postal}
                        onChange={handleInputChange}
                        error={errors.postal}
                      />
                      {/* Country as select dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-[#1c1917] mb-1.5">
                          Country<span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-[rgba(28,25,23,0.12)] bg-[#f9f7f4] text-[#1c1917] focus:outline-none focus:border-[#2d5a3d] transition-colors text-sm cursor-pointer"
                        >
                          <option value="np">Nepal</option>
                          <option value="in">India</option>
                          <option value="us">USA</option>
                          <option value="gb">UK</option>
                          <option value="au">Australia</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Save this address */}
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            saveAddress
                              ? "bg-[#2d5a3d] border-[#2d5a3d]"
                              : "border-[rgba(28,25,23,0.2)] group-hover:border-[#2d5a3d]"
                          }`}
                        >
                          {saveAddress && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-[#78746e]">
                        Save this address for future orders
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={handleContinueToPayment}
                    className="w-full mt-8 py-4 bg-[#2d5a3d] text-white font-semibold rounded-xl hover:bg-[#234832] transition-colors flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* STEP 2 — Payment */}
              {step === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-7">
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm text-[#78746e] hover:text-[#2d5a3d] transition-colors"
                    >
                      ← Back
                    </button>
                    <h2
                      className="text-xl font-semibold text-[#1c1917]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Payment Method
                    </h2>
                  </div>

                  {/* Payment option cards */}
                  <div className="space-y-3 mb-6">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.key}
                        onClick={() => setPaymentMethod(method.key)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                          paymentMethod === method.key
                            ? "border-[#2d5a3d] bg-[#2d5a3d]/5"
                            : "border-[rgba(28,25,23,0.1)] hover:border-[#2d5a3d]/40 bg-white"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-[#f9f7f4] flex items-center justify-center text-2xl shrink-0">
                          {method.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-[#1c1917]">
                            {method.label}
                          </p>
                          <p className="text-sm text-[#78746e]">
                            {method.description}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            paymentMethod === method.key
                              ? "border-[#2d5a3d] bg-[#2d5a3d]"
                              : "border-[rgba(28,25,23,0.2)]"
                          }`}
                        >
                          {paymentMethod === method.key && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Card fields — shown only when card is selected */}
                  {paymentMethod === "card" && (
                    <div className="bg-[#f9f7f4] rounded-xl p-5 space-y-4 mb-6 border border-[rgba(28,25,23,0.08)]">
                      <div>
                        <label className="block text-sm font-medium text-[#1c1917] mb-1.5">
                          Card Number<span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          value={cardData.number}
                          onChange={handleCardNumberChange}
                          className={`w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none transition-colors ${
                            errors.cardNumber
                              ? "border-red-500 focus:border-red-500"
                              : "border-[rgba(28,25,23,0.12)] focus:border-[#2d5a3d]"
                          }`}
                        />
                        {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1c1917] mb-1.5">
                            Expiry Date<span className="text-red-500 ml-1">*</span>
                          </label>
                          <input
                            type="text"
                            name="expiry"
                            placeholder="MM / YY"
                            maxLength={7}
                            value={cardData.expiry}
                            onChange={handleExpiryChange}
                            className={`w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none transition-colors ${
                              errors.expiry
                                ? "border-red-500 focus:border-red-500"
                                : "border-[rgba(28,25,23,0.12)] focus:border-[#2d5a3d]"
                            }`}
                          />
                          {errors.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1c1917] mb-1.5">
                            CVV<span className="text-red-500 ml-1">*</span>
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            placeholder="123"
                            maxLength={4}
                            value={cardData.cvv}
                            onChange={handleCVVChange}
                            className={`w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none transition-colors ${
                              errors.cvv
                                ? "border-red-500 focus:border-red-500"
                                : "border-[rgba(28,25,23,0.12)] focus:border-[#2d5a3d]"
                            }`}
                          />
                          {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full py-4 bg-[#2d5a3d] text-white font-semibold rounded-xl hover:bg-[#234832] transition-colors flex items-center justify-center gap-2"
                  >
                    Place Order — Rs.&nbsp;{cartTotal.toLocaleString()}
                    <ArrowRight className="h-5 w-5" />
                  </button>

                  <p className="text-xs text-center text-[#78746e] mt-4 flex items-center justify-center gap-1">
                    <span>🔒</span>
                    Your payment information is encrypted and secure.
                  </p>
                </div>
              )}
            </div>

            {/* ── Order Summary (sticky) ── */}
            <div className="lg:col-span-1">
              <div className="bg-white p-7 rounded-2xl border border-[rgba(28,25,23,0.06)] sticky top-32">
                <h3
                  className="text-xl font-semibold text-[#1c1917] mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Order Summary
                </h3>

                {cart.length === 0 ? (
                  <p className="text-sm text-[#78746e]">Your cart is empty.</p>
                ) : (
                  <>
                    <div className="space-y-4 mb-5">
                      {cart.map((item) => (
                        <div
                          key={item.id + item.weight}
                          className="flex items-center gap-3"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-[#2d5a3d] flex items-center justify-center shrink-0">
                              <span className="text-white text-sm font-serif">
                                {item.name[0]}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#1c1917] truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-[#78746e]">
                              {item.weight} × {item.quantity}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-[#1c1917] shrink-0">
                            Rs.&nbsp;
                            {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="h-px bg-[rgba(28,25,23,0.08)] mb-4" />

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm text-[#78746e]">
                        <span>Subtotal</span>
                        <span>Rs.&nbsp;{cartTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-[#78746e]">
                        <span>Shipping</span>
                        <span className="text-[#2d5a3d] font-semibold">
                          Free
                        </span>
                      </div>
                    </div>

                    <div className="h-px bg-[rgba(28,25,23,0.08)] mb-4" />

                    <div className="flex justify-between text-lg font-bold text-[#1c1917]">
                      <span>Total</span>
                      <span>Rs.&nbsp;{cartTotal.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
