import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Eye,
  MoreHorizontal,
  Coffee,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { useStore } from "../../../context/StoreContext";
import { useTranslation } from "../../../hooks/useTranslation";
import { BRAND } from "../../../config/brand";

// Helper functions to calculate metrics
const getMonthDate = (monthsAgo: number) => {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() - monthsAgo);
  return date;
};

const getMonthRevenue = (monthDate: Date, orders: any[]) => {
  return orders.reduce((sum, order) => {
    const orderDate = new Date(order.orderDate);
    if (
      orderDate.getFullYear() === monthDate.getFullYear() &&
      orderDate.getMonth() === monthDate.getMonth()
    ) {
      return sum + order.grandTotal;
    }
    return sum;
  }, 0);
};

const getMonthOrders = (monthDate: Date, orders: any[]) => {
  return orders.filter((order) => {
    const orderDate = new Date(order.orderDate);
    return (
      orderDate.getFullYear() === monthDate.getFullYear() &&
      orderDate.getMonth() === monthDate.getMonth()
    );
  }).length;
};

const getMonthCustomers = (monthDate: Date, customers: any[]) => {
  return customers.filter((customer) => {
    // For demo purposes, assume all customers are "active" in the current month
    // In real scenario, you'd track customer join date or last purchase date
    return true;
  }).length;
};

const calculateChange = (current: number, previous: number) => {
  if (previous === 0) return "N/A";
  const change = ((current - previous) / previous) * 100;
  return (change > 0 ? "+" : "") + change.toFixed(1) + "%";
};

const getTopProductsBySales = (products: any[], orders: any[], limit: number = 4) => {
  const productSales = products.map((product) => {
    const totalSold = orders.reduce((sum, order) => {
      const productItems = order.items.filter((item: any) => item.productId === product.id);
      return sum + productItems.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0);
    }, 0);
    const totalRevenue = orders.reduce((sum, order) => {
      const productItems = order.items.filter((item: any) => item.productId === product.id);
      return sum + productItems.reduce((itemSum: number, item: any) => itemSum + (item.price * item.quantity), 0);
    }, 0);
    return { ...product, totalSold, totalRevenue };
  });
  
  return productSales.sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, limit);
};

