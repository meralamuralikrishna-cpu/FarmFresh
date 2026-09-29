import { useState } from "react";
import { useBrokerData } from "../../context/BrokerDataContext";
import { SUBMISSION_STATUS_LABELS } from "../../services/brokerStore";

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function formatWhen(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function Submissions() {
  const { submissions, ready, accept, reject } = useBrokerData();
  const [filter, setFilter] = useState("pending");
  const [error, setError] = useState("");

  if (!ready) return <p className="seller-empty">Loading listings…</p>;

  const filtered =
    filter === "all"
      ? submissions
      : submissions.filter((s) => s.status === filter);

  const onAccept = (id) => {
    setError("");
    try {
      accept(id);
    } catch (err) {
      setError(err.message || "Could not accept listing.");
    }
  };

  const onReject = (id) => {
    setError("");
    const note = window.prompt("Optional note for the farmer:", "") ?? "";
    try {
      reject(id, note);
    } catch (err) {
      setError(err.message || "Could not reject listing.");
    }
  };

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Farmer listings</h1>
          <p className="seller-page__lede">
            Each submission includes the price the farmer set. Accept to send
            it to Admin → Products for final approval, or reject with a note.
          </p>
        </div>
      </div>

      <div className="seller-actions" style={{ marginBottom: "1rem" }}>
        {[
          { id: "pending", label: "Pending" },
          { id: "accepted", label: "Accepted" },
          { id: "rejected", label: "Rejected" },
          { id: "all", label: "All" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`seller-btn ${
              filter === tab.id ? "seller-btn--primary" : "seller-btn--ghost"
            }`}
            onClick={() => setFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error ? <p className="seller-error">{error}</p> : null}

      <div className="seller-panel">
        {filtered.length === 0 ? (
          <p className="seller-empty">No listings in this filter.</p>
        ) : (
          <div className="seller-table-wrap">
            <table className="seller-table">
              <thead>
                <tr>
                  <th>Submitted</th>
                  <th>Farmer / farm</th>
                  <th>Product details</th>
                  <th>Farmer price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>{formatWhen(s.submittedAt)}</td>
                    <td>
                      <strong>{s.farmerName}</strong>
                      <div
                        style={{ color: "var(--muted)", fontSize: "0.85rem" }}
                      >
                        {s.farmName}
                      </div>
                    </td>
                    <td>
                      <strong>{s.product.name}</strong>
                      <div
                        style={{ color: "var(--muted)", fontSize: "0.85rem" }}
                      >
                        {s.product.type} · per {s.product.unit}
                      </div>
                      {s.product.description ? (
                        <div
                          style={{
                            color: "var(--muted)",
                            fontSize: "0.8rem",
                            marginTop: "0.25rem",
                          }}
                        >
                          {s.product.description}
                        </div>
                      ) : null}
                    </td>
                    <td>
                      <strong>{formatINR(s.product.price)}</strong>
                    </td>
                    <td>{s.product.stock}</td>
                    <td>
                      <span
                        className={`seller-badge ${
                          s.status === "accepted"
                            ? "seller-badge--ok"
                            : s.status === "rejected"
                              ? "seller-badge--muted"
                              : ""
                        }`}
                      >
                        {SUBMISSION_STATUS_LABELS[s.status] || s.status}
                      </span>
                      {s.note ? (
                        <div
                          style={{
                            color: "var(--muted)",
                            fontSize: "0.8rem",
                            marginTop: "0.25rem",
                          }}
                        >
                          {s.note}
                        </div>
                      ) : null}
                    </td>
                    <td>
                      {s.status === "pending" ? (
                        <div className="seller-actions">
                          <button
                            type="button"
                            className="seller-btn seller-btn--primary"
                            onClick={() => onAccept(s.id)}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            className="seller-btn seller-btn--danger"
                            onClick={() => onReject(s.id)}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: "var(--muted)" }}>Reviewed</span>
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
