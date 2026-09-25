import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./SellerLayout.css";
import "./SellerAuth.css";

export default function SellerLogin() {
  const { isSeller, login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    farmName: "",
    email: "",
    phone: "",
    password: "",
  });

  if (isSeller) return <Navigate to="/seller" replace />;

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        login({ email: form.email, password: form.password });
      } else {
        if (!form.name.trim() || !form.farmName.trim()) {
          throw new Error("Name and farm name are required.");
        }
        register({
          name: form.name.trim(),
          farmName: form.farmName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
        });
      }
      navigate("/seller");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  const fillDemo = () => {
    setMode("login");
    setForm((f) => ({
      ...f,
      email: "farmer@pail.demo",
      password: "farmer123",
    }));
  };

  return (
    <div className="seller-auth">
      <div className="seller-auth__panel">
        <p className="seller-auth__brand">Pail</p>
        <h1>{mode === "login" ? "Seller sign in" : "Register as farmer"}</h1>
        <p className="seller-auth__lede">
          Manage products, stock, orders, and deliveries from your farm
          workspace.
        </p>

        <div className="seller-auth__tabs" role="tablist">
          <button
            type="button"
            className={mode === "login" ? "is-active" : ""}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "is-active" : ""}
            onClick={() => {
              setMode("register");
              setError("");
            }}
          >
            Register
          </button>
        </div>

        {error ? <p className="seller-error">{error}</p> : null}

        <form className="seller-form" onSubmit={onSubmit}>
          {mode === "register" ? (
            <>
              <div className="seller-field">
                <label htmlFor="name">Your name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="seller-field">
                <label htmlFor="farmName">Farm name</label>
                <input
                  id="farmName"
                  name="farmName"
                  value={form.farmName}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="seller-field">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  required
                />
              </div>
            </>
          ) : null}

          <div className="seller-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>
          <div className="seller-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
              minLength={6}
            />
          </div>

          <div className="seller-actions">
            <button type="submit" className="seller-btn seller-btn--primary">
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
            {mode === "login" ? (
              <button
                type="button"
                className="seller-btn seller-btn--ghost"
                onClick={fillDemo}
              >
                Use demo account
              </button>
            ) : null}
          </div>
        </form>

        <p className="seller-auth__hint">
          Demo: farmer@pail.demo / farmer123
        </p>
        <Link to="/" className="seller-auth__back">
          ← Back to storefront
        </Link>
      </div>
    </div>
  );
}
