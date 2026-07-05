# Godgifted — Website Transformation Blueprint
### Turning the Himmat Tea codebase into the multi-product Godgifted platform
*Prepared as an execution-ready prompt pack — hand each numbered prompt to a developer or an AI coding agent (e.g. Claude Code) in order.*

---

## 0. What I Found When I Analyzed the Codebase

Before the prompts, here's the actual audit — this is the "why" behind every instruction below.

**Stack:** Next.js 15 (App Router) + TypeScript, Prisma + SQLite, Tailwind v4, Radix/shadcn components, MUI (partial), `react-router` remnants, 5-language i18n (`en`, `ne`, `hi`, `zh`, `ja`) via a custom `TranslationContext`, and a full commerce layer: cart, wishlist, checkout, customer auth, orders, reviews, coupons, subscriptions, blog, brewing guides, and a hidden admin dashboard at `/himmat_admin_8526`.

**Brand is hard-coded everywhere, not centralized.** There is no single "brand config" file. The string `"Himmat Tea"` (or `Himmat`) is written directly into ~44 files, including:

| Area | Files | Why it matters |
|---|---|---|
| SEO/meta | `src/app/layout.tsx` | Title, OG tags, Twitter card, domain `himmattea.com` |
| Global state | `src/context/StoreContext.tsx`, `AuthContext.tsx` | Default store name baked into app state |
| Admin | `DashboardLayout.tsx`, `himmat_admin_8526/*` | Route slug + dashboard header both say "Himmat" |
| Legal | `Terms.tsx`, `PrivacyPolicy.tsx`, `Careers.tsx` | Entity name in legal copy |
| Storefront | `Navigation.tsx`, `Footer.tsx`, `About.tsx`, `Testimonials.tsx` | Logo text, copyright line, "Our Story" |
| Data | `prisma/seed.ts`, `src/lib/mock-data.ts`, `Settings` model default | `storeName`, `storeEmail` defaults |
| i18n | `src/locales/*.json` (614 lines each) | Translated brand/nav strings per language |

**The product model is single-line only.** `Product.category` is a flat string (`"green" | "black" | "herbal" | "oolong" | "white"`) — i.e. tea sub-types. There is **no concept of a product line/vertical** (Tea vs. Dal vs. Spices, etc.). This is the core structural gap that has to be fixed first — everything else (nav, filters, homepage) depends on it.

**Naming is also inconsistent even within "tea."** The features section eyebrow text says *"Why TeaHaven"* while the rest of the site says "Himmat Tea" — a leftover from an earlier template pass. This needs cleanup regardless of the Godgifted move.

**Visual identity worth preserving:** primary green `#2d5a3d`, gold accent `#c8a96e`, warm off-white background `#f9f7f4`, Playfair Display + DM Sans pairing. This is a strong, food-brand-appropriate palette — recommend keeping it as the *Godgifted* master palette and letting each product line (Tea, Dal, ...) get a small accent variation rather than a full re-theme.

---

## 1. Brand Architecture Decision (read this before running any prompt)

You told me: **Godgifted is the company. Himmat Tea is the flagship product line. There will be others (Dal, and more later).**

Recommended structure — a **"house of brands with a shared storefront"** model, the same pattern Tata Consumer Products or ITC uses (parent umbrella + named product lines):

```
GODGIFTED (company / master brand — logo, domain, legal entity, checkout, account, admin)
 │
 ├── Himmat Tea            → Product Line: "tea"    (existing SKUs, existing sub-categories: green/black/herbal/oolong/white)
 ├── Godgifted Dal         → Product Line: "dal"    (new: toor, moong, chana, masoor, urad, etc.)
 └── [future line]         → Product Line: "___"    (spices / grains / ghee / honey — just add a row, no rebuild)
```

**Why keep "Himmat" for tea specifically instead of renaming it "Godgifted Tea":** it's already got brand equity built into the current site's copy, reviews, and testimonials. Losing it would waste real content. Everywhere else — legal entity, domain, checkout receipts, admin panel, copyright line, SEO — becomes **Godgifted**.

If your other product lines don't have names yet, use `Godgifted Dal`, `Godgifted Spices`, etc. as the default pattern (Company Name + Category) until you decide otherwise — that's what the prompts below assume. Swap the string later; the structure won't change.

---

## 2. Target Sitemap

