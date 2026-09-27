import { Link } from "react-router-dom";
import { useMiddlemanData } from "../../context/MiddlemanDataContext";
import { DELIVERY_STATUS_LABELS } from "../../services/middlemanStore";

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export default function Dashboard() {
  const { profile, earnings, orders, ready } = useMiddlemanData();

  if (!ready) return <p className="seller-empty">Loading workspace…</p>;

  const active = orders.filter(
    (o) => !["DELIVERED", "FAILED"].includes(o.status)
  );

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">
            Hi, {profile?.name?.split(" ")[0] || "Partner"}
          </h1>
          <p className="seller-page__lede">
            Assigned pickups and deliveries for {profile?.area || "your area"}.
          </p>
        </div>
        <Link to="/middleman/assigned" className="seller-btn seller-btn--primary">
          View assigned
        </Link>
      </div>

      <div className="seller-stats">
        <div className="seller-stat">
          <p className="seller-stat__label">Today’s earnings</p>
          <p className="seller-stat__value">
            {formatINR(earnings.todayEarnings)}
          </p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">Total earnings</p>
          <p className="seller-stat__value">
            {formatINR(earnings.totalEarnings)}
          </p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">Active deliveries</p>
          <p className="seller-stat__value">{earnings.activeDeliveries}</p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">Delivered</p>
          <p className="seller-stat__value">{earnings.deliveredCount}</p>
        </div>
      </div>

      <div className="seller-panel">
        <h2 className="seller-panel__title">Active jobs</h2>
        {active.length === 0 ? (
          <p className="seller-empty">No active deliveries right now.</p>
        ) : (
          <div className="seller-table-wrap">
            <table className="seller-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Seller</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {active.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td>{o.orderRef}</td>
                    <td>{o.customerName}</td>
                    <td>{o.sellerName}</td>
                    <td>
                      <span className="seller-badge">
                        {DELIVERY_STATUS_LABELS[o.status] || o.status}
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
