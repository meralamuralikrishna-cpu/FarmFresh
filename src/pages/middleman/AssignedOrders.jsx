import { useMiddlemanData } from "../../context/MiddlemanDataContext";
import { DELIVERY_STATUS_LABELS } from "../../services/middlemanStore";

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function OrderActions({ order, advanceDelivery, failDelivery }) {
  const canAdvance = ![
    "DELIVERED",
    "FAILED",
    "OUT_FOR_DELIVERY",
  ].includes(order.status);
  const canDeliver = order.status === "OUT_FOR_DELIVERY";
  const canFail = !["DELIVERED", "FAILED"].includes(order.status);

  return (
    <div className="seller-actions">
      {(canAdvance || canDeliver) && (
        <button
          type="button"
          className="seller-btn seller-btn--primary"
          onClick={() => {
            try {
              advanceDelivery(order.id);
            } catch (err) {
              alert(err.message);
            }
          }}
        >
          {order.status === "ASSIGNED"
            ? "Accept"
            : order.status === "ACCEPTED"
              ? "Arrived at seller"
              : order.status === "AT_SELLER"
                ? "Mark picked up"
                : order.status === "PICKED_UP"
                  ? "Out for delivery"
                  : "Mark delivered"}
        </button>
      )}
      {canFail && (
        <button
          type="button"
          className="seller-btn seller-btn--danger"
          onClick={() => {
            try {
              failDelivery(order.id);
            } catch (err) {
              alert(err.message);
            }
          }}
        >
          Failed
        </button>
      )}
    </div>
  );
}

function OrderTable({ orders, advanceDelivery, failDelivery, empty }) {
  if (orders.length === 0) {
    return <p className="seller-empty">{empty}</p>;
  }

  return (
    <div className="seller-table-wrap">
      <table className="seller-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Address</th>
            <th>Items</th>
            <th>Earning</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.orderRef}</td>
              <td>
                {o.customerName}
                <br />
                <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                  {o.customerPhone}
                </span>
              </td>
              <td>{o.address}</td>
              <td>
                {o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
              </td>
              <td>{formatINR(o.earning)}</td>
              <td>
                <span
                  className={`seller-badge${
                    o.status === "DELIVERED"
                      ? " seller-badge--ok"
                      : o.status === "FAILED"
                        ? " seller-badge--warn"
                        : ""
                  }`}
                >
                  {DELIVERY_STATUS_LABELS[o.status] || o.status}
                </span>
              </td>
              <td>
                <OrderActions
                  order={o}
                  advanceDelivery={advanceDelivery}
                  failDelivery={failDelivery}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AssignedOrders() {
  const { orders, ready, advanceDelivery, failDelivery } = useMiddlemanData();

  if (!ready) return <p className="seller-empty">Loading…</p>;

  const assigned = orders.filter((o) =>
    ["ASSIGNED", "ACCEPTED"].includes(o.status)
  );

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Assigned orders</h1>
          <p className="seller-page__lede">
            New jobs waiting for you to accept and start.
          </p>
        </div>
      </div>
      <div className="seller-panel">
        <OrderTable
          orders={assigned}
          advanceDelivery={advanceDelivery}
          failDelivery={failDelivery}
          empty="No newly assigned orders."
        />
      </div>
    </div>
  );
}

export function PickupOrders() {
  const { orders, ready, advanceDelivery, failDelivery } = useMiddlemanData();

  if (!ready) return <p className="seller-empty">Loading…</p>;

  const pickup = orders.filter((o) =>
    ["AT_SELLER", "PICKED_UP"].includes(o.status)
  );

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Pickup</h1>
          <p className="seller-page__lede">
            Collect milk from the farm and mark pickup complete.
          </p>
        </div>
      </div>
      <div className="seller-panel">
        <OrderTable
          orders={pickup}
          advanceDelivery={advanceDelivery}
          failDelivery={failDelivery}
          empty="Nothing waiting at the farm right now."
        />
      </div>
    </div>
  );
}

export function Deliveries() {
  const { orders, ready, advanceDelivery, failDelivery } = useMiddlemanData();

  if (!ready) return <p className="seller-empty">Loading…</p>;

  const active = orders.filter((o) =>
    ["OUT_FOR_DELIVERY"].includes(o.status)
  );
  const history = orders.filter((o) =>
    ["DELIVERED", "FAILED"].includes(o.status)
  );

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Deliveries</h1>
          <p className="seller-page__lede">
            Out for delivery now, plus completed history.
          </p>
        </div>
      </div>

      <div className="seller-panel">
        <h2 className="seller-panel__title">Out for delivery</h2>
        <OrderTable
          orders={active}
          advanceDelivery={advanceDelivery}
          failDelivery={failDelivery}
          empty="No orders currently out for delivery."
        />
      </div>

      <div className="seller-panel">
        <h2 className="seller-panel__title">Delivery history</h2>
        <OrderTable
          orders={history}
          advanceDelivery={advanceDelivery}
          failDelivery={failDelivery}
          empty="No completed deliveries yet."
        />
      </div>
    </div>
  );
}
