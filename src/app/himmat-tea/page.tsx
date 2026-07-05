'use client';

import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BRAND } from "@/config/brand";
import ProductCard from "@/app/components/ProductCard";
import { useStore } from "@/context/StoreContext";

export default function HimmatTeaPage() {
  const { products } = useStore();
  const himmatTeaProducts = products.filter(p => p.productLine?.slug === "himmat-tea" || p.category === "green" || p.category === "black" || p.category === "herbal" || p.category === "oolong" || p.category === "white" || p.category === "tea-sets");
  
  const teaCategories = [
    { id: "green", name: "Green Tea", description: "Fresh & delicate", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop" },
    { id: "black", name: "Black Tea", description: "Bold & robust", image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop" },
    { id: "oolong", name: "Oolong Tea", description: "Complex & fragrant", image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=400&h=300&fit=crop" },
    { id: "white", name: "White Tea", description: "Subtle & elegant", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop" },
    { id: "herbal", name: "Herbal Infusions", description: "Caffeine-free & soothing", image: "https://images.unsplash.com/photo-1596344084757-b83f2081da8b?w=400&h=300&fit=crop" },
    { id: "tea-sets", name: "Tea Sets", description: "The perfect gift", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-[#f9f7f4]">
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-2 text-sm text-[#5c5a57]">
          <Link href="/" className="hover:text-[#2d5a3d]">{BRAND.companyName}</Link>
          <span>/</span>
          <span className="text-[#2d5a3d] font-semibold">{BRAND.productLines[0].name}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="relative py-20 lg:py-28 bg-gradient-to-br from-[#2d5a3d]/5 to-[#faf8f5]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div
                  aria-hidden
                  style={{
                    width: "28px",
                    height: "2px",
                    borderRadius: "2px",
                    background: "linear-gradient(to right, #c8a96e, rgba(200,169,110,0.25))",
                    flexShrink: 0,
                  }}
                />
                <span
                  className="text-[#c8a96e] font-semibold"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                  }}
                >
                  {BRAND.productLines[0].name}
                </span>
              </div>
              <h1
                className="text-[#1a1917] font-bold tracking-tight mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                  lineHeight: "1.1",
                }}
              >
                Hand-sourced tea from the Himalayan foothills
              </h1>
              <p className="text-[#5c5a57] mb-8 max-w-lg" style={{ fontSize: "1.125rem", lineHeight: "1.8" }}>
                {BRAND.productLines[0].description} From the misty hills of Ilam to Darjeeling, discover teas that tell a story of soil, altitude, and generations of craftsmanship.
              </p>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 rounded-lg bg-[#2d5a3d] text-white font-semibold hover:bg-[#244a33] transition-all duration-200"
                style={{
                  fontSize: "0.875rem",
                  padding: "14px 28px",
                  boxShadow: "0 4px 18px rgba(45,90,61,0.22)",
                }}
              >
                Shop {BRAND.productLines[0].name}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  strokeWidth={2.5}
                />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop"
                alt="Himalayan tea plantation"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tea Categories Grid */}
      <section className="py-20 bg-[#faf8f5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-[#1a1917] font-bold tracking-tight mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.75rem, 2.8vw, 2.5rem)",
              }}
            >
              Explore our tea categories
            </h2>
            <p className="text-[#5c5a57] max-w-2xl mx-auto" style={{ fontSize: "1.0625rem", lineHeight: "1.8" }}>
              From delicate greens to bold blacks, find the perfect tea for every moment.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teaCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="group relative rounded-xl overflow-hidden border border-[rgba(26,25,23,0.08)] hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1917]/70 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {cat.name}
                  </h3>
                  <p className="text-white/90 text-sm">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-[#faf8f5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-[#1a1917] font-bold tracking-tight mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.75rem, 2.8vw, 2.5rem)",
              }}
            >
              Featured teas
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {himmatTeaProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2.5 rounded-lg border border-[#2d5a3d] text-[#2d5a3d] font-semibold hover:bg-[#2d5a3d] hover:text-white transition-all duration-200"
              style={{ fontSize: "0.875rem", padding: "12px 26px" }}
            >
              View all teas
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Brewing Guide CTA */}
      <section className="py-20 bg-[#2d5a3d]/5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2
            className="text-[#1a1917] font-bold tracking-tight mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.75rem, 2.8vw, 2.5rem)",
            }}
          >
            New to tea?
          </h2>
          <p className="text-[#5c5a57] mb-8 max-w-2xl mx-auto" style={{ fontSize: "1.0625rem", lineHeight: "1.8" }}>
            Learn how to brew the perfect cup with our detailed brewing guides.
          </p>
          <Link
            href="/brewing-guides"
            className="group inline-flex items-center gap-2.5 rounded-lg bg-[#c8a96e] text-[#1a1917] font-semibold hover:bg-[#b59a5e] transition-all duration-200"
            style={{ fontSize: "0.875rem", padding: "14px 28px" }}
          >
            View brewing guides
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
