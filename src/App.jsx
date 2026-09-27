import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import PlaceholderPage from "./pages/public/PlaceholderPage";

import SellerLogin from "./pages/seller/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import RequireSeller from "./pages/seller/RequireSeller";
import Dashboard from "./pages/seller/Dashboard";
import Products from "./pages/seller/Products";
import ProductForm from "./pages/seller/ProductForm";
import Orders from "./pages/seller/Orders";
import Deliveries from "./pages/seller/Deliveries";
import Earnings from "./pages/seller/Earnings";
import Reviews from "./pages/seller/Reviews";
import Profile from "./pages/seller/Profile";

import CustomerLogin from "./pages/customer/CustomerLogin";
import RequireCustomer from "./pages/customer/RequireCustomer";
import CustomerProducts from "./pages/customer/Products";
import ProductDetail from "./pages/customer/ProductDetail";
import CustomerProfile from "./pages/customer/Profile";
import Addresses from "./pages/customer/Addresses";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import CustomerOrders from "./pages/customer/Orders";
import OrderDetail from "./pages/customer/OrderDetail";
import Wishlist from "./pages/customer/Wishlist";
import Subscriptions from "./pages/customer/Subscriptions";
import Notifications from "./pages/customer/Notifications";

import MiddlemanLogin from "./pages/middleman/MiddlemanLogin";
import MiddlemanLayout from "./pages/middleman/MiddlemanLayout";
import RequireMiddleman from "./pages/middleman/RequireMiddleman";
import MiddlemanDashboard from "./pages/middleman/Dashboard";
import AssignedOrders from "./pages/middleman/AssignedOrders";
import MiddlemanPickup from "./pages/middleman/Pickup";
import MiddlemanDeliveries from "./pages/middleman/Deliveries";
import MiddlemanEarnings from "./pages/middleman/Earnings";
import MiddlemanProfile from "./pages/middleman/Profile";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import RequireAdmin from "./pages/admin/RequireAdmin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminSellers from "./pages/admin/Sellers";
import AdminMiddlemen from "./pages/admin/Middlemen";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminPayments from "./pages/admin/Payments";
import AdminComplaints from "./pages/admin/Complaints";
import AdminAnalytics from "./pages/admin/Analytics";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<CustomerProducts />} />
        <Route path="products/:productId" element={<ProductDetail />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<CustomerLogin />} />

        <Route element={<RequireCustomer />}>
          <Route path="account" element={<CustomerProfile />} />
          <Route path="account/addresses" element={<Addresses />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="orders/:orderId" element={<OrderDetail />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="subscription" element={<Subscriptions />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        <Route
          path="*"
          element={
            <PlaceholderPage
              title="Page not found"
              blurb="That route isn’t set up yet. Head back to the home page."
            />
          }
        />
      </Route>

      <Route path="/seller/login" element={<SellerLogin />} />
      <Route element={<RequireSeller />}>
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:productId/edit" element={<ProductForm />} />
          <Route path="orders" element={<Orders />} />
          <Route path="deliveries" element={<Deliveries />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/middleman/login" element={<MiddlemanLogin />} />
      <Route element={<RequireMiddleman />}>
        <Route path="/middleman" element={<MiddlemanLayout />}>
          <Route index element={<MiddlemanDashboard />} />
          <Route path="assigned" element={<AssignedOrders />} />
          <Route path="pickup" element={<MiddlemanPickup />} />
          <Route path="deliveries" element={<MiddlemanDeliveries />} />
          <Route path="earnings" element={<MiddlemanEarnings />} />
          <Route path="profile" element={<MiddlemanProfile />} />
        </Route>
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sellers" element={<AdminSellers />} />
          <Route path="middlemen" element={<AdminMiddlemen />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Route>
    </Routes>
  );
}
