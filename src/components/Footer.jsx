import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__name">FreshFarm</span>
          <p>Fresh dairy from nearby farms, delivered on your schedule.</p>
        </div>

        <div className="footer__cols">
          <div>
            <h4>Shop</h4>
            <Link to="/products">Products</Link>
            <Link to="/subscription">Subscriptions</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link to="/login">Sign in</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/account/addresses">Addresses</Link>
            <Link to="/seller/login">Farmer portal</Link>
            <Link to="/broker/login">Broker portal</Link>
            <Link to="/middleman/login">Delivery portal</Link>
            <Link to="/admin/login">Admin</Link>
          </div>
        </div>
      </div>
      <div className="footer__bar">
        <span>© {new Date().getFullYear()} FreshFarm</span>
      </div>
    </footer>
  );
}
