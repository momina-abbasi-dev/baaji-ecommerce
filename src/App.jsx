import { lazy, Suspense, useContext } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Services from "./pages/Services";
import FAQ from "./pages/FAQ";
import { AuthContext } from "./contexts/AuthContext";

// Admin Pages
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDashboardHome from "./pages/admin/AdminDashboardHome";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminEvents from "./pages/admin/AdminEvents";

// Lazy load public pages
const HomePage = lazy(() => import("./pages/HomePage"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailed = lazy(() => import("./pages/PaymentFailed"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  // Hide Navbar/Footer on auth & admin pages
  const hideLayout =
    location.pathname.startsWith("/admin") ||
    ["/login", "/signup", "/payment-success", "/payment-failed"].includes(
      location.pathname
    );

  return (
    <div className="container">
      <Suspense fallback={<LoadingSpinner />}>
        {!hideLayout && <Navbar />}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id?" element={<Products />} />
          <Route path="/products/details/:id" element={<ProductDetails />} />
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={isLoggedIn ? <Navigate to="/" /> : <Signup />}
          />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/services" element={<Services />} />
          <Route path="/faqs" element={<FAQ />} />
      
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />

          {/* Protected Routes */}
          <Route
            path="/cart"
            element={isLoggedIn ? <Cart /> : <Navigate to="/login" />}
          />
          <Route
            path="/cart/checkout"
            element={isLoggedIn ? <Checkout /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/wishlist"
            element={isLoggedIn ? <Wishlist /> : <Navigate to="/login" />}
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardHome />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <AdminCategories />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/banners"
            element={
              <AdminRoute>
                <AdminBanners />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/videos"
            element={
              <AdminRoute>
                <AdminVideos />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/events"
            element={
              <AdminRoute>
                <AdminEvents />
              </AdminRoute>
            }
          />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {!hideLayout && <Footer />}
      </Suspense>
    </div>
  );
}

// =========================
// Admin Route Wrapper
// =========================
function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />; // not logged in
  if (user.role !== "admin") return <Navigate to="/" />; // not admin

  return children; // admin access granted
}