import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

import Navbar          from "./components/common/Navbar.jsx";
import Footer          from "./components/common/Footer.jsx";
import ProtectedRoute  from "./components/common/ProtectedRoute.jsx";
import VendorRoute     from "./components/common/VendorRoute.jsx";

/* Pages */
import HomePage          from "./pages/HomePage.jsx";
import FoodListingPage   from "./pages/FoodListingPage.jsx";
import FoodDetailPage    from "./pages/FoodDetailPage.jsx";
import CartPage          from "./pages/CartPage.jsx";
import CheckoutPage      from "./pages/CheckoutPage.jsx";
import OrderSuccessPage  from "./pages/OrderSuccessPage.jsx";
import OrdersPage        from "./pages/OrdersPage.jsx";
import StoriesPage       from "./pages/StoriesPage.jsx";
import StoryDetailPage   from "./pages/StoryDetailPage.jsx";
import LoginPage         from "./pages/LoginPage.jsx";
import RegisterPage      from "./pages/RegisterPage.jsx";
import ProfilePage       from "./pages/ProfilePage.jsx";
import FestivalPage      from "./pages/FestivalPage.jsx";
import RegionPage        from "./pages/RegionPage.jsx";
import VendorDashboard   from "./pages/vendor/VendorDashboard.jsx";
import VendorFoods       from "./pages/vendor/VendorFoods.jsx";
import VendorAddFood     from "./pages/vendor/VendorAddFood.jsx";
import VendorOrders      from "./pages/vendor/VendorOrders.jsx";
import NotFoundPage      from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public */}
                <Route path="/"                  element={<HomePage />} />
                <Route path="/foods"             element={<FoodListingPage />} />
                <Route path="/foods/:slug"       element={<FoodDetailPage />} />
                <Route path="/stories"           element={<StoriesPage />} />
                <Route path="/stories/:slug"     element={<StoryDetailPage />} />
                <Route path="/festival/:fest"    element={<FestivalPage />} />
                <Route path="/region/:region"    element={<RegionPage />} />
                <Route path="/login"             element={<LoginPage />} />
                <Route path="/register"          element={<RegisterPage />} />

                {/* Customer protected */}
                <Route path="/cart"              element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/checkout"          element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
                <Route path="/orders"            element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                <Route path="/profile"           element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                {/* Vendor protected */}
                <Route path="/vendor/dashboard"  element={<VendorRoute><VendorDashboard /></VendorRoute>} />
                <Route path="/vendor/foods"      element={<VendorRoute><VendorFoods /></VendorRoute>} />
                <Route path="/vendor/foods/add"  element={<VendorRoute><VendorAddFood /></VendorRoute>} />
                <Route path="/vendor/orders"     element={<VendorRoute><VendorOrders /></VendorRoute>} />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#fdf6e8",
                color: "#3d2a0a",
                border: "1px solid #e8d5a0",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "#c4431a", secondary: "#fdf6e8" } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}