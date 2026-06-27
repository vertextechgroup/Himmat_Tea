'use client';

import { useState } from "react";
import Link from "next/link";
import { Star, ShoppingBag, ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useCart } from "@/context/CartContext";

const products = [
  {
    id: 1,
    name: "Dragon Well Longjing",
    type: "Green Tea",
    origin: "Zhejiang, China",
    description:
      "Flat sword-shaped leaves with chestnut sweetness and a long, clean finish.",
    price: 32,
    per: "50g",
    rating: 4.9,
    reviews: 312,
    tag: "Bestseller",
    tagStyle: "bg-[#2d5a3d] text-white",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=700&fit=crop",
  },
  {
    id: 2,
    name: "First Flush Darjeeling",
    type: "Black Tea",
    origin: "West Bengal, India",
    description:
      "Muscatel notes with a bright, astringent character. The champagne of teas.",
    price: 38,
    per: "50g",
    rating: 4.8,
    reviews: 218,
    tag: "Seasonal",
    tagStyle: "bg-[#c8a96e] text-[#1c1917]",
    image:
      "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&h=700&fit=crop",
  },
  {
    id: 3,
    name: "Himalayan Herbal Blend",
    type: "Herbal",
    origin: "Nepal",
    description:
      "Tulsi, ginger, and lemongrass in a warming, caffeine-free infusion.",
    price: 24,
    per: "40g",
    rating: 4.7,
    reviews: 189,
    tag: "New",
    tagStyle: "bg-[#f0ede8] text-[#1c1917]",
    image:
      "https://images.unsplash.com/photo-1596344084757-b83f2081da8b?w=600&h=700&fit=crop",
  },
  {
    id: 4,
    name: "Wuyi Rock Oolong",
    type: "Oolong",
    origin: "Fujian, China",
    description:
      "Roasted depth with floral lift. Complex, lingering, and deeply satisfying.",
    price: 45,
    per: "50g",
    rating: 5.0,
    reviews: 97,
    tag: "Reserve",
    tagStyle: "bg-[#1c1917] text-white",
    image:
      "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=600&h=700&fit=crop",
  },
];

export default function ProductsSection() {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [activeFilter, setActiveFilter] = useState(t("products.filter.all"));
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filters = [
    t("products.filter.all"),
    t("products.filter.greenTea"),
    t("products.filter.blackTea"),
    t("products.filter.herbal"),
    t("products.filter.oolong"),
    t("products.filter.giftSets"),
  ];

  const filtered =
    activeFilter === t("products.filter.all")
      ? products
      : products.filter((p) => p.type === activeFilter);

  return (
    <section
      className="py-28 bg-[#f9f7f4]"
      id="shop"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#c8a96e] font-medium mb-4">
              {t("products.eyebrow")}
            </p>
            <h2
              className="text-[clamp(2rem,3.5vw,2.75rem)] font-semibold leading-[1.15] text-[#1c1917]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t("products.headline")}{" "}
              <em className="not-italic text-[#2d5a3d]">
                {t("products.headlineAccent")}
              </em>
              <br />
              {t("products.headlineLine2")}
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === f
                    ? "bg-[#2d5a3d] text-white"
                    : "bg-white text-[#78746e] border border-[rgba(28,25,23,0.12)] hover:border-[#2d5a3d] hover:text-[#2d5a3d]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid - new horizontal card layout */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden group border border-[rgba(28,25,23,0.06)] hover:shadow-2xl hover:border-[#2d5a3d]/20 transition-all duration-300"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.2fr] h-full">
                {/* Image */}
                <Link
                  href={`/products/${product.id}`}
                  className="relative overflow-hidden bg-[#f0ede8] block h-full"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Tag */}
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${product.tagStyle}`}
                  >
                    {product.tag}
                  </span>
                </Link>

                {/* Details */}
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-3.5 w-3.5 fill-[#c8a96e] text-[#c8a96e]" />
                      <span className="text-sm font-medium text-[#1c1917]">
                        {product.rating}
                      </span>
                      <span className="text-xs text-[#78746e]">
                        ({product.reviews})
                      </span>
                    </div>

                    <Link href={`/products/${product.id}`} className="block">
                      <h3
                        className="text-[17px] font-semibold text-[#1c1917] mb-1.5 leading-snug group-hover:text-[#2d5a3d] transition-colors"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-[#78746e] leading-relaxed mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xl font-bold text-[#1c1917]">
                          Rs.{product.price}
                        </span>
                        <span className="text-xs text-[#78746e] ml-1">
                          / {product.per}
                        </span>
                      </div>
                      <span className="text-xs text-[#2d5a3d] font-semibold bg-[#2d5a3d]/10 px-2 py-1 rounded-full">
                        {product.type}
                      </span>
                    </div>

                    {/* Add to cart button - always visible */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          id: String(product.id),
                          name: product.name,
                          price: product.price,
                          image: product.image,
                          weight: product.per,
                        });
                      }}
                      className="cursor-pointer w-full flex items-center justify-center gap-2 py-2.5 bg-[#2d5a3d] text-white text-sm font-medium rounded-lg hover:bg-[#234832] transition-colors"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {t("products.addToCart")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#2d5a3d] text-[#2d5a3d] font-medium rounded-lg hover:bg-[#2d5a3d] hover:text-white transition-all group"
          >
            {t("products.viewAll")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
