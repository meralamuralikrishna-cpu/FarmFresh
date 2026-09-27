import { Link, useNavigate } from "react-router-dom";
import { useCustomerData } from "../../context/CustomerDataContext";
import "./Customer.css";

export default function Cart() {
  const { cart, cartSum, setCartQty } = useCustomerData();
  const navigate = useNavigate();

  return (
    <div className="customer-page">
      <div className="customer-page__head">
        <div>
          <h1 className="customer-page__title">Cart</h1>
          <p className="customer-page__lede">
            Update quantities before checkout.
          </p>
        </div>
        <Link to="/products" className="customer-btn customer-btn--ghost">
          Continue shopping
        </Link>
      </div>

      <div className="customer-panel">
        {cart.length === 0 ? (
          <p className="customer-empty">Your cart is empty.</p>
        ) : (
          <>
            <div className="customer-list">
              {cart.map((item) => (
                <div key={item.productId} className="customer-list-item">
                  <div>
                    <h3>{item.name}</h3>
                    <p>
                      {item.sellerName} · ₹{item.price}/{item.unit}
                    </p>
                    <p>Line total: ₹{item.price * item.qty}</p>
                  </div>
                  <div className="customer-actions">
                    <div className="customer-qty">
                      <button
                        type="button"
                        onClick={() =>
                          setCartQty(item.productId, item.qty - 1)
                        }
                      >
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setCartQty(item.productId, item.qty + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="customer-btn customer-btn--danger"
                      onClick={() => setCartQty(item.productId, 0)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="customer-page__head"
              style={{ marginTop: "1.25rem", marginBottom: 0 }}
            >
              <p className="customer-card__price">Total ₹{cartSum}</p>
              <button
                type="button"
                className="customer-btn customer-btn--primary"
                onClick={() => navigate("/checkout")}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
