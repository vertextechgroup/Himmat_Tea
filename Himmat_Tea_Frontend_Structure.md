# Himmat Tea — Client-Side Frontend Structure
### Analysis, Audit & Recommended Page Architecture

> **Prepared for:** Himmat Tea Development Team
> **Scope:** Client-facing pages only (excludes `/dashboard` admin panel)
> **Stack observed:** React + React Router + Tailwind CSS + i18n (EN / NE / HI / ZH / JA)
> **Brand identity:** Deep forest green `#2d5a3d`, warm gold `#c8a96e`, off-white `#f9f7f4`, Playfair Display (headings) + DM Sans (body)

---

## Table of Contents

1. [Current State Audit](#1-current-state-audit)
2. [What Should Stay](#2-what-should-stay)
3. [What Should Be Removed or Changed](#3-what-should-be-removed-or-changed)
4. [What Is Missing and Must Be Added](#4-what-is-missing-and-must-be-added)
5. [Recommended Page Architecture](#5-recommended-page-architecture)
6. [Page-by-Page Content Specifications](#6-page-by-page-content-specifications)
7. [Global Components (Header & Footer)](#7-global-components-header--footer)
8. [Priority Build Order](#8-priority-build-order)

---

## 1. Current State Audit

### Pages that exist in the codebase

| Route | Component | Status |
|---|---|---|
| `/` | `LandingPage` | ✅ Exists — needs content fixes |
| `/products` | `ProductsCatalog` | ✅ Exists — placeholder data only |
| `/products/:id` | `ProductDetail` | ✅ Exists — single hardcoded product |
| `/about` | `About` | ✅ Exists — skeleton only |
| `/contact` | `Contact` | ✅ Exists — functional form |
| `/wholesale` | `Wholesale` | ✅ Exists — functional form |
| `/blog` | `Blog` | ✅ Exists — 3 placeholder posts |
| `/blog/:slug` | `BlogPost` | ✅ Exists — not reviewed (stub) |
| `/cart` | `Cart` | ✅ Exists — fully functional |
| `/checkout` | `Checkout` | ✅ Exists — 2-step flow |
| `/dashboard/*` | Admin Panel | ⛔ NOT client-facing — separate system |
| `*` | `NotFound` | ✅ Exists |

### Key findings from code review

**Brand inconsistency:** The footer hardcodes "TeaHaven" as the brand name in the JSX while the navigation correctly shows "Himmat Tea". This is a critical bug — the footer logo and tagline reference a different product entirely.

**Placeholder content everywhere:** Product images, blog images, About page hero image, and product details are all placeholder strings (`"Tea Garden Image"`, `"Product Image"`, `"Blog image"`). No real content exists.

**Nepal-local context is underused:** The codebase sets Nepali language (`ne`), Nepali Rupee pricing (`Rs.`), a Kathmandu address, and Nepali payment options (eSewa/Khalti) — but the marketing copy still reads as a generic Western tea brand ("Portland, OR 97201", "USDA organic certification", "Portland, OR"). These need to be localized.

**Dashboard is exposed to customers:** The `nav.dashboard` link appears in the primary navigation and is accessible without any authentication. Customers should not see or reach the admin dashboard.

**Missing pages for a tea e-commerce brand:** No FAQ, no brewing guides, no tea subscription, no order tracking, no user account pages.

---

## 2. What Should Stay

These pages and sections are well-structured and should be kept with content improvements.

### ✅ Keep: Landing Page (`/`)
Well-composed section flow. Keep all six sections but replace all placeholder content.

### ✅ Keep: Products Catalog (`/products`)
Filter + sort pattern is correct. Keep the layout, replace with real product data.

### ✅ Keep: Product Detail (`/products/:id`)
Good UX: image gallery, weight selector, quantity selector, add-to-cart, brew guide. Keep structure.

### ✅ Keep: Cart (`/cart`)
Fully functional with context. Keep as-is.

### ✅ Keep: Checkout (`/checkout`)
2-step flow (Shipping → Payment) with eSewa/Khalti is correct for the Nepal market. Keep flow, add validation.

### ✅ Keep: Contact (`/contact`)
Clean form with contact details. Keep.

### ✅ Keep: Wholesale (`/wholesale`)
Good B2B inquiry form. Keep.

### ✅ Keep: Blog (`/blog`)
Content marketing is valuable. Keep, expand categories and real posts.

### ✅ Keep: Multi-language support (EN / NE / HI / ZH / JA)
Excellent for Nepal's market with Indian Hindi speakers, Chinese tourists, and diaspora in Japan. Keep all five languages and complete the `ne.json` and `hi.json` translation files.

---

## 3. What Should Be Removed or Changed

### ❌ Remove: Dashboard link from main navigation
The `nav.dashboard` button is visible to all customers in the top-right of the navigation. This exposes the admin panel. Remove the dashboard link from the public navigation entirely. The admin dashboard should be accessible only via a separate, protected URL (e.g., `/admin`) with login.

### ❌ Remove: "TeaHaven" branding in Footer
The footer component references "TeaHaven" (competitor/template brand) in the logo text and tagline copy. Replace all "TeaHaven" references with "Himmat Tea" throughout.

### ❌ Remove: "Portland, OR 97201" address
The footer hardcodes a Portland, Oregon address. Replace with the correct Kathmandu, Nepal address.

### ❌ Remove: "USDA organic certification" claim in Features section
Himmat Tea is a Nepal-origin brand. USDA certification is an American standard. Replace with Nepal-relevant certifications or remove the specific claim if the certification is not held.

### ❌ Remove: "30+ Countries Sourced" stat in Hero
This positions Himmat Tea as a global aggregator (like a Western blender). Himmat Tea's differentiation is Nepali origin. Replace this stat with something Nepal-specific (e.g., "3 Growing Regions", "Single-Origin", "100% Nepal Grown").

### ❌ Remove: "Careers" footer link (unless actively hiring)
A dead careers link damages credibility. Either build a real careers page or remove the link.

### ⚠️ Change: Announcement bar copy
`"Free shipping on orders over Rs.60"` — Rs. 60 is a trivially low amount (less than $0.50 USD). This is likely a template placeholder. Update to a realistic threshold, e.g., `"Free shipping on orders over Rs. 1,500"`.

### ⚠️ Change: Hero stats
Current stats (`50+ Premium Blends`, `100% Certified Organic`, `30+ Countries Sourced`) need to be replaced with real, verifiable numbers specific to Himmat Tea's actual business.

### ⚠️ Change: Testimonials section
The current testimonials are likely seeded placeholder data. Replace with real customer reviews or integrate with an actual review system.

---

## 4. What Is Missing and Must Be Added

These are gaps identified by comparing the existing structure to what a functional tea e-commerce brand needs.

### 🆕 Must Add: FAQ Page (`/faq`)
Referenced in Contact page and Footer but the route does not exist. High customer service deflection value. Cover shipping, returns, brewing, subscriptions, bulk orders.

### 🆕 Must Add: Brewing Guides (`/brewing-guides`)
Referenced in footer. Tea brewing education is a major content differentiator for premium tea brands. Creates SEO value, reduces returns (from improper brewing), and increases perceived quality.

### 🆕 Must Add: Shipping & Returns Policy (`/shipping-returns`)
Referenced in footer. Required for e-commerce trust and legal compliance. Must cover Nepal domestic delivery, international shipping, return policy, and payment refund process.

### 🆕 Must Add: Privacy Policy (`/privacy-policy`) and Terms of Service (`/terms`)
Referenced in footer but routes don't exist. Required for any e-commerce site. Especially important if collecting customer data and processing payments.

### 🆕 Must Add: Order Confirmation Page (`/order-confirmed`)
After a customer completes checkout, there is no success/confirmation page. The checkout currently has no post-order state at all.

### 🆕 Must Add: User Account System (`/account`)
For returning customers to track orders, manage addresses, and view order history. Without this, customers have no way to check on their order after purchase.

### 🆕 Must Add: Tea Subscription Page (`/subscribe`)
Referenced in the footer as "Subscriptions" but no page or route exists. Subscriptions are high-LTV (lifetime value) for tea brands and create predictable revenue. Even a waitlist page is better than a dead link.

### 🆕 Should Add: About / Sourcing sub-sections
The About page mentions "Direct Trade" and "Organic & Sustainable" but has no sourcing detail. A Sourcing page or dedicated About sub-section with farm stories, region profiles (Ilam, Dhankuta, Nuwakot), and farmer partnerships would strongly differentiate Himmat Tea.

### 🆕 Should Add: Wishlist / Save for Later
Common e-commerce feature for tea brands where customers research before buying.

---

## 5. Recommended Page Architecture

```
CLIENT-SIDE ROUTES
│
├── / ................................ Landing Page
├── /products ........................ Products Catalog
│   └── /products/:id ............... Product Detail
├── /collections ..................... Collections Hub (seasonal, wellness, gifts)
│   └── /collections/:slug .......... Collection Detail
├── /about ........................... Our Story
│   └── /about/sourcing .............. Sourcing & Farms
├── /wholesale ....................... Wholesale / B2B
├── /blog ............................ Blog Index
│   └── /blog/:slug .................. Blog Post
├── /contact ......................... Contact
├── /faq ............................. FAQ
├── /brewing-guides .................. Brewing Guides Hub
│   └── /brewing-guides/:slug ........ Individual Guide
├── /subscribe ....................... Tea Subscription
├── /shipping-returns ................ Shipping & Returns Policy
├── /privacy-policy .................. Privacy Policy
├── /terms ........................... Terms of Service
│
├── /cart ............................ Shopping Cart
├── /checkout ........................ Checkout (multi-step)
└── /order-confirmed ................. Order Confirmation
│
├── /account ......................... Customer Account (future)
│   ├── /account/orders .............. Order History
│   ├── /account/addresses ........... Saved Addresses
│   └── /account/profile ............. Profile Settings
│
└── * ................................ 404 Not Found
```

> **Note:** `/dashboard` and all `/dashboard/*` routes remain but should be protected behind authentication and removed from the public navigation.

---

## 6. Page-by-Page Content Specifications

---

### 6.1 Landing Page (`/`)

The homepage is the brand's first impression. All six sections should remain.

#### Section 1 — Announcement Bar (Global, part of Navigation)
- **Content:** Promotional offer, shipping threshold, or seasonal message
- **Example:** `"Free shipping on orders over Rs. 1,500 across Nepal"`
- **Remove:** Promo code "TEAHAVEN" — replace with "HIMMATTEA" if a code is offered
- **CTA:** Optional link to `/products`

#### Section 2 — Hero
- **Badge/trust signal:** `"Loved by 10,000+ tea drinkers across Nepal"` (or real number)
- **Headline:** `"Discover the Teas of the Himalayas"` (Nepal-specific)
- **Sub-headline:** Story-driven copy about Nepal's tea gardens, Ilam region, direct trade
- **Primary CTA:** `"Shop Our Teas"` → `/products`
- **Secondary CTA:** `"Our Story"` → `/about`
- **Stats (replace with real data):**
  - `X+` Tea Varieties (actual SKU count)
  - `100%` Nepal Origin (or "Himalayan Grown")
  - `3` Growing Regions (Ilam, Dhankuta, Nuwakot — or actual regions)
- **Visual:** High-quality hero image of Himalayan tea gardens or tea being poured
- **Remove:** Stars/rating badge unless pulled from a real review system

#### Section 3 — Why Himmat Tea (Features/USPs)
Keep 6 feature cards. Replace generic copy with Nepal-specific truths:

| # | Title | Correct Copy Direction |
|---|---|---|
| 1 | 100% Nepal Origin | All teas sourced from Nepali growing regions — no blending with imported leaves |
| 2 | Direct from Farms | Partnership directly with smallholder farmers in Ilam and Dhankuta |
| 3 | Expert Selection | Curated by tea specialists, only teas that meet Himmat standards |
| 4 | Freshness Guaranteed | Packed within days of harvest in nitrogen-sealed pouches |
| 5 | Nepal-Fast Delivery | Nationwide delivery across Nepal, same-week in Kathmandu valley |
| 6 | Sustainability | Fair wages, organic practices, and no synthetic chemicals |

- **CTA Strip at bottom:** `"Find Your Perfect Tea"` → `/products` or a tea quiz

#### Section 4 — Featured Products
- **Section label:** `"Our Collection"` or `"Best Sellers"`
- **Display:** 4–6 real products with real images, names, prices, and ratings
- **Filter tabs:** All / Green / Black / Herbal / Oolong
- **Each card:** Product image, origin label, name, price (Rs.), star rating, "Add to Cart" button
- **CTA:** `"View All Teas"` → `/products`
- **Remove:** White tea category (only if not in inventory)

#### Section 5 — Testimonials / Social Proof
- **Header:** `"What Our Customers Say"`
- **Stats:** Real review count and average rating (source from actual reviews)
- **Content:** 3–6 real customer testimonials with name, location (city in Nepal), and verified purchase badge
- **Optional:** Star rating breakdown, "Read all reviews" link

#### Section 6 — Newsletter (in Footer, visible on homepage)
- **Headline:** `"The Himmat Tea Newsletter"`
- **Sub-copy:** `"New arrivals, seasonal picks, brewing tips, and exclusive offers — delivered to your inbox."`
- **Input:** Email field
- **CTA Button:** `"Subscribe"`

---

### 6.2 Products Catalog (`/products`)

#### Page Header
- **Eyebrow:** `"Our Teas"`
- **Headline:** `"Explore Our Full Collection"`
- **Sub-copy:** Short description of the range, e.g., "From Ilam first-flush green teas to bold Dhankuta blacks — all grown in Nepal."

#### Filter & Sort Controls
- **Filters (category tabs):** All / Green Tea / Black Tea / Herbal / Oolong / White Tea / Gift Sets
- **Sort options:** Featured / Newest / Price: Low to High / Price: High to Low / Highest Rated
- **Result count:** `"Showing 12 of 24 teas"`

#### Product Grid
Each card must include:
- Real product image (square aspect ratio)
- Origin label (e.g., "Ilam, Nepal")
- Product name
- Short descriptor (e.g., "Light & grassy — perfect for mornings")
- Price in Rs.
- Star rating + review count
- "Add to Cart" button
- Wishlist/Save icon (future)
- "Organic" / "Bestseller" / "New" badge where applicable

#### Sidebar (optional enhancement)
- Filter by origin (Ilam / Dhankuta / Nuwakot)
- Filter by caffeine level (High / Medium / Low / None)
- Filter by brew style (Hot / Cold Brew / Both)
- Price range slider

---

### 6.3 Product Detail (`/products/:id`)

#### Left Column — Media
- Main product image (high resolution, square)
- Thumbnail gallery (3–5 images: tea leaves, dry, brewed, packaging, lifestyle)

#### Right Column — Purchase Panel
- Origin label (e.g., `"Ilam, Nepal"`)
- Product name (Playfair Display heading)
- Star rating + review count (links to review section below)
- Price in Rs. (bold, green `#2d5a3d`)
- Weight selector: 25g / 50g / 100g (with per-gram price hint)
- Quantity selector
- "Add to Cart" (primary) + "Save to Wishlist" (secondary)
- Trust signals: 🔒 Secure checkout · 🚚 Free delivery over Rs. 1,500 · ↩️ 7-day returns

#### Product Information Tabs
The product detail page needs information organized in tabs:

**Tab 1: Description**
- Story of this tea (origin, estate/farm name, harvest season, altitude)
- Tasting notes (flavor profile)
- Health benefits

**Tab 2: Brew Guide**
- Water temperature
- Steep time
- Tea-to-water ratio
- Number of infusions possible
- Hot vs cold brew instructions

**Tab 3: Origin**
- Growing region map or description
- Farm/estate story
- Altitude and climate
- Harvest season

**Tab 4: Reviews**
- Customer reviews with verified purchase badges
- Star breakdown
- "Write a Review" button

---

### 6.4 About / Our Story (`/about`)

#### Hero Section
- **Large image:** Himmat Tea founder(s) or tea garden in Nepal
- **Headline:** `"From the Hills of Nepal to Your Cup"`
- **Sub-copy:** 2–3 sentences on the founding mission

#### Our Story (narrative)
- Founding story: who started Himmat Tea, when, and why
- The problem: how Nepali tea quality was underrepresented globally
- The mission: direct trade, fair wages, authentic Himalayan tea
- 2–3 paragraphs with a supporting image

#### Our Values (3-column cards)
- **Direct Trade** — Working directly with smallholder farmers
- **Organic Practices** — No synthetic pesticides or fertilizers
- **Freshness First** — Packed within days of harvest

#### The Team (optional)
- Founder photo + short bio
- Head Tea Specialist / Sourcing Manager

#### By the Numbers
- Year founded
- Number of farm partners
- Growing regions
- Countries delivered to

#### Link to Sourcing Page
- `"See How We Source Our Teas"` → `/about/sourcing`

---

### 6.5 Sourcing Page (`/about/sourcing`)

#### Hero
- Headline: `"From Garden to Cup — How We Source"`
- Map or illustration of Nepal showing Ilam, Dhankuta, Nuwakot regions

#### Region Profiles (one card per region)
For each growing region:
- Region name and location
- Altitude and climate description
- Tea types grown there
- Farmer partnership story
- Photo of the garden or farmer

#### Our Process
- Step-by-step visual: Farm → Harvest → Selection → Packing → Delivery
- Emphasis on no middlemen, direct payment to farmers

---

### 6.6 Wholesale (`/wholesale`)

#### Hero
- **Headline:** `"Partner With Himmat Tea"`
- **Sub-copy:** `"Cafés, restaurants, hotels, and retailers — let's work together to bring authentic Himalayan tea to your customers."`

#### Why Partner (3 benefit cards)
- Competitive wholesale pricing with tiered discounts
- Custom packaging and private label options
- Dedicated account manager and consistent supply

#### Who We Work With (icons/logos section)
- Cafés & Coffee Shops
- Hotels & Resorts
- Restaurants
- Specialty Retailers
- Corporate Gifting

#### Minimum Order Information
- MOQ (minimum order quantity)
- Lead time
- Sample policy

#### Inquiry Form
Fields:
- Business Name (required)
- Contact Name (required)
- Business Type (dropdown: Café / Restaurant / Hotel / Retailer / Corporate / Other)
- Email (required)
- Phone (required)
- Monthly volume estimate
- Message / Tell us about your business
- Submit button: `"Send Inquiry"`

---

### 6.7 Blog (`/blog`)

#### Page Header
- `"The Himmat Tea Blog"` or `"Tea Stories & Guides"`
- Sub-copy: `"Brewing guides, origin stories, health insights, and news from Nepal's tea gardens"`

#### Featured Post (top, full width)
- Large hero image
- Category, date
- Title
- 2-sentence excerpt
- "Read More" CTA

#### Post Grid (3 columns)
Each card:
- Thumbnail image
- Category badge (Brewing Guides / Origins / Health / News / Recipes)
- Title
- Date + read time
- "Read More" link

#### Category Filter
Tabs: All / Brewing Guides / Origins / Health & Wellness / News / Recipes

#### Sidebar (optional)
- Popular posts
- Newsletter signup

---

### 6.8 Blog Post (`/blog/:slug`)

#### Content Structure
- Category + date + read time
- Title (large, Playfair Display)
- Author name and avatar
- Feature image (full width)
- Article body (rich text, with subheadings, images, pull quotes)
- Tags at bottom
- Author bio block

#### End of Article
- "Related Posts" section (3 post cards)
- Newsletter signup strip
- Social share buttons (Facebook, Instagram, WhatsApp — relevant for Nepal)

---

### 6.9 Contact (`/contact`)

The existing page is well-structured. Confirm or update:

#### Left Column
- Section label: `"Get in Touch"`
- Headline: `"We'd Love to Hear From You"`
- Email: `hello@himmattea.com`
- Phone: `+977-XX-XXXXXXX` (real number)
- Address: (real Kathmandu address)
- Business hours: Monday–Saturday, 9:00 AM – 6:00 PM NPT

#### Right Column (Contact Form)
- Name
- Email
- Subject dropdown: General / Order Support / Wholesale / Brewing Questions / Press / Other
- Message
- Submit button

#### Below the Form (add)
- FAQ teaser: `"Have a common question? Check our FAQ first."` → `/faq`
- Response time promise: `"We respond within 1 business day"`

---

### 6.10 FAQ Page (`/faq`) — NEW

#### Page Header
- Headline: `"Frequently Asked Questions"`

#### Sections with Accordions

**Ordering & Payment**
- How do I place an order?
- What payment methods do you accept? (eSewa, Khalti, card, cash on delivery?)
- Can I change or cancel my order after placing it?
- Do you offer cash on delivery?

**Shipping & Delivery**
- How long does delivery take within Nepal?
- Do you ship internationally?
- How do I track my order?
- What happens if my order is damaged in transit?

**Products & Quality**
- Where do your teas come from?
- Are your teas organic?
- How should I store my tea?
- What is the shelf life of your teas?

**Brewing**
- How do I brew [tea type] properly?
- What water temperature should I use?
- Can I reuse tea leaves?
- Link to `/brewing-guides` for detailed guides

**Returns & Refunds**
- What is your return policy?
- What if I received the wrong product?
- How do I request a refund?

**Wholesale**
- Do you offer wholesale pricing?
- What is the minimum order for wholesale?
- Link to `/wholesale`

---

### 6.11 Brewing Guides (`/brewing-guides`) — NEW

#### Hub Page (`/brewing-guides`)
- Headline: `"The Art of Brewing Himalayan Tea"`
- Sub-copy: brief intro to the importance of proper brewing
- Grid of guide cards, one per tea type or technique

#### Individual Guides (`/brewing-guides/:slug`)
Example guides to create:
- How to Brew Himalayan Green Tea
- How to Brew Black Tea (Nepali Style)
- Herbal Tea: A Complete Brewing Guide
- Cold Brew Tea at Home
- Tea-to-Water Ratio Guide

Each guide includes:
- Tea type overview
- Equipment needed
- Step-by-step instructions with visuals
- Temperature chart
- Common mistakes to avoid
- Product recommendation (link to related `/products/:id`)

---

### 6.12 Shipping & Returns (`/shipping-returns`) — NEW

#### Sections
- **Nepal Domestic Shipping:** delivery time by zone (Kathmandu valley vs. other provinces)
- **International Shipping:** countries supported, estimated delivery time, rates
- **Order Processing:** processing time before dispatch
- **Tracking:** how to track an order
- **Return Policy:** conditions for returns (unused, original packaging, X days from delivery)
- **Damaged / Wrong Items:** process for claims with photos
- **Refund Process:** timeline and method (reverse to eSewa/Khalti/card)

---

### 6.13 Cart (`/cart`)

The existing cart is functional. Minor improvements:

#### Add to existing structure:
- Coupon/promo code input field
- Estimated delivery date preview
- "You might also like" product suggestions (3 related products)
- Trust signals near checkout button: `"Secure checkout · Free returns · Nepal-fast delivery"`

---

### 6.14 Checkout (`/checkout`)

The existing 2-step checkout (Shipping → Payment) is appropriate. Improvements:

#### Step 1 — Shipping Information
- Full Name
- Email
- Phone (Nepal format, required for delivery coordination)
- Province (dropdown: Bagmati / Gandaki / Lumbini / etc.)
- City / District
- Street Address
- Delivery instructions (optional)

#### Step 2 — Payment
- eSewa (primary — most common in Nepal)
- Khalti (secondary)
- Credit / Debit Card
- Cash on Delivery (important for trust in Nepal market)

#### Step 3 (add) — Review & Confirm
- Summary of items, shipping address, payment method
- "Place Order" button

---

### 6.15 Order Confirmation (`/order-confirmed`) — NEW

#### Content
- Large success checkmark
- Headline: `"Order Placed! Thank You."`
- Order number
- Estimated delivery date
- Summary of items ordered
- Delivery address
- CTA: `"Continue Shopping"` → `/products`
- Secondary CTA: `"Track Your Order"` → (email link or account page)
- Newsletter signup prompt

---

### 6.16 Legal Pages — NEW

#### Privacy Policy (`/privacy-policy`)
- Data collected (name, email, address, payment method)
- How data is used
- Third-party services (eSewa, Khalti, analytics)
- Customer rights
- Contact for privacy questions

#### Terms of Service (`/terms`)
- Purchase terms
- Cancellation and refund policy
- Intellectual property
- Governing law (Nepal)

---

## 7. Global Components (Header & Footer)

### 7.1 Navigation (Header)

#### Top Announcement Bar
- Background: `#2d5a3d` (dark green)
- Text: Promotional message with real threshold
- **Remove:** Promo code "TEAHAVEN"

#### Main Navigation Bar
**Logo:** Himmat Tea SVG mark + "Himmat Tea" wordmark (Playfair Display)

**Navigation Links:**
- Products (dropdown: Green Tea, Black Tea, Herbal Blends, Oolong Tea, White Tea, Tea Sets)
- Collections (dropdown: Seasonal Picks, Wellness Range, Gift Sets)
- Wholesale
- Our Story

**Right-side actions:**
- Language selector (EN / NE / HI / ZH / JA) — keep
- Cart icon with item count — keep
- **Remove:** Dashboard button (admin panel must not be in customer nav)
- **Add:** Account icon / Login link (once user accounts are built)

---

### 7.2 Footer

#### Fix immediately:
- Replace "TeaHaven" with "Himmat Tea" everywhere in footer
- Replace "Portland, OR 97201" with real Nepal address
- Replace "hello@teahaven.com" with correct `hello@himmattea.com`

#### Newsletter Section
- Keep newsletter signup — it has real business value

#### Footer Link Columns

**Shop**
- Green Tea → `/products?category=green`
- Black Tea → `/products?category=black`
- Herbal Blends → `/products?category=herbal`
- Oolong Tea → `/products?category=oolong`
- Tea Sets → `/products?category=sets`
- Subscriptions → `/subscribe`

**Company**
- Our Story → `/about`
- Sourcing → `/about/sourcing`
- Sustainability → `/about#sustainability`
- Wholesale → `/wholesale`
- Blog → `/blog`
- ~~Careers~~ (remove if no hiring page)

**Support**
- FAQ → `/faq`
- Shipping & Returns → `/shipping-returns`
- Brewing Guides → `/brewing-guides`
- Contact Us → `/contact`
- Privacy Policy → `/privacy-policy`
- Terms of Service → `/terms`

#### Social Media Links
- Instagram (primary — highly visual for tea brand)
- Facebook (important for Nepal market)
- YouTube (brewing guides, farm videos)
- WhatsApp Business (very common in Nepal for customer service)
- **Remove or de-emphasize:** platforms not actively used

#### Bottom Bar
- Copyright: `"© 2026 Himmat Tea. All rights reserved."`
- Links: Privacy · Terms · Cookies

---

## 8. Priority Build Order

Build in this order to get a functional, trustworthy storefront as quickly as possible.

### Phase 1 — Critical Fixes (Week 1)
These are bugs or trust-breakers that must be fixed before any marketing or launch.

1. Fix footer brand name: "TeaHaven" → "Himmat Tea"
2. Fix footer address: Portland, OR → real Nepal address
3. Remove Dashboard link from customer navigation
4. Fix announcement bar promo code: "TEAHAVEN" → real or remove
5. Fix hero stats: replace placeholder numbers with real Himmat Tea data
6. Fix free shipping threshold: Rs. 60 → realistic amount

### Phase 2 — Real Content (Week 2–3)
Replace all placeholder content with real assets.

1. Real product photos and product data for all SKUs
2. Real About page copy and images (founder photo, tea gardens)
3. Real testimonials (import from existing reviews)
4. Real blog posts (minimum 3 published on launch)
5. Real contact details (phone, email, address)

### Phase 3 — Missing Pages (Week 3–4)
Add missing pages to complete the customer journey.

1. Order Confirmation page (`/order-confirmed`)
2. FAQ page (`/faq`)
3. Shipping & Returns page (`/shipping-returns`)
4. Privacy Policy (`/privacy-policy`)
5. Terms of Service (`/terms`)

### Phase 4 — Content Marketing (Month 2)
Build content that drives organic traffic and repeat visits.

1. Brewing Guides hub (`/brewing-guides`)
2. Sourcing page (`/about/sourcing`)
3. 10+ blog posts across categories (Brewing, Origins, Health, Recipes)

### Phase 5 — Growth Features (Month 3+)
Features that increase revenue and retention.

1. Tea Subscription page (`/subscribe`)
2. Customer account system (`/account`, `/account/orders`)
3. Wishlist / Save for Later
4. Product reviews and ratings (real, integrated)
5. WhatsApp Business integration for customer support
6. "Recently Viewed" and "You Might Also Like" sections

---

*Document produced based on full source code review of the Himmat Tea React/TypeScript codebase including all page components, translation files, routing configuration, cart context, and footer/navigation components.*
