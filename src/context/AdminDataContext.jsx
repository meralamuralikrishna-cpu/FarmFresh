import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  getAnalytics,
  loadAdminData,
  removeProduct,
  setComplaintStatus,
  setCustomerStatus,
  setMiddlemanStatus,
  setProductStatus,
  setSellerStatus,
} from "../services/adminStore";

const AdminDataContext = createContext(null);

export function AdminDataProvider({ children }) {
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  const data = useMemo(() => {
    void version;
    return loadAdminData();
  }, [version]);

  const run = useCallback(
    (fn) => {
      const result = fn();
      refresh();
      return result;
    },
    [refresh]
  );

  const value = useMemo(
    () => ({
      ready: true,
      ...data,
      analytics: getAnalytics(data),
      refresh,
      approveSeller: (id) => run(() => setSellerStatus(id, "approved")),
      rejectSeller: (id) => run(() => setSellerStatus(id, "rejected")),
      approveProduct: (id) => run(() => setProductStatus(id, "approved")),
      rejectProduct: (id) => run(() => setProductStatus(id, "rejected")),
      deleteProduct: (id) => run(() => removeProduct(id)),
      toggleCustomer: (id, status) => run(() => setCustomerStatus(id, status)),
      toggleMiddleman: (id, status) => run(() => setMiddlemanStatus(id, status)),
      updateComplaint: (id, status) => run(() => setComplaintStatus(id, status)),
    }),
    [data, refresh, run]
  );

  return (
    <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}
