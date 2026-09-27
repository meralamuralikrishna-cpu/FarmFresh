import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../seller/SellerLayout.css";
import "../seller/SellerAuth.css";

export default function MiddlemanLogin() {
  const { isMiddleman, loginAsMiddleman } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  if (isMiddleman) return <Navigate to="/middleman" replace />;

  const enterDemo = () => {
    setError("");
    try {
      loginAsMiddleman({
        email: "delivery@freshfarm.demo",
        password: "delivery123",
      });
      navigate("/middleman");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="seller-auth">
      <div className="seller-auth__panel">
        <p className="seller-auth__brand">FreshFarm</p>
        <h1>Delivery sign in</h1>
        <p className="seller-auth__lede">
          Accept pickups, deliver milk, and track your earnings.
        </p>

        {error ? <p className="seller-error">{error}</p> : null}

        <div className="seller-actions" style={{ marginTop: "0.5rem" }}>
          <button
            type="button"
            className="seller-btn seller-btn--primary"
            onClick={enterDemo}
          >
            Continue as demo delivery partner
          </button>
        </div>

        <p className="seller-auth__hint">
          No email or password — one click opens the delivery demo.
        </p>
        <Link to="/" className="seller-auth__back">
          ← Back to storefront
        </Link>
      </div>
    </div>
  );
}
