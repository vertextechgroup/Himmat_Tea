# Himmat Tea — Dashboard Improvement Blueprint
**Prepared by:** Technical Business Analysis  
**Date:** June 2026  
**Scope:** Full-stack admin dashboard audit covering UX, business logic, data integrity, performance, and revenue operations
**Last Updated:** June 2026 (Phase 1 & 2 Completed)

---

## Executive Summary

The Himmat Tea admin dashboard is a well-structured React application covering core e-commerce operations — orders, products, inventory, customers, analytics, blog, coupons, reviews, and admin access control. The tech stack (React, Tailwind, shadcn/ui, Recharts, jsPDF) is solid and the visual identity is consistent.

We have completed **Phase 1 (Data Integrity)** and most of **Phase 2 (Order Operations)**. This document now reflects the current implementation state.

---

## 1. Analytics — Major Business Intelligence Gaps

### 1.1 Hardcoded Growth Percentages (Critical Bug) ✅ Completed
**Current state:** ~~Every stat card in `Analytics.tsx` and `DashboardHome.tsx` displays hardcoded change values: `"+12.5%"`, `"+8.2%"`, `"+23.1%"`, `"+5.3%"`. These are not calculated from real data.~~  
**Updated state:** Growth percentages are now dynamically calculated from real data (current period vs previous period).

**Business impact:** Management can now make decisions based on accurate growth metrics.

### 1.2 Period Filter Does Nothing ✅ Completed
**Current state:** ~~`Analytics.tsx` renders a Week/Month/Quarter/Year selector that sets `period` state but never uses it to filter `monthlyData`, `productPerformance`, or `orderStatusData`.~~  
**Updated state:** The period filter is now wired into all data computations and charts.

### 1.3 Missing Business KPIs
The following are standard for a D2C tea brand and are entirely absent:

| KPI | Why It Matters |
|-----|---------------|
| Customer Lifetime Value (CLV) | Informs acquisition spend cap |
| Repeat Purchase Rate | Key health metric for subscription-adjacent products |
| Cart Abandonment Rate | Direct revenue leak |
| Revenue per Product Category | Which tea type drives profit |
| Refund Rate & Refund Value | Already tracked as order status but never surfaced |
| Coupon Redemption Rate & Revenue Impact | Measures promotion effectiveness |
| Inventory Turnover Rate | Prevents dead stock write-offs |
| Gross Margin by Product | Core profitability metric |

### 1.4 No Date Range Picker
Analytics charts only show last 6 months with no ability to specify a custom range. Add a date-range picker (e.g., react-day-picker or shadcn Calendar + Popover) for ad-hoc reporting.

### 1.5 No Export from Analytics
The revenue trend, product performance, and order status data have no export capability. Add CSV export using Papa.unparse and PDF export of the full analytics view.

---

## 2. Orders — Operational Workflow Improvements

### 2.1 No Bulk Operations ⚠️ Partially Completed
**Current state:** ~~Every order action (status update, download invoice) requires opening each order individually.~~  
**Updated state:** Bulk status update is implemented. Bulk invoice download and CSV export are still pending.

**Implemented:** Add row checkboxes with a bulk action bar for status updates.  
**Pending:** Bulk invoice download (ZIP of selected order PDFs), bulk export to CSV.

### 2.2 Missing Tracking Number Field ✅ Completed
**Current state:** ~~Orders have `shippingAddress` but no `trackingNumber` or `courierPartner` field.~~  
**Updated state:** `trackingNumber` and `courierPartner` fields are added to Order interface and UI in order detail modal.

### 2.3 No Order Notes / Internal Comments ✅ Completed
**Current state:** ~~Staff cannot annotate orders with internal notes.~~  
**Updated state:** Internal notes with timestamps and admin attribution are now supported.

### 2.4 "Download Report" Button is a Toast ✅ Completed
**Current state:** ~~`DashboardHome.tsx` "Download Report" button only fires `toast.success("Report Downloaded")`.~~  
**Updated state:** Now generates a professional CSV with proper escaping, UTF-8 BOM for Excel, and additional fields.

