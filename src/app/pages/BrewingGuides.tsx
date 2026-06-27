'use client';

import Link from "next/link";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import { ArrowRight, Thermometer, Clock, Leaf } from "lucide-react";

interface GuideCard {
  slug: string;
  name: string;
  emoji: string;
  accentColor: string;
  accentBg: string;
  temperature: string;
  steepTime: string;
  leafRatio: string;
  description: string;
}

const guides: GuideCard[] = [
  {
    slug: "green-tea",
    name: "Green Tea",
    emoji: "🍵",
    accentColor: "#4a7c59",
    accentBg: "#e8f2eb",
    temperature: "70–80°C",
    steepTime: "2–3 min",
    leafRatio: "2g per 200ml",
    description:
      "Delicate and grassy, Himalayan green tea rewards gentle handling. Lower temperatures preserve its subtle sweetness and prevent bitter astringency.",
  },
  {
    slug: "black-tea",
    name: "Black Tea",
    emoji: "☕",
    accentColor: "#7c4a3a",
    accentBg: "#f2ebe8",
    temperature: "95–100°C",
    steepTime: "3–5 min",
    leafRatio: "2.5g per 200ml",
    description:
      "Bold and full-bodied, Nepali black tea can stand up to boiling water. Our Ilam black teas develop rich, malty notes with longer steeping.",
  },
  {
    slug: "oolong",
    name: "Oolong",
    emoji: "🌿",
    accentColor: "#7c6a3a",
    accentBg: "#f2ede8",
    temperature: "85–95°C",
    steepTime: "3–4 min",
    leafRatio: "3g per 200ml",
    description:
      "Sitting between green and black tea, oolong rewards multiple infusions. Each steep reveals new layers — from floral to toasty and beyond.",
  },
  {
    slug: "white-tea",
    name: "White Tea",
    emoji: "🌸",
    accentColor: "#7a6a8a",
    accentBg: "#f0edf5",
    temperature: "75–85°C",
    steepTime: "4–5 min",
    leafRatio: "2g per 200ml",
    description:
      "The least processed of all teas, white tea is prized for its silky texture and gentle floral notes. Treat it with care and cool water.",
  },
  {
    slug: "herbal",
    name: "Herbal Tisane",
    emoji: "🌼",
    accentColor: "#6a7c3a",
    accentBg: "#eff2e8",
    temperature: "100°C",
    steepTime: "5–7 min",
    leafRatio: "3g per 200ml",
    description:
      "Blended from flowers, herbs, and botanicals, herbal tisanes are caffeine-free and richly aromatic. Full boiling water unlocks their depth.",
  },
  {
    slug: "pu-erh",
    name: "Pu-erh",
    emoji: "🧱",
    accentColor: "#4a3a2a",
    accentBg: "#ede8e2",
    temperature: "95–100°C",
    steepTime: "3–5 min",
    leafRatio: "4g per 200ml",
    description:
      "An aged, fermented tea with earthy depth and remarkable complexity. Pu-erh improves with age and produces a smooth, warming cup.",
  },
];

const equipment = [
  {
    emoji: "🫖",
    name: "Temperature-Control Kettle",
    description:
      "Precise temperature control is the single biggest upgrade you can make to your brewing. Set the exact temperature for each tea type and never over-heat delicate leaves again.",
  },
  {
    emoji: "⏱️",
    name: "Tea Timer",
    description:
      "Consistent steep times transform good tea into exceptional tea. Even a 30-second difference can shift a cup from bright and lively to bitter and flat.",
  },
  {
    emoji: "🫙",
    name: "Fine Mesh Infuser",
    description:
      "A fine stainless steel infuser gives leaves room to unfurl and release their full flavour while keeping your cup clear. Avoid infusers that restrict leaf movement.",
  },
];

