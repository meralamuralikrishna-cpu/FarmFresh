import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequireCustomer() {
  const { isCustomer } = useAuth();
  const location = useLocation();

  if (!isCustomer) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
