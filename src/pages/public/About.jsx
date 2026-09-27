import { Link } from "react-router-dom";
import "./PlaceholderPage.css";
import "./Home.css";

export default function About() {
  return (
    <div className="placeholder">
      <div className="placeholder__inner" style={{ maxWidth: "42rem" }}>
        <p className="placeholder__eyebrow">About FreshFarm</p>
        <h1>Farm milk, delivered with care</h1>
        <p>
          FreshFarm connects local dairy farmers with nearby households. Milk is
          chilled at the farm, handed to vetted delivery partners, and tracked
          until it reaches your door — so you always know where your bottle came
          from.
        </p>
        <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
          Sellers manage stock and orders, middlemen handle pickup and delivery,
          customers subscribe or order on demand, and admins keep the platform
          healthy. Built as a React frontend with local demo data for every role.
        </p>
        <div className="seller-actions" style={{ marginTop: "1.5rem" }}>
          <Link to="/products" className="seller-btn seller-btn--primary">
            Browse products
          </Link>
          <Link to="/seller/login" className="seller-btn seller-btn--ghost">
            Sell with us
          </Link>
        </div>
      </div>
    </div>
  );
}
