import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductsCatalog from "./pages/ProductsCatalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Wholesale from "./pages/Wholesale";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Inventory from "./pages/dashboard/Inventory";
import Products from "./pages/dashboard/Products";
import Orders from "./pages/dashboard/Orders";
import Customers from "./pages/dashboard/Customers";
import DashboardBlog from "./pages/dashboard/Blog";
import Analytics from "./pages/dashboard/Analytics";
import Settings from "./pages/dashboard/Settings";
import Coupons from "./pages/dashboard/Coupons";
import Reviews from "./pages/dashboard/Reviews";
import PurchaseOrders from "./pages/dashboard/PurchaseOrders";
import AdminUsers from "./pages/dashboard/AdminUsers";
import FAQ from "./pages/FAQ";
import BrewingGuides from "./pages/BrewingGuides";
import BrewingGuideDetail from "./pages/BrewingGuideDetail";
import ShippingReturns from "./pages/ShippingReturns";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import OrderConfirmed from "./pages/OrderConfirmed";
import Subscribe from "./pages/Subscribe";
import Sourcing from "./pages/Sourcing";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Careers from "./pages/Careers";
import Login from "./pages/Login";
import Wishlist from "./pages/Wishlist";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/himmat_admin_8526",
    Component: Login,
  },
  {
    path: "/about",
    Component: About,
  },
  {
    path: "/about/sourcing",
    Component: Sourcing,
  },
  {
    path: "/contact",
    Component: Contact,
  },
  {
    path: "/products",
    Component: ProductsCatalog,
  },
  {
    path: "/products/:id",
    Component: ProductDetail,
  },
  {
    path: "/collections",
    Component: Collections,
  },
  {
    path: "/collections/:slug",
    Component: CollectionDetail,
  },
  {
    path: "/cart",
    Component: Cart,
  },
  {
    path: "/wishlist",
    Component: Wishlist,
  },
  {
    path: "/checkout",
    Component: Checkout,
  },
  {
    path: "/order-confirmed",
    Component: OrderConfirmed,
  },
  {
    path: "/blog",
    Component: Blog,
  },
  {
    path: "/blog/:slug",
    Component: BlogPost,
  },
  {
    path: "/wholesale",
    Component: Wholesale,
  },
  {
    path: "/faq",
    Component: FAQ,
  },
  {
    path: "/brewing-guides",
    Component: BrewingGuides,
  },
  {
    path: "/brewing-guides/:slug",
    Component: BrewingGuideDetail,
  },
  {
    path: "/subscribe",
    Component: Subscribe,
  },
  {
    path: "/shipping-returns",
    Component: ShippingReturns,
  },
  {
    path: "/privacy-policy",
    Component: PrivacyPolicy,
  },
  {
    path: "/terms",
    Component: Terms,
  },
  {
    path: "/careers",
    Component: Careers,
  },
  {
    path: "/himmat_admin_8526/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
              {
                index: true,
                Component: DashboardHome,
              },
              {
                path: "inventory",
                Component: Inventory,
              },
              {
                path: "products",
                Component: Products,
              },
      {
        path: "orders",
        Component: Orders,
      },
      {
        path: "purchase-orders",
        Component: PurchaseOrders,
      },
      {
        path: "customers",
        Component: Customers,
      },
      {
        path: "coupons",
        Component: Coupons,
      },
      {
        path: "reviews",
        Component: Reviews,
      },
      {
        path: "blog",
        Component: DashboardBlog,
      },
      {
        path: "analytics",
        Component: Analytics,
      },
      {
        path: "settings",
        Component: Settings,
      },
      {
        path: "admin-users",
        Component: AdminUsers,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
