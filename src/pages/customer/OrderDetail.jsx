import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCustomerData } from "../../context/CustomerDataContext";
import {
  ORDER_STATUS_LABELS,
  TRACKING_STEPS,
} from "../../services/customerStore";
import "./Customer.css";

function StarPicker({ value, onChange, label }) {
  return (
    <div className="customer-field">
      <label>{label}</label>
      <div className="customer-stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={n <= value ? "is-on" : ""}
            onClick={() => onChange(n)}
            aria-label={`${n} stars`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function OrderDetail() {
  const { orderId } = useParams();
  const { orders, cancelCustomerOrder, submitRating } = useCustomerData();
  const order = orders.find((o) => o.id === orderId);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [ratings, setRatings] = useState({
    product: 5,
    seller: 5,
    delivery: 5,
  });

  if (!order) {
    return (
      <div className="customer-page">
        <h1 className="customer-page__title">Order not found</h1>
        <Link to="/orders" className="customer-btn customer-btn--ghost">
          Back to orders
        </Link>
      </div>
    );
  }

  const statusIndex = TRACKING_STEPS.indexOf(order.status);
  const canCancel = ![
    "DELIVERED",
    "CANCELLED",
    "OUT_FOR_DELIVERY",
  ].includes(order.status);

  const onCancel = () => {
    setError("");
    try {
      cancelCustomerOrder(order.id);
      setMessage("Order cancelled.");
    } catch (err) {
      setError(err.message);
    }
  };

  const onRate = (e) => {
    e.preventDefault();
    setError("");
    try {
      submitRating(order.id, ratings);
      setMessage("Thanks — product, seller, and delivery rated.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="customer-page">
      <div className="customer-page__head">
        <div>
          <h1 className="customer-page__title">Order #{order.id.slice(-8)}</h1>
          <p className="customer-page__lede">
            {ORDER_STATUS_LABELS[order.status]} · {order.paymentMethod} · ₹
            {order.total}
          </p>
        </div>
        <Link to="/orders" className="customer-btn customer-btn--ghost">
          All orders
        </Link>
      </div>

      {error ? <p className="customer-error">{error}</p> : null}
      {message ? <p className="customer-success">{message}</p> : null}

      <div className="customer-panel">
        <h2 className="customer-panel__title">Tracking</h2>
        {order.status === "CANCELLED" ? (
          <p className="customer-empty">This order was cancelled.</p>
        ) : (
          <div className="customer-track">
            {TRACKING_STEPS.map((step, idx) => {
              const done = statusIndex >= idx;
              const current = order.status === step;
              return (
                <div
                  key={step}
                  className={`customer-track__step${
                    done ? " is-done" : ""
                  }${current ? " is-current" : ""}`}
                >
                  <span className="customer-track__dot" />
                  {ORDER_STATUS_LABELS[step]}
                </div>
              );
            })}
          </div>
        )}
        {canCancel ? (
          <button
            type="button"
            className="customer-btn customer-btn--danger"
            onClick={onCancel}
          >
            Cancel order
          </button>
        ) : null}
      </div>

      <div className="customer-panel">
        <h2 className="customer-panel__title">Items</h2>
        <div className="customer-list">
          {order.items.map((item) => (
            <div key={item.productId + item.name} className="customer-list-item">
              <div>
                <h3>
                  {item.name} × {item.qty}
                </h3>
                <p>{item.sellerName}</p>
              </div>
              <p>₹{item.price * item.qty}</p>
            </div>
          ))}
        </div>
        <p>
          Deliver to: {order.address.line1}, {order.address.city} —{" "}
          {order.address.pincode}
        </p>
      </div>

      {order.status === "DELIVERED" ? (
        <div className="customer-panel">
          <h2 className="customer-panel__title">Rate your experience</h2>
          {order.ratings ? (
            <p className="customer-empty">
              Rated — Product {order.ratings.product}/5 · Seller{" "}
              {order.ratings.seller}/5 · Delivery {order.ratings.delivery}/5
            </p>
          ) : (
            <form className="customer-form" onSubmit={onRate}>
              <StarPicker
                label="Rate product"
                value={ratings.product}
                onChange={(n) => setRatings((r) => ({ ...r, product: n }))}
              />
              <StarPicker
                label="Rate seller"
                value={ratings.seller}
                onChange={(n) => setRatings((r) => ({ ...r, seller: n }))}
              />
              <StarPicker
                label="Rate delivery"
                value={ratings.delivery}
                onChange={(n) => setRatings((r) => ({ ...r, delivery: n }))}
              />
              <div className="customer-actions">
                <button
                  type="submit"
                  className="customer-btn customer-btn--primary"
                >
                  Submit ratings
                </button>
              </div>
            </form>
          )}
        </div>
      ) : null}
    </div>
  );
}
