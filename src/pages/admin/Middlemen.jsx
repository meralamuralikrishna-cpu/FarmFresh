import { useAdminData } from "../../context/AdminDataContext";

export default function Middlemen() {
  const { middlemen, toggleMiddleman, ready } = useAdminData();

  if (!ready) return <p className="seller-empty">Loading…</p>;

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Middlemen</h1>
          <p className="seller-page__lede">
            Delivery partners across service areas.
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
                <th>Area</th>
                <th>Deliveries</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {middlemen.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.area}</td>
                  <td>{m.deliveries}</td>
                  <td>
                    <span className="seller-badge">{m.status}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="seller-btn seller-btn--ghost"
                      onClick={() =>
                        toggleMiddleman(
                          m.id,
                          m.status === "active" ? "inactive" : "active"
                        )
                      }
                    >
                      {m.status === "active" ? "Deactivate" : "Activate"}
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