```
godgifted.com
├── /                         → Company homepage (NEW hero, "Our Product Lines" grid, bestsellers across lines)
├── /himmat-tea                → Tea line landing page (existing homepage content moves here)
│     └── /himmat-tea/products/[id]
├── /godgifted-dal             → Dal line landing page (NEW, mirrors tea line structure)
│     └── /godgifted-dal/products/[id]
├── /products                 → Unified catalog, filterable by Product Line + Category
├── /products/[id]
├── /collections, /collections/[slug]
├── /about                    → Godgifted company story (mission/values/founders)
├── /about/sourcing            → Can stay tea-specific OR become per-line tabs
├── /brewing-guides            → Stays tea-specific (rename copy: "Himmat Tea Brewing Guides")
├── /wholesale, /careers, /contact, /faq, /blog
├── /cart, /checkout, /account, /wishlist, /subscribe
├── /shipping-returns, /privacy-policy, /terms
└── /godgifted_admin_XXXX      → Renamed admin dashboard (product-line-aware)
```

---

## 3. Execution Prompts

Run these **in order**. Each one is self-contained — copy it as-is into your coding agent, or use it as a dev ticket.

---

### PROMPT 1 — Create a single source of truth for branding

> Create a new file `src/config/brand.ts` that exports a `BRAND` constant object containing: `companyName: "Godgifted"`, `legalName: "Godgifted Pvt. Ltd."` (adjust to real entity), `domain: "godgifted.com"`, `supportEmail: "support@godgifted.com"`, `supportPhone` (reuse existing number), `tagline: "Pure, Traceable, God-Gifted."`, and a `productLines` array of `{ slug, name, category, description, color }` objects — seed it with:
> ```ts
> { slug: "himmat-tea", name: "Himmat Tea", category: "tea", description: "Hand-sourced tea from the Himalayan foothills and beyond.", color: "#2d5a3d" },
> { slug: "godgifted-dal", name: "Godgifted Dal", category: "dal", description: "Stone-ground, unpolished pulses sourced directly from farmers.", color: "#b8862f" }
> ```
> Do not hardcode any brand string anywhere else going forward — every component that currently writes `"Himmat Tea"` literally should import from this file instead. This file is the only place a future rename or new product line should require editing (besides content copy).

---

### PROMPT 2 — Update global metadata and SEO

> In `src/app/layout.tsx`, replace the hardcoded `title`, `description`, `openGraph`, and `twitter` metadata to pull from `BRAND` (`src/config/brand.ts`). New copy should describe Godgifted as the parent company ("Godgifted — Pure, traceable food products including Himmat Tea and Godgifted Dal, sourced directly from Himalayan farms") rather than describing only tea. Update the `url` field from `https://himmattea.com` to `https://godgifted.com`.

---

### PROMPT 3 — Extend the data model for multiple product lines

> In `prisma/schema.prisma`, add a new model:
> ```prisma
> model ProductLine {
>   id          String    @id @default(cuid())
>   slug        String    @unique
>   name        String
>   description String
>   heroImage   String?
>   isActive    Boolean   @default(true)
>   sortOrder   Int       @default(0)
>   createdAt   DateTime  @default(now())
>   updatedAt   DateTime  @updatedAt
>   products    Product[]
> }
> ```
> Modify `model Product` to add a required relation:
> ```prisma
> productLineId String
> productLine   ProductLine @relation(fields: [productLineId], references: [id])
> ```
> Keep the existing `category` field on `Product` as-is — it now represents the **sub-category within a line** (e.g. `"green"` under the `himmat-tea` line, `"toor"` under the `godgifted-dal` line), not the top-level vertical. Generate and run a migration. Update `src/context/StoreContext.tsx`'s `Product` interface and any TypeScript types (`src/lib/mock-data.ts`, dashboard product forms) to include `productLineId` and a nested `productLine` object.

---

### PROMPT 4 — Update seed data with real multi-line products

> In `prisma/seed.ts`:
> 1. First seed two `ProductLine` rows — `himmat-tea` and `godgifted-dal` — using the descriptions from `BRAND.productLines`.
> 2. Keep all existing tea products, but link each to the `himmat-tea` line via `productLineId`.
> 3. Add 6–8 sample dal/pulses products linked to `godgifted-dal`, following the existing product shape (name, category as sub-type like `"toor"`, `"moong"`, `"chana"`, `"masoor"`, price, stock, description, imageUrl, isBestseller). Use realistic Nepali-sourced-pulses copy (e.g. "unpolished, stone-ground toor dal from the Terai plains").
> 4. Update the `Settings` model defaults: `storeName: "Godgifted"`, `storeEmail: "support@godgifted.com"`.
> Run `npm run prisma:seed` after this to verify it seeds cleanly.

