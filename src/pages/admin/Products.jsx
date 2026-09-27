import { useAdminData } from "../../context/AdminDataContext";

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export default function Products() {
  const {
    products,
    approveProduct,
    rejectProduct,
    deleteProduct,
    ready,
  } = useAdminData();

  if (!ready) return <p className="seller-empty">Loading…</p>;

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Products</h1>
          <p className="seller-page__lede">
            Approve or remove catalogue listings.
          </p>
        </div>
      </div>

      <div className="seller-panel">
        <div className="seller-table-wrap">
          <table className="seller-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Seller</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.seller}</td>
                  <td>{p.category}</td>
                  <td>{formatINR(p.price)}</td>
                  <td>
                    <span
                      className={`seller-badge${
                        p.status === "approved"
                          ? " seller-badge--ok"
                          : " seller-badge--warn"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div className="seller-actions">
                      {p.status !== "approved" && (
                        <button
                          type="button"
                          className="seller-btn seller-btn--primary"
                          onClick={() => approveProduct(p.id)}
                        >
                          Approve
                        </button>
                      )}
                      {p.status === "pending" && (
                        <button
                          type="button"
                          className="seller-btn seller-btn--ghost"
                          onClick={() => rejectProduct(p.id)}
                        >
                          Reject
                        </button>
                      )}
                      <button
                        type="button"
                        className="seller-btn seller-btn--danger"
                        onClick={() => {
                          if (confirm(`Remove ${p.name}?`)) deleteProduct(p.id);
                        }}
                      >
                        Remove
                      </button>
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
