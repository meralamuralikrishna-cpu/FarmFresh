import { useCustomerData } from "../../context/CustomerDataContext";
import "./Customer.css";

export default function Notifications() {
  const {
    notifications,
    unread,
    readNotification,
    readAllNotifications,
  } = useCustomerData();

  return (
    <div className="customer-page">
      <div className="customer-page__head">
        <div>
          <h1 className="customer-page__title">Notifications</h1>
          <p className="customer-page__lede">
            Order updates, delivery reminders, and subscription alerts.
            {unread ? ` ${unread} unread.` : ""}
          </p>
        </div>
        {unread ? (
          <button
            type="button"
            className="customer-btn customer-btn--ghost"
            onClick={readAllNotifications}
          >
            Mark all read
          </button>
        ) : null}
      </div>

      <div className="customer-panel">
        {notifications.length === 0 ? (
          <p className="customer-empty">No notifications yet.</p>
        ) : (
          <div className="customer-list">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`customer-list-item customer-notify${
                  n.read ? "" : " is-unread"
                }`}
              >
                <div>
                  <h3>{n.title}</h3>
                  <p>{n.body}</p>
                  <p>{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read ? (
                  <button
                    type="button"
                    className="customer-btn customer-btn--ghost"
                    onClick={() => readNotification(n.id)}
                  >
                    Mark read
                  </button>
                ) : (
                  <span className="customer-badge customer-badge--muted">
                    Read
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
