import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { SellerDataProvider, useSellerData } from "../../context/SellerDataContext";
import "./SellerLayout.css";

const NAV = [
  { to: "/seller", end: true, label: "Dashboard" },
  { to: "/seller/products", label: "Products" },
  { to: "/seller/orders", label: "Orders" },
  { to: "/seller/deliveries", label: "Delivery" },
  { to: "/seller/earnings", label: "Earnings" },
  { to: "/seller/reviews", label: "Reviews" },
  { to: "/seller/profile", label: "Profile" },
];

function SellerShell() {
  const { user, logout } = useAuth();
  const { profile } = useSellerData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/seller/login");
  };

  return (
    <div className="seller-shell">
      <aside className="seller-sidebar">
        <div className="seller-sidebar__brand">
          <span className="seller-sidebar__mark" aria-hidden="true" />
          <div>
            <p className="seller-sidebar__app">Pail Seller</p>
            <p className="seller-sidebar__farm">
              {profile?.farmName || "Your farm"}
            </p>
          </div>
        </div>

        <nav className="seller-sidebar__nav" aria-label="Seller">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `seller-sidebar__link${isActive ? " is-active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="seller-sidebar__foot">
          <p className="seller-sidebar__user">{user?.name || user?.email}</p>
          <button type="button" className="seller-sidebar__logout" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <div className="seller-main">
        <header className="seller-topbar">
          <p className="seller-topbar__label">Farmer workspace</p>
          <a href="/" className="seller-topbar__storefront">
            View storefront
          </a>
        </header>
        <div className="seller-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function SellerLayout() {
  return (
    <SellerDataProvider>
      <SellerShell />
    </SellerDataProvider>
  );
}
