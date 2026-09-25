import { Link } from "react-router-dom";
import { useSellerData } from "../../context/SellerDataContext";
import { ORDER_STATUS_LABELS } from "../../services/sellerStore";

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export default function Dashboard() {
  const { profile, earnings, orders, products, reviews, ready } = useSellerData();

  if (!ready) return <p className="seller-empty">Loading workspace…</p>;

  const pending = orders.filter((o) =>
    ["PLACED", "CONFIRMED", "PREPARING", "READY_FOR_PICKUP"].includes(o.status)
  );
  const lowStock = products.filter((p) => p.stock <= 5);

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">
            {profile?.farmName || "Seller dashboard"}
          </h1>
          <p className="seller-page__lede">
            Today’s sales, open orders, and stock at a glance.
          </p>
        </div>
        <Link to="/seller/products/new" className="seller-btn seller-btn--primary">
          Add product
        </Link>
      </div>

      <div className="seller-stats">
        <div className="seller-stat">
          <p className="seller-stat__label">Today’s sales</p>
          <p className="seller-stat__value">{formatINR(earnings.todaySales)}</p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">Total sales</p>
          <p className="seller-stat__value">{formatINR(earnings.totalSales)}</p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">Active orders</p>
          <p className="seller-stat__value">{earnings.activeOrders}</p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">Products</p>
          <p className="seller-stat__value">{earnings.productCount}</p>
        </div>
      </div>

      <div className="seller-panel">
        <h2 className="seller-panel__title">Open orders</h2>
        {pending.length === 0 ? (
          <p className="seller-empty">No open orders right now.</p>
        ) : (
          <div className="seller-table-wrap">
            <table className="seller-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pending.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.customerName}</td>
                    <td>{formatINR(o.total)}</td>
                    <td>
                      <span className="seller-badge">
                        {ORDER_STATUS_LABELS[o.status] || o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="seller-actions" style={{ marginTop: "1rem" }}>
          <Link to="/seller/orders" className="seller-btn seller-btn--ghost">
            Manage orders
          </Link>
          <Link to="/seller/deliveries" className="seller-btn seller-btn--ghost">
            Assign delivery
          </Link>
        </div>
      </div>

      <div className="seller-panel">
        <h2 className="seller-panel__title">Stock alerts</h2>
        {lowStock.length === 0 ? (
          <p className="seller-empty">All products have healthy stock.</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "var(--muted)" }}>
            {lowStock.map((p) => (
              <li key={p.id} style={{ marginBottom: "0.35rem" }}>
                <strong style={{ color: "var(--ink)" }}>{p.name}</strong> —{" "}
                {p.stock} {p.unit} left
                {!p.available ? " (unavailable)" : ""}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="seller-panel">
        <h2 className="seller-panel__title">Latest reviews</h2>
        {reviews.length === 0 ? (
          <p className="seller-empty">No reviews yet.</p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {reviews.slice(0, 3).map((r) => (
              <li
                key={r.id}
                style={{
                  padding: "0.75rem 0",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <strong>
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </strong>{" "}
                on {r.productName}
                <p style={{ margin: "0.35rem 0 0", color: "var(--muted)" }}>
                  {r.comment} — {r.customerName}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