---

### PROMPT 5 — Rebuild Navigation.tsx as a multi-line mega menu

> In `src/app/components/Navigation.tsx`:
> 1. Replace the hardcoded logo text (currently "Himmat Tea" at ~lines 416 and 724) with `BRAND.companyName` ("Godgifted"), optionally with a small "Home of Himmat Tea" sub-label under the logo on desktop.
> 2. Change the top-level nav from tea-sub-category dropdowns to **two levels**: a primary item per product line (`Himmat Tea`, `Godgifted Dal`), each opening a mega-menu with that line's own sub-categories (tea keeps its existing Green/Black/Herbal/Oolong/White/Tea Sets structure; dal gets its own: Toor, Moong, Chana, Masoor, Gift Hampers).
> 3. Keep `Wholesale`, `Our Story`, `Blog` as company-level nav items (not per-line).
> 4. Update `SEARCH_PRODUCTS` to include dal products, and add a `productLine` field to each search result so the search dropdown can show a small line badge (e.g. "Himmat Tea" / "Godgifted Dal") next to each result.
> 5. Update the `ANNOUNCEMENTS` array — the free-shipping code `TEAHAVEN` should become a line-agnostic code like `GODGIFTED` (or `WELCOME10`), since it's no longer tea-only.

---

### PROMPT 6 — New company homepage

