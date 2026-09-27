import { useAdminData } from "../../context/AdminDataContext";
import { COMPLAINT_STATUSES } from "../../services/adminStore";

export default function Complaints() {
  const { complaints, reviews, updateComplaint, ready } = useAdminData();

  if (!ready) return <p className="seller-empty">Loading…</p>;

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Complaints & reviews</h1>
          <p className="seller-page__lede">
            Resolve issues and monitor platform feedback.
          </p>
        </div>
      </div>

      <div className="seller-panel">
        <h2 className="seller-panel__title">Complaints</h2>
        <div className="seller-table-wrap">
          <table className="seller-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Order</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id}>
                  <td>{c.user}</td>
                  <td>{c.orderId}</td>
                  <td>
                    <strong>{c.subject}</strong>
                    <br />
                    <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                      {c.description}
                    </span>
                  </td>
                  <td>{c.date}</td>
                  <td>
                    <span
                      className={`seller-badge${
                        c.status === "Resolved"
                          ? " seller-badge--ok"
                          : " seller-badge--warn"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={c.status}
                      onChange={(e) => updateComplaint(c.id, e.target.value)}
                      style={{
                        padding: "0.4rem 0.55rem",
                        borderRadius: "8px",
                        border: "1.5px solid var(--line)",
                        font: "inherit",
                      }}
                    >
                      {COMPLAINT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="seller-panel">
        <h2 className="seller-panel__title">Reviews</h2>
        <div className="seller-table-wrap">
          <table className="seller-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Type</th>
                <th>Target</th>
                <th>Rating</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td>{r.customer}</td>
                  <td>{r.type}</td>
                  <td>{r.target}</td>
                  <td>{"★".repeat(r.rating)}</td>
                  <td>{r.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
