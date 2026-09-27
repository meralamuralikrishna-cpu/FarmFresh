import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../seller/SellerLayout.css";
import "../seller/SellerAuth.css";

export default function AdminLogin() {
  const { isAdmin, loginAsAdmin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  if (isAdmin) return <Navigate to="/admin" replace />;

  const enterDemo = () => {
    setError("");
    try {
      loginAsAdmin({ email: "admin@freshfarm.demo", password: "admin123" });
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="seller-auth">
      <div className="seller-auth__panel">
        <p className="seller-auth__brand">FreshFarm</p>
        <h1>Admin control center</h1>
        <p className="seller-auth__lede">
          Manage users, products, orders, payments, and platform analytics.
        </p>

        {error ? <p className="seller-error">{error}</p> : null}

        <div className="seller-actions" style={{ marginTop: "0.5rem" }}>
          <button
            type="button"
            className="seller-btn seller-btn--primary"
            onClick={enterDemo}
          >
            Continue as demo admin
          </button>
        </div>

        <p className="seller-auth__hint">
          No email or password — one click opens the admin demo.
        </p>
        <Link to="/" className="seller-auth__back">
          ← Back to storefront
        </Link>
      </div>
    </div>
  );
}
