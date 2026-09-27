import { useMiddlemanData } from "../../context/MiddlemanDataContext";

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export default function Earnings() {
  const { earnings, orders, ready } = useMiddlemanData();

  if (!ready) return <p className="seller-empty">Loading…</p>;

  const delivered = orders.filter((o) => o.status === "DELIVERED");

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Earnings</h1>
          <p className="seller-page__lede">
            Delivery fees from completed jobs.
          </p>
        </div>
      </div>

      <div className="seller-stats">
        <div className="seller-stat">
          <p className="seller-stat__label">Today</p>
          <p className="seller-stat__value">
            {formatINR(earnings.todayEarnings)}
          </p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">All time</p>
          <p className="seller-stat__value">
            {formatINR(earnings.totalEarnings)}
          </p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">Completed</p>
          <p className="seller-stat__value">{earnings.deliveredCount}</p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">In progress</p>
          <p className="seller-stat__value">{earnings.activeDeliveries}</p>
        </div>
      </div>

      <div className="seller-panel">
        <h2 className="seller-panel__title">Payout history</h2>
        {delivered.length === 0 ? (
          <p className="seller-empty">No completed deliveries yet.</p>
        ) : (
          <div className="seller-table-wrap">
            <table className="seller-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Delivered</th>
                  <th>Fee</th>
                </tr>
              </thead>
              <tbody>
                {delivered.map((o) => (
                  <tr key={o.id}>
                    <td>{o.orderRef}</td>
                    <td>{o.customerName}</td>
                    <td>
                      {o.deliveryTime
                        ? new Date(o.deliveryTime).toLocaleString("en-IN")
                        : "—"}
                    </td>
                    <td>{formatINR(o.earning)}</td>
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
