import { createContext, useContext, useMemo, useState, useCallback } from "react";
import {
  getSession,
  loginSeller,
  logoutSeller,
  registerSeller,
  loadSellerData,
} from "../services/sellerStore";
import {
  getCustomerSession,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  loadCustomerData,
} from "../services/customerStore";
import {
  getMiddlemanSession,
  loginMiddleman,
  logoutMiddleman,
  registerMiddleman,
  loadMiddlemanData,
} from "../services/middlemanStore";
import {
  getAdminSession,
  loginAdmin,
  logoutAdmin,
} from "../services/adminStore";
import {
  getBrokerSession,
  loginBroker,
  logoutBroker,
  getBrokerProfile,
} from "../services/brokerStore";

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
      name: data.profile?.ownerName || "Farmer",
    };
  });

  const [customer, setCustomer] = useState(() => {
    const session = getCustomerSession();
    if (!session) return null;
    const data = loadCustomerData(session.userId);
    return {
      id: session.userId,
      email: session.email,
      role: session.role,
      name: data.profile?.name || "Customer",
    };
  });

  const [middleman, setMiddleman] = useState(() => {
    const session = getMiddlemanSession();
    if (!session) return null;
    const data = loadMiddlemanData(session.userId);
    return {
      id: session.userId,
      email: session.email,
      role: session.role,
      name: data.profile?.name || "Delivery partner",
    };
  });

  const [admin, setAdmin] = useState(() => {
    const session = getAdminSession();
    if (!session) return null;
    return {
      id: session.userId,
      email: session.email,
      role: session.role,
      name: "FreshFarm Admin",
    };
  });

  const [broker, setBroker] = useState(() => {
    const session = getBrokerSession();
    if (!session) return null;
    const profile = getBrokerProfile();
    return {
      id: session.userId,
      email: session.email,
      role: session.role,
      name: profile?.name || "Broker",
    };
  });

  const login = useCallback(({ email, password }) => {
    const loggedIn = loginSeller({ email, password });
    const data = loadSellerData(loggedIn.id);
    const next = {
      ...loggedIn,
      name: data.profile?.ownerName || loggedIn.name || "Farmer",
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

  const loginAsCustomer = useCallback(({ email, password }) => {
    const loggedIn = loginCustomer({ email, password });
    const data = loadCustomerData(loggedIn.id);
    const next = {
      ...loggedIn,
      name: data.profile?.name || loggedIn.name || "Customer",
    };
    setCustomer(next);
    return next;
  }, []);

  const registerAsCustomer = useCallback((payload) => {
    const created = registerCustomer(payload);
    setCustomer({ ...created, name: payload.name });
    return created;
  }, []);

  const logoutCustomerAccount = useCallback(() => {
    logoutCustomer();
    setCustomer(null);
  }, []);

  const refreshCustomerName = useCallback((name) => {
    setCustomer((c) => (c ? { ...c, name } : c));
  }, []);

  const loginAsMiddleman = useCallback(({ email, password }) => {
    const loggedIn = loginMiddleman({ email, password });
    const data = loadMiddlemanData(loggedIn.id);
    const next = {
      ...loggedIn,
      name: data.profile?.name || loggedIn.name || "Delivery partner",
    };
    setMiddleman(next);
    return next;
  }, []);

  const registerAsMiddleman = useCallback((payload) => {
    const created = registerMiddleman(payload);
    setMiddleman({ ...created, name: payload.name });
    return created;
  }, []);

  const logoutMiddlemanAccount = useCallback(() => {
    logoutMiddleman();
    setMiddleman(null);
  }, []);

  const loginAsAdmin = useCallback(({ email, password }) => {
    const loggedIn = loginAdmin({ email, password });
    setAdmin({ ...loggedIn, name: loggedIn.name || "Admin" });
    return loggedIn;
  }, []);

  const logoutAdminAccount = useCallback(() => {
    logoutAdmin();
    setAdmin(null);
  }, []);

  const loginAsBroker = useCallback(({ email, password }) => {
    const loggedIn = loginBroker({ email, password });
    const profile = getBrokerProfile();
    const next = {
      ...loggedIn,
      name: profile?.name || loggedIn.name || "Broker",
    };
    setBroker(next);
    return next;
  }, []);

  const logoutBrokerAccount = useCallback(() => {
    logoutBroker();
    setBroker(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isSeller: Boolean(user && user.role === "seller"),
      login,
      register,
      logout,
      customer,
      isCustomer: Boolean(customer && customer.role === "customer"),
      loginAsCustomer,
      registerAsCustomer,
      logoutCustomer: logoutCustomerAccount,
      refreshCustomerName,
      middleman,
      isMiddleman: Boolean(middleman && middleman.role === "middleman"),
      loginAsMiddleman,
      registerAsMiddleman,
      logoutMiddleman: logoutMiddlemanAccount,
      admin,
      isAdmin: Boolean(admin && admin.role === "admin"),
      loginAsAdmin,
      logoutAdmin: logoutAdminAccount,
      broker,
      isBroker: Boolean(broker && broker.role === "broker"),
      loginAsBroker,
      logoutBroker: logoutBrokerAccount,
    }),
    [
      user,
      login,
      register,
      logout,
      customer,
      loginAsCustomer,
      registerAsCustomer,
      logoutCustomerAccount,
      refreshCustomerName,
      middleman,
      loginAsMiddleman,
      registerAsMiddleman,
      logoutMiddlemanAccount,
      admin,
      loginAsAdmin,
      logoutAdminAccount,
      broker,
      loginAsBroker,
      logoutBrokerAccount,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
