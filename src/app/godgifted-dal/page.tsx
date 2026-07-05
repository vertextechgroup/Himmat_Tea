'use client';

import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BRAND } from "@/config/brand";
import ProductCard from "@/app/components/ProductCard";
import { useStore } from "@/context/StoreContext";

export default function GodgiftedDalPage() {
  const { products } = useStore();
  const dalProducts = products.filter(p => p.productLine?.slug === "godgifted-dal" || p.category === "toor" || p.category === "moong" || p.category === "chana" || p.category === "masoor" || p.category === "urad" || p.category === "gift-hampers");
  
  const dalCategories = [
    { id: "toor", name: "Toor Dal", description: "Protein-rich & versatile", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop" },
    { id: "moong", name: "Moong Dal", description: "Light & easy to digest", image: "https://images.unsplash.com/photo-1598344084757-b83f2081da8b?w=400&h=300&fit=crop" },
    { id: "chana", name: "Chana Dal", description: "Nutty & wholesome", image: "https://images.unsplash.com/photo-1598387993441-a360f544a835?w=400&h=300&fit=crop" },
    { id: "masoor", name: "Masoor Dal", description: "Quick-cooking & vibrant", image: "https://images.unsplash.com/photo-1598344084757-b83f2081da8b?w=400&h=300&fit=crop" },
    { id: "urad", name: "Urad Dal", description: "Creamy & comforting", image: "https://images.unsplash.com/photo-1598344084757-b83f2081da8b?w=400&h=300&fit=crop" },
    { id: "gift-hampers", name: "Gift Hampers", description: "Perfect for gifting", image: "https://images.unsplash.com/photo-1598344084757-b83f2081da8b?w=400&h=300&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-[#f9f7f4]">
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-2 text-sm text-[#5c5a57]">
          <Link href="/" className="hover:text-[#2d5a3d]">{BRAND.companyName}</Link>
          <span>/</span>
          <span className="text-[#2d5a3d] font-semibold">{BRAND.productLines[1].name}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="relative py-20 lg:py-28 bg-gradient-to-br from-[#b8862f]/5 to-[#faf8f5]"
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
                  {BRAND.productLines[1].name}
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
                Stone-ground pulses from the Terai plains
              </h1>
              <p className="text-[#5c5a57] mb-8 max-w-lg" style={{ fontSize: "1.125rem", lineHeight: "1.8" }}>
                {BRAND.productLines[1].description} Unpolished, nutrient-rich dals that bring authentic flavours to your table.
              </p>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 rounded-lg bg-[#b8862f] text-white font-semibold hover:bg-[#9a7229] transition-all duration-200"
                style={{
                  fontSize: "0.875rem",
                  padding: "14px 28px",
                  boxShadow: "0 4px 18px rgba(184,134,47,0.22)",
                }}
              >
                Shop {BRAND.productLines[1].name}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  strokeWidth={2.5}
                />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
                alt="Pulses and grains"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dal Categories Grid */}
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
              Explore our dal varieties
            </h2>
            <p className="text-[#5c5a57] max-w-2xl mx-auto" style={{ fontSize: "1.0625rem", lineHeight: "1.8" }}>
              From everyday cooking to special occasions, find the perfect dal for every recipe.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {dalCategories.map((cat) => (
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
              Featured dals
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {dalProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2.5 rounded-lg border border-[#b8862f] text-[#b8862f] font-semibold hover:bg-[#b8862f] hover:text-white transition-all duration-200"
              style={{ fontSize: "0.875rem", padding: "12px 26px" }}
            >
              View all dals
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sourcing Story */}
      <section className="py-20 bg-[#b8862f]/5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2
            className="text-[#1a1917] font-bold tracking-tight mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.75rem, 2.8vw, 2.5rem)",
            }}
          >
            Our sourcing story
          </h2>
          <p className="text-[#5c5a57] mb-8 max-w-2xl mx-auto" style={{ fontSize: "1.0625rem", lineHeight: "1.8" }}>
            We partner directly with farmers in the Terai region to bring you unpolished, stone-ground dals that retain all their natural nutrition and flavour.
          </p>
          <Link
            href="/about/sourcing"
            className="group inline-flex items-center gap-2.5 rounded-lg border border-[#b8862f] text-[#b8862f] font-semibold hover:bg-[#b8862f] hover:text-white transition-all duration-200"
            style={{ fontSize: "0.875rem", padding: "12px 26px" }}
          >
            Learn more
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
