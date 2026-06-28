import { useState, useRef } from "react";
import {
  Plus, Search, Eye, CheckCircle, Truck, Clock,
  Package, XCircle, RefreshCw, Download, Printer, Undo2,
  CheckSquare, Square, ChevronLeft, ChevronRight
} from "lucide-react";
import { useStore } from "../../../context/StoreContext";
import { useTranslation } from "../../../hooks/useTranslation";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { Textarea } from "../../components/ui/textarea";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
type PaymentStatus = "Paid" | "Unpaid" | "Refunded";

interface OrderItem {
  id: number;
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

interface InternalNote {
  id: string;
  text: string;
  adminId: string;
  adminName: string;
  timestamp: string;
}

interface Order {
  id: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  orderDate: string;
  items: OrderItem[];
  total: number;
  tax: number;
  grandTotal: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  trackingNumber?: string;
  courierPartner?: string;
  internalNotes: InternalNote[];
  refundReason?: string;
  refundAmount?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_META: Record<string, { icon: React.ElementType; pill: string }> = {
  delivered:  { icon: CheckCircle, pill: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  completed:  { icon: CheckCircle, pill: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  processing: { icon: Clock,       pill: "bg-sky-50 text-sky-700 border-sky-200" },
  shipped:    { icon: Truck,       pill: "bg-violet-50 text-violet-700 border-violet-200" },
  pending:    { icon: Package,     pill: "bg-amber-50 text-amber-700 border-amber-200" },
  cancelled:  { icon: XCircle,    pill: "bg-red-50 text-red-700 border-red-200" },
  refunded:   { icon: RefreshCw,  pill: "bg-orange-50 text-orange-700 border-orange-200" },
};

const PAYMENT_PILL: Record<string, string> = {
  Paid:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  Unpaid:   "bg-red-50 text-red-700 border-red-200",
  Refunded: "bg-orange-50 text-orange-700 border-orange-200",
};

const fmt = (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function numberToWords(num: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convert(n: number): string {
    if (n === 0) return "";
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
    if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
    return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
  }
  return convert(Math.floor(num)) || "Zero";
}

// ─── Invoice Component ────────────────────────────────────────────────────────

function OrderInvoice({
  order,
  invoiceRef,
  settings,
}: {
  order: Order;
  invoiceRef: React.RefObject<HTMLDivElement>;
  settings: any;
}) {
  const cgstRate = settings.taxRate / 2;
  const sgstRate = settings.taxRate / 2;
  const cgstAmount = order.total * (cgstRate / 100);
  const sgstAmount = order.total * (sgstRate / 100);
  const subtotal = order.total;

  const invoiceDate = new Date(order.orderDate);
  const dueDateObj = new Date(invoiceDate);
  dueDateObj.setDate(dueDateObj.getDate() + 30);

  const fmtDate = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div
      ref={invoiceRef}
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        backgroundColor: "#ffffff",
        color: "#1a1a1a",
        width: "794px",         // A4 at 96dpi
        minHeight: "1123px",
        margin: "0 auto",
        position: "relative",
        fontSize: "13px",
        lineHeight: "1.5",
      }}
    >
      {/* ── Accent bar (top) ── */}
      <div style={{
        height: "6px",
        background: "linear-gradient(90deg, #1a3a2a 0%, #2d5a3d 50%, #4a8c5c 100%)",
      }} />

      {/* ── Header ── */}
      <div style={{ padding: "36px 48px 28px", borderBottom: "1px solid #e5e5e5" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>

          {/* Brand */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div style={{
              width: "52px", height: "52px",
              background: "#1a3a2a",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "4px", flexShrink: 0,
            }}>
              <span style={{ color: "#ffffff", fontWeight: 800, fontSize: "18px", letterSpacing: "1px" }}>
                {(settings.storeName || "HT").slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.3px" }}>
                {settings.storeName || "Himalayan Teas"}
              </div>
              {settings.storeAddress && (
                <div style={{ fontSize: "12px", color: "#666666", marginTop: "3px", maxWidth: "260px", lineHeight: "1.5" }}>
                  {settings.storeAddress}
                </div>
              )}
              <div style={{ fontSize: "12px", color: "#666666", marginTop: "3px" }}>
                {settings.storeEmail} {settings.storePhone ? `· ${settings.storePhone}` : ""}
              </div>
              {settings.gstNumber && (
                <div style={{ fontSize: "11px", color: "#888888", marginTop: "4px" }}>
                  GSTIN: <strong style={{ color: "#444444" }}>{settings.gstNumber}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Invoice meta */}
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontSize: "28px", fontWeight: 800, color: "#1a3a2a",
              letterSpacing: "-0.5px", lineHeight: 1,
            }}>
              TAX INVOICE
            </div>
            <div style={{ marginTop: "14px" }}>
              <table style={{ borderCollapse: "collapse", marginLeft: "auto" }}>
                <tbody>
                  <tr>
                    <td style={{ fontSize: "11px", color: "#888888", paddingRight: "16px", paddingBottom: "5px", textAlign: "right", whiteSpace: "nowrap" }}>
                      INVOICE NO.
                    </td>
                    <td style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", paddingBottom: "5px", textAlign: "right" }}>
                      {order.id}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontSize: "11px", color: "#888888", paddingRight: "16px", paddingBottom: "5px", textAlign: "right" }}>
                      DATE
                    </td>
                    <td style={{ fontSize: "13px", color: "#333333", paddingBottom: "5px", textAlign: "right" }}>
                      {fmtDate(invoiceDate)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontSize: "11px", color: "#888888", paddingRight: "16px", textAlign: "right" }}>
                      DUE DATE
                    </td>
                    <td style={{ fontSize: "13px", color: "#333333", textAlign: "right" }}>
                      {fmtDate(dueDateObj)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment badge */}
            <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
              <span style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "3px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                ...(order.paymentStatus === "Paid"
                  ? { background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" }
                  : order.paymentStatus === "Refunded"
                  ? { background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa" }
                  : { background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }),
              }}>
                {order.paymentStatus.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Address section ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        borderBottom: "1px solid #e5e5e5",
        background: "#f9fafb",
      }}>
        {/* Bill To */}
        <div style={{ padding: "24px 32px", borderRight: "1px solid #e5e5e5" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#888888", letterSpacing: "1px", marginBottom: "10px", textTransform: "uppercase" }}>
            Bill To
          </div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a" }}>{order.customerName}</div>
          {order.customerEmail && (
            <div style={{ fontSize: "12px", color: "#555555", marginTop: "4px" }}>{order.customerEmail}</div>
          )}
          {order.customerPhone && (
            <div style={{ fontSize: "12px", color: "#555555", marginTop: "2px" }}>{order.customerPhone}</div>
          )}
          {order.shippingAddress && (
            <div style={{ fontSize: "12px", color: "#555555", marginTop: "6px", lineHeight: "1.6", whiteSpace: "pre-line" }}>
              {order.shippingAddress}
            </div>
          )}
        </div>

        {/* Ship To */}
        <div style={{ padding: "24px 32px", borderRight: "1px solid #e5e5e5" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#888888", letterSpacing: "1px", marginBottom: "10px", textTransform: "uppercase" }}>
            Ship To
          </div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a" }}>{order.customerName}</div>
          {order.shippingAddress && (
            <div style={{ fontSize: "12px", color: "#555555", marginTop: "6px", lineHeight: "1.6", whiteSpace: "pre-line" }}>
              {order.shippingAddress}
            </div>
          )}
        </div>

        {/* Order Info */}
        <div style={{ padding: "24px 32px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#888888", letterSpacing: "1px", marginBottom: "10px", textTransform: "uppercase" }}>
            Order Info
          </div>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              {[
                ["Order ID", order.id],
                ["Status", order.status],
                ["Items", String(order.items.length)],
                ["Order Date", fmtDate(invoiceDate)],
              ].map(([label, val]) => (
                <tr key={label}>
                  <td style={{ fontSize: "11px", color: "#888888", paddingBottom: "5px", paddingRight: "8px", whiteSpace: "nowrap" }}>
                    {label}
                  </td>
                  <td style={{ fontSize: "12px", fontWeight: 600, color: "#333333", paddingBottom: "5px" }}>
                    {val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Line items table ── */}
      <div style={{ padding: "0 48px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #1a3a2a" }}>
              {[
                { label: "#",           align: "left",   width: "36px" },
                { label: "Description", align: "left",   width: "auto" },
                { label: "HSN/SAC",     align: "center", width: "90px" },
                { label: "Qty",         align: "center", width: "60px" },
                { label: "Unit Price",  align: "right",  width: "100px" },
                { label: "Discount",    align: "right",  width: "90px" },
                { label: "Amount",      align: "right",  width: "110px" },
              ].map((col) => (
                <th
                  key={col.label}
                  style={{
                    textAlign: col.align as any,
                    width: col.width,
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#888888",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    paddingTop: "18px",
                    paddingBottom: "10px",
                    paddingLeft: col.align === "left" ? "0" : "8px",
                    paddingRight: col.align === "right" ? "0" : "8px",
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: "1px solid #eeeeee",
                  background: idx % 2 === 0 ? "#ffffff" : "#fafafa",
                }}
              >
                <td style={{ paddingTop: "13px", paddingBottom: "13px", fontSize: "12px", color: "#aaaaaa", textAlign: "left" }}>
                  {String(idx + 1).padStart(2, "0")}
                </td>
                <td style={{ paddingTop: "13px", paddingBottom: "13px", paddingRight: "8px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a1a" }}>{item.name}</div>
                  <div style={{ fontSize: "11px", color: "#999999", marginTop: "2px" }}>SKU: {item.id}</div>
                </td>
                <td style={{ textAlign: "center", paddingTop: "13px", paddingBottom: "13px", fontSize: "12px", color: "#666666" }}>
                  0902
                </td>
                <td style={{ textAlign: "center", paddingTop: "13px", paddingBottom: "13px", fontSize: "13px", fontWeight: 600, color: "#1a1a1a" }}>
                  {item.quantity}
                </td>
                <td style={{ textAlign: "right", paddingTop: "13px", paddingBottom: "13px", paddingLeft: "8px", fontSize: "12px", color: "#555555" }}>
                  ₹{fmt(item.price)}
                </td>
                <td style={{ textAlign: "right", paddingTop: "13px", paddingBottom: "13px", paddingLeft: "8px", fontSize: "12px", color: "#aaaaaa" }}>
                  —
                </td>
                <td style={{ textAlign: "right", paddingTop: "13px", paddingBottom: "13px", fontSize: "13px", fontWeight: 700, color: "#1a1a1a" }}>
                  ₹{fmt(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Totals + bank details ── */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "28px 48px 0", gap: "32px" }}>

        {/* Bank / notes (left) */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#888888", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
            Payment Details
          </div>
          <table style={{ borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["Bank Name", "State Bank of India"],
                ["Account No.", "XXXX XXXX XXXX 4521"],
                ["IFSC Code", "SBIN0001234"],
                ["Branch", "New Delhi Main"],
              ].map(([label, val]) => (
                <tr key={label}>
                  <td style={{ fontSize: "11px", color: "#888888", paddingBottom: "4px", paddingRight: "16px", whiteSpace: "nowrap" }}>
                    {label}
                  </td>
                  <td style={{ fontSize: "12px", color: "#333333", fontWeight: 500, paddingBottom: "4px" }}>
                    {val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Amount in words */}
          <div style={{
            marginTop: "20px",
            padding: "12px 16px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "4px",
          }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#16a34a", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "4px" }}>
              Amount in Words
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#14532d" }}>
              {numberToWords(order.grandTotal)} Rupees Only
            </div>
          </div>
        </div>

        {/* Totals table (right) */}
        <div style={{ minWidth: "260px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ fontSize: "12px", color: "#666666", paddingBottom: "8px" }}>Subtotal</td>
                <td style={{ fontSize: "13px", textAlign: "right", fontWeight: 500, color: "#1a1a1a", paddingBottom: "8px" }}>₹{fmt(subtotal)}</td>
              </tr>
              <tr>
                <td style={{ fontSize: "12px", color: "#666666", paddingBottom: "8px" }}>Discount</td>
                <td style={{ fontSize: "13px", textAlign: "right", color: "#16a34a", paddingBottom: "8px" }}>— ₹0.00</td>
              </tr>
              {settings.gstNumber ? (
                <>
                  <tr>
                    <td style={{ fontSize: "12px", color: "#666666", paddingBottom: "8px" }}>CGST ({cgstRate}%)</td>
                    <td style={{ fontSize: "13px", textAlign: "right", color: "#1a1a1a", paddingBottom: "8px" }}>₹{fmt(cgstAmount)}</td>
                  </tr>
                  <tr>
                    <td style={{ fontSize: "12px", color: "#666666", paddingBottom: "12px" }}>SGST ({sgstRate}%)</td>
                    <td style={{ fontSize: "13px", textAlign: "right", color: "#1a1a1a", paddingBottom: "12px" }}>₹{fmt(sgstAmount)}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td style={{ fontSize: "12px", color: "#666666", paddingBottom: "12px" }}>Tax ({settings.taxRate}%)</td>
                  <td style={{ fontSize: "13px", textAlign: "right", color: "#1a1a1a", paddingBottom: "12px" }}>₹{fmt(order.tax)}</td>
                </tr>
              )}
              <tr style={{ borderTop: "2px solid #1a3a2a" }}>
                <td style={{ fontSize: "15px", fontWeight: 800, color: "#1a1a1a", paddingTop: "12px" }}>
                  TOTAL DUE
                </td>
                <td style={{
                  fontSize: "18px", fontWeight: 800, textAlign: "right",
                  color: "#1a3a2a", paddingTop: "12px",
                }}>
                  ₹{fmt(order.grandTotal)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Signature box */}
          <div style={{
            marginTop: "32px",
            borderTop: "1px solid #cccccc",
            paddingTop: "8px",
            textAlign: "center",
          }}>
            <div style={{ height: "36px" }} />
            <div style={{ borderTop: "1px solid #aaaaaa", paddingTop: "6px", fontSize: "11px", color: "#888888" }}>
              Authorised Signatory for {settings.storeName}
            </div>
          </div>
        </div>
      </div>

      {/* ── Terms & notes ── */}
      <div style={{
        margin: "28px 48px 0",
        padding: "18px 20px",
        background: "#fafafa",
        border: "1px solid #e5e5e5",
        borderRadius: "4px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
      }}>
        <div>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#888888", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
            Terms & Conditions
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Goods once sold cannot be returned without prior approval.",
              "Payment is due within 30 days of the invoice date.",
              "Subject to local jurisdiction.",
            ].map((t, i) => (
              <li key={i} style={{ fontSize: "11px", color: "#666666", marginBottom: "3px" }}>
                {i + 1}. {t}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#888888", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
            Notes
          </div>
          <p style={{ fontSize: "11px", color: "#666666", margin: 0 }}>
            Thank you for your business! We appreciate your continued trust in {settings.storeName}.
            For any queries regarding this invoice, please reach us at {settings.storeEmail}.
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        margin: "28px 48px 0",
        paddingTop: "14px",
        borderTop: "1px solid #e5e5e5",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: "28px",
      }}>
        <div style={{ fontSize: "11px", color: "#aaaaaa" }}>
          This is a computer-generated invoice and does not require a physical signature.
        </div>
        <div style={{ fontSize: "11px", color: "#aaaaaa" }}>
          © {new Date().getFullYear()} {settings.storeName} · All rights reserved
        </div>
      </div>

      {/* ── Bottom accent bar ── */}
      <div style={{
        height: "4px",
        background: "linear-gradient(90deg, #1a3a2a 0%, #2d5a3d 50%, #4a8c5c 100%)",
      }} />
    </div>
  );
}

// ─── Print CSS ────────────────────────────────────────────────────────────────

const buildPrintStyles = () => `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    background: white;
    color: #1a1a1a;
    font-size: 13px;
    line-height: 1.5;
  }
  @media print {
    @page { size: A4; margin: 0; }
    body { margin: 0; padding: 0; }
  }
  table { border-collapse: collapse; }
`;

// ─── Main Orders page ─────────────────────────────────────────────────────────

const ALL_STATUSES = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];
const PAYMENT_STATUSES = ["Paid", "Unpaid", "Refunded"];

export default function Orders() {
  const { 
    orders, 
    updateOrder, 
    settings, 
    refundOrder,
    addInternalNote,
    updateTrackingInfo,
    bulkUpdateOrderStatus
  } = useStore();
  const { t } = useTranslation();

  const [refundReason, setRefundReason] = useState("");
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [newInternalNote, setNewInternalNote] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierPartner, setCourierPartner] = useState("");
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>("Processing");
  
  const invoiceRef = useRef<HTMLDivElement>(null);

  const filteredOrders = orders.filter((o) =>
    (o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedStatus === "All" || o.status === selectedStatus)
  );

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Toggle order selection
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrderIds(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Select all orders
  const toggleSelectAll = () => {
    if (selectedOrderIds.length === paginatedOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(paginatedOrders.map(o => o.id));
    }
  };

  // Handle bulk status update
  const handleBulkUpdate = () => {
    if (selectedOrderIds.length > 0) {
      bulkUpdateOrderStatus(selectedOrderIds, bulkStatus);
      setSelectedOrderIds([]);
    }
  };

  // Handle adding internal note
  const handleAddInternalNote = () => {
    if (selectedOrder && newInternalNote.trim()) {
      addInternalNote(selectedOrder.id, newInternalNote, "1", "Admin");
      setNewInternalNote("");
      // Refresh selected order
      const updatedOrder = orders.find(o => o.id === selectedOrder.id);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder as unknown as Order);
      }
    }
  };

  // Handle updating tracking info
  const handleUpdateTracking = () => {
    if (selectedOrder) {
      updateTrackingInfo(selectedOrder.id, trackingNumber, courierPartner);
      // Refresh selected order
      const updatedOrder = orders.find(o => o.id === selectedOrder.id);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder as unknown as Order);
      }
    }
  };

  // Handle refund
  const handleRefund = (order: Order) => {
    const amount = refundAmount ? parseFloat(refundAmount) : undefined;
    refundOrder(order.id, refundReason, amount);
    setRefundReason("");
    setRefundAmount("");
  };

  // ── Print ──────────────────────────────────────────────────────────────────

  const handlePrintInvoice = () => {
    if (!invoiceRef.current || !selectedOrder) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head>
      <title>Invoice – ${selectedOrder.id}</title>
      <meta charset="UTF-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          background: white;
          padding: 20px;
        }
        @media print {
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; }
        }
      </style>
    </head><body>${invoiceRef.current.outerHTML}</body></html>`);
    win.document.close();
    win.onload = () => setTimeout(() => win.print(), 500);
  };

  // ── Download PDF ───────────────────────────────────────────────────────────

  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current || !selectedOrder) return;
    try {
      console.log("Starting PDF export...");
      
      // Ensure all styles are loaded
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: true,
        allowTaint: true,
        windowWidth: 800,
        windowHeight: invoiceRef.current.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });
      
      console.log("Canvas created successfully, dimensions:", canvas.width, canvas.height);

      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 297;
      
      console.log("Adding image to PDF...");
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight);
      
      console.log("Saving PDF...");
      pdf.save(`invoice-${selectedOrder.id}.pdf`);
      
      console.log("PDF saved successfully!");
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Failed to download invoice. Please try again or use the Print option.");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold text-[#1c1917]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t("dashboard.orders.title")}
          </h1>
          <p className="text-[#78746e] mt-1">{t("dashboard.orders.subtitle")}</p>
        </div>
        <Button className="bg-[#2d5a3d] hover:bg-[#234832] text-white">
          <Plus className="h-4 w-4 mr-2" />
          {t("dashboard.home.newOrder")}
        </Button>
      </div>

      {/* Search + filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#2d5a3d]/5 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78746e]" />
          <Input
            type="text"
            placeholder={t("dashboard.orders.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("dashboard.orders.allStatuses")} />
          </SelectTrigger>
          <SelectContent>
            {ALL_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bulk actions */}
      {selectedOrderIds.length > 0 && (
        <div className="bg-[#2d5a3d]/10 border border-[#2d5a3d]/20 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-medium text-[#2d5a3d]">
              {selectedOrderIds.length} {selectedOrderIds.length === 1 ? "order" : "orders"} selected
            </span>
            <Select value={bulkStatus} onValueChange={(val) => setBulkStatus(val as OrderStatus)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {ALL_STATUSES.slice(1).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="bg-[#2d5a3d] hover:bg-[#234832] text-white"
              onClick={handleBulkUpdate}
            >
              Update Status
            </Button>
          </div>
          <Button
            variant="secondary"
            onClick={() => setSelectedOrderIds([])}
          >
            Clear Selection
          </Button>
        </div>
      )}

      {/* Orders table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#2d5a3d]/5 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="sticky top-0 bg-[#f9f7f4] z-10">
              <tr className="text-left text-sm text-[#78746e] border-b border-[#2d5a3d]/5">
                <th className="px-6 py-4 font-medium whitespace-nowrap">
                  <button onClick={toggleSelectAll} className="p-1">
                    {selectedOrderIds.length === paginatedOrders.length && paginatedOrders.length > 0 ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">{t("dashboard.orders.orderId")}</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">{t("dashboard.orders.customer")}</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">{t("dashboard.orders.date")}</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">{t("dashboard.products.products")}</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">{t("dashboard.orders.totalAmount")}</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">{t("dashboard.products.status")}</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">{t("dashboard.settings.billing")}</th>
                <th className="px-6 py-4 font-medium text-right whitespace-nowrap">{t("dashboard.orders.action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d5a3d]/5">
              {paginatedOrders.map((order) => {
                const meta = STATUS_META[order.status.toLowerCase()];
                const StatusIcon = meta?.icon ?? Clock;
                const isSelected = selectedOrderIds.includes(order.id);
                return (
                  <tr 
                    key={order.id} 
                    className={`group transition-colors ${isSelected ? "bg-[#f0f9f4]" : "hover:bg-[#f9f7f4]"}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => toggleOrderSelection(order.id)} 
                        className="p-1"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-[#1c1917]">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-[#1c1917]">{order.customerName}</p>
                      <p className="text-xs text-[#78746e]">{order.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#78746e]">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#1c1917]">
                      {order.items.length} {order.items.length > 1 ? t("dashboard.home.products") : t("dashboard.invoice.item")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-[#1c1917]">
                      ₹{order.grandTotal.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${meta?.pill ?? "bg-gray-100 text-gray-700 border-gray-200"}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={PAYMENT_PILL[order.paymentStatus] ?? "bg-gray-100 text-gray-700"}>
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => { 
                            setSelectedOrder(order); 
                            setIsDetailModalOpen(true); 
                            // Initialize form values
                            setTrackingNumber(order.trackingNumber || "");
                            setCourierPartner(order.courierPartner || "");
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {order.status !== "Refunded" && order.status !== "Cancelled" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Undo2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t("dashboard.orders.refundOrder")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t("dashboard.orders.refundConfirm", { orderId: order.id })}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="py-4 space-y-4">
                                <div>
                                  <Label htmlFor="refund-amount">Refund Amount (optional)</Label>
                                  <Input
                                    id="refund-amount"
                                    type="number"
                                    placeholder="Full amount if left empty"
                                    value={refundAmount}
                                    onChange={(e) => setRefundAmount(e.target.value)}
                                    className="mt-2"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="refund-reason">{t("dashboard.orders.refundReason")}</Label>
                                  <Textarea
                                    id="refund-reason"
                                    placeholder={t("dashboard.orders.refundPlaceholder")}
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    className="mt-2"
                                  />
                                </div>
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => {
                                  setRefundReason("");
                                  setRefundAmount("");
                                }}>
                                  {t("dashboard.products.cancel")}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  disabled={!refundReason.trim()}
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleRefund(order)}
                                >
                                  {t("dashboard.orders.refundOrder")}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-[#2d5a3d]/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#78746e]">
              Show {paginatedOrders.length} of {filteredOrders.length} orders
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(val) => {
                setPageSize(parseInt(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map((size) => (
                  <SelectItem key={size} value={size.toString()}>{size} / page</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-[#1c1917]">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── Order detail modal ── */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-[900px] w-full max-h-[95vh] overflow-y-auto p-0">
          {selectedOrder && (
            <>
              {/* Modal toolbar */}
              <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="text-xl font-bold text-[#1c1917]">
                    {t("dashboard.orders.orderDetailsTitle")} {selectedOrder.id}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-[#78746e] mt-0.5">
                    {t("dashboard.orders.orderDetailsDesc")}
                  </DialogDescription>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={handlePrintInvoice}>
                    <Printer className="h-4 w-4 mr-1.5" />
                    {t("dashboard.orders.printInvoice")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
                    <Download className="h-4 w-4 mr-1.5" />
                    {t("dashboard.orders.download")}
                  </Button>
                </div>
              </div>

              {/* Status editor */}
              <div className="px-6 pt-4 pb-5 bg-[#f9f7f4] border-b border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-[#78746e] uppercase tracking-wide mb-1.5 block">
                      {t("dashboard.orders.updateOrderStatus")}
                    </Label>
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(value) => {
                        updateOrder(selectedOrder.id, { status: value as OrderStatus });
                        setSelectedOrder({ ...selectedOrder, status: value as OrderStatus });
                      }}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ALL_STATUSES.slice(1).map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-[#78746e] uppercase tracking-wide mb-1.5 block">
                      {t("dashboard.orders.updatePaymentStatus")}
                    </Label>
                    <Select
                      value={selectedOrder.paymentStatus}
                      onValueChange={(value) => {
                        updateOrder(selectedOrder.id, { paymentStatus: value as PaymentStatus });
                        setSelectedOrder({ ...selectedOrder, paymentStatus: value as PaymentStatus });
                      }}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PAYMENT_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Tracking Info */}
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-[#1c1917] mb-4">Tracking Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tracking-number">Tracking Number</Label>
                    <Input
                      id="tracking-number"
                      placeholder="Enter tracking number"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="courier-partner">Courier Partner</Label>
                    <Input
                      id="courier-partner"
                      placeholder="Enter courier partner"
                      value={courierPartner}
                      onChange={(e) => setCourierPartner(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
                <Button
                  className="mt-4 bg-[#2d5a3d] hover:bg-[#234832] text-white"
                  onClick={handleUpdateTracking}
                >
                  Update Tracking
                </Button>
                {selectedOrder.trackingNumber && (
                  <div className="mt-4 p-3 bg-[#f0f9f4] rounded-lg">
                    <p className="text-sm text-[#78746e]">
                      Current: <span className="font-medium text-[#1c1917]">{selectedOrder.trackingNumber}</span>
                      {selectedOrder.courierPartner && (
                        <span className="text-[#78746e]"> via {selectedOrder.courierPartner}</span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Internal Notes */}
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-[#1c1917] mb-4">Internal Notes</h3>
                <div className="flex gap-3 mb-4">
                  <Input
                    placeholder="Add a note..."
                    value={newInternalNote}
                    onChange={(e) => setNewInternalNote(e.target.value)}
                  />
                  <Button
                    className="bg-[#2d5a3d] hover:bg-[#234832] text-white"
                    onClick={handleAddInternalNote}
                    disabled={!newInternalNote.trim()}
                  >
                    Add Note
                  </Button>
                </div>
                <div className="space-y-3">
                  {selectedOrder.internalNotes.length === 0 ? (
                    <p className="text-sm text-[#78746e] text-center py-4">
                      No notes yet
                    </p>
                  ) : (
                    [...selectedOrder.internalNotes]
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((note) => (
                        <div
                          key={note.id}
                          className="p-3 bg-[#f9f7f4] rounded-lg border border-[#2d5a3d]/10"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-[#1c1917]">{note.adminName}</span>
                            <span className="text-xs text-[#78746e]">
                              {new Date(note.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-[#1c1917]">{note.text}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Invoice preview */}
              <div className="p-6 bg-[#f0f0f0]">
                <div className="shadow-xl rounded overflow-hidden">
                  <OrderInvoice
                    order={selectedOrder}
                    invoiceRef={invoiceRef}
                    settings={settings}
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}