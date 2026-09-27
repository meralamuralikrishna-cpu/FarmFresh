import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CustomerLogin() {
  const { isCustomer, loginAsCustomer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/products";
  const [error, setError] = useState("");

  if (isCustomer) return <Navigate to={from} replace />;

  const enterDemo = () => {
    setError("");
    try {
      loginAsCustomer({
        email: "customer@freshfarm.demo",
        password: "customer123",
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_60%_50%_at_20%_10%,var(--color-mist)_0%,transparent_55%),linear-gradient(160deg,var(--color-foam),var(--color-milk)_55%,var(--color-sky))] px-5 py-8">
      <div className="w-full max-w-md animate-[auth-in_0.55s_cubic-bezier(0.22,1,0.36,1)_both] rounded-[18px] border border-line bg-white px-6 pb-6 pt-7 shadow-soft motion-reduce:animate-none">
        <p className="font-display text-[1.75rem] font-extrabold tracking-[-0.04em] text-pasture-deep">
          FreshFarm
        </p>
        <h1 className="mt-1.5 font-display text-[1.55rem] font-extrabold tracking-[-0.03em] text-ink">
          Customer sign in
        </h1>
        <p className="mb-5 mt-2 text-[0.95rem] leading-normal text-muted">
          Order dairy, manage deliveries, and run your milk subscription.
        </p>

        {error ? (
          <p className="mb-3 text-sm font-medium text-red-700">{error}</p>
        ) : null}

        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-full bg-pasture px-5 py-3 text-[0.95rem] font-semibold text-white transition hover:bg-pasture-deep"
          onClick={enterDemo}
        >
          Continue as demo customer
        </button>

        <p className="mt-4 text-[0.82rem] text-muted">
          No email or password — one click opens the customer demo.
        </p>
        <Link
          to="/seller/login"
          className="mt-3.5 inline-block text-[0.9rem] font-semibold text-pasture hover:text-pasture-deep"
        >
          Farmer? Open seller portal →
        </Link>
      </div>
    </div>
  );
}