> Currently `src/app/pages/LandingPage.tsx` (rendered at `/`) is entirely tea-focused (Hero → Features → ProductsSection → Testimonials). Restructure it as the **Godgifted company homepage**:
> 1. `Hero.tsx`: update headline from tea-specific copy ("Discover the Art of Fine Tea") to a company-level headline ("Pure, God-Gifted Goodness — From Himalayan Farms to Your Home") with a subheadline that name-drops both product lines. Keep the two CTAs but repoint them to "Shop Himmat Tea" and "Shop Godgifted Dal" (or a combined "Shop All Products").
> 2. Add a **new component** `ProductLinesShowcase.tsx` — a 2-up (scales to N-up) card grid, one large card per product line, each with its hero image, name, one-line description, and a "Shop [Line Name]" button linking to `/himmat-tea` or `/godgifted-dal`.
> 3. `ProductsSection.tsx`: change from "hardcoded 4 teas" to "bestsellers across all product lines" — pull `isBestseller: true` products regardless of line, show a small product-line badge on each card.
> 4. `Features.tsx`: generalize the "Why [Brand]" eyebrow (fix the leftover "Why TeaHaven" bug here too) to "Why Godgifted" and make the 3–4 feature bullets company-level (traceability, direct-from-farm sourcing, quality certification) rather than tea-specific (remove any caffeine/brewing-specific claims from this section — those belong on the tea line page).
> 5. `Testimonials.tsx`: fix the hardcoded brand string here (flagged in the original structure doc as a bug — it says "Himmat Tea" mid-quote in one place it shouldn't); keep tea testimonials but add 1–2 dal testimonials once available.

---

### PROMPT 7 — Create the Himmat Tea line landing page

> Create `src/app/himmat-tea/page.tsx`. Move the *current* tea-specific homepage content here almost unchanged (it already exists — Hero-style banner, tea category grid, brewing guide teaser, tea testimonials). This becomes the dedicated tea storefront. Add a small breadcrumb/eyebrow reading "Godgifted / Himmat Tea" at the top so users always know they're inside a Godgifted product line, not a separate company.

---

### PROMPT 8 — Create the Godgifted Dal line landing page

> Create `src/app/godgifted-dal/page.tsx`, structurally mirroring Prompt 7 but for dal: hero banner with dal-specific imagery/copy, a sub-category grid (Toor / Moong / Chana / Masoor / Hampers), a "How We Source" teaser (stone-ground, direct-from-farmer angle — reuse the sourcing-transparency pattern from `/about/sourcing`, adapted), and dal-specific testimonials/placeholder content. Reuse `ProductSlider.tsx` and `ProductsSection.tsx` patterns filtered by `productLine.slug === "godgifted-dal"`.

---

### PROMPT 9 — Update the unified product catalog and product detail page

> 1. `src/app/pages/ProductsCatalog.tsx` (and `/products/page.tsx`): add a **Product Line filter** as the first/primary filter (above Category), with options "Himmat Tea" and "Godgifted Dal". Selecting a line should dynamically change the Category filter options underneath it (tea's green/black/etc. vs. dal's toor/moong/etc.). Update the empty-state and SEO copy to be line-agnostic by default.
> 2. `src/app/products/[id]/page.tsx` and `ProductDetail.tsx`: add a small clickable badge/breadcrumb showing the product's line (e.g. "Himmat Tea" pill linking back to `/himmat-tea`), so cross-line browsing is easy. The "Brew Guide" tab should only render for tea-line products; dal-line products should show a "Cooking Guide" tab instead (soak time, cook time, water ratio — mirror the brew-guide data shape).

---

### PROMPT 10 — Footer

> In `src/app/components/Footer.tsx`:
> 1. Replace the flat `[t("footer.shop")]` link list (all tea items) with two grouped columns: "Himmat Tea" (existing tea links) and "Godgifted Dal" (new dal category links), or a single "Shop" column with a sub-heading per line if space is tight.
> 2. Fix the hardcoded support email (flagged in the original structure doc as pointing at `hello@Himmat Tea.com`, which isn't even a valid address) — pull from `BRAND.supportEmail`.
> 3. Update the copyright line from "© Himmat Tea" to "© Godgifted" with a small "Himmat Tea is a Godgifted brand" line underneath if legally/brand-wise you want that disclosed.

---

### PROMPT 11 — Rewrite the About page as the company story

> `src/app/about/page.tsx` / `About.tsx` currently tells Himmat Tea's origin story only. Restructure as:
> 1. Hero: "From the Hills of Nepal, God-Gifted to the World" — Godgifted-level headline.
> 2. Founding story: reframe as *the Godgifted company's* founding (why the founders started sourcing directly from farmers), with a clearly separated sub-section: "How Himmat Tea Began" (preserve the existing tea-specific founding narrative here, don't delete it — just demote it from page-level to section-level) and, once available, a matching "How Godgifted Dal Began" section.
> 3. Mission/values grid stays company-level (Traceability, Freshness, Fair Trade, Sustainability) — these already apply across product lines without editing.
> 4. Add a "Our Product Lines" strip near the bottom linking to `/himmat-tea` and `/godgifted-dal`, reusing the `ProductLinesShowcase` component from Prompt 6.

---

### PROMPT 12 — Wholesale, Careers, Contact, Terms, Privacy Policy

> These four pages currently reference "Himmat Tea" as the contracting/legal entity 14, 14, and 7 times respectively (per the audit above) — mostly in legal boilerplate and B2B copy.
> 1. `Terms.tsx` / `PrivacyPolicy.tsx`: replace the legal entity name with `BRAND.legalName` ("Godgifted Pvt. Ltd.") everywhere it appears — do this with a careful find-and-replace since these are legal documents; don't paraphrase legal clauses, only swap the entity name and email/domain.
> 2. `Careers.tsx`: change "Join the Himmat Tea team" style copy to "Join the Godgifted team" and mention that the team works across both the tea and dal lines (this is actually a hiring selling point — cross-category growth).
> 3. `Wholesale.tsx`: the wholesale inquiry form's "business type" dropdown and benefits copy should mention both product lines — a café might want tea, a retailer might want both. Add a "Which product lines are you interested in?" multi-select to the inquiry form.
> 4. `Contact.tsx`: update the "Subject" dropdown to include line-specific options (e.g. "Himmat Tea Order", "Godgifted Dal Order", "Wholesale", "General").

---

### PROMPT 13 — i18n: update all five locale files

> In `src/locales/en.json`, `ne.json`, `hi.json`, `zh.json`, `ja.json` (614 keys each):
> 1. Add new top-level keys: `brand.companyName`, `brand.tagline`.
> 2. Restructure the `nav.*` keys: keep the existing tea sub-category keys (`nav.greenTea`, `nav.blackTea`, etc.) but namespace them under a tea-line group, and add a parallel set for dal (`nav.toorDal`, `nav.moongDal`, `nav.chanaDal`, `nav.masoorDal`, each with a `*Sub` description key following the existing pattern like `nav.greenTeaSub: "Fresh & delicate"`).
> 3. Update `hero.headlinePart1` / `hero.headlinePart2` and `features.eyebrow` (fixes the "Why TeaHaven" bug in every language file, not just English) to company-level copy.
> 4. Get every non-English file translated by a native speaker or professional translation pass before shipping — do not machine-translate the final copy, especially for Nepali (`ne`) and Hindi (`hi`) since this is a Himalayan-sourced-food brand and tone matters to the target market.

---

### PROMPT 14 — Admin dashboard: rebrand and make it product-line-aware

> 1. Rename the admin route from `src/app/himmat_admin_8526/` to a new obscured slug, e.g. `src/app/godgifted_admin_<new-random-suffix>/` — generate a fresh random suffix rather than reusing the old one, since the old slug may already be indexed/leaked. Update every internal `Link` and `redirect()` call that references the old path (check `AuthContext.tsx`, `ProtectedRoute.tsx`, and all `dashboard/*` pages).
> 2. `DashboardLayout.tsx`: replace the "Himmat Tea" header/logo text (17 occurrences per the audit) with "Godgifted" plus a product-line switcher/filter control in the top bar so an operator can view "All", "Himmat Tea only", or "Godgifted Dal only" data.
> 3. `dashboard/Products.tsx` (and the API route `src/app/api/products/route.ts`): add a required "Product Line" select field to the create/edit product form, populated from the new `ProductLine` table. Add a Product Line column to the products table view, and a filter dropdown above it.
> 4. `dashboard/Inventory.tsx`, `Analytics.tsx`, `Orders.tsx`: add a Product Line filter to each so a Godgifted operations manager can see tea-only or dal-only numbers, not just company-wide totals.
> 5. `dashboard/Settings.tsx` and the `Settings` Prisma model: update `storeName` default to "Godgifted" and add a settings section for managing the `ProductLine` list itself (add/edit/deactivate lines) so future product categories (spices, grains, ghee) don't require a code change — just a new admin-created row.

---

### PROMPT 15 — Global find-and-replace pass (do this LAST, carefully)

> Search the codebase case-insensitively for `himmat` and `Himmat Tea` and classify every hit into one of two buckets before touching anything:
> - **Bucket A — Company-level mention** (site title, copyright, admin panel chrome, legal entity, default email/domain, generic "our brand" copy) → replace with `Godgifted` / `BRAND.companyName`.
> - **Bucket B — Tea-line-specific mention** (brewing guides, tea product descriptions, tea category names, the `/himmat-tea` page itself) → **keep as "Himmat Tea"**, it's correct.
> Do not run a blind global replace — this will silently break Bucket B content. Go file by file using the table in Section 0 of this document as your checklist, and mark each file done once reviewed.

---

### PROMPT 16 — Assets, domain, and social checklist (non-code)

> Outside the codebase, before launch:
> - [ ] New logo: primary "Godgifted" wordmark/lockup, plus a secondary lockup showing "Himmat Tea, a Godgifted brand" for use on tea-specific pages/packaging.
> - [ ] Register/point domain `godgifted.com`; decide whether `himmattea.com` becomes a 301 redirect or stays as a standalone domain pointing at `/himmat-tea`.
> - [ ] Update social handles/bios (Instagram, Facebook, YouTube — already linked in `Footer.tsx`) to Godgifted, or create line-specific social accounts if you want Himmat Tea to keep its own following.
> - [ ] Update GST/business registration references in `Settings.gstNumber` and any invoice/PDF export templates (`ExportUtils.tsx`, `jspdf` usage) to the Godgifted legal entity.
> - [ ] New OG/social preview images sized for the company homepage vs. each product line page.

---

## 4. QA Checklist Before Launch

- [ ] No page anywhere shows "TeaHaven" (leftover bug, independent of this rebrand).
- [ ] Homepage (`/`) reads as a company page, not a tea page — first-time visitor should immediately understand there's more than tea.
- [ ] `/himmat-tea` and `/godgifted-dal` both function as complete, self-contained storefronts with working filters, PDP, and cart-add.
- [ ] Cart, checkout, and order confirmation all display the product line per line-item (a mixed tea+dal cart should look intentional, not buggy).
- [ ] Admin dashboard can filter every report (orders, inventory, analytics) by product line.
- [ ] Every legal document (Terms, Privacy) references the correct legal entity name — have this reviewed by counsel, not just find-replaced.
- [ ] All 5 locale files are complete and translated (not machine-translated placeholders) for both product lines.
- [ ] Old admin route (`/himmat_admin_8526`) returns a 404, not a redirect that leaks the new slug.
- [ ] SEO: sitemap.xml / robots.txt (if present) updated with new domain and new routes.

---

*This document is meant to be executed top-to-bottom. Prompts 1–4 (brand config + data model) are blocking dependencies for everything after them — do not skip ahead to navigation or homepage work until the `ProductLine` model exists and is seeded.*
