import { useState } from "react";
import { useCustomerData } from "../../context/CustomerDataContext";
import "./Customer.css";

const empty = {
  label: "",
  line1: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  isDefault: false,
};

export default function Addresses() {
  const { addresses, addNewAddress, editAddress, removeAddress } =
    useCustomerData();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    try {
      addNewAddress({
        label: form.label.trim(),
        line1: form.line1.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        phone: form.phone.trim(),
        isDefault: form.isDefault,
      });
      setForm(empty);
      setMessage("Address saved.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="customer-page">
      <div className="customer-page__head">
        <div>
          <h1 className="customer-page__title">Addresses</h1>
          <p className="customer-page__lede">
            Manage delivery locations for checkout and subscriptions.
          </p>
        </div>
      </div>

      <div className="customer-panel">
        <h2 className="customer-panel__title">Saved addresses</h2>
        {addresses.length === 0 ? (
          <p className="customer-empty">No addresses yet.</p>
        ) : (
          <div className="customer-list">
            {addresses.map((a) => (
              <div key={a.id} className="customer-list-item">
                <div>
                  <h3>
                    {a.label}{" "}
                    {a.isDefault ? (
                      <span className="customer-badge">Default</span>
                    ) : null}
                  </h3>
                  <p>
                    {a.line1}, {a.city}, {a.state} — {a.pincode}
                  </p>
                  <p>{a.phone}</p>
                </div>
                <div className="customer-actions">
                  {!a.isDefault ? (
                    <button
                      type="button"
                      className="customer-btn customer-btn--ghost"
                      onClick={() => editAddress(a.id, { isDefault: true })}
                    >
                      Make default
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="customer-btn customer-btn--danger"
                    onClick={() => removeAddress(a.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="customer-panel">
        <h2 className="customer-panel__title">Add address</h2>
        {error ? <p className="customer-error">{error}</p> : null}
        {message ? <p className="customer-success">{message}</p> : null}
        <form className="customer-form" onSubmit={onSubmit}>
          <div className="customer-form__row customer-form__row--2">
            <div className="customer-field">
              <label htmlFor="label">Label</label>
              <input
                id="label"
                name="label"
                placeholder="Home / Office"
                value={form.label}
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
            <label htmlFor="line1">Street address</label>
            <input
              id="line1"
              name="line1"
              value={form.line1}
              onChange={onChange}
              required
            />
          </div>
          <div className="customer-form__row customer-form__row--2">
            <div className="customer-field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                value={form.city}
                onChange={onChange}
                required
              />
            </div>
            <div className="customer-field">
              <label htmlFor="state">State</label>
              <input
                id="state"
                name="state"
                value={form.state}
                onChange={onChange}
                required
              />
            </div>
          </div>
          <div className="customer-field">
            <label htmlFor="pincode">Pincode</label>
            <input
              id="pincode"
              name="pincode"
              value={form.pincode}
              onChange={onChange}
              required
            />
          </div>
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={onChange}
            />
            Set as default
          </label>
          <div className="customer-actions">
            <button type="submit" className="customer-btn customer-btn--primary">
              Save address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
