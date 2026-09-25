import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/public/Home";
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

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="products"
          element={
            <PlaceholderPage
              title="Products"
              blurb="Bottled milk and dairy essentials will live here."
            />
          }
        />
        <Route
          path="about"
          element={
            <PlaceholderPage
              title="About"
              blurb="The farms and people behind FreshFarm will be introduced here."
            />
          }
        />
        <Route
          path="contact"
          element={
            <PlaceholderPage
              title="Contact"
              blurb="Reach the FreshFarm team — form coming soon."
            />
          }
        />
        <Route
          path="login"
          element={
            <PlaceholderPage
              title="Sign in"
              blurb="Customer login will land here. Farmers can sign in at Seller portal."
            />
          }
        />
        <Route
          path="subscription"
          element={
            <PlaceholderPage
              title="Subscriptions"
              blurb="Weekly and custom milk plans will be configured here."
            />
          }
        />
        <Route
          path="orders"
          element={
            <PlaceholderPage
              title="Orders"
              blurb="Your delivery history will show up here after sign-in."
            />
          }
        />
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
    </Routes>
  );
}
