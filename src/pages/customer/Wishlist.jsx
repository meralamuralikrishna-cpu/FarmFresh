import { Link } from "react-router-dom";
import { useCustomerData } from "../../context/CustomerDataContext";
import "./Customer.css";

export default function Wishlist() {
  const { wishlist, getProduct, toggleWish, addItemToCart } = useCustomerData();
  const items = wishlist.map(getProduct).filter(Boolean);

  return (
    <div className="customer-page">
      <div className="customer-page__head">
        <div>
          <h1 className="customer-page__title">Wishlist</h1>
          <p className="customer-page__lede">
            Saved products you can move to cart anytime.
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="customer-panel">
          <p className="customer-empty">Wishlist is empty.</p>
          <Link to="/products" className="customer-btn customer-btn--primary">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="customer-grid">
          {items.map((p) => (
            <article key={p.id} className="customer-card">
              <p className="customer-card__cat">{p.category}</p>
              <h2 className="customer-card__title">
                <Link to={`/products/${p.id}`}>{p.name}</Link>
              </h2>
              <p className="customer-card__meta">{p.sellerName}</p>
              <p className="customer-card__price">
                ₹{p.price} / {p.unit}
              </p>
              <div className="customer-card__actions">
                <button
                  type="button"
                  className="customer-btn customer-btn--primary"
                  disabled={!p.available}
                  onClick={() => addItemToCart(p.id, 1)}
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  className="customer-btn customer-btn--danger"
                  onClick={() => toggleWish(p.id)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