### 2.5 Invoice Improvements
The invoice component in `Orders.tsx` is well-structured but missing:
- HSN/SAC code column (mandatory for GST compliance in India above ₹50,000 annual turnover)
- Place of Supply field (required for IGST vs CGST/SGST determination)
- IRN / QR code placeholder (for e-invoicing compliance above the threshold)
- Terms & Conditions section
- Bank account details for offline payment

### 2.6 No Pagination ✅ Completed
**Current state:** ~~Orders are loaded into a single table with no pagination or virtualisation.~~  
**Updated state:** Pagination with configurable page sizes (10/25/50/100) is now implemented.

### 2.7 Refund Workflow is Incomplete ✅ Completed
**Current state:** ~~Refund reason is captured but not stored, no refund amount field.~~  
**Updated state:** Refund reason and refund amount fields are added, partial refunds are supported.

---

## 3. Products — Catalogue Management

### 3.1 No Product Variants
Tea products naturally have variants (weight: 50g, 100g, 250g, 500g; grade: TGFOP, FTGFOP; flavour). The current product schema has a single `price` and `stock`. Without variants, each SKU requires a separate product record, causing catalogue bloat and making inventory management near-impossible.

**Fix required:** Add a `variants` array:
```ts
variants: Array<{
  id: string;
  name: string; // "100g", "Premium Grade"
  sku: string;
  price: number;
  stock: number;
  weight?: number;
}>
```

### 3.2 No SKU / Barcode Field
Products have no `sku` field visible in the UI. Barcodes/EAN codes are absent. These are required for warehouse operations, purchase orders, and courier integrations.

### 3.3 No Product Cost Price
Without a `costPrice` field, gross margin per product cannot be calculated. This is why the Analytics page shows revenue but cannot show profitability.

**Fix required:** Add `costPrice: number` to the product schema. Compute `margin = (price - costPrice) / price * 100` and display in the product list and analytics.

### 3.4 Product Images — URL Only
Images are stored as URL strings. If external URLs break, products show no image. Add support for image uploads (base64 or a hosted storage solution). At minimum, add image validity checking.

### 3.5 No Product Tags / Collections
No `tags` or `collections` field exists for grouping products (e.g., "Bestseller", "Seasonal", "Gift Pack"). This limits storefront merchandising capability.

### 3.6 No SEO Metadata
Products have no `metaTitle`, `metaDescription`, or `slug` fields for SEO. If the storefront renders product pages, these are required for search ranking.

---

## 4. Inventory — Stock Management

### 4.1 Purchase Orders Have No Receiving Workflow
`PurchaseOrders.tsx` exists but there is no "Receive Stock" action that actually increments product stock levels when a PO is marked received. The two systems (PO and inventory) are disconnected.

**Fix required:** When a PO status changes to "Received", auto-increment `product.stock` for each line item by the received quantity.

### 4.2 No Stock Reservation System
When an order is placed, stock should be immediately reserved even before it is processed. Currently, two simultaneous orders for the last unit of stock could both succeed.

**Fix required:** Track `reservedStock` separately from `availableStock = stock - reservedStock`. Reserve on order creation, release on cancellation.

### 4.3 Low Stock Threshold is Not Configurable Per Product
The low stock alert threshold appears to be a global setting. Each product should have its own `lowStockThreshold` (a fast-moving product needs a higher threshold than a seasonal one).

### 4.4 No Stock Movement Log
There is no audit trail of how stock changed — was it a sale, a purchase order receipt, a manual adjustment, a return? This is essential for reconciliation and shrinkage detection.

**Fix required:** Create a `stockMovements` log:
```ts
interface StockMovement {
  id: string;
  productId: number;
  type: "sale" | "po_receipt" | "manual_adjustment" | "return" | "write_off";
  quantity: number; // negative for reductions
  referenceId?: string; // orderId or poId
  note?: string;
  timestamp: string;
  adminId: string;
}
```

