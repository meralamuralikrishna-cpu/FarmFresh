import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="Pail home">
          <span className="navbar__mark" aria-hidden="true" />
          <span className="navbar__name">Pail</span>
        </Link>

        <nav className="navbar__links" aria-label="Primary">
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/seller/login">Sell with Pail</NavLink>
        </nav>

        <div className="navbar__actions">
          <Link to="/login" className="navbar__login">
            Sign in
          </Link>
          <Link to="/products" className="navbar__cta">
            Order milk
          </Link>
        </div>
      </div>
    </header>
  );
}
