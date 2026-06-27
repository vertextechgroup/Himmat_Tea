'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import {
  ArrowLeft,
  ArrowRight,
  Thermometer,
  Clock,
  Leaf,
  Users,
} from "lucide-react";

interface GuideData {
  name: string;
  emoji: string;
  accentColor: string;
  accentBg: string;
  tagline: string;
  description: string;
  temperature: string;
  steepTime: string;
  leafRatio: string;
  servings: string;
  steps: string[];
  proTips: string[];
  mistakes: string[];
}

const guides: Record<string, GuideData> = {
  "green-tea": {
    name: "Green Tea",
    emoji: "🍵",
    accentColor: "#4a7c59",
    accentBg: "#e8f2eb",
    tagline: "Delicate, grassy, and full of nuance",
    description:
      "Green tea is the most delicate of all tea types, and it rewards patience and precision. Himalayan green teas from the Ilam region carry a distinctive sweetness and fresh vegetal character that sets them apart from Chinese or Japanese varieties. The key to a perfect cup is never rushing the process.",
    temperature: "70–80°C",
    steepTime: "2–3 min",
    leafRatio: "2g per 200ml",
    servings: "2–3 infusions",
    steps: [
      "Heat fresh, filtered water to 70–80°C. If you don't have a temperature-controlled kettle, bring water to a boil and then let it cool for 4–5 minutes.",
      "Warm your teapot or cup by rinsing it with a splash of the hot water. Discard the rinse water. This helps maintain a consistent brewing temperature.",
      "Measure 2g of loose leaf green tea per 200ml of water. Use a fine mesh infuser and give the leaves room to unfurl.",
      "Pour the water over the leaves slowly and evenly. Avoid pouring directly onto the leaves — aim for the side of the vessel.",
      "Steep for 2–3 minutes. Start with 2 minutes for your first infusion; you can extend slightly for subsequent infusions.",
      "Remove the infuser promptly. Over-steeping green tea even by 30 seconds can introduce unwanted bitterness. Serve immediately and enjoy.",
    ],
    proTips: [
      "Use spring water or filtered water whenever possible. Chlorinated tap water can mask green tea's subtle sweetness and introduce off-flavours.",
      "Green tea leaves can be re-steeped 2–3 times. Each infusion reveals different characteristics — the first is bright and fresh, the second softer and more nuanced.",
      "Try a longer, colder steep: place 4g of leaves in 400ml of cold water and refrigerate overnight (8–12 hours) for a smooth, naturally sweet cold brew.",
    ],
    mistakes: [
      "Using boiling water (100°C). This is the most common mistake and causes harsh bitterness by scorching the delicate leaves. Always use water below 80°C.",
      "Steeping too long. Even 30 seconds over the recommended time can make green tea unpleasantly astringent. Set a timer every time.",
      "Storing tea near heat or light. Green tea oxidises rapidly when exposed to warmth, sunlight, or air. Always store in an opaque, airtight container away from your stove.",
    ],
  },
  "black-tea": {
    name: "Black Tea",
    emoji: "☕",
    accentColor: "#7c4a3a",
    accentBg: "#f2ebe8",
    tagline: "Bold, malty, and deeply satisfying",
    description:
      "Nepali black tea is among the world's finest, produced at high altitudes in the Ilam and Kanchanjangha regions. Fully oxidised and richly flavoured, it ranges from bright and muscatel to deep and malty. Unlike many black teas, Himalayan black teas are smooth enough to drink without milk, though they also welcome it beautifully.",
    temperature: "95–100°C",
    steepTime: "3–5 min",
    leafRatio: "2.5g per 200ml",
    servings: "2 infusions",
    steps: [
      "Bring fresh, filtered water to a full rolling boil (95–100°C). Black tea benefits from the full energy of boiling water to extract its bold flavours.",
      "Warm your teapot by rinsing with a little boiling water, then discard. This prevents your brewing temperature from dropping prematurely.",
      "Measure 2.5g of loose leaf black tea per 200ml of water. For a stronger, breakfast-style cup, you can increase to 3g.",
      "Pour boiling water directly over the leaves. Black tea is robust and handles direct pouring well.",
      "Steep for 3–5 minutes depending on your preference. 3 minutes yields a bright, lively cup; 5 minutes produces a stronger, more full-bodied brew.",
      "Remove the leaves promptly to prevent over-extraction. Serve black, or add a splash of whole milk if desired. Avoid sugar — it masks the nuanced terroir notes.",
    ],
    proTips: [
      "First-flush Nepali black teas (harvested March–April) are lighter and more aromatic. Second-flush teas (May–June) are richer and more muscatel. Try both to find your preference.",
      "For iced tea, brew at double strength (5g per 200ml) and pour over ice immediately. The rapid chilling locks in brightness and prevents cloudiness.",
      "A pinch of cardamom added to the pot transforms Nepali black tea into an elegant masala chai base — simply add warmed milk and a touch of honey.",
    ],
    mistakes: [
      "Using water that hasn't fully boiled. Tepid or warm water produces a flat, flavourless cup because the compounds that create black tea's characteristic depth require high temperatures to extract properly.",
      "Adding milk before the tea. Always pour tea first, then add milk to taste. Adding milk first interferes with the brewing process if you're using the pot method.",
      "Storing black tea in the fridge. Moisture from condensation will degrade quality rapidly. Store at room temperature in an airtight, opaque container.",
    ],
  },
  oolong: {
    name: "Oolong Tea",
    emoji: "🌿",
    accentColor: "#7c6a3a",
    accentBg: "#f2ede8",
    tagline: "Complex, layered, and endlessly rewarding",
    description:
      "Oolong sits in the fascinating middle ground between green and black tea. Partially oxidised, it develops a spectrum of flavours that shifts from floral and fruity in lightly oxidised styles to rich and roasted in darker varieties. Himalayan oolongs are a recent and exciting development from Nepal's high-altitude gardens.",
    temperature: "85–95°C",
    steepTime: "3–4 min",
    leafRatio: "3g per 200ml",
    servings: "3–5 infusions",
    steps: [
      "Heat water to 85–95°C. Lighter, more floral oolongs prefer the lower end of this range; darker, roasted styles benefit from higher temperatures.",
      "Rinse the leaves with a quick 10-second pour of hot water, then discard this rinse. This 'wakes' the leaves and removes any residual dust.",
      "Measure 3g of oolong per 200ml. Oolong leaves are often large and tightly rolled — they need space to unfurl, so use a large infuser or gaiwan.",
      "Pour water evenly over the leaves and steep for 3–4 minutes for the first infusion.",
      "Decant all the liquid to prevent over-steeping. Oolong is particularly sensitive to over-extraction because the leaves continue to release flavour after steeping.",
      "Re-steep the leaves for subsequent infusions, adding 30 seconds each time. Good oolong reveals new dimensions with each infusion — first fruity, then floral, then subtly toasty.",
    ],
    proTips: [
      "Gongfu-style brewing — using a small vessel with a high leaf-to-water ratio and very short steep times (30–60 seconds) — is the most rewarding way to explore oolong complexity.",
      "The third and fourth infusion of a quality oolong is often considered the best — the leaves are fully open and all their aromatic compounds are accessible.",
      "Oolong pairs beautifully with light pastries, fruit, and mild cheeses. Avoid strongly spiced foods that will overwhelm its nuance.",
    ],
    mistakes: [
      "Skipping the rinse. The initial rinse isn't just for cleanliness — it softens tightly rolled leaves so they expand properly during brewing.",
      "Using the same steep time for every infusion. Oolong requires adjustment with each steep. Start at 3 minutes and increase by 30 seconds with each subsequent infusion.",
      "Brewing only once. Oolong is specifically designed for multiple infusions. Discarding the leaves after one steep wastes most of the tea's potential.",
    ],
  },
  "white-tea": {
    name: "White Tea",
    emoji: "🌸",
    accentColor: "#7a6a8a",
    accentBg: "#f0edf5",
    tagline: "Gentle, silky, and naturally sweet",
    description:
      "White tea is the least processed of all teas — the young buds and leaves are simply picked, withered, and dried. The result is a cup that is extraordinarily subtle: silky in texture, pale in colour, and delicate in flavour with notes of honey, fresh hay, and wildflower. Himalayan white teas, produced in small batches, are some of the most prized in the world.",
    temperature: "75–85°C",
    steepTime: "4–5 min",
    leafRatio: "2g per 200ml",
    servings: "2–3 infusions",
    steps: [
      "Heat filtered water to 75–85°C. White tea is the most temperature-sensitive of all teas. Even slight overheating will flatten its delicate floral character.",
      "Warm your vessel briefly and discard the rinse water. Use a porcelain or glass vessel — metal can impart a faint metallic note that white tea's subtlety will reveal.",
      "Measure 2g of loose leaf white tea per 200ml. White tea leaves are often large and fluffy — they look like a lot but weigh very little.",
      "Pour water gently over the leaves. Do not pour directly onto the buds; let the water cascade in from the side.",
      "Steep for 4–5 minutes. White tea benefits from a longer steep than green to fully extract its gentle sweetness without becoming astringent.",
      "Remove the leaves and sip slowly. Appreciate the colour — a pale golden hue is the mark of a perfect cup. Drink without any additions to experience the full character.",
    ],
    proTips: [
      "High-quality white tea can be cold brewed magnificently. Use 4g per 500ml of cold water and steep in the refrigerator for 12–24 hours. The result is an exquisitely sweet, clear cup.",
      "White tea is rich in antioxidants and slightly lower in caffeine than green tea — making it an ideal afternoon option.",
      "Try steeping at different temperatures within the 75–85°C range and compare. Even a 5°C difference reveals different aspects of the same tea.",
    ],
    mistakes: [
      "Using boiling water. This is the most damaging mistake with white tea — the high temperature destroys its delicate aromatic compounds and produces a thin, papery cup.",
      "Expecting bold flavour. White tea is intentionally subtle. If you're expecting the strength of black tea, you'll be disappointed. Calibrate your expectations toward elegance, not power.",
      "Short steeping. Unlike green tea, white tea needs a full 4–5 minutes to express itself. Too short a steep produces a flat, watery result.",
    ],
  },
  herbal: {
    name: "Herbal Tisane",
    emoji: "🌼",
    accentColor: "#6a7c3a",
    accentBg: "#eff2e8",
    tagline: "Caffeine-free, aromatic, and nourishing",
    description:
      "Herbal tisanes are technically not 'tea' — they contain no Camellia sinensis leaves — but they are brewed and enjoyed in the same way. Our Himalayan herbal blends draw on the rich medicinal and aromatic plant traditions of Nepal: lemongrass from the Terai, chamomile from mountain meadows, and wild-harvested herbs from elevations above 2,000 metres.",
    temperature: "100°C",
    steepTime: "5–7 min",
    leafRatio: "3g per 200ml",
    servings: "1–2 infusions",
    steps: [
      "Bring fresh water to a full rolling boil (100°C). Unlike true teas, herbal tisanes require maximum heat to extract their flavour, aroma, and beneficial compounds from tough plant material.",
      "Warm your teapot and discard the rinse water. Cover your teapot with a lid while brewing to retain the volatile aromatic compounds that give herbal teas their character.",
      "Measure 3g of herbal blend per 200ml — slightly more generous than true tea, as herbs are often lighter and less dense than processed tea leaves.",
      "Pour boiling water over the herbs. Cover immediately to trap the aromatic oils.",
      "Steep for 5–7 minutes covered. Shorter steeping produces a lighter, more aromatic cup; longer steeping creates a stronger, more medicinal brew.",
      "Strain carefully and serve. Herbal tisanes can be sweetened with a small amount of honey, which complements floral blends beautifully. Taste before adding any sweetener.",
    ],
    proTips: [
      "Cover your cup or pot while steeping. Many of the beneficial compounds in herbs are volatile — they evaporate with steam if left uncovered, reducing both flavour and therapeutic value.",
      "Herbal tisanes are superb iced. Brew double-strength, sweeten lightly while hot, and refrigerate. They make a deeply refreshing summer drink.",
      "Blend our chamomile tisane with a slice of fresh ginger and a squeeze of lemon for a soothing evening drink that aids digestion and relaxation.",
    ],
    mistakes: [
      "Under-steeping. Herbal tisanes need the full 5–7 minutes. Pulling them early produces a thin, watery brew that lacks the full character and benefits of the herbs.",
      "Not covering the pot. Aromatic herbs like peppermint, lemongrass, and chamomile release their most volatile and fragrant compounds as steam. Always cover the pot during steeping.",
      "Using old or poorly stored herbs. Herbal tisanes lose their potency quickly if exposed to air and light. Always store in airtight, opaque containers and use within 12 months of purchase.",
    ],
  },
  "pu-erh": {
    name: "Pu-erh Tea",
    emoji: "🧱",
    accentColor: "#4a3a2a",
    accentBg: "#ede8e2",
    tagline: "Earthy, aged, and deeply complex",
    description:
      "Pu-erh is unique among teas — it is fermented and aged, sometimes for decades. The result is a deeply earthy, smooth, and complex cup that bears little resemblance to other tea styles. While traditionally from Yunnan, Nepal's high-altitude gardens have begun producing exceptional Himalayan-style aged teas that are gaining international recognition.",
    temperature: "95–100°C",
    steepTime: "3–5 min",
    leafRatio: "4g per 200ml",
    servings: "5–8 infusions",
    steps: [
      "Bring water to a full rolling boil. Pu-erh's compressed, aged leaves require maximum temperature to open up and release their complex profile.",
      "Perform a mandatory rinse: pour boiling water over the leaves, steep for 10–15 seconds, and discard. This 'wakes' the aged leaves and removes any surface impurities from the aging process.",
      "Measure 4g per 200ml — pu-erh is compact and dense, and needs a generous measure. If using a cake or brick, break off the leaves carefully with a pu-erh pick to preserve the leaf structure.",
      "Pour boiling water and steep for 3–5 minutes for the first full infusion. The first infusion after rinsing is often the most revealing of the tea's character.",
      "Decant fully and assess the colour: good pu-erh produces a deep amber to dark garnet liquor. The aroma should be earthy, woody, and clean — not musty or sour.",
      "Re-steep multiple times, adding 1 minute for each subsequent infusion. Quality pu-erh can yield 6–8 excellent infusions from a single measure of leaves.",
    ],
    proTips: [
      "Store pu-erh at room temperature with some air circulation and moderate humidity. Unlike other teas, pu-erh continues to age and improve over time if stored correctly — not in an airtight container.",
      "Aged raw (sheng) pu-erh and ripe (shou) pu-erh taste dramatically different. Shou is smooth, earthy, and immediately approachable; sheng is sharper and more complex when young but mellows beautifully with age.",
      "Pu-erh is excellent after a heavy meal — its fermented compounds support digestion and cut through richness.",
    ],
    mistakes: [
      "Skipping the rinse. This is non-negotiable with pu-erh. The rinse is essential for awakening the compressed leaves and removing the surface bitterness accumulated during aging.",
      "Using flavoured or chlorinated water. Pu-erh's subtle earthy notes are easily overpowered or distorted by off-flavours in the water. Use filtered or spring water only.",
      "Discarding leaves after one infusion. Pu-erh is one of the most re-steepable teas available — it often gets better after the second or third infusion. Brewing it only once is a waste of exceptional leaves.",
    ],
  },
};