### 4.5 No Dead Stock / Overstock Alerts
Products with zero sales in 90 days and high stock should be flagged for promotion or write-off. This is a missed working capital optimisation opportunity.

---

## 5. Customers — CRM Enhancements

### 5.1 No Customer Lifetime Value Display
The customer detail view shows orders but does not sum total spend, average order value, or order frequency — the three pillars of CLV. These should be computed and displayed prominently.

### 5.2 No Customer Segments / Tags
Customers cannot be tagged (e.g., "VIP", "Wholesale", "Gifting", "Repeat Buyer"). Without segmentation, targeted promotions via coupons are impossible to administer efficiently.

### 5.3 No Customer Export
No ability to export the customer list as CSV for email marketing tools (Mailchimp, Klaviyo, etc.). This is a direct marketing capability gap.

### 5.4 No Purchase History Timeline
The customer view likely shows a list of orders but not a visual timeline showing purchasing patterns, gaps, and product affinities.

### 5.5 No Customer Communication Log
No way to record calls, emails, or chat interactions against a customer record.

---

## 6. Blog — Content Management

### 6.1 Content Editor is Raw JSON
The blog body field requires manually writing JSON like `[{"type": "p", "text": "..."}]`. This is unusable for non-technical content editors and is a significant operational bottleneck.

**Fix required:** Replace the JSON textarea with a rich text editor. Recommended: `@tiptap/react` (open source, headless, extensible). The output can still serialise to the internal JSON format.

### 6.2 No Draft / Published State
Posts have no `status: "draft" | "published" | "archived"` field. Every saved post is presumably live. This prevents content scheduling and review workflows.

### 6.3 No Author Attribution
Blog posts have no `author` field. For multi-admin setups this is a content accountability gap.

### 6.4 No Scheduled Publishing
No `publishAt: datetime` field for scheduling posts to go live automatically.

### 6.5 No SEO Preview
No meta title, meta description, or Open Graph image fields are present on the blog post form.

---

## 7. Coupons — Promotion Engine

### 7.1 No Product or Category Scoping
Coupons apply store-wide. There is no `applicableProductIds` or `applicableCategories` field, making it impossible to run product-specific promotions (e.g., 20% off only Darjeeling teas).

### 7.2 No Per-Customer Usage Limit
`usageLimit` is a global total across all customers. There is no `perCustomerLimit` to prevent a single customer from using a coupon multiple times.

### 7.3 No Free Shipping Coupon Type
The only discount types are `percentage` and `fixed`. Free shipping (`discountType: "free_shipping"`) is one of the most effective conversion tools and is absent.

### 7.4 No Coupon Performance Dashboard
There is no summary of which coupons generated the most orders, discount value given away, or revenue generated. Coupon ROI is unmeasurable.

### 7.5 Coupon Code Generation
No auto-generate button for random coupon codes. Manually typing codes is error-prone.

---

## 8. Reviews — Moderation

### 8.1 No Review Response Feature
Admins cannot post a public response to a customer review. This is a standard reputation management feature on any D2C platform.

### 8.2 No Review Request Trigger
No ability to send a review request email after an order is delivered (triggered by status change to "Delivered"). This limits organic review volume.

### 8.3 No Aggregate Rating Display
There is no product-level aggregate rating (average stars, review count) visible in the Products or Analytics sections.

### 8.4 Image Reviews Not Supported
Customer photo reviews significantly increase conversion rates. The review schema has no `images` field.

---

## 9. Settings — Configuration Completeness

### 9.1 Missing GST / Tax Configuration Fields ⚠️ Partially Completed
India-specific tax setup is incomplete. Required fields:
- ✅ `gstNumber` (already exists)
- `panNumber`
- `stateCode` (for determining IGST vs CGST+SGST)
- `hsnCodes` per product category

These are legally required on invoices above the threshold.

