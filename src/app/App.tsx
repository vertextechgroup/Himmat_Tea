import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { TranslationProvider } from "../context/TranslationContext";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import { StoreProvider } from "../context/StoreContext";
import { WishlistProvider } from "../context/WishlistContext";

export default function App() {
  return (
    <TranslationProvider>
      <StoreProvider>
        <CartProvider>
          <WishlistProvider>
            <AuthProvider>
              <RouterProvider router={router} />
              <Toaster />
            </AuthProvider>
          </WishlistProvider>
        </CartProvider>
      </StoreProvider>
    </TranslationProvider>
  );
}
