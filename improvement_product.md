# improvement_product.md
### Product & Content Flow Architecture — Findings + Execution Brief
**Project analyzed:** Himmat Tea / Godgifted (Next.js 14 App Router + Prisma/SQLite)
**Prepared as:** Business review + UX audit + Senior full-stack engineering brief
**How to use this file:** It is written so you can hand it directly to a developer or an AI coding agent (Claude Code, Cursor, etc.) as a task prompt. Each fix in Section 4 is phrased as an instruction you can paste in as-is.

---

## 0. Role framing

> You are acting as three people at once: **(1)** a business owner who needs the tea/dal store to actually make money reliably, **(2)** a UI/UX designer who needs the shopping journey to feel trustworthy and fast, and **(3)** a senior full-stack developer who has to keep this system correct under real traffic. Read the findings below, then execute the roadmap in Section 5 in order — do not skip Phase 0.

---

## 1. Executive Summary

The codebase looks feature-complete: there's a Prisma schema with 20+ models, a full REST API under `src/app/api`, an admin dashboard, and a polished storefront. **But the product catalog — the single most important content flow in an e-commerce site — is not actually wired to the database.** The storefront and the admin "Products" screen both read and write a client-side `StoreContext` that persists to **`localStorage` in the visitor's own browser**, while a fully-built Prisma/SQLite backend and REST API for products sit almost unused.

In plain business terms: **when the store owner adds a new tea, changes a price, or marks something out of stock in the admin dashboard, that change is saved only to their own laptop's browser storage.** No customer, on any other device, will ever see it. Meanwhile, checkout *does* call the real backend (`/api/orders`), which means orders can reference product IDs that don't exist in the real database, or silently get miscoded to product #1 in a checkout-side conversion bug (Finding 4.2). This is not a polish issue — it's a foundational data-integrity issue that will produce wrong orders, phantom inventory, and an admin panel that lies to the owner.

The rest of this document explains the specific problems (with file/line evidence), the business impact of each, and a phased plan to fix them.

---

## 2. Current State Architecture (as built)

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│  STOREFRONT (customer)      │        │  ADMIN DASHBOARD (owner)      │
│  ProductsCatalog.tsx        │        │  dashboard/Products.tsx       │
│  ProductDetail.tsx          │        │  dashboard/ProductLines.tsx   │
│  Cart / Wishlist            │        │  dashboard/Inventory.tsx      │
└──────────────┬───────────────┘        └───────────────┬────────────┘
               │            both call useStore()          │
               └───────────────────┬───────────────────────┘
                                    ▼
                     ┌───────────────────────────┐
                     │   StoreContext.tsx         │   ← 1,832 lines, 20+ entities,
                     │   (React state, in-memory) │      one giant provider
                     └──────────────┬──────────────┘
                                    ▼
                     ┌───────────────────────────┐
                     │  window.localStorage        │  ← lives ONLY in the
                     │  "godgifted_products", etc. │     current browser
                     └───────────────────────────┘

                                          (meanwhile, unused for products)
                     ┌───────────────────────────┐
                     │  Prisma + SQLite            │
                     │  /api/products, /api/orders │  ← real DB, real schema,
                     │  /api/collections, etc.     │     wired only for
                     │                              │     auth/customers/orders
                     └───────────────────────────┘