### 9.2 Shipping Settings Absent
No shipping configuration:
- Flat rate vs weight-based vs order-value-based
- Free shipping threshold
- COD availability toggle
- Pincode serviceability list

### 9.3 Email Template Configuration Missing
No ability to customise transactional email templates (order confirmation, shipping notification, delivery confirmation). These are brand touchpoints.

### 9.4 Payment Gateway Settings Not Present
No Razorpay / PayU / Cashfree API key management in the settings panel (presumably handled elsewhere, but should be surfaced here for operational visibility).

### 9.5 Store Logo Upload Missing
`Settings.tsx` references `settings.storeName` in the invoice but there is no logo upload field. The invoice shows initials instead of a logo.

---

## 10. Admin Users — Access Control

### 10.1 No Role-Based Permission Granularity
The system has only two roles: `admin` and `superadmin`. A real business needs granular permissions:

| Permission | Example Use Case |
|-----------|-----------------|
| `orders:read` / `orders:write` | Warehouse staff can view, not edit |
| `products:write` | Catalogue manager only |
| `customers:read` | Customer support, no data modification |
| `analytics:read` | Finance team, read-only reporting |
| `blog:write` | Content team, no financial access |

### 10.2 No Audit Log / Activity Trail
No record of which admin performed which action (deleted a product, changed an order status, updated prices). This is both a security and accountability gap.

**Fix required:**
```ts
interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string; // "order.status.updated" | "product.deleted"
  entityType: string;
  entityId: string;
  previousValue?: any;
  newValue?: any;
  timestamp: string;
  ipAddress?: string;
}
```

### 10.3 No Two-Factor Authentication (2FA)
Admin accounts protect financial and customer data. No 2FA mechanism is present. At minimum, add TOTP support (Google Authenticator compatible).

### 10.4 No Session Management
No ability to view or revoke active sessions. If an admin credential is compromised, there is no forced logout mechanism.

### 10.5 Password Policy Not Enforced
The password field in the add user dialog has no minimum length, complexity, or strength indicator.

---

## 11. Dashboard Home — Quick Wins

### 11.1 Order Status Pipeline Should Be Visual
The four status counts (Pending, Processing, Shipped, Delivered) are shown as number badges. A horizontal funnel chart would make conversion/drop-off immediately visible.

### 11.2 "Top Products" Shows Stock Status, Not Sales Rank ✅ Completed
**Current state:** ~~"Top Products" sidebar shows `products.slice(0, 4)` — the first four products by insertion order.~~  
**Updated state:** Now shows actual top sellers by revenue.

### 11.3 Revenue Widget Shows All-Time Total, Not Period ✅ Completed
**Current state:** ~~Total Revenue stat card shows all-time total.~~  
**Updated state:** Shows current period by default with previous period comparison.

### 11.4 Notifications System Needs Actionability
Notifications exist (`useStore().notifications`) but clicking a notification does not navigate to the relevant entity. Every notification should deep-link to its source (order, review, low stock product).

### 11.5 "Test New Order" Button in Production UI ✅ Completed
**Current state:** ~~"Test New Order" button was exposed in production.~~  
**Updated state:** Button has been removed.

---

## 12. Technical Architecture — Code Quality

### 12.1 All State is In-Memory Only ✅ Completed
**Current state:** ~~All state in-memory, lost on refresh.~~  
**Updated state:** Full localStorage persistence already implemented!

### 12.2 No Optimistic UI with Error Rollback
Async functions like `addAdminUser`, `updateAdminUser` are `await`-ed but there is no error handling shown in the UI beyond the async call itself. If the operation fails, the UI may show stale state.

### 12.3 TypeScript `any` Overuse
Multiple components use `any` for entities that have well-defined shapes (`editingUser: any`, `editingPost: any`, `editingCoupon: any`). This defeats TypeScript's purpose and will cause runtime surprises.

**Fix required:** Export shared interfaces from a central `types/` directory and import them in all components.

