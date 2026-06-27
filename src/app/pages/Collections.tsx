'use client';

import Link from "next/link";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    slug: "seasonal",
    title: "Seasonal Picks",
    desc: "Hand-selected teas that celebrate each season's finest harvests.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    count: 8,
    badge: "Spring 2026",
  },
  {
    slug: "wellness",
    title: "Wellness Range",
    desc: "Blends crafted for mindfulness, energy, and inner balance.",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop",
    count: 6,
    badge: "Bestseller",
  },
  {
    slug: "gift-sets",
    title: "Gift Sets",
    desc: "Beautiful curated sets, perfectly presented for gifting.",
    image:
      "https://images.unsplash.com/photo-1549558549-415fe4c37b60?w=600&h=400&fit=crop",
    count: 5,
    badge: "Popular",
  },
  {
    slug: "single-origin",
    title: "Single Origin",
    desc: "Pure teas from a single estate, unblended and terroir-forward.",
    image:
      "https://images.unsplash.com/photo-1464716535967-a81e2fc45b22?w=600&h=400&fit=crop",
    count: 10,
    badge: "",
  },
  {
    slug: "himalayan",
    title: "Himalayan Selection",
    desc: "Exclusively sourced from Nepal's legendary tea-growing regions.",
    image:
      "https://images.unsplash.com/photo-1455853828816-0c301a011711?w=600&h=400&fit=crop",
    count: 7,
    badge: "Exclusive",
  },
  {
    slug: "organic",
    title: "Certified Organic",
    desc: "Every cup is certified organic, traceable, and chemical-free.",
    image:
      "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&h=400&fit=crop",
    count: 12,
    badge: "",
  },
];

function CollectionCard({
  collection,
  featured = false,
}: {
  collection: (typeof collections)[number];
  featured?: boolean;
}) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className={`relative group block overflow-hidden rounded-2xl ${featured ? "md:col-span-2" : ""}`}
    >
      <div
        className={`relative overflow-hidden ${featured ? "h-[480px]" : "h-[320px]"}`}
      >
        <img
          src={collection.image}
          alt={collection.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/85 via-[#1c1917]/30 to-transparent" />

        {/* Badge */}
        {collection.badge && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-[#c8a96e] text-[#1c1917] text-xs font-semibold rounded-full uppercase tracking-widest">
              {collection.badge}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <p className="text-white/60 text-xs uppercase tracking-widest mb-2">
            {collection.count} products
          </p>
          <h2
            className={`font-semibold text-white mb-2 leading-tight ${featured ? "text-3xl lg:text-4xl" : "text-2xl"}`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {collection.title}
          </h2>
          <p className="text-white/75 text-sm leading-relaxed mb-5 max-w-md">
            {collection.desc}
          </p>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-medium rounded-xl group-hover:bg-white/25 transition-colors">
            Explore Collection
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Collections() {
  const { t } = useTranslation();
  const [featured, ...rest] = collections;

  return (
    <div
      className="min-h-screen bg-[#f9f7f4]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Navigation />
      <main className="pt-[180px] pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-[#c8a96e] font-medium mb-4">
              Curated for You
            </p>
            <h1
              className="text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] font-semibold text-[#1c1917] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Collections
            </h1>
            <p className="text-xl text-[#78746e] max-w-2xl mx-auto">
              Each collection tells a different story — of a season, a place, a
              purpose. Find the one that calls to you.
            </p>
          </div>

          {/* Featured + 3-col grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Featured card spans 2 columns */}
            <CollectionCard collection={featured} featured />
            {/* Third item in first row */}
            <CollectionCard collection={rest[0]} />
            {/* Remaining 4 in 3-col */}
            {rest.slice(1).map((c) => (
              <CollectionCard key={c.slug} collection={c} />
            ))}
          </div>

          {/* Build Your Own Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-[#2d5a3d] p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="absolute inset-0 opacity-10">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-widest text-[#c8a96e] font-medium mb-3">
                Your Way
              </p>
              <h2
                className="text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1] font-semibold text-white mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Build Your Own Collection
              </h2>
              <p className="text-white/70 text-lg max-w-lg">
                Browse our full catalogue and hand-pick the teas that speak to
                you. Mix origins, styles, and seasons freely.
              </p>
            </div>
            <Link
              href="/products"
              className="relative z-10 flex-shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-[#c8a96e] text-[#1c1917] font-semibold rounded-xl hover:bg-[#b8995e] transition-colors whitespace-nowrap"
            >
              Shop All Teas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