```

Two data systems exist side-by-side and disagree with each other. Checkout is the seam where they collide.

---

## 3. Critical Findings (evidence-based)

### 3.1 — Product catalog is not connected to the database
- `src/app/pages/ProductsCatalog.tsx:10,75` and `src/app/pages/dashboard/Products.tsx:38,62` both import `useStore` from `context/StoreContext.tsx` — **not** `useApi`/`api-client`.
- `StoreContext.tsx:719-720,738-761` seeds `products` from a hardcoded `sampleProducts` array, then overwrites it from `localStorage.getItem("godgifted_products")` if present, and **every mutation (`addProduct`, `updateProduct`, `deleteProduct`) writes back only to `localStorage`** (line ~905-909) — never to `/api/products`.
- Meanwhile a complete, working REST layer already exists: `src/app/api/products/route.ts` and `[id]/route.ts` do real Prisma `findMany`/`create`/`update`/`delete` with proper `include` relations.
- **Business impact:** The admin can spend an afternoon curating the catalog and see it "work" — because they're only ever testing in their own browser. Open the site in an incognito window or on a phone and the catalog reverts to seed data. This is a silent, invisible failure mode — nothing errors, it just doesn't sync.

### 3.2 — Checkout can silently attribute orders to the wrong product (or product #1)
- `CartContext.tsx:5` defines `CartItem.id: string`.
- `Checkout.tsx:344`: `productId: parseInt(item.id) || 1`.
- If `item.id` is a composite/non-numeric string (which happens for any product added with a variant, since variant SKUs/keys are commonly non-numeric), `parseInt` returns `NaN`, `NaN || 1` evaluates to `1`, and **the order silently records product ID 1** instead of failing loudly.
- **Business impact:** Financial and inventory records become wrong without any error being thrown. Analytics on bestsellers, reorder points, and revenue-by-product become untrustworthy. This is the kind of bug that surfaces months later as "why does product #1 show 400 sales it never had."

### 3.3 — Product images: schema supports one image, UI was designed for a gallery
- `prisma/schema.prisma:33` — `Product.imageUrl String` (singular, one field).
- `ProductDetail.tsx:316` — `const images = [product.imageUrl];` then `src={images[activeImage]}` with an `activeImage` state and (implied) thumbnail selector.
- **Business impact:** Tea and dal are products people buy partly on visual trust (leaf color, packaging, texture). A single hero photo per product is a conversion-rate problem for a food/beverage brand, and the UI was clearly designed expecting more — it's half-implemented.

### 3.4 — Variants and stock can desynchronize
- `Product.stock` (top-level Int) and `ProductVariant.stock` (per-variant Int) both exist independently in `schema.prisma:30,56` with no constraint tying them together.
- `variantOptions` and `ProductVariant.variants` are stored as raw JSON strings (`schema.prisma:37,54`) and manually `JSON.parse`/`JSON.stringify`'d in every API route (`api/products/route.ts:22-26,42`). This means variant data can never be filtered, indexed, or validated at the database level (e.g., "show me all products where size = 250g" requires loading every row into app memory).
- **Business impact:** A product can show "In Stock" at the parent level while every one of its variants is at 0, or vice versa — the classic "add to cart, then told it's unavailable at checkout" failure that erodes trust.

### 3.5 — No taxonomy, no slugs, no SEO surface on Product
- `Product.category` is a free-text `String` (`schema.prisma:28`), not a relation — seed data already shows drift risk (`"green"`, `"black"`, `"herbal"`, `"oolong"`, `"white"`, `"toor"`, `"moong"` mixed across two unrelated product lines with no shared enum/table).
- `Product` has no `slug` field — `[slug]` dynamic routes exist for blog posts and collections but products are presumably addressed by numeric ID, which is bad for SEO and unreadable in URLs/marketing.
- **Business impact:** Category filters will break or need constant manual cleanup as the catalog grows; product pages won't rank well in search; typos in category strings silently create "ghost" categories that never show in filters.

### 3.6 — `StoreContext` is a 1,800-line god-object mixing storefront and back-office concerns
- One file/provider (`StoreContext.tsx`) owns products, product lines, orders, customers, notifications, blog, reviews, coupons, collections, brewing guides, FAQs, about-page content, settings, purchase orders, inventory transactions, **and admin authentication (including a hardcoded admin password hash shipped to the client, line ~704)**.
- Every consumer component re-renders on *any* state change anywhere in this object (no context splitting/memoization visible).
- **Business/security impact:** Shipping the admin password hash into client-side JS bundle is a real security exposure — anyone can open devtools and see it. Architecturally, this also means the storefront bundle is carrying admin-dashboard code/data it never needs, hurting load time.

### 3.7 — Product list API has no pagination, filtering, or field selection
- `api/products/route.ts:GET` runs `findMany` with **five nested `include`s and no `where`, `take`, or `skip`** — it always returns every product with every batch, every review, every inventory transaction, every collection membership, on every call.
- **Business impact:** This works fine for a 20-item demo catalog and will visibly slow down (and eventually time out) as SKUs, batches, and reviews accumulate — normal growth for a working tea business.

### 3.8 — Duplicate/parallel "content" pattern beyond products
- The same disconnect pattern (Prisma API exists, but storefront/admin use `StoreContext` + `localStorage` instead) repeats for **Collections, Brewing Guides, FAQs, Blog, Coupons, Product Lines, Reviews, Inventory, and Purchase Orders** — i.e., nearly the entire content system, not just products.
- **Business impact:** This isn't a one-off bug, it's the dominant pattern in the app. Any content the owner edits — a blog post, an FAQ answer, a brewing guide — has the same "works on my browser only" problem.

---

## 4. Target Architecture (what "done" looks like)

```
Storefront & Admin (React Server/Client Components)
        │
        ▼