export default function BrewingGuides() {
  return (
    <div
      className="min-h-screen bg-[#f9f7f4]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Navigation />
      <main className="pt-[180px] pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Page Header */}
          <div className="max-w-2xl mb-14">
            <p className="text-xs uppercase tracking-widest text-[#c8a96e] font-medium mb-4">
              The Art of Tea
            </p>
            <h1
              className="text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] font-semibold text-[#1c1917] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Brewing Guides
            </h1>
            <p className="text-[#444] leading-relaxed text-lg">
              Master the craft of loose leaf tea. From water temperature to
              steep time, small adjustments make all the difference between an
              ordinary cup and an extraordinary one.
            </p>
          </div>

          {/* Hero Feature Card */}
          <div className="bg-[#2d5a3d] rounded-2xl p-8 lg:p-12 mb-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-widest text-[#c8a96e] font-medium mb-3">
                Start Here
              </p>
              <h2
                className="text-2xl lg:text-3xl font-semibold text-white mb-4 leading-snug"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Master the Five Golden Rules of Tea Brewing
              </h2>
              <p className="text-white/75 leading-relaxed">
                Before diving into individual tea types, learn the universal
                principles that govern every perfect cup — water quality,
                temperature, ratio, time, and vessel. These five rules apply
                whether you're brewing a first-flush Darjeeling or a robust Ilam
                black.
              </p>
            </div>
            <Link
              href="/brewing-guides/green-tea"
              className="shrink-0 flex items-center gap-2 bg-[#c8a96e] text-[#1c1917] hover:bg-[#b8995e] rounded-xl px-6 py-3 font-medium transition-colors"
            >
              Read the Guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Guide Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {guides.map((guide) => (
              <div
                key={guide.slug}
                className="bg-white rounded-2xl border border-[rgba(28,25,23,0.06)] p-6 lg:p-8 flex flex-col group hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: guide.accentBg }}
                  >
                    {guide.emoji}
                  </div>
                  <div>
                    <div
                      className="w-2 h-2 rounded-full inline-block mr-2"
                      style={{ backgroundColor: guide.accentColor }}
                    />
                    <span
                      className="text-xs uppercase tracking-widest font-medium"
                      style={{ color: guide.accentColor }}
                    >
                      {guide.name}
                    </span>
                  </div>
                </div>

                <p className="text-[#444] leading-relaxed text-sm mb-6 flex-1">
                  {guide.description}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-[#f9f7f4] rounded-xl p-3 text-center">
                    <Thermometer className="h-4 w-4 text-[#78746e] mx-auto mb-1" />
                    <p className="text-[10px] text-[#78746e] uppercase tracking-wide mb-0.5">
                      Temp
                    </p>
                    <p className="text-xs font-semibold text-[#1c1917]">
                      {guide.temperature}
                    </p>
                  </div>
                  <div className="bg-[#f9f7f4] rounded-xl p-3 text-center">
                    <Clock className="h-4 w-4 text-[#78746e] mx-auto mb-1" />
                    <p className="text-[10px] text-[#78746e] uppercase tracking-wide mb-0.5">
                      Steep
                    </p>
                    <p className="text-xs font-semibold text-[#1c1917]">
                      {guide.steepTime}
                    </p>
                  </div>
                  <div className="bg-[#f9f7f4] rounded-xl p-3 text-center">
                    <Leaf className="h-4 w-4 text-[#78746e] mx-auto mb-1" />
                    <p className="text-[10px] text-[#78746e] uppercase tracking-wide mb-0.5">
                      Ratio
                    </p>
                    <p className="text-xs font-semibold text-[#1c1917]">
                      {guide.leafRatio}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/brewing-guides/${guide.slug}`}
                  className="flex items-center justify-center gap-2 border border-[#2d5a3d] text-[#2d5a3d] hover:bg-[#2d5a3d] hover:text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-colors mt-auto"
                >
                  View Full Guide
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          {/* Brewing Equipment */}
          <div className="mb-4">
            <p className="text-xs uppercase tracking-widest text-[#c8a96e] font-medium mb-3">
              Tools of the Trade
            </p>
            <h2
              className="text-2xl lg:text-3xl font-semibold text-[#1c1917] mb-10"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Brewing Equipment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {equipment.map((item) => (
                <div
                  key={item.name}
                  className="bg-white rounded-2xl border border-[rgba(28,25,23,0.06)] p-6 lg:p-8"
                >
                  <div className="text-4xl mb-5">{item.emoji}</div>
                  <h3
                    className="text-lg font-semibold text-[#1c1917] mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {item.name}
                  </h3>
                  <p className="text-[#78746e] leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
