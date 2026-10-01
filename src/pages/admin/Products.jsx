import { useMemo, useState } from "react";
import { useAdminData } from "../../context/AdminDataContext";

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

export default function Products() {
  const {
    products,
    approveProduct,
    rejectProduct,
    deleteProduct,
    setProductStock,
    ready,
  } = useAdminData();
  const [filter, setFilter] = useState("pending");

  const counts = useMemo(() => {
    const list = products || [];
    return {
      pending: list.filter((p) => p.status === "pending").length,
      approved: list.filter((p) => p.status === "approved").length,
      rejected: list.filter((p) => p.status === "rejected").length,
      all: list.length,
    };
  }, [products]);

  const filtered = useMemo(() => {
    const list = products || [];
    if (filter === "all") return list;
    return list.filter((p) => p.status === filter);
  }, [products, filter]);

  if (!ready) return <p className="seller-empty">Loading…</p>;

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Products</h1>
          <p className="seller-page__lede">
            Live catalog matches the customer{" "}
            <a href="/products">Products</a> page. When the Product Reviewer accepts a
            farmer listing, it appears here as a pending request — approve to
            add it to the shop catalog, or reject / remove it.
          </p>
        </div>
      </div>

      <div className="seller-actions" style={{ marginBottom: "1rem" }}>
        {[
          { id: "pending", label: `Pending requests (${counts.pending})` },
          { id: "approved", label: `Live catalog (${counts.approved})` },
          { id: "rejected", label: `Rejected (${counts.rejected})` },
          { id: "all", label: `All (${counts.all})` },
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

      <div className="seller-panel">
        {filtered.length === 0 ? (
          <p className="seller-empty">
            {filter === "pending"
              ? "No pending Product Reviewer product requests."
              : "No products in this filter."}
          </p>
        ) : (
          <div className="seller-table-wrap">
            <table className="seller-table admin-products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Seller / farm</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th className="admin-products-table__center">Source</th>
                  <th className="admin-products-table__center">Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.name}</strong>
                      {p.description ? (
                        <div
                          style={{
                            color: "var(--muted)",
                            fontSize: "0.8rem",
                            marginTop: "0.25rem",
                            maxWidth: "16rem",
                          }}
                        >
                          {p.description}
                        </div>
                      ) : null}
                      {p.submittedAt ? (
                        <div
                          style={{
                            color: "var(--muted)",
                            fontSize: "0.75rem",
                            marginTop: "0.25rem",
                          }}
                        >
                          Requested {formatWhen(p.submittedAt)}
                        </div>
                      ) : null}
                    </td>
                    <td>{p.seller}</td>
                    <td>{p.category}</td>
                    <td>
                      <strong>{formatINR(p.price)}</strong>
                      <span
                        style={{
                          color: "var(--muted)",
                          fontSize: "0.85rem",
                        }}
                      >
                        {" "}
                        / {p.unit || "unit"}
                      </span>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={p.stock ?? 0}
                        aria-label={`Stock for ${p.name}`}
                        style={{
                          width: "4.5rem",
                          padding: "0.4rem 0.5rem",
                          border: "1.5px solid var(--line)",
                          borderRadius: "8px",
                          font: "inherit",
                          background:
                            Number(p.stock) <= 0
                              ? "rgba(180,80,40,0.08)"
                              : undefined,
                        }}
                        onChange={(e) =>
                          setProductStock(p.id, Number(e.target.value) || 0)
                        }
                      />
                      {Number(p.stock) <= 0 ? (
                        <div
                          style={{
                            color: "#8a5a12",
                            fontSize: "0.75rem",
                            marginTop: "0.2rem",
                          }}
                        >
                          Out of stock
                        </div>
                      ) : null}
                    </td>
                    <td className="admin-products-table__center">
                      <span className="seller-badge seller-badge--muted">
                        {p.source === "broker" ? "Product Reviewer" : "Catalog"}
                      </span>
                    </td>
                    <td className="admin-products-table__center">
                      <span
                        className={`seller-badge${
                          p.status === "approved"
                            ? " seller-badge--ok"
                            : p.status === "rejected"
                              ? " seller-badge--muted"
                              : " seller-badge--warn"
                        }`}
                      >
                        {p.status === "approved"
                          ? "Live"
                          : p.status === "rejected"
                            ? "Rejected"
                            : "Pending"}
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
                            Approve &amp; publish
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
                            if (
                              confirm(
                                `Remove ${p.name} from admin and the customer catalog?`
                              )
                            ) {
                              deleteProduct(p.id);
                            }
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
        )}
      </div>
    </div>
  );
}
