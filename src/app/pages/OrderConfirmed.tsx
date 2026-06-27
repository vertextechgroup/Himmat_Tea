'use client';

import { useEffect } from "react";
import Link from "next/link";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import { useCart } from "@/context/CartContext";
import { CheckCircle, Package, Truck, ArrowRight, Star } from "lucide-react";

const NEXT_STEPS = [
  {
    Icon: CheckCircle,
    title: "Order Confirmed",
    description: "We've received your order and are preparing it now.",
    done: true,
  },
  {
    Icon: Package,
    title: "Being Prepared",
    description: "We're carefully packing your teas.",
    done: false,
  },
  {
    Icon: Truck,
    title: "On Its Way",
    description: "Your order will be shipped within 24 hours.",
    done: false,
  },
];

const suggestedProducts = [
  {
    id: "1",
    name: "Dragon Well Longjing",
    origin: "Zhejiang, China",
    price: 1850,
    rating: 4.9,
    tag: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=600&h=600&fit=crop",
  },
  {
    id: "4",
    name: "Wuyi Rock Oolong",
    origin: "Fujian, China",
    price: 2600,
    rating: 5.0,
    tag: "Reserve",
    image:
      "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=600&h=600&fit=crop",
  },
  {
    id: "5",
    name: "Silver Needle White Tea",
    origin: "Fujian, China",
    price: 3200,
    rating: 4.9,
    tag: "Premium",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop",
  },
];

export default function OrderConfirmed() {
  const { clearCart } = useCart();

  // Clear cart once on mount after successful order
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="min-h-screen bg-[#f9f7f4]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Navigation />
      <main className="pt-[180px] pb-24">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          {/* ── Animated checkmark circle ── */}
          <style>{`
            @keyframes himmat-scale-in {
              from { transform: scale(0); opacity: 0; }
              to   { transform: scale(1); opacity: 1; }
            }
            @keyframes himmat-draw-check {
              to { stroke-dashoffset: 0; }
            }
            .himmat-circle {
              animation: himmat-scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
            .himmat-check-path {
              stroke-dasharray: 30;
              stroke-dashoffset: 30;
              animation: himmat-draw-check 0.45s ease 0.4s forwards;
            }
          `}</style>

          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-[#2d5a3d] flex items-center justify-center mx-auto shadow-xl himmat-circle">
              <svg
                className="w-12 h-12 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6L9 17l-5-5" className="himmat-check-path" />
              </svg>
            </div>
          </div>

          {/* ── Heading ── */}
          <p className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold mb-3">
            Thank You
          </p>
          <h1
            className="text-[clamp(2rem,5vw,3rem)] leading-[1.1] font-semibold text-[#1c1917] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Order Confirmed!
          </h1>
          <p className="text-[#78746e] text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            Thank you for your order! We've sent a confirmation to your email.
          </p>

          {/* ── Order number card ── */}
          <div className="bg-[#2d5a3d]/8 border border-[#2d5a3d]/20 rounded-2xl px-8 py-5 mb-4 inline-block">
            <p className="text-xs text-[#78746e] uppercase tracking-wider font-medium mb-1">
              Order Number
            </p>
            <p className="font-bold text-[#2d5a3d] font-mono tracking-widest text-lg">
              #HT-2026-12345
            </p>
          </div>

          <p className="text-sm text-[#78746e] mb-10">
            Estimated delivery:{" "}
            <span className="font-semibold text-[#2d5a3d]">
              3–5 business days
            </span>
          </p>

          {/* ── Action buttons ── */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <Link
              to="/products"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2d5a3d] text-white font-semibold rounded-xl hover:bg-[#234832] transition-colors"
            >
              Continue Shopping
              <ArrowRight className="h-5 w-5" />
            </Link>
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#2d5a3d] text-[#2d5a3d] font-semibold rounded-xl hover:bg-[#2d5a3d] hover:text-white transition-all">
              Track Your Order
            </button>
          </div>

          {/* ── What Happens Next? ── */}
          <div className="text-left mb-16">
            <h2
              className="text-xl font-semibold text-[#1c1917] mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              What Happens Next?
            </h2>
            <div className="space-y-3">
              {NEXT_STEPS.map((step, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-5 p-5 rounded-2xl border transition-all ${
                    step.done
                      ? "bg-[#2d5a3d]/5 border-[#2d5a3d]/20"
                      : "bg-white border-[rgba(28,25,23,0.06)]"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      step.done
                        ? "bg-[#2d5a3d] text-white"
                        : i === 1
                          ? "bg-purple-50 text-purple-500"
                          : "bg-[#f0ede8] text-[#78746e]"
                    }`}
                  >
                    <step.Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#1c1917]">{step.title}</p>
                    <p className="text-sm text-[#78746e] mt-0.5">
                      {step.description}
                    </p>
                  </div>
                  {step.done && (
                    <span className="shrink-0 text-xs font-semibold text-[#2d5a3d] bg-[#2d5a3d]/10 px-3 py-1 rounded-full">
                      Done ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── You might also enjoy ── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2
            className="text-2xl font-semibold text-[#1c1917] mb-8 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            You might also enjoy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {suggestedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-2xl border border-[rgba(28,25,23,0.06)] overflow-hidden group hover:shadow-md transition-shadow"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.tag && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-[#2d5a3d] text-white">
                      {product.tag}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-[#c8a96e] font-semibold uppercase tracking-wide mb-1">
                    {product.origin}
                  </p>
                  <h3
                    className="font-semibold text-[#1c1917] group-hover:text-[#2d5a3d] transition-colors mb-2 leading-snug"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-[#2d5a3d] font-bold">
                      Rs.&nbsp;{product.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-[#78746e]">
                      <Star className="h-3 w-3 fill-[#c8a96e] text-[#c8a96e]" />
                      {product.rating}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
