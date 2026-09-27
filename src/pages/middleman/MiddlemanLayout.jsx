import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  MiddlemanDataProvider,
  useMiddlemanData,
} from "../../context/MiddlemanDataContext";
import "../seller/SellerLayout.css";

const NAV = [
  { to: "/middleman", end: true, label: "Dashboard" },
  { to: "/middleman/assigned", label: "Assigned" },
  { to: "/middleman/pickup", label: "Pickup" },
  { to: "/middleman/deliveries", label: "Deliveries" },
  { to: "/middleman/earnings", label: "Earnings" },
  { to: "/middleman/profile", label: "Profile" },
];

function MiddlemanShell() {
  const { middleman, logoutMiddleman } = useAuth();
  const { profile } = useMiddlemanData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutMiddleman();
    navigate("/middleman/login");
  };

  return (
    <div className="seller-shell">
      <aside className="seller-sidebar">
        <div className="seller-sidebar__brand">
          <span className="seller-sidebar__mark" aria-hidden="true" />
          <div>
            <p className="seller-sidebar__app">FreshFarm Delivery</p>
            <p className="seller-sidebar__farm">
              {profile?.area || "Your route"}
            </p>
          </div>
        </div>

        <nav className="seller-sidebar__nav" aria-label="Middleman">
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
          <p className="seller-sidebar__user">
            {middleman?.name || middleman?.email}
          </p>
          <button
            type="button"
            className="seller-sidebar__logout"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="seller-main">
        <header className="seller-topbar">
          <p className="seller-topbar__label">Delivery workspace</p>
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

export default function MiddlemanLayout() {
  return (
    <MiddlemanDataProvider>
      <MiddlemanShell />
    </MiddlemanDataProvider>
  );
}
