import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AdminDataProvider } from "../../context/AdminDataContext";
import "../seller/SellerLayout.css";

const NAV = [
  { to: "/admin", end: true, label: "Dashboard" },
  { to: "/admin/users", label: "Customers" },
  { to: "/admin/sellers", label: "Sellers" },
  { to: "/admin/middlemen", label: "Middlemen" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/complaints", label: "Complaints" },
  { to: "/admin/analytics", label: "Analytics" },
];

function AdminShell() {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  return (
    <div className="seller-shell">
      <aside className="seller-sidebar">
        <div className="seller-sidebar__brand">
          <span className="seller-sidebar__mark" aria-hidden="true" />
          <div>
            <p className="seller-sidebar__app">FreshFarm Admin</p>
            <p className="seller-sidebar__farm">Control center</p>
          </div>
        </div>

        <nav className="seller-sidebar__nav" aria-label="Admin">
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
          <p className="seller-sidebar__user">{admin?.email}</p>
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
          <p className="seller-topbar__label">Platform administration</p>
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

export default function AdminLayout() {
  return (
    <AdminDataProvider>
      <AdminShell />
    </AdminDataProvider>
  );
}
