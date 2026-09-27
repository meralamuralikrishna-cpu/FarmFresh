import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCustomerData } from "../../context/CustomerDataContext";
import { PAYMENT_METHODS } from "../../services/customerStore";
import "./Customer.css";

export default function Checkout() {
  const { cart, cartSum, addresses, checkout } = useCustomerData();
  const navigate = useNavigate();
  const defaultAddr =
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || "";
  const [addressId, setAddressId] = useState(defaultAddr);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [error, setError] = useState("");

  if (cart.length === 0) {
    return (
      <div className="customer-page">
        <h1 className="customer-page__title">Checkout</h1>
        <p className="customer-empty">Your cart is empty.</p>
        <Link to="/products" className="customer-btn customer-btn--primary">
          Browse products
        </Link>
      </div>
    );
  }

  const onPlace = (e) => {
    e.preventDefault();
    setError("");
    try {
      const order = checkout({ addressId, paymentMethod });
      navigate(`/orders/${order.id}`, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="customer-page">
      <div className="customer-page__head">
        <div>
          <h1 className="customer-page__title">Checkout</h1>
          <p className="customer-page__lede">
            Pay with UPI, Card, or Cash on Delivery.
          </p>
        </div>
      </div>

      <div className="customer-panel">
        <h2 className="customer-panel__title">Order summary</h2>
        <div className="customer-list">
          {cart.map((item) => (
            <div key={item.productId} className="customer-list-item">
              <div>
                <h3>
                  {item.name} × {item.qty}
                </h3>
                <p>{item.sellerName}</p>
              </div>
              <p className="customer-card__price">₹{item.price * item.qty}</p>
            </div>
          ))}
        </div>
        <p className="customer-card__price">Total ₹{cartSum}</p>
      </div>

      <div className="customer-panel">
        <h2 className="customer-panel__title">Delivery & payment</h2>
        {error ? <p className="customer-error">{error}</p> : null}
        {addresses.length === 0 ? (
          <p className="customer-empty">
            Add an address first.{" "}
            <Link to="/account/addresses">Manage addresses</Link>
          </p>
        ) : (
          <form className="customer-form" onSubmit={onPlace}>
            <div className="customer-field">
              <label htmlFor="addressId">Delivery address</label>
              <select
                id="addressId"
                value={addressId}
                onChange={(e) => setAddressId(e.target.value)}
                required
              >
                {addresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label} — {a.line1}, {a.city}
                  </option>
                ))}
              </select>
            </div>
            <div className="customer-field">
              <label>Payment method</label>
              <div className="customer-chips">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`customer-chip${
                      paymentMethod === m ? " is-active" : ""
                    }`}
                    onClick={() => setPaymentMethod(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="customer-actions">
              <button type="submit" className="customer-btn customer-btn--primary">
                Place order
              </button>
              <Link to="/cart" className="customer-btn customer-btn--ghost">
                Back to cart
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
