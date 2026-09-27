import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequireMiddleman() {
  const { isMiddleman } = useAuth();
  const location = useLocation();

  if (!isMiddleman) {
    return (
      <Navigate to="/middleman/login" replace state={{ from: location }} />
    );
  }

  return <Outlet />;
}
