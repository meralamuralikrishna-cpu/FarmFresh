import { useAdminData } from "../../context/AdminDataContext";

export default function Sellers() {
  const { sellers, approveSeller, rejectSeller, ready } = useAdminData();

  if (!ready) return <p className="seller-empty">Loading…</p>;

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Sellers</h1>
          <p className="seller-page__lede">
            Approve farms and manage seller accounts.
          </p>
        </div>
      </div>

      <div className="seller-panel">
        <div className="seller-table-wrap">
          <table className="seller-table">
            <thead>
              <tr>
                <th>Farm</th>
                <th>Owner</th>
                <th>Email</th>
                <th>Products</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((s) => (
                <tr key={s.id}>
                  <td>{s.farmName}</td>
                  <td>{s.ownerName}</td>
                  <td>{s.email}</td>
                  <td>{s.products}</td>
                  <td>
                    <span
                      className={`seller-badge${
                        s.status === "approved"
                          ? " seller-badge--ok"
                          : s.status === "pending"
                            ? " seller-badge--warn"
                            : " seller-badge--muted"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <div className="seller-actions">
                      {s.status !== "approved" && (
                        <button
                          type="button"
                          className="seller-btn seller-btn--primary"
                          onClick={() => approveSeller(s.id)}
                        >
                          Approve
                        </button>
                      )}
                      {s.status !== "rejected" && (
                        <button
                          type="button"
                          className="seller-btn seller-btn--danger"
                          onClick={() => rejectSeller(s.id)}
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
