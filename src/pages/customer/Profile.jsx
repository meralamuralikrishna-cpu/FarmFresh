import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCustomerData } from "../../context/CustomerDataContext";
import "./Customer.css";

export default function Profile() {
  const { customer, logoutCustomer } = useAuth();
  const { profile, saveProfile } = useCustomerData();
  const [form, setForm] = useState({
    name: profile?.name || "",
    email: profile?.email || customer?.email || "",
    phone: profile?.phone || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    try {
      saveProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      setMessage("Profile updated.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="customer-page">
      <div className="customer-page__head">
        <div>
          <h1 className="customer-page__title">Profile</h1>
          <p className="customer-page__lede">
            Your account details for orders and subscriptions.
          </p>
        </div>
        <div className="customer-actions">
          <Link to="/account/addresses" className="customer-btn customer-btn--ghost">
            Manage addresses
          </Link>
          <button
            type="button"
            className="customer-btn customer-btn--ghost"
            onClick={logoutCustomer}
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="customer-panel">
        {error ? <p className="customer-error">{error}</p> : null}
        {message ? <p className="customer-success">{message}</p> : null}
        <form className="customer-form" onSubmit={onSubmit}>
          <div className="customer-form__row customer-form__row--2">
            <div className="customer-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>
            <div className="customer-field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={onChange}
                required
              />
            </div>
          </div>
          <div className="customer-field">
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
          <div className="customer-actions">
            <button type="submit" className="customer-btn customer-btn--primary">
              Save profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