### 12.4 No Loading / Skeleton States
No loading indicators exist for any async operations. Users get no feedback while data is fetching (especially relevant when the persistence layer is added).

### 12.5 No Error Boundaries
No React Error Boundary wraps the dashboard. A runtime error in Analytics will blank the entire admin panel.

### 12.6 html2canvas + jsPDF Performance
The invoice PDF generation uses html2canvas to rasterise DOM, then embeds as an image in jsPDF. This produces large file sizes and blurry text at high zoom. Use `jspdf` with direct text/line drawing or switch to a React-to-PDF library like `@react-pdf/renderer` for vector-quality output.

---

## 13. Mobile Responsiveness

### 13.1 Order Table is Not Mobile-Usable
The orders table has 8 columns and does not collapse on mobile. Staff checking orders on a phone see a broken layout.

**Fix required:** On mobile (`< 768px`), switch to a card-per-order layout. Each card shows Order ID, customer name, total, status, and action buttons stacked vertically.

### 13.2 Analytics Charts Overflow on Small Screens
Recharts `ResponsiveContainer` handles width but the chart legends and tick labels overflow on screens below 480px.

---

## 14. Prioritised Implementation Roadmap

### Phase 1 — Data Integrity (Weeks 1–2, Highest ROI) ✅ Completed
1. ✅ Fix hardcoded growth percentages in Analytics and DashboardHome
2. ✅ Wire the period filter in Analytics to all data computations
3. ✅ Fix "Download Report" to generate a real CSV/PDF
4. ✅ Remove "Test New Order" from production UI
5. ✅ Add persistence layer (localStorage already implemented!)

### Phase 2 — Order Operations (Weeks 3–4) ⚠️ Partially Completed
1. ✅ Add tracking number + courier partner fields to orders
2. ✅ Add bulk order status update
3. ✅ Add order internal notes
4. ✅ Fix partial refund capability
5. ✅ Add order-level pagination
6. ⏳ Fix invoice for GST compliance (HSN codes, Place of Supply)

### Phase 3 — Inventory & Products (Weeks 5–6)
1. Add product cost price and display margin in analytics
2. Connect PO receipt to stock increment
3. Add stock movement audit log
4. Add low stock threshold per product
5. Add product SKU field

### Phase 4 — CRM & Marketing (Weeks 7–8)
1. Add CLV calculation to customer profiles
2. Add customer CSV export
3. Add coupon per-customer usage limit
4. Add free shipping coupon type
5. Add coupon performance dashboard

### Phase 5 — Content & Access Control (Weeks 9–10)
1. Replace blog JSON editor with Tiptap rich text editor
2. Add blog draft/published state
3. Add granular role permissions
4. Add admin activity audit log
5. Add review response feature

### Phase 6 — Architecture & Scale (Ongoing)
1. Replace `any` types with proper TypeScript interfaces
2. Add React Error Boundaries
3. Add loading skeleton states
4. Switch invoice generation to @react-pdf/renderer
5. Mobile-optimise order table

---

## 15. Quick Summary Table

| Area | Severity | Total Issues | Completed | Pending |
|------|----------|--------------|-----------|---------|
| Analytics — data integrity | Critical | 2 | 1 | 1 |
| Orders — operational | High | 7 | 5 | 2 |
| Products — schema | High | 6 | 0 | 6 |
| Inventory — stock accuracy | High | 5 | 0 | 5 |
| Blog — editor usability | Medium | 5 | 0 | 5 |
| Coupons — feature completeness | Medium | 5 | 0 | 5 |
| Reviews — moderation | Low-Medium | 4 | 0 | 4 |
| Settings — compliance | High | 5 | 1 | 4 |
| Admin / Security | High | 5 | 0 | 5 |
| Architecture — reliability | Critical | 6 | 1 | 5 |
| **Total** | | **55** | **8** | **47** |

---

*This document should be treated as a living specification. Each Phase item maps to a GitHub issue or JIRA ticket. Estimates assume a single full-stack developer; adjust for team size.*