Scoped data hooks (TanStack Query) — useProducts(), useProduct(slug), useCollections()...
        │
        ▼
/api/* routes (already exist) — add pagination, filtering, caching headers
        │
        ▼
Prisma → SQLite/Postgres  ← SINGLE source of truth for all reads & writes
```

Principles:
1. **One source of truth.** All product/content reads and writes go through the Prisma-backed API. `localStorage` may be used for cart/wishlist/session UI state only — never for canonical product, order, or content data.
2. **Split the god-context.** Replace `StoreContext` with narrow, purpose-built data hooks per domain (products, collections, orders, etc.), each backed by server data + cache, not a single 1,800-line provider.
3. **Server-render the catalog.** Product listing/detail pages should be Server Components fetching directly via Prisma (or a cached API call) for fast first paint and correct SEO — no need to ship an admin-shaped context to anonymous shoppers.
4. **Admin writes go straight to the API**, and the storefront cache (TanStack Query / Next.js revalidation) invalidates on mutation so changes are visible everywhere immediately.

---

## 5. Phased Roadmap (execute in this order)

### Phase 0 — Stop the bleeding (data integrity, do this first)
1. Fix `Checkout.tsx:344`: never fall back to `productId: 1`. If `item.id` can't resolve to a real product/variant ID, block checkout and surface a clear error ("this item is no longer available") instead of silently mis-recording the order.
2. Add a database constraint / API-level validation on `POST /api/orders` that rejects any `productId` not found in `Product` — fail loudly, not silently.
3. Freeze any further admin edits to product/content data until Phase 1 is live, and communicate to the store owner that current catalog edits made via the dashboard are not yet persisted centrally.

### Phase 1 — Reconnect the catalog to the real database
1. Rewrite `ProductsCatalog.tsx`, `ProductDetail.tsx`, and `dashboard/Products.tsx` to fetch/mutate via `/api/products` (using the existing `useApi`/`api-client` pattern already proven in `Checkout.tsx` and `AuthContext.tsx`), removing `useStore()` product state entirely.
2. Repeat the same migration for `ProductLines`, `Collections`, `BrewingGuides`, `FAQs`, `Blog`, `Reviews`, `Coupons` — same disconnect pattern, same fix.
3. Delete the corresponding `localStorage` read/write `useEffect` blocks in `StoreContext.tsx` for every migrated domain.
4. Add TanStack Query (or SWR) as the caching layer so admin mutations invalidate storefront queries and changes show up without a manual refresh cycle.

### Phase 2 — Fix the schema gaps that block good product UX
1. Add `slug` (`@unique`) and basic SEO fields (`metaTitle`, `metaDescription`) to `Product`.
2. Replace `category: String` with a proper `Category` model (id, slug, name) and a relation, seeded from the current distinct category strings.
3. Add a `ProductImage` model (`id, productId, url, altText, sortOrder`) to support real galleries; migrate `imageUrl` into it as the first image for backward compatibility.
4. Normalize `variantOptions`/`ProductVariant.variants` out of JSON strings into real rows (e.g., `VariantOption { productId, name, value }` and a join to `ProductVariant`), so variants can be filtered/queried natively.
5. Decide a single source of truth for stock: either (a) `Product.stock` is derived/summed from active `ProductVariant.stock` when `hasVariants` is true, enforced in the API layer, or (b) remove `Product.stock` for variant products entirely. Document and enforce whichever you choose.

### Phase 3 — API hardening
1. Add pagination (`take`/`skip` or cursor), filtering (`category`, `productLineId`, `priceRange`, `inStock`), and sorting to `GET /api/products`.
2. Add a lightweight list-view response (no nested `batches`/`inventoryTransactions`) vs. a detail-view response — don't ship admin-only inventory data to the public product API.
3. Add `Cache-Control`/ISR revalidation for public product endpoints so the storefront stays fast without re-hitting the DB on every request.

### Phase 4 — Decompose `StoreContext`
1. Split into domain-scoped providers/hooks: `useProducts`, `useCollections`, `useOrdersAdmin`, `useCustomersAdmin`, etc. Storefront pages only import what they render; admin dashboard imports admin-scoped hooks.
2. Remove the admin password hash and any admin-only logic from any context that the public storefront bundle includes. Admin auth should live entirely behind the already-existing `/api/auth` + `AuthContext` pattern, never in client-shipped constants.
3. Confirm (via bundle analysis) that anonymous storefront visitors are no longer downloading admin dashboard state/logic.

### Phase 5 — UX upgrades now unlocked by the above
1. **Product gallery** on PDP using the new `ProductImage` model (thumbnails + zoom), not a 1-image array.
2. **Faceted filtering** on the catalog page (category, product line, price, in-stock) powered by real API query params instead of client-side filtering of a full in-memory array.
3. **Real-time stock badges**: "Only 4 left" / "Out of stock" driven by the resolved variant stock, consistently between catalog, PDP, and cart — eliminate the "added to cart but unavailable at checkout" failure mode.
4. **Related products** via the existing `Collection`/`CollectionItem` models (already well-designed in the schema) instead of ad hoc logic.
5. **Breadcrumbs + canonical slugs** (`/collections/green-tea/himalayan-green-250g`) for SEO and shareability, now that slugs exist.

---

## 6. Acceptance Criteria (Definition of Done)

- [ ] Opening the storefront in two different browsers/devices shows the **same** product catalog, always.
- [ ] Editing a product in the admin dashboard is visible on the public site within seconds, without relying on the editor's own browser storage.
- [ ] No checkout path can create an `Order`/`OrderItem` referencing a non-existent `productId`; invalid cart items block checkout with a clear message instead of defaulting to product #1.
- [ ] Product detail pages render a real multi-image gallery sourced from the database.
- [ ] Category and variant filtering happens via API query params against normalized fields, not client-side filtering of a fully-loaded in-memory array.
- [ ] `GET /api/products` supports pagination and does not return admin-only fields (inventory transactions, batches, cost price) to unauthenticated requests.
- [ ] The public storefront bundle contains no admin credentials, admin-only mutation functions, or backoffice-only data.
- [ ] `StoreContext.tsx` no longer exists as a single file, or exists only as a thin composition of the split domain hooks with no `localStorage` persistence of canonical business data.

---

## 7. Quick-reference: file-level map of what changes

| Area | Current (broken) | Change to |
|---|---|---|
| Storefront catalog | `pages/ProductsCatalog.tsx` → `useStore()` → localStorage | → `useProducts()` (React Query) → `/api/products` |
| Product detail | `pages/ProductDetail.tsx` → `useStore()`, single `imageUrl` | → API-backed detail fetch + `ProductImage[]` gallery |
| Admin products | `pages/dashboard/Products.tsx` → `useStore()` | → `/api/products` CRUD directly |
| Checkout | `pages/Checkout.tsx:344` `parseInt(item.id) \|\| 1` | → explicit numeric productId/variantId carried through cart, hard failure if unresolved |
| Cart items | `context/CartContext.tsx` string `id` only | → carry `productId: number` + optional `variantId: number` explicitly |
| Schema | `Product.category: String`, `Product.imageUrl: String`, JSON-string variants | → `Category` relation, `ProductImage[]`, normalized variant tables, `Product.slug` |
| Global state | `context/StoreContext.tsx` (1 file, everything) | → split per-domain hooks; kill localStorage persistence for business data |
| Product list API | `api/products/route.ts` — no pagination/filter | → add `take/skip`, `where`, list vs. detail projections |

---

*End of brief. Start at Phase 0 — the checkout fallback bug (3.2) is the single highest-risk item because it corrupts financial/order data silently.*
