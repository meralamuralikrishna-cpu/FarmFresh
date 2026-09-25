import { createContext, useContext, useMemo, useState, useCallback } from "react";
import {
  getSession,
  loginSeller,
  logoutSeller,
  registerSeller,
  loadSellerData,
} from "../services/sellerStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const session = getSession();
    if (!session) return null;
    const data = loadSellerData(session.userId);
    return {
      id: session.userId,
      email: session.email,
      role: session.role,
      name: data.profile?.ownerName || "Seller",
    };
  });

  const login = useCallback(({ email, password }) => {
    const loggedIn = loginSeller({ email, password });
    const data = loadSellerData(loggedIn.id);
    const next = {
      ...loggedIn,
      name: data.profile?.ownerName || loggedIn.name || "Seller",
    };
    setUser(next);
    return next;
  }, []);

  const register = useCallback((payload) => {
    const created = registerSeller(payload);
    setUser({ ...created, name: payload.name });
    return created;
  }, []);

  const logout = useCallback(() => {
    logoutSeller();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isSeller: Boolean(user && user.role === "seller"),
      login,
      register,
      logout,
    }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
