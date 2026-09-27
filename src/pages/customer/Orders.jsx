import { Link } from "react-router-dom";
import { useCustomerData } from "../../context/CustomerDataContext";
import { ORDER_STATUS_LABELS } from "../../services/customerStore";
import "./Customer.css";

export default function Orders() {
  const { orders } = useCustomerData();

  return (
    <div className="customer-page">
      <div className="customer-page__head">
        <div>
          <h1 className="customer-page__title">Order history</h1>
          <p className="customer-page__lede">
            Track deliveries, cancel eligible orders, and leave ratings.
          </p>
        </div>
      </div>

      <div className="customer-panel">
        {orders.length === 0 ? (
          <p className="customer-empty">No orders yet.</p>
        ) : (
          <div className="customer-list">
            {orders.map((order) => (
              <div key={order.id} className="customer-list-item">
                <div>
                  <h3>
                    #{order.id.slice(-8)}{" "}
                    <span
                      className={`customer-badge${
                        order.status === "CANCELLED"
                          ? " customer-badge--danger"
                          : order.status === "DELIVERED"
                            ? ""
                            : " customer-badge--warn"
                      }`}
                    >
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </span>
                  </h3>
                  <p>
                    {new Date(order.createdAt).toLocaleString()} ·{" "}
                    {order.paymentMethod} · ₹{order.total}
                  </p>
                  <p>
                    {order.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                  </p>
                </div>
                <Link
                  to={`/orders/${order.id}`}
                  className="customer-btn customer-btn--ghost"
                >
                  Track / details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
