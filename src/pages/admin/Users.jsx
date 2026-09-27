import { useAdminData } from "../../context/AdminDataContext";

export default function Users() {
  const { customers, toggleCustomer, ready } = useAdminData();

  if (!ready) return <p className="seller-empty">Loading…</p>;

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Customers</h1>
          <p className="seller-page__lede">
            All customer accounts on the platform.
          </p>
        </div>
      </div>

      <div className="seller-panel">
        <div className="seller-table-wrap">
          <table className="seller-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.joined}</td>
                  <td>
                    <span
                      className={`seller-badge${
                        c.status === "active" ? " seller-badge--ok" : " seller-badge--warn"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="seller-btn seller-btn--ghost"
                      onClick={() =>
                        toggleCustomer(
                          c.id,
                          c.status === "active" ? "suspended" : "active"
                        )
                      }
                    >
                      {c.status === "active" ? "Suspend" : "Activate"}
                    </button>
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
