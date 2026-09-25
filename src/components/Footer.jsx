import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__name">Pail</span>
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
            <Link to="/seller/login">Seller portal</Link>
          </div>
        </div>
      </div>
      <div className="footer__bar">
        <span>© {new Date().getFullYear()} Pail</span>
      </div>
    </footer>
  );
}
