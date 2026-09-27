import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCustomerData } from "../../context/CustomerDataContext";
import { CATEGORIES } from "../../services/customerStore";
import "./Customer.css";

export default function Products() {
  const { isCustomer } = useAuth();
  const { searchProducts, addItemToCart, toggleWish, wishlist } =
    useCustomerData();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const products = useMemo(
    () => searchProducts({ query, category }),
    [searchProducts, query, category]
  );

  const requireAuth = (fn) => {
    if (!isCustomer) {
      navigate("/login", { state: { from: { pathname: "/products" } } });
      return;
    }
    try {
      fn();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="customer-page">
      <div className="customer-page__head">
        <div>
          <h1 className="customer-page__title">Products</h1>
          <p className="customer-page__lede">
            Search and browse farm-fresh dairy by category.
          </p>
        </div>
      </div>

      <div className="customer-toolbar">
        <input
          type="search"
          placeholder="Search milk, curd, paneer, farm…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search products"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Category"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="customer-chips">
        <button
          type="button"
          className={`customer-chip${!category ? " is-active" : ""}`}
          onClick={() => setCategory("")}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`customer-chip${category === c ? " is-active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {message ? <p className="customer-success">{message}</p> : null}

      {products.length === 0 ? (
        <p className="customer-empty">No products match your search.</p>
      ) : (
        <div className="customer-grid">
          {products.map((p) => (
            <article key={p.id} className="customer-card">
              <p className="customer-card__cat">{p.category}</p>
              <h2 className="customer-card__title">
                <Link to={`/products/${p.id}`}>{p.name}</Link>
              </h2>
              <p className="customer-card__meta">
                {p.sellerName} · ★ {p.rating}
                {!p.available ? " · Out of stock" : ""}
              </p>
              <p className="customer-card__price">
                ₹{p.price}
                <span className="customer-card__meta"> / {p.unit}</span>
              </p>
              <div className="customer-card__actions">
                <Link
                  to={`/products/${p.id}`}
                  className="customer-btn customer-btn--ghost"
                >
                  Details
                </Link>
                <button
                  type="button"
                  className="customer-btn customer-btn--primary"
                  disabled={!p.available}
                  onClick={() =>
                    requireAuth(() => {
                      addItemToCart(p.id, 1);
                      setMessage(`${p.name} added to cart.`);
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
                      const wasSaved = wishlist.includes(p.id);
                      toggleWish(p.id);
                      setMessage(
                        wasSaved
                          ? "Removed from wishlist."
                          : "Saved to wishlist."
                      );
                    })
                  }
                >
                  {wishlist.includes(p.id) ? "♥ Saved" : "♡ Wishlist"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
