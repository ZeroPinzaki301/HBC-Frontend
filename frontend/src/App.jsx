import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import ProductsPage from "./pages/ProductsPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderHistory from "./pages/OrderHistory";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AccountPage from "./pages/AccountPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import VerifyEmail from "./pages/VerifyEmail";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import AdminVerify from "./pages/AdminVerify";
import AdminDashboard from "./admin/AdminDashboard";
import ManageOrders from "./admin/ManageOrders";
import ManageProducts from "./admin/ManageProducts";
import SalesAnalytics from "./admin/SalesAnalytics";
import UserManagement from "./admin/UserManagement";
import OngoingOrdersPage from "./pages/OngoingOrder";
import OrderDetails from "./admin/OrderDetails";
import AboutPage from "./pages/AboutPage";
import ContactsPage from "./pages/ContactsPage";
import AdminMessages from "./admin/ManageMessages";
import PaymentProof from "./admin/PaymentRecords";
import AdminInventory from "./admin/InventoryManagement";

const App = () => {
  const location = useLocation();

  // Define admin routes (support dynamic routes with a regular expression)
  const adminRoutes = [
    "/admin-dashboard",
    "/admin/manage-orders",
    "/admin/manage-products",
    "/admin/sales-analytics",
    "/admin/user-management",
    "/admin-verify",
    "/admin/messages",
    "/admin/payment-records",
    "/admin/inventory"
  ];

  // Check if the current route is an admin route (dynamic route support)
  const isAdminRoute = adminRoutes.some((route) =>
    location.pathname.startsWith(route)
  ) || location.pathname.startsWith("/admin/manage-orders/");

  // Conditionally render Navbar based on current route
  const showNavbar = !isAdminRoute;

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactsPage />} />



        {/* Protected Routes */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route path="/checkout/:userId" element={<CheckoutPage />} />
        <Route path="/orders/history" element={<OrderHistory />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders/ongoing" element={<OngoingOrdersPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute isAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-orders"
          element={
            <ProtectedRoute isAdmin={true}>
              <ManageOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-products"
          element={
            <ProtectedRoute isAdmin={true}>
              <ManageProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sales-analytics"
          element={
            <ProtectedRoute isAdmin={true}>
              <SalesAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user-management"
          element={
            <ProtectedRoute isAdmin={true}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-orders/:orderId"
          element={
            <ProtectedRoute isAdmin={true}>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute isAdmin={true}>
              <AdminMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payment-records"
          element={
            <ProtectedRoute isAdmin={true}>
              <PaymentProof />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <ProtectedRoute isAdmin={true}>
              <AdminInventory />
            </ProtectedRoute>
          }
        />
        <Route path="/admin-verify" element={<AdminVerify />} />
      </Routes>
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;