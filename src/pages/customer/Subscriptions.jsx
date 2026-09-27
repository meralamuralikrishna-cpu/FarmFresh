import { useState } from "react";
import { Link } from "react-router-dom";
import { useCustomerData } from "../../context/CustomerDataContext";
import {
  SUBSCRIPTION_FREQUENCIES,
  getCatalog,
} from "../../services/customerStore";
import "./Customer.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Subscriptions() {
  const {
    subscriptions,
    startSubscription,
    editSubscription,
    skipDelivery,
    pauseSub,
    resumeSub,
    endSubscription,
  } = useCustomerData();
  const milkProducts = getCatalog().filter(
    (p) => p.available && (p.category === "Cow Milk" || p.category === "Buffalo Milk")
  );
  const [form, setForm] = useState({
    productId: milkProducts[0]?.id || "",
    qty: 1,
    frequency: "daily",
    customDays: ["Mon", "Wed", "Fri"],
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const freqLabel = (id) =>
    SUBSCRIPTION_FREQUENCIES.find((f) => f.id === id)?.label || id;

  const onCreate = (e) => {
    e.preventDefault();
    setError("");
    try {
      startSubscription({
        productId: form.productId,
        qty: Number(form.qty),
        frequency: form.frequency,
        customDays: form.frequency === "custom" ? form.customDays : [],
      });
      setMessage("Subscription created.");
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleDay = (day) => {
    setForm((f) => ({
      ...f,
      customDays: f.customDays.includes(day)
        ? f.customDays.filter((d) => d !== day)
        : [...f.customDays, day],
    }));
  };

  return (
    <div className="customer-page">
      <div className="customer-page__head">
        <div>
          <h1 className="customer-page__title">Subscriptions</h1>
          <p className="customer-page__lede">
            Daily milk, alternate days, weekly, or a custom schedule.
          </p>
        </div>
      </div>

      <div className="customer-panel">
        <h2 className="customer-panel__title">Your plans</h2>
        {subscriptions.length === 0 ? (
          <p className="customer-empty">No active subscriptions.</p>
        ) : (
          <div className="customer-list">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="customer-list-item">
                <div>
                  <h3>
                    {sub.productName}{" "}
                    <span
                      className={`customer-badge${
                        sub.status === "active"
                          ? ""
                          : sub.status === "paused"
                            ? " customer-badge--warn"
                            : " customer-badge--muted"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </h3>
                  <p>
                    {freqLabel(sub.frequency)} · {sub.qty} {sub.unit} · ₹
                    {sub.price}/{sub.unit}
                  </p>
                  <p>
                    Next delivery: {sub.nextDelivery}
                    {sub.customDays?.length
                      ? ` · Days: ${sub.customDays.join(", ")}`
                      : ""}
                  </p>
                  {sub.skippedDates?.length ? (
                    <p>Skipped: {sub.skippedDates.join(", ")}</p>
                  ) : null}
                </div>
                <div className="customer-actions">
                  {sub.status !== "cancelled" ? (
                    <>
                      <div className="customer-qty">
                        <button
                          type="button"
                          disabled={sub.qty <= 1}
                          onClick={() =>
                            editSubscription(sub.id, { qty: sub.qty - 1 })
                          }
                        >
                          −
                        </button>
                        <span>{sub.qty}</span>
                        <button
                          type="button"
                          onClick={() =>
                            editSubscription(sub.id, { qty: sub.qty + 1 })
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="customer-btn customer-btn--ghost"
                        onClick={() => skipDelivery(sub.id)}
                      >
                        Skip delivery
                      </button>
                      {sub.status === "active" ? (
                        <button
                          type="button"
                          className="customer-btn customer-btn--ghost"
                          onClick={() => pauseSub(sub.id)}
                        >
                          Pause
                        </button>
                      ) : sub.status === "paused" ? (
                        <button
                          type="button"
                          className="customer-btn customer-btn--primary"
                          onClick={() => resumeSub(sub.id)}
                        >
                          Resume
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="customer-btn customer-btn--danger"
                        onClick={() => endSubscription(sub.id)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="customer-panel">
        <h2 className="customer-panel__title">New subscription</h2>
        {error ? <p className="customer-error">{error}</p> : null}
        {message ? <p className="customer-success">{message}</p> : null}
        {milkProducts.length === 0 ? (
          <p className="customer-empty">
            No milk products available.{" "}
            <Link to="/products">Browse catalog</Link>
          </p>
        ) : (
          <form className="customer-form" onSubmit={onCreate}>
            <div className="customer-form__row customer-form__row--2">
              <div className="customer-field">
                <label htmlFor="productId">Product</label>
                <select
                  id="productId"
                  value={form.productId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, productId: e.target.value }))
                  }
                  required
                >
                  {milkProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.price}/{p.unit}
                    </option>
                  ))}
                </select>
              </div>
              <div className="customer-field">
                <label htmlFor="qty">Quantity</label>
                <input
                  id="qty"
                  type="number"
                  min={1}
                  value={form.qty}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, qty: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div className="customer-field">
              <label htmlFor="frequency">Schedule</label>
              <select
                id="frequency"
                value={form.frequency}
                onChange={(e) =>
                  setForm((f) => ({ ...f, frequency: e.target.value }))
                }
              >
                {SUBSCRIPTION_FREQUENCIES.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            {form.frequency === "custom" ? (
              <div className="customer-field">
                <label>Custom days</label>
                <div className="customer-check-days">
                  {DAYS.map((day) => (
                    <label key={day}>
                      <input
                        type="checkbox"
                        checked={form.customDays.includes(day)}
                        onChange={() => toggleDay(day)}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="customer-actions">
              <button type="submit" className="customer-btn customer-btn--primary">
                Start subscription
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
