import { useSellerData } from "../../context/SellerDataContext";

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export default function Earnings() {
  const { earnings, payments, ready } = useSellerData();

  if (!ready) return <p className="seller-empty">Loading earnings…</p>;

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Earnings</h1>
          <p className="seller-page__lede">
            Today’s sales, lifetime totals, and payment history.
          </p>
        </div>
      </div>

      <div className="seller-stats">
        <div className="seller-stat">
          <p className="seller-stat__label">Today’s sales</p>
          <p className="seller-stat__value">{formatINR(earnings.todaySales)}</p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">Total sales</p>
          <p className="seller-stat__value">{formatINR(earnings.totalSales)}</p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">Payments</p>
          <p className="seller-stat__value">{payments.length}</p>
        </div>
        <div className="seller-stat">
          <p className="seller-stat__label">Active orders</p>
          <p className="seller-stat__value">{earnings.activeOrders}</p>
        </div>
      </div>

      <div className="seller-panel">
        <h2 className="seller-panel__title">Payment history</h2>
        {payments.length === 0 ? (
          <p className="seller-empty">No payments recorded yet.</p>
        ) : (
          <div className="seller-table-wrap">
            <table className="seller-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {[...payments]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((p) => (
                    <tr key={p.id}>
                      <td>{p.date}</td>
                      <td>{p.orderId}</td>
                      <td>{p.customerName}</td>
                      <td>{p.method}</td>
                      <td>
                        <span className="seller-badge seller-badge--ok">
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <strong>{formatINR(p.amount)}</strong>
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
