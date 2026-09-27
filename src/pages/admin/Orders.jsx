import { useMemo, useState } from "react";
import { useAdminData } from "../../context/AdminDataContext";

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

const FILTERS = ["All", "Pending", "Completed", "Cancelled"];

function matchesFilter(order, filter) {
  if (filter === "All") return true;
  if (filter === "Pending") {
    return !["DELIVERED", "CANCELLED"].includes(order.status);
  }
  if (filter === "Completed") return order.status === "DELIVERED";
  if (filter === "Cancelled") return order.status === "CANCELLED";
  return true;
}

export default function Orders() {
  const { orders, ready } = useAdminData();
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(
    () => orders.filter((o) => matchesFilter(o, filter)),
    [orders, filter]
  );

  if (!ready) return <p className="seller-empty">Loading…</p>;

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Orders</h1>
          <p className="seller-page__lede">
            All platform orders across sellers and middlemen.
          </p>
        </div>
        <div className="seller-actions">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`seller-btn ${
                filter === f ? "seller-btn--primary" : "seller-btn--ghost"
              }`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="seller-panel">
        {filtered.length === 0 ? (
          <p className="seller-empty">No orders in this filter.</p>
        ) : (
          <div className="seller-table-wrap">
            <table className="seller-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Seller</th>
                  <th>Middleman</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.customer}</td>
                    <td>{o.seller}</td>
                    <td>{o.middleman}</td>
                    <td>{formatINR(o.total)}</td>
                    <td>
                      <span className="seller-badge">{o.status}</span>
                    </td>
                    <td>{o.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
