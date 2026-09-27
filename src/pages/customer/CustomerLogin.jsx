import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Customer.css";

export default function CustomerLogin() {
  const { isCustomer, loginAsCustomer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/products";
  const [error, setError] = useState("");

  if (isCustomer) return <Navigate to={from} replace />;

  const enterDemo = () => {
    setError("");
    try {
      loginAsCustomer({
        email: "customer@freshfarm.demo",
        password: "customer123",
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="customer-auth">
      <div className="customer-auth__panel">
        <p className="customer-auth__brand">FreshFarm</p>
        <h1>Customer sign in</h1>
        <p className="customer-auth__lede">
          Order dairy, manage deliveries, and run your milk subscription.
        </p>

        {error ? <p className="customer-error">{error}</p> : null}

        <div className="customer-actions" style={{ marginTop: "0.5rem" }}>
          <button
            type="button"
            className="customer-btn customer-btn--primary"
            onClick={enterDemo}
          >
            Continue as demo customer
          </button>
        </div>

        <p className="customer-auth__hint">
          No email or password — one click opens the customer demo.
        </p>
        <Link to="/seller/login" className="customer-auth__seller">
          Farmer? Open seller portal →
        </Link>
      </div>
    </div>
  );
}
