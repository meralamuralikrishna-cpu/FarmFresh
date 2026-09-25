import { useSellerData } from "../../context/SellerDataContext";

export default function Reviews() {
  const { reviews, ready } = useSellerData();

  if (!ready) return <p className="seller-empty">Loading reviews…</p>;

  const avg =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Reviews</h1>
          <p className="seller-page__lede">
            Customer feedback on your products and farm.
          </p>
        </div>
      </div>

      <div className="seller-stats" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
        <div className="seller-stat">
          <p className="seller-stat__label">Average rating</p>
          <p className="seller-stat__value">{avg.toFixed(1)} ★</p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">Total reviews</p>
          <p className="seller-stat__value">{reviews.length}</p>
        </div>
      </div>

      <div className="seller-panel">
        {reviews.length === 0 ? (
          <p className="seller-empty">No reviews yet.</p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {reviews.map((r) => (
              <li
                key={r.id}
                style={{
                  padding: "1rem 0",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                  }}
                >
                  <strong>
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)} · {r.productName}
                  </strong>
                  <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                    {r.date}
                  </span>
                </div>
                <p style={{ margin: "0.45rem 0 0", color: "var(--muted)" }}>
                  {r.comment}
                </p>
                <p
                  style={{
                    margin: "0.35rem 0 0",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  {r.customerName}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
