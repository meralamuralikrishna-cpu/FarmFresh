import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCustomerData } from "../../context/CustomerDataContext";
import "./Customer.css";

export default function ProductDetail() {
  const { productId } = useParams();
  const { isCustomer } = useAuth();
  const { getProduct, addItemToCart, toggleWish, wishlist, startSubscription } =
    useCustomerData();
  const navigate = useNavigate();
  const product = getProduct(productId);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [frequency, setFrequency] = useState("daily");

  if (!product) {
    return (
      <div className="customer-page">
        <h1 className="customer-page__title">Product not found</h1>
        <Link to="/products" className="customer-btn customer-btn--ghost">
          Back to products
        </Link>
      </div>
    );
  }

  const requireAuth = (fn) => {
    if (!isCustomer) {
      navigate("/login", {
        state: { from: { pathname: `/products/${productId}` } },
      });
      return;
    }
    try {
      setError("");
      fn();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="customer-page">
      <div className="customer-detail-hero">
        <div className="customer-detail-hero__visual" aria-hidden="true" />
        <div>
          <p className="customer-card__cat">{product.category}</p>
          <h1 className="customer-page__title">{product.name}</h1>
          <p className="customer-page__lede">
            {product.sellerName} · ★ {product.rating} · {product.stock} in stock
          </p>
          <p className="customer-card__price" style={{ marginTop: "1rem" }}>
            ₹{product.price} / {product.unit}
          </p>
          <p className="customer-card__meta" style={{ marginTop: "0.75rem" }}>
            {product.description}
          </p>

          {error ? <p className="customer-error">{error}</p> : null}
          {message ? <p className="customer-success">{message}</p> : null}

          <div className="customer-actions" style={{ marginTop: "1.25rem" }}>
            <div className="customer-qty" aria-label="Quantity">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((q) => q + 1)}>
                +
              </button>
            </div>
            <button
              type="button"
              className="customer-btn customer-btn--primary"
              disabled={!product.available}
              onClick={() =>
                requireAuth(() => {
                  addItemToCart(product.id, qty);
                  setMessage("Added to cart.");
                })
              }
            >
              Add to cart
            </button>
            <button
              type="button"
              className="customer-btn customer-btn--ghost"
              onClick={() =>
                requireAuth(() => {
                  const wasSaved = wishlist.includes(product.id);
                  toggleWish(product.id);
                  setMessage(
                    wasSaved
                      ? "Removed from wishlist."
                      : "Saved to wishlist."
                  );
                })
              }
            >
              {wishlist.includes(product.id) ? "♥ Wishlisted" : "♡ Wishlist"}
            </button>
          </div>
        </div>
      </div>

      <div className="customer-panel">
        <h2 className="customer-panel__title">Start a subscription</h2>
        <p className="customer-card__meta" style={{ marginBottom: "1rem" }}>
          Daily, alternate days, weekly, or custom — change anytime.
        </p>
        <div className="customer-form__row customer-form__row--2">
          <div className="customer-field">
            <label htmlFor="freq">Schedule</label>
            <select
              id="freq"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="daily">Daily Milk</option>
              <option value="alternate">Alternate Days</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom Schedule</option>
            </select>
          </div>
        </div>
        <div className="customer-actions" style={{ marginTop: "1rem" }}>
          <button
            type="button"
            className="customer-btn customer-btn--primary"
            disabled={!product.available}
            onClick={() =>
              requireAuth(() => {
                startSubscription({
                  productId: product.id,
                  qty,
                  frequency,
                  customDays:
                    frequency === "custom"
                      ? ["Mon", "Wed", "Fri"]
                      : [],
                });
                setMessage("Subscription started. Manage it under Subscriptions.");
                navigate("/subscription");
              })
            }
          >
            Subscribe
          </button>
          <Link to="/products" className="customer-btn customer-btn--ghost">
            Browse more
          </Link>
        </div>
      </div>
    </div>
  );
}