export default function BrewingGuideDetail() {
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? guides[slug] : undefined;

  if (!guide) {
    return (
      <div
        className="min-h-screen bg-[#f9f7f4]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <Navigation />
        <main className="pt-[180px] pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-6xl mb-6">🍵</p>
            <h1
              className="text-3xl font-semibold text-[#1c1917] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Guide Not Found
            </h1>
            <p className="text-[#78746e] mb-8">
              We don't have a brewing guide for "<strong>{slug}</strong>" yet.
            </p>
            <Link
              href="/brewing-guides"
              className="inline-flex items-center gap-2 bg-[#2d5a3d] text-white hover:bg-[#234832] rounded-xl px-6 py-3 font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Brewing Guides
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f9f7f4]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Navigation />
      <main className="pt-[180px] pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/brewing-guides"
            className="inline-flex items-center gap-2 text-[#78746e] hover:text-[#2d5a3d] text-sm mb-10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Brewing Guides
          </Link>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Page Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                    style={{ backgroundColor: guide.accentBg }}
                  >
                    {guide.emoji}
                  </div>
                  <p
                    className="text-xs uppercase tracking-widest font-medium"
                    style={{ color: guide.accentColor }}
                  >
                    Brewing Guide
                  </p>
                </div>
                <h1
                  className="text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] font-semibold text-[#1c1917] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {guide.name}
                </h1>
                <p className="text-[#c8a96e] font-medium italic mb-6">
                  {guide.tagline}
                </p>
                <p className="text-[#444] leading-relaxed text-lg">
                  {guide.description}
                </p>
              </div>

              {/* Step-by-Step Instructions */}
              <div>
                <h2
                  className="text-xl font-semibold text-[#1c1917] mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Step-by-Step Instructions
                </h2>
                <ol className="space-y-5">
                  {guide.steps.map((step, i) => (
                    <li key={i} className="flex gap-5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 mt-0.5"
                        style={{ backgroundColor: guide.accentColor }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-[#444] leading-relaxed pt-0.5">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Pro Tips */}
              <div className="bg-white rounded-2xl border border-[rgba(28,25,23,0.06)] p-6 lg:p-8">
                <h2
                  className="text-xl font-semibold text-[#1c1917] mb-5"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  ✨ Pro Tips
                </h2>
                <ul className="space-y-4">
                  {guide.proTips.map((tip, i) => (
                    <li key={i} className="flex gap-3">
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0"
                        style={{ backgroundColor: guide.accentColor }}
                      />
                      <p className="text-[#444] leading-relaxed">{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Mistakes */}
              <div className="bg-[#fff8f6] rounded-2xl border border-[rgba(28,25,23,0.06)] p-6 lg:p-8">
                <h2
                  className="text-xl font-semibold text-[#1c1917] mb-5"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  ⚠️ Common Mistakes to Avoid
                </h2>
                <ul className="space-y-4">
                  {guide.mistakes.map((mistake, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c8593a] mt-2.5 shrink-0" />
                      <p className="text-[#444] leading-relaxed">{mistake}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div
                className="rounded-2xl p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                style={{ backgroundColor: guide.accentBg }}
              >
                <div>
                  <p
                    className="text-xs uppercase tracking-widest font-medium mb-2"
                    style={{ color: guide.accentColor }}
                  >
                    Ready to Brew?
                  </p>
                  <p className="text-[#1c1917] font-medium">
                    Shop our selection of premium {guide.name.toLowerCase()} and
                    taste the difference Himalayan altitude makes.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="shrink-0 flex items-center gap-2 bg-[#2d5a3d] text-white hover:bg-[#234832] rounded-xl px-6 py-3 font-medium transition-colors"
                >
                  Shop Teas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Sidebar: Quick Reference */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <div className="bg-white rounded-2xl border border-[rgba(28,25,23,0.06)] p-6 lg:p-8">
                  <h2
                    className="text-lg font-semibold text-[#1c1917] mb-6"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Quick Reference
                  </h2>
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#f9f7f4] flex items-center justify-center shrink-0">
                        <Thermometer className="h-5 w-5 text-[#78746e]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#78746e] uppercase tracking-wide mb-0.5">
                          Temperature
                        </p>
                        <p className="font-semibold text-[#1c1917]">
                          {guide.temperature}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#f9f7f4] flex items-center justify-center shrink-0">
                        <Clock className="h-5 w-5 text-[#78746e]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#78746e] uppercase tracking-wide mb-0.5">
                          Steep Time
                        </p>
                        <p className="font-semibold text-[#1c1917]">
                          {guide.steepTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#f9f7f4] flex items-center justify-center shrink-0">
                        <Leaf className="h-5 w-5 text-[#78746e]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#78746e] uppercase tracking-wide mb-0.5">
                          Leaf : Water
                        </p>
                        <p className="font-semibold text-[#1c1917]">
                          {guide.leafRatio}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#f9f7f4] flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-[#78746e]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#78746e] uppercase tracking-wide mb-0.5">
                          Infusions
                        </p>
                        <p className="font-semibold text-[#1c1917]">
                          {guide.servings}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[rgba(28,25,23,0.06)] mt-6 pt-6">
                    <p className="text-xs text-[#78746e] leading-relaxed">
                      All times and temperatures are starting points. Adjust to
                      your personal taste — brewing tea is a practice, not a
                      formula.
                    </p>
                  </div>
                </div>

                {/* Other Guides */}
                <div className="mt-6 bg-[#f0ede8] rounded-2xl p-6">
                  <p className="text-xs uppercase tracking-widest text-[#78746e] font-medium mb-4">
                    Explore More
                  </p>
                  <div className="space-y-2">
                    {Object.entries(guides)
                      .filter(([s]) => s !== slug)
                      .slice(0, 4)
                      .map(([s, g]) => (
                        <Link
                          key={s}
                          href={`/brewing-guides/${s}`}
                          className="flex items-center gap-3 py-2 text-sm text-[#1c1917] hover:text-[#2d5a3d] transition-colors"
                        >
                          <span>{g.emoji}</span>
                          <span>{g.name}</span>
                          <ArrowRight className="h-3 w-3 ml-auto text-[#78746e]" />
                        </Link>
                      ))}
                  </div>
                  <Link
                    href="/brewing-guides"
                    className="block mt-4 text-xs text-[#2d5a3d] hover:underline font-medium"
                  >
                    View all guides →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
