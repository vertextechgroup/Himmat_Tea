'use client';

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function Hero() {
  const { t } = useTranslation();

  const stats = [
    { value: t("hero.stat.blendsValue"), label: t("hero.stat.blendsLabel") },
    { value: t("hero.stat.organicValue"), label: t("hero.stat.organicLabel") },
    {
      value: t("hero.stat.countriesValue"),
      label: t("hero.stat.countriesLabel"),
    },
  ];

  return (
    <section
      className="relative grid min-h-screen overflow-hidden lg:grid-cols-[52%_1fr]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LEFT PANEL  —  editorial content
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="relative z-10 w-full flex flex-col justify-center hero-animate-in"
        style={{
          background: "#faf8f5",
          paddingTop: "clamp(140px, 15vh, 180px)",
          paddingBottom: "clamp(60px,  8vh,  96px)",
          paddingLeft: "clamp(24px,  6vw,  96px)",
          paddingRight: "clamp(24px,  4vw,  64px)",
        }}
      >
        {/* Faint warm glow — bottom-left corner only */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 0% 100%, rgba(200,169,110,0.07) 0%, transparent 70%)",
          }}
        />

        {/* ── Mobile: image behind the content ── */}
        <div className="lg:hidden absolute inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/hero-bg.avif')",
              backgroundSize: "cover",
              backgroundPosition: "center 20%",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, rgba(250,248,245,0.97) 0%, rgba(250,248,245,0.92) 55%, rgba(250,248,245,0.80) 100%)",
            }}
          />
        </div>

        {/* ── Main content wrapper ── */}
        <div className="relative max-w-[520px]">
          {/* ① Eyebrow */}
          <div className="flex items-center gap-3 mb-9">
            <div
              aria-hidden
              style={{
                width: "28px",
                height: "2px",
                borderRadius: "2px",
                background:
                  "linear-gradient(to right, #c8a96e, rgba(200,169,110,0.25))",
                flexShrink: 0,
              }}
            />
            <span
              className="text-[#c8a96e] font-semibold select-none"
              style={{
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              {t("hero.badge")}
            </span>
          </div>

          {/* ② Headline */}
          <h1
            className="text-[#1a1917] font-bold tracking-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.9rem, 4.4vw, 4.6rem)",
              lineHeight: "1.07",
              marginBottom: "0.5rem",
            }}
          >
            {t("hero.headlinePart1")}
          </h1>
          <h1
            className="text-[#2d5a3d] font-bold tracking-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.9rem, 4.4vw, 4.6rem)",
              lineHeight: "1.07",
              marginBottom: "1.75rem",
            }}
          >
            {t("hero.headlinePart2")}
          </h1>

          {/* Thin gold rule — editorial accent under headline */}
          <div
            aria-hidden
            style={{
              width: "52px",
              height: "1.5px",
              borderRadius: "2px",
              background:
                "linear-gradient(to right, #c8a96e, rgba(200,169,110,0.1))",
              marginBottom: "1.75rem",
            }}
          />

          {/* ③ Subheadline */}
          <p
            className="text-[#5c5a57]"
            style={{
              fontSize: "1.0625rem",
              lineHeight: "1.82",
              maxWidth: "480px",
              marginBottom: "2.75rem",
            }}
          >
            {t("hero.subheadline")}
          </p>

          {/* ④ CTAs */}
          <div className="flex flex-wrap items-center gap-5 mb-14">
            {/* Primary */}
            <Link
              href="/products"
              className="group inline-flex items-center gap-2.5 rounded-lg bg-[#2d5a3d] text-white font-semibold hover:bg-[#244a33] transition-all duration-200"
              style={{
                fontSize: "0.875rem",
                padding: "14px 28px",
                boxShadow:
                  "0 4px 18px rgba(45,90,61,0.22), 0 1px 3px rgba(45,90,61,0.15)",
              }}
            >
              {t("hero.cta.shop")}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </Link>

            {/* Secondary — text link style */}
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 font-semibold text-[#1a1917] hover:text-[#2d5a3d] transition-colors duration-200"
              style={{ fontSize: "0.875rem" }}
            >
              {t("hero.cta.story")}
              <span
                className="text-[#c8a96e] transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
                style={{ fontSize: "1rem", lineHeight: 1 }}
              >
                →
              </span>
            </Link>
          </div>

          {/* ⑤ Stats */}
          <div
            className="grid grid-cols-3 pt-8"
            style={{ borderTop: "1px solid rgba(26,25,23,0.08)" }}
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={i > 0 ? "pl-6" : ""}
                style={
                  i > 0 ? { borderLeft: "1px solid rgba(26,25,23,0.08)" } : {}
                }
              >
                <div
                  className="text-[#1a1917] font-bold leading-none"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.55rem, 2.2vw, 2rem)",
                    marginBottom: "6px",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[#78746e] font-medium"
                  style={{
                    fontSize: "9.5px",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom-left brand stamp (desktop) ── */}
        <div
          className="hidden lg:block absolute"
          style={{ bottom: "28px", left: "clamp(24px, 6vw, 96px)" }}
        >
          <span
            className="font-semibold"
            style={{
              color: "rgba(200,169,110,0.45)",
              fontSize: "9.5px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Est. 2018 &nbsp;·&nbsp; Kathmandu, Nepal
          </span>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          RIGHT PANEL  —  full-bleed image (desktop only)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="hidden lg:block relative overflow-hidden"
        style={{ animation: "hero-animate-in 1.1s ease-out 0.12s both" }}
      >
        {/* Tea-garden image */}
        <img
          src="/hero-bg.avif"
          alt="Himalayan tea garden"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "58% center" }}
          loading="eager"
          fetchPriority="high"
        />

        {/* Seamless blend into left panel's cream colour */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 pointer-events-none"
          style={{
            width: "140px",
            background:
              "linear-gradient(to right, #faf8f5 0%, rgba(250,248,245,0.55) 55%, transparent 100%)",
          }}
        />

        {/* Bottom dark vignette — depth & text contrast */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "38%",
            background:
              "linear-gradient(to top, rgba(18,15,12,0.50) 0%, rgba(18,15,12,0.12) 65%, transparent 100%)",
          }}
        />

        {/* Premium inset frame — thin hairline border inside the image */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            inset: "22px",
            insetInlineStart: "68px",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: "3px",
          }}
        />

        {/* Origin label — bottom, glassmorphic */}
        <div
          className="absolute"
          style={{
            bottom: "44px",
            left: "88px",
            animation: "hero-animate-in 0.9s ease-out 0.45s both",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              padding: "14px 20px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.10)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <span
              className="text-white/55 font-semibold"
              style={{
                fontSize: "9px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "3px",
              }}
            >
              Himmat Tea
            </span>
            <span
              className="text-white font-semibold"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "14px",
                lineHeight: 1.2,
              }}
            >
              Premium Tea from Nepal
            </span>
          </div>
        </div>

        {/* Harvest season tag — top right */}
        <div
          className="absolute"
          style={{
            top: "148px",
            right: "32px",
            animation: "hero-animate-in 0.8s ease-out 0.6s both",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 16px",
              borderRadius: "100px",
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.6)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            }}
          >
            <span style={{ fontSize: "13px", lineHeight: 1 }}>🍃</span>
            <span
              className="text-[#1a1917] font-semibold"
              style={{ fontSize: "12px", letterSpacing: "0.01em" }}
            >
              Spring Harvest 2026
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
