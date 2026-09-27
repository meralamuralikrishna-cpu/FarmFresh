import { Link } from "react-router-dom";
import { useAdminData } from "../../context/AdminDataContext";

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export default function Dashboard() {
  const { analytics, orders, complaints, products, ready } = useAdminData();

  if (!ready) return <p className="seller-empty">Loading…</p>;

  const pendingOrders = orders.filter((o) =>
    ["PLACED", "CONFIRMED", "PREPARING", "ASSIGNED"].includes(o.status)
  );
  const openComplaints = complaints.filter((c) => c.status !== "Resolved");
  const pendingProducts = products.filter((p) => p.status === "pending");

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Admin dashboard</h1>
          <p className="seller-page__lede">
            Platform health across customers, farms, and deliveries.
          </p>
        </div>
      </div>

      <div className="seller-stats">
        <div className="seller-stat">
          <p className="seller-stat__label">Revenue</p>
          <p className="seller-stat__value">
            {formatINR(analytics.totalRevenue)}
          </p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">Orders</p>
          <p className="seller-stat__value">{analytics.orderCount}</p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">Customers</p>
          <p className="seller-stat__value">{analytics.customers}</p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">Sellers</p>
          <p className="seller-stat__value">{analytics.sellers}</p>
        </div>
      </div>

      <div className="seller-panel">
        <h2 className="seller-panel__title">Needs attention</h2>
        <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "var(--muted)" }}>
          <li style={{ marginBottom: "0.4rem" }}>
            {pendingProducts.length} products awaiting approval —{" "}
            <Link to="/admin/products" style={{ color: "var(--pasture)" }}>
              Review
            </Link>
          </li>
          <li style={{ marginBottom: "0.4rem" }}>
            {openComplaints.length} open complaints —{" "}
            <Link to="/admin/complaints" style={{ color: "var(--pasture)" }}>
              Triage
            </Link>
          </li>
          <li>
            {pendingOrders.length} active orders —{" "}
            <Link to="/admin/orders" style={{ color: "var(--pasture)" }}>
              Monitor
            </Link>
          </li>
        </ul>
      </div>

      <div className="seller-panel">
        <h2 className="seller-panel__title">Recent orders</h2>
        <div className="seller-table-wrap">
          <table className="seller-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Seller</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.seller}</td>
                  <td>{formatINR(o.total)}</td>
                  <td>
                    <span className="seller-badge">{o.status}</span>
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
