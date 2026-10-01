import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  BrokerDataProvider,
  useBrokerData,
} from "../../context/BrokerDataContext";
import "../seller/SellerLayout.css";

const NAV = [
  { to: "/broker", end: true, label: "Dashboard" },
  { to: "/broker/submissions", label: "Farmer listings" },
  { to: "/broker/profile", label: "Profile" },
];

function BrokerShell() {
  const { broker, logoutBroker } = useAuth();
  const { profile, stats } = useBrokerData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutBroker();
    navigate("/broker/login");
  };

  return (
    <div className="seller-shell">
      <aside className="seller-sidebar">
        <div className="seller-sidebar__brand">
          <span className="seller-sidebar__mark" aria-hidden="true" />
          <div>
            <p className="seller-sidebar__app">FreshFarm Product Reviewer</p>
            <p className="seller-sidebar__farm">
              {profile?.region || "Your region"}
              {stats?.pending ? ` · ${stats.pending} pending` : ""}
            </p>
          </div>
        </div>

        <nav className="seller-sidebar__nav" aria-label="Product Reviewer">
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
            {broker?.name || broker?.email}
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
          <p className="seller-topbar__label">Product Reviewer workspace</p>
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

export default function BrokerLayout() {
  return (
    <BrokerDataProvider>
      <BrokerShell />
    </BrokerDataProvider>
  );
}
