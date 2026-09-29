import { Link } from "react-router-dom";
import { useSellerData } from "../../context/SellerDataContext";
import { BROKER_STATUS_LABELS } from "../../services/sellerStore";

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export default function Products() {
  const { products, ready, editProduct, removeProduct } = useSellerData();

  if (!ready) return <p className="seller-empty">Loading products…</p>;

  const toggleAvailability = (p) => {
    editProduct(p.id, { available: !p.available });
  };

  const onDelete = (p) => {
    if (window.confirm(`Delete “${p.name}”?`)) removeProduct(p.id);
  };

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Product management</h1>
          <p className="seller-page__lede">
            Change the <strong>Stock</strong> number to restock (Fresh Cow Milk,
            Buffalo Milk, Ghee, etc.). That updates the customer shop too.
          </p>
        </div>
        <Link to="/seller/products/new" className="seller-btn seller-btn--primary">
          Submit to broker
        </Link>
      </div>

      <div className="seller-panel">
        {products.length === 0 ? (
          <p className="seller-empty">No products yet. Submit your first listing.</p>
        ) : (
          <div className="seller-table-wrap">
            <table className="seller-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Your price</th>
                  <th>Stock</th>
                  <th>Broker</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.name}</strong>
                      <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                        per {p.unit}
                      </div>
                    </td>
                    <td>{p.type}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={p.price}
                        aria-label={`Price for ${p.name}`}
                        style={{
                          width: "5.5rem",
                          padding: "0.4rem 0.5rem",
                          border: "1.5px solid var(--line)",
                          borderRadius: "8px",
                          font: "inherit",
                        }}
                        onChange={(e) =>
                          editProduct(p.id, { price: Number(e.target.value) || 0 })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={p.stock}
                        aria-label={`Stock for ${p.name}`}
                        style={{
                          width: "4.5rem",
                          padding: "0.4rem 0.5rem",
                          border: "1.5px solid var(--line)",
                          borderRadius: "8px",
                          font: "inherit",
                          background:
                            Number(p.stock) <= 0 ? "rgba(180,80,40,0.08)" : undefined,
                        }}
                        onChange={(e) =>
                          editProduct(p.id, {
                            stock: Number(e.target.value) || 0,
                          })
                        }
                      />
                      {Number(p.stock) <= 0 ? (
                        <div
                          style={{
                            color: "#8a5a12",
                            fontSize: "0.75rem",
                            marginTop: "0.2rem",
                          }}
                        >
                          Out of stock — type a qty
                        </div>
                      ) : null}
                    </td>
                    <td>
                      <span
                        className={`seller-badge ${
                          p.brokerStatus === "accepted"
                            ? "seller-badge--ok"
                            : p.brokerStatus === "rejected"
                              ? "seller-badge--muted"
                              : ""
                        }`}
                      >
                        {BROKER_STATUS_LABELS[p.brokerStatus] ||
                          BROKER_STATUS_LABELS.pending}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`seller-badge ${
                          p.available ? "seller-badge--ok" : "seller-badge--muted"
                        }`}
                        style={{ border: "none", cursor: "pointer" }}
                        onClick={() => toggleAvailability(p)}
                      >
                        {p.available ? "Available" : "Unavailable"}
                      </button>
                    </td>
                    <td>
                      <div className="seller-actions">
                        <Link
                          to={`/seller/products/${p.id}/edit`}
                          className="seller-btn seller-btn--ghost"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="seller-btn seller-btn--danger"
                          onClick={() => onDelete(p)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p style={{ margin: "1rem 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
          Farmer sets the price. After submit, the broker reviews the listing.
          Example amount: {products[0] ? formatINR(products[0].price) : "₹…"}.
        </p>
      </div>
    </div>
  );
}
