import { useMemo, useState } from "react";
import { useSellerData } from "../../context/SellerDataContext";
import { ORDER_STATUS_LABELS } from "../../services/sellerStore";

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export default function Deliveries() {
  const { orders, middlemen, ready, assignDelivery } = useSellerData();
  const [selected, setSelected] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const readyOrders = useMemo(
    () =>
      orders.filter((o) =>
        ["READY_FOR_PICKUP", "ASSIGNED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(
          o.status
        )
      ),
    [orders]
  );

  if (!ready) return <p className="seller-empty">Loading deliveries…</p>;

  const middlemanName = (id) =>
    middlemen.find((m) => m.id === id)?.name || "—";

  const onAssign = (orderId) => {
    setError("");
    setMessage("");
    const middlemanId = selected[orderId];
    if (!middlemanId) {
      setError("Select a middleman first.");
      return;
    }
    try {
      assignDelivery(orderId, middlemanId);
      setMessage(`Delivery assigned for order ${orderId}.`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Assign delivery</h1>
          <p className="seller-page__lede">
            Select a middleman for orders ready for pickup and track status.
          </p>
        </div>
      </div>

      {message ? <p className="seller-success">{message}</p> : null}
      {error ? <p className="seller-error">{error}</p> : null}

      <div className="seller-panel">
        <h2 className="seller-panel__title">Available middlemen</h2>
        <div className="seller-table-wrap">
          <table className="seller-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Area</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {middlemen.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.phone}</td>
                  <td>{m.area}</td>
                  <td>
                    <span
                      className={`seller-badge ${
                        m.status === "available"
                          ? "seller-badge--ok"
                          : "seller-badge--warn"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="seller-panel">
        <h2 className="seller-panel__title">Pickup & tracking</h2>
        {readyOrders.length === 0 ? (
          <p className="seller-empty">
            No orders ready for pickup yet. Advance orders in the Orders tab.
          </p>
        ) : (
          <div className="seller-table-wrap">
            <table className="seller-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Middleman</th>
                  <th>Assign</th>
                </tr>
              </thead>
              <tbody>
                {readyOrders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>
                      <strong>{o.customerName}</strong>
                      <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                        {o.address}
                      </div>
                    </td>
                    <td>{formatINR(o.total)}</td>
                    <td>
                      <span className="seller-badge seller-badge--ok">
                        {ORDER_STATUS_LABELS[o.status] || o.status}
                      </span>
                    </td>
                    <td>{middlemanName(o.middlemanId)}</td>
                    <td>
                      {o.status === "READY_FOR_PICKUP" ? (
                        <div className="seller-actions">
                          <select
                            value={selected[o.id] || ""}
                            onChange={(e) =>
                              setSelected((s) => ({
                                ...s,
                                [o.id]: e.target.value,
                              }))
                            }
                            style={{
                              padding: "0.45rem 0.55rem",
                              borderRadius: "8px",
                              border: "1.5px solid var(--line)",
                              font: "inherit",
                            }}
                          >
                            <option value="">Select middleman</option>
                            {middlemen.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name}
                                {m.status === "busy" ? " (busy)" : ""}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="seller-btn seller-btn--primary"
                            onClick={() => onAssign(o.id)}
                          >
                            Assign
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                          Tracking: {ORDER_STATUS_LABELS[o.status] || o.status}
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
