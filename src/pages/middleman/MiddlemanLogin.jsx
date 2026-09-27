import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function MiddlemanLogin() {
  const { isMiddleman, loginAsMiddleman } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  if (isMiddleman) return <Navigate to="/middleman" replace />;

  const enterDemo = () => {
    setError("");
    try {
      loginAsMiddleman({
        email: "delivery@freshfarm.demo",
        password: "delivery123",
      });
      navigate("/middleman");
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
          Delivery sign in
        </h1>
        <p className="mb-5 mt-2 text-[0.95rem] leading-normal text-muted">
          Accept pickups, deliver milk, and track your earnings.
        </p>

        {error ? (
          <p className="mb-3 text-sm font-medium text-red-700">{error}</p>
        ) : null}

        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-full bg-pasture px-5 py-3 text-[0.95rem] font-semibold text-white transition hover:bg-pasture-deep"
          onClick={enterDemo}
        >
          Continue as demo delivery partner
        </button>

        <p className="mt-4 text-[0.82rem] text-muted">
          No email or password — one click opens the delivery demo.
        </p>
        <Link
          to="/"
          className="mt-3.5 inline-block text-[0.9rem] font-semibold text-pasture hover:text-pasture-deep"
        >
          ← Back to storefront
        </Link>
      </div>
    </div>
  );
}
