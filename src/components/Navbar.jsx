import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCustomerData } from "../context/CustomerDataContext";
import "./Navbar.css";

export default function Navbar() {
  const { isCustomer, customer, logoutCustomer } = useAuth();
  const { cartCount, unread } = useCustomerData();

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="FreshFarm home">
          <span className="navbar__mark" aria-hidden="true" />
          <span className="navbar__name">FreshFarm</span>
        </Link>

        <nav className="navbar__links" aria-label="Primary">
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/subscription">Subscriptions</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/seller/login">Sell with FreshFarm</NavLink>
        </nav>

        <div className="navbar__actions">
          {isCustomer ? (
            <>
              <Link to="/notifications" className="navbar__login">
                Alerts{unread ? ` (${unread})` : ""}
              </Link>
              <Link to="/wishlist" className="navbar__login">
                Wishlist
              </Link>
              <Link to="/cart" className="navbar__login">
                Cart{cartCount ? ` (${cartCount})` : ""}
              </Link>
              <Link to="/orders" className="navbar__login">
                Orders
              </Link>
              <Link to="/account" className="navbar__login">
                {customer?.name?.split(" ")[0] || "Account"}
              </Link>
              <button
                type="button"
                className="navbar__login navbar__logout"
                onClick={logoutCustomer}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar__login">
              Sign in
            </Link>
          )}
          <Link to="/products" className="navbar__cta">
            Order milk
          </Link>
        </div>
      </div>
    </header>
  );
}
