import { useAdminData } from "../../context/AdminDataContext";

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export default function Analytics() {
  const { analytics, ready } = useAdminData();

  if (!ready) return <p className="seller-empty">Loading…</p>;

  const cards = [
    { label: "Total revenue", value: formatINR(analytics.totalRevenue) },
    { label: "Orders", value: analytics.orderCount },
    {
      label: "Milk sold (₹ delivered)",
      value: formatINR(analytics.milkSoldEstimate),
    },
    { label: "Customers", value: analytics.customers },
    { label: "Sellers", value: analytics.sellers },
    { label: "Middlemen", value: analytics.middlemen },
    { label: "Pending products", value: analytics.pendingProducts },
    { label: "Open complaints", value: analytics.openComplaints },
    { label: "Active subscriptions", value: analytics.activeSubscriptions },
  ];

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Analytics</h1>
          <p className="seller-page__lede">
            Snapshot of FreshFarm platform performance.
          </p>
        </div>
      </div>

      <div className="seller-stats" style={{ gridTemplateColumns: undefined }}>
        {cards.map((c) => (
          <div className="seller-stat" key={c.label}>
            <p className="seller-stat__label">{c.label}</p>
            <p className="seller-stat__value">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
