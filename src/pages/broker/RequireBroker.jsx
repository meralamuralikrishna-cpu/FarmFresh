import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequireBroker() {
  const { isBroker } = useAuth();
  const location = useLocation();

  if (!isBroker) {
    return <Navigate to="/broker/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
