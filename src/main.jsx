import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { CartProvider } from "./contexts/CartContext.jsx";
import { WishlistProvider } from "./contexts/WishlistContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

// Lazy load App for faster initial load
const App = lazy(() => import("./App.jsx"));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
          <ScrollToTop/>
            <Suspense fallback={<div>Loading...</div>}>
              <App />
            </Suspense>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
