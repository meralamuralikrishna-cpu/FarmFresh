import { Link } from "react-router-dom";
import { useBrokerData } from "../../context/BrokerDataContext";
import { SUBMISSION_STATUS_LABELS } from "../../services/brokerStore";

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export default function Dashboard() {
  const { profile, stats, submissions, ready } = useBrokerData();

  if (!ready) return <p className="seller-empty">Loading workspace…</p>;

  const pending = submissions.filter((s) => s.status === "pending");

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">
            Hi, {profile?.name?.split(" ")[0] || "Broker"}
          </h1>
          <p className="seller-page__lede">
            Farmers submit product details with their own prices. Review and
            accept listings for the marketplace.
          </p>
        </div>
        <Link
          to="/broker/submissions"
          className="seller-btn seller-btn--primary"
        >
          Open inbox
        </Link>
      </div>

      <div className="seller-stats">
        <div className="seller-stat">
          <p className="seller-stat__label">Pending</p>
          <p className="seller-stat__value">{stats.pending}</p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">Accepted</p>
          <p className="seller-stat__value">{stats.accepted}</p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">Rejected</p>
          <p className="seller-stat__value">{stats.rejected}</p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">Total submissions</p>
          <p className="seller-stat__value">{stats.total}</p>
        </div>
      </div>

      <div className="seller-panel">
        <h2 className="seller-panel__title">Awaiting your review</h2>
        {pending.length === 0 ? (
          <p className="seller-empty">
            No new farmer listings. When a farmer submits a product, it appears
            here.
          </p>
        ) : (
          <div className="seller-table-wrap">
            <table className="seller-table">
              <thead>
                <tr>
                  <th>Farm</th>
                  <th>Product</th>
                  <th>Farmer price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pending.slice(0, 6).map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.farmName}</strong>
                      <div
                        style={{ color: "var(--muted)", fontSize: "0.85rem" }}
                      >
                        {s.farmerName}
                      </div>
                    </td>
                    <td>
                      {s.product.name}
                      <div
                        style={{ color: "var(--muted)", fontSize: "0.85rem" }}
                      >
                        {s.product.type} · per {s.product.unit}
                      </div>
                    </td>
                    <td>
                      <strong>{formatINR(s.product.price)}</strong>
                    </td>
                    <td>
                      <span className="seller-badge">
                        {SUBMISSION_STATUS_LABELS[s.status]}
                      </span>
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