const downloadReport = (orders: any[]) => {
  // Create CSV content with proper escaping for special characters
  const escapeCSV = (value: any): string => {
    if (value == null) return "";
    const stringValue = String(value);
    if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const headers = ["Order ID", "Customer Name", "Email", "Phone", "Date", "Total (₹)", "Status", "Payment Status"];
  const rows = orders.map(order => [
    order.id,
    order.customerName,
    order.customerEmail,
    order.customerPhone,
    new Date(order.orderDate).toLocaleString(),
    order.grandTotal.toFixed(2),
    order.status,
    order.paymentStatus
  ]);
  
  // Add BOM for UTF-8 compatibility with Excel
  const BOM = "\uFEFF";
  const csvContent = BOM + [
    headers.map(escapeCSV).join(","), 
    ...rows.map(row => row.map(escapeCSV).join(","))
  ].join("\n");
  
  // Create download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${BRAND.companyName.replace(/ /g, '_')}_Orders_Report_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function DashboardHome() {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const { orders, products, customers, addOrder, notifications, getInventoryValue, getLowStockProducts } = useStore();
  
  const inventoryValue = getInventoryValue();
  const lowStockProducts = getLowStockProducts();
  
  // Calculate metrics for current and previous month
  const currentMonth = getMonthDate(0);
  const previousMonth = getMonthDate(1);
  
  const currentMonthRevenue = getMonthRevenue(currentMonth, orders);
  const previousMonthRevenue = getMonthRevenue(previousMonth, orders);
  const revenueChange = calculateChange(currentMonthRevenue, previousMonthRevenue);
  
  const currentMonthOrders = getMonthOrders(currentMonth, orders);
  const previousMonthOrders = getMonthOrders(previousMonth, orders);
  const ordersChange = calculateChange(currentMonthOrders, previousMonthOrders);
  
  const currentMonthCustomers = getMonthCustomers(currentMonth, customers);
  const previousMonthCustomers = getMonthCustomers(previousMonth, customers);
  const customersChange = calculateChange(currentMonthCustomers, previousMonthCustomers);
  
  // Products change (just show 0% for demo since we don't track product creation dates)
  const productsChange = "0.0%";
  
  const topProducts = getTopProductsBySales(products, orders);

  // Calculate order status counts
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const processingOrders = orders.filter(o => o.status === "Processing").length;
  const shippedOrders = orders.filter(o => o.status === "Shipped").length;
  const deliveredOrders = orders.filter(o => o.status === "Delivered").length;

  const stats = [
    {
      title: t("dashboard.home.totalRevenue"),
      value: "₹" + currentMonthRevenue.toLocaleString(),
      change: revenueChange,
      trend: revenueChange.startsWith("+") ? "up" : "down",
      icon: DollarSign,
      color: "from-[#2d5a3d] to-[#0b7c33]",
      bg: "bg-[#2d5a3d]/10",
      badge: t("dashboard.home.thisMonth"),
    },
    {
      title: t("dashboard.home.totalOrders"),
      value: currentMonthOrders.toString(),
      change: ordersChange,
      trend: ordersChange.startsWith("+") ? "up" : "down",
      icon: ShoppingBag,
      color: "from-[#c8a96e] to-[#a88b55]",
      bg: "bg-[#c8a96e]/10",
      badge: `${pendingOrders} ${t("dashboard.home.pending")}`,
    },
    {
      title: t("dashboard.home.customers"),
      value: currentMonthCustomers.toString(),
      change: customersChange,
      trend: customersChange.startsWith("+") ? "up" : "down",
      icon: Users,
      color: "from-[#4a9d7a] to-[#3a8d6a]",
      bg: "bg-[#4a9d7a]/10",
      badge: t("dashboard.home.active"),
    },
    {
      title: t("dashboard.home.products"),
      value: products.length.toString(),
      change: productsChange,
      trend: "up",
      icon: Package,
      color: "from-[#6b7280] to-[#4b5563]",
      bg: "bg-[#6b7280]/10",
      badge: `${products.filter(p => p.status === "Low Stock").length} ${t("dashboard.home.lowStock")}`,
    },
  ];

  const orderStatusSummary = [
    { label: t("dashboard.status.pending"), count: pendingOrders, color: "text-[#92400e]", bg: "bg-[#fef3c7]", icon: Clock },
    { label: t("dashboard.status.processing"), count: processingOrders, color: "text-[#0369a1]", bg: "bg-[#e0f2fe]", icon: Zap },
    { label: t("dashboard.status.shipped"), count: shippedOrders, color: "text-[#7e22ce]", bg: "bg-[#f0e7ff]", icon: Truck },
    { label: t("dashboard.status.delivered"), count: deliveredOrders, color: "text-[#2d5a3d]", bg: "bg-[#e8f5ed]", icon: CheckCircle },
  ];

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-[#e8f5ed] text-[#2d5a3d]";
      case "processing":
        return "bg-[#e0f2fe] text-[#0369a1]";
      case "shipped":
        return "bg-[#f0e7ff] text-[#7e22ce]";
      case "pending":
        return "bg-[#fef3c7] text-[#92400e]";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "refunded":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleTestOrder = () => {
    const customer = customers.length > 0 ? customers[0] : { id: 999, name: "Test Customer", email: "test@example.com", phone: "+91 9876543210" };
    const product = products.length > 0 ? products[0] : { id: 1, name: "Premium Green Tea", price: 249 };
    const orderItems = [{ id: 1, productId: product.id, name: product.name, price: product.price, quantity: 2 }];
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxRate = 0.1;
    const tax = subtotal * taxRate;
    const grandTotal = subtotal + tax;

    addOrder({
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      items: orderItems,
      total: subtotal,
      tax: tax,
      grandTotal: grandTotal,
      status: "Pending",
      paymentStatus: "Paid",
      shippingAddress: "123 Test Street, Test City",
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1c1917]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t("dashboard.home.title")}
          </h1>
          <p className="text-[#78746e] mt-1">{t("dashboard.home.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              try {
                console.log("Downloading report, orders count:", orders.length);
                downloadReport(orders);
                toast.success(t("dashboard.home.reportDownloaded"));
              } catch (error) {
                console.error("Download failed:", error);
                toast.error("Failed to download report. Please try again.");
              }
            }}
            className="px-4 py-2.5 rounded-xl border border-[#2d5a3d]/20 text-[#1c1917] font-medium hover:bg-[#f0f9f4] transition-all duration-200 flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            {t("dashboard.home.downloadReport")}
          </button>
          <button 
            onClick={() => router.push("/himmat_admin_8526/dashboard/orders")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2d5a3d] text-white font-medium hover:bg-[#234832] transition-all duration-200 shadow-md shadow-[#2d5a3d]/20"
          >
            <Plus className="h-4 w-4" />
            {t("dashboard.home.newOrder")}
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-[#fef3c7] border border-[#f59e0b] rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-[#92400e] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[#92400e]">
                {t("dashboard.home.lowStockAlertTitle")}
              </h3>
              <p className="text-[#78350f] mt-1">
                {lowStockProducts.length === 1 
                  ? t("dashboard.home.lowStockProductsText.singular", { count: lowStockProducts.length })
                  : t("dashboard.home.lowStockProductsText.plural", { count: lowStockProducts.length })
                }
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <span
                    key={product.id}
                    className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-[#1c1917] border border-[#f59e0b]/30"
                  >
                    {product.name} ({product.stock} {t("dashboard.common.units")})
                  </span>
                ))}
                {lowStockProducts.length > 5 && (
                  <span className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-[#78350f] border border-[#f59e0b]/30">
                    +{lowStockProducts.length - 5} {t("dashboard.common.more")}
                  </span>
                )}
              </div>
            </div>
            <Button
              className="bg-[#92400e] hover:bg-[#78350f] text-white"
              onClick={() => router.push("/himmat_admin_8526/dashboard/inventory")}
            >
              {t("dashboard.home.manageInventory")}
            </Button>
          </div>
        </div>
      )}

      {/* Order Status Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#2d5a3d]/5">
        <h3 className="text-sm font-semibold text-[#1c1917] mb-4">{t("dashboard.home.orderStatus")}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {orderStatusSummary.map((status) => {
            const Icon = status.icon;
            return (
              <div key={status.label} className="flex items-center gap-3 p-4 rounded-xl bg-[#f9f7f4] hover:bg-[#f0ede8] transition-colors cursor-pointer" onClick={() => router.push("/himmat_admin_8526/dashboard/orders")}>
                <div className={`w-10 h-10 rounded-xl ${status.bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${status.color}`} />
                </div>
                <div>
                  <p className="text-xs text-[#78746e] font-medium">{status.label}</p>
                  <p className={`text-2xl font-bold ${status.color}`}>{status.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <div 
              key={stat.title} 
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-[#2d5a3d]/5 hover:border-[#2d5a3d]/15"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#f9f7f4] text-[#78746e]">
                  {stat.badge}
                </span>
              </div>
              <div className="space-y-2">
                  <p className="text-sm text-[#78746e] font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-[#1c1917]">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 ${
                      stat.trend === "up" ? "text-[#2d5a3d]" : "text-red-600"
                    }`}>
                      <TrendIcon className="h-4 w-4" />
                      <span className="text-sm font-semibold">{stat.change}</span>
                    </div>
                    <span className="text-sm text-[#78746e]">{t("dashboard.home.vsLastMonth")}</span>
                  </div>
                </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#2d5a3d]/5 overflow-hidden">
          <div className="p-6 border-b border-[#2d5a3d]/5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#1c1917]">{t("dashboard.home.recentOrders")}</h2>
              <p className="text-sm text-[#78746e]">{t("dashboard.home.latestOrders")}</p>
            </div>
            <button 
              onClick={() => router.push("/himmat_admin_8526/dashboard/orders")}
              className="flex items-center gap-2 text-[#2d5a3d] font-medium hover:text-[#234832] transition-colors"
            >
              {t("dashboard.home.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-[#78746e] border-b border-[#2d5a3d]/5">
                    <th className="pb-3 font-medium">{t("dashboard.home.orderId")}</th>
                    <th className="pb-3 font-medium">{t("dashboard.home.customer")}</th>
                    <th className="pb-3 font-medium">{t("dashboard.home.date")}</th>
                    <th className="pb-3 font-medium">{t("dashboard.home.total")}</th>
                    <th className="pb-3 font-medium">{t("dashboard.home.status")}</th>
                    <th className="pb-3 font-medium">{t("dashboard.home.action")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d5a3d]/5">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="group hover:bg-[#f9f7f4] transition-colors">
                      <td className="py-4">
                        <span className="font-medium text-[#1c1917]">{order.id}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-[#1c1917]">{order.customerName}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-[#78746e]">{new Date(order.orderDate).toLocaleDateString()}</span>
                      </td>
                      <td className="py-4">
                        <span className="font-semibold text-[#1c1917]">₹{order.grandTotal.toFixed(2)}</span>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyles(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <button className="p-2 rounded-lg hover:bg-[#f0ede8] transition-colors text-[#78746e]">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Products & Quick Actions */}
        <div className="space-y-6">
          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#2d5a3d]/5 overflow-hidden">
            <div className="p-6 border-b border-[#2d5a3d]/5">
              <h2 className="text-lg font-semibold text-[#1c1917]">{t("dashboard.home.topProducts")}</h2>
              <p className="text-sm text-[#78746e]">{t("dashboard.home.thisMonthBestSellers")}</p>
            </div>
            <div className="p-6 space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                      index === 0 ? "from-[#c8a96e] to-[#a88b55]" : 
                      index === 1 ? "from-[#6b7280] to-[#4b5563]" : 
                      index === 2 ? "from-[#92400e] to-[#78350f]" : 
                      "from-[#4a9d7a] to-[#3a8d6a]"
                    } flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-[#1c1917] group-hover:text-[#2d5a3d] transition-colors">
                        {product.name}
                      </p>
                      <p className="text-xs text-[#78746e]">₹{product.totalRevenue.toLocaleString()} ({product.totalSold} units)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      product.status === "In Stock" ? "bg-[#e8f5ed] text-[#2d5a3d]" : 
                      product.status === "Low Stock" ? "bg-[#fef3c7] text-[#92400e]" : 
                      "bg-red-100 text-red-700"
                    }`}>
                      {product.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              <button 
                onClick={() => router.push("/himmat_admin_8526/dashboard/products")}
                className="w-full py-2.5 rounded-xl bg-[#f0f9f4] text-[#2d5a3d] font-medium hover:bg-[#e8f5ed] transition-colors flex items-center justify-center gap-2"
              >
                {t("dashboard.home.viewAllProducts")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-[#2d5a3d] to-[#0b7c33] rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Coffee className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{t("dashboard.home.quickActions")}</h2>
                <p className="text-sm text-white/80">Manage your {BRAND.companyName} business</p>
              </div>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => router.push("/himmat_admin_8526/dashboard/products")}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
              >
                <span className="font-medium flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {t("dashboard.home.addNewProduct")}
                </span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <button 
                onClick={() => router.push("/himmat_admin_8526/dashboard/orders")}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
              >
                <span className="font-medium flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  {t("dashboard.home.processOrders")}
                </span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
