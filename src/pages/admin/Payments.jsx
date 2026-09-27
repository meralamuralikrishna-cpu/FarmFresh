import { useAdminData } from "../../context/AdminDataContext";

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export default function Payments() {
  const { payments, subscriptions, offers, ready } = useAdminData();

  if (!ready) return <p className="seller-empty">Loading…</p>;

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Payments & offers</h1>
          <p className="seller-page__lede">
            Transactions, subscriptions, and coupon codes.
          </p>
        </div>
      </div>

      <div className="seller-panel">
        <h2 className="seller-panel__title">Payments</h2>
        <div className="seller-table-wrap">
          <table className="seller-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Order</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.orderId}</td>
                  <td>{p.customer}</td>
                  <td>{p.method}</td>
                  <td>{formatINR(p.amount)}</td>
                  <td>
                    <span
                      className={`seller-badge${
                        p.status === "Paid" ? " seller-badge--ok" : " seller-badge--warn"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="seller-panel">
        <h2 className="seller-panel__title">Subscriptions</h2>
        <div className="seller-table-wrap">
          <table className="seller-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Frequency</th>
                <th>Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s) => (
                <tr key={s.id}>
                  <td>{s.customer}</td>
                  <td>{s.product}</td>
                  <td>{s.frequency}</td>
                  <td>{s.quantity}</td>
                  <td>
                    <span className="seller-badge">{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="seller-panel">
        <h2 className="seller-panel__title">Offers / coupons</h2>
        <div className="seller-table-wrap">
          <table className="seller-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Expiry</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((o) => (
                <tr key={o.id}>
                  <td>{o.code}</td>
                  <td>
                    {o.discount}
                    {o.discount >= 20 ? " ₹" : "%"}
                  </td>
                  <td>{o.expiry}</td>
                  <td>
                    <span className="seller-badge seller-badge--ok">
                      {o.status}
                    </span>
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
