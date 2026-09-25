import { useMemo, useState } from "react";
import { useSellerData } from "../../context/SellerDataContext";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
} from "../../services/sellerStore";

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

const ACTION_LABEL = {
  PLACED: "Confirm order",
  CONFIRMED: "Start preparing",
  PREPARING: "Mark ready for pickup",
};

export default function Orders() {
  const { orders, ready, advanceOrder } = useSellerData();
  const [filter, setFilter] = useState("ALL");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    if (filter === "ALL") return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  if (!ready) return <p className="seller-empty">Loading orders…</p>;

  const onAdvance = (orderId) => {
    setError("");
    setMessage("");
    try {
      const updated = advanceOrder(orderId);
      setMessage(
        `Order ${orderId} moved to ${ORDER_STATUS_LABELS[updated.status] || updated.status}.`
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Orders</h1>
          <p className="seller-page__lede">
            New → Confirm → Preparing → Ready for pickup.
          </p>
        </div>
      </div>

      <div className="seller-actions" style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          className={`seller-btn ${filter === "ALL" ? "seller-btn--primary" : "seller-btn--ghost"}`}
          onClick={() => setFilter("ALL")}
        >
          All
        </button>
        {ORDER_STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            className={`seller-btn ${
              filter === status ? "seller-btn--primary" : "seller-btn--ghost"
            }`}
            onClick={() => setFilter(status)}
          >
            {ORDER_STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {message ? <p className="seller-success">{message}</p> : null}
      {error ? <p className="seller-error">{error}</p> : null}

      <div className="seller-panel">
        {filtered.length === 0 ? (
          <p className="seller-empty">No orders in this stage.</p>
        ) : (
          <div className="seller-table-wrap">
            <table className="seller-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>
                      <strong>{o.customerName}</strong>
                      <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                        {o.address}
                      </div>
                    </td>
                    <td>
                      {o.items
                        .map((i) => `${i.name} × ${i.qty}`)
                        .join(", ")}
                    </td>
                    <td>{formatINR(o.total)}</td>
                    <td>
                      <span
                        className={`seller-badge ${
                          o.status === "PLACED"
                            ? "seller-badge--warn"
                            : "seller-badge--ok"
                        }`}
                      >
                        {ORDER_STATUS_LABELS[o.status] || o.status}
                      </span>
                    </td>
                    <td>
                      {ACTION_LABEL[o.status] ? (
                        <button
                          type="button"
                          className="seller-btn seller-btn--primary"
                          onClick={() => onAdvance(o.id)}
                        >
                          {ACTION_LABEL[o.status]}
                        </button>
                      ) : (
                        <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                          {o.status === "READY_FOR_PICKUP"
                            ? "Assign in Delivery"
                            : "—"}
                        </span>
                      )}
                    </td>
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
