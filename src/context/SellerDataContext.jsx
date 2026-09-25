import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import {
  advanceOrderStatus,
  assignMiddleman,
  createProduct,
  deleteProduct,
  getEarningsSummary,
  loadSellerData,
  updateProduct,
  updateProfile,
} from "../services/sellerStore";

const SellerDataContext = createContext(null);

function emptyValue(refresh) {
  return {
    ready: false,
    profile: null,
    products: [],
    orders: [],
    middlemen: [],
    payments: [],
    reviews: [],
    earnings: {
      todaySales: 0,
      totalSales: 0,
      activeOrders: 0,
      productCount: 0,
    },
    refresh,
    saveProfile: () => {},
    addProduct: () => {},
    editProduct: () => {},
    removeProduct: () => {},
    advanceOrder: () => {},
    assignDelivery: () => {},
  };
}

export function SellerDataProvider({ children }) {
  const { user } = useAuth();
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  const data = useMemo(() => {
    if (!user?.id) return null;
    void version;
    return loadSellerData(user.id);
  }, [user, version]);

  const run = useCallback(
    (fn) => {
      if (!user?.id) throw new Error("Not signed in");
      const result = fn(user.id);
      refresh();
      return result;
    },
    [user, refresh]
  );

  const value = useMemo(() => {
    if (!data) return emptyValue(refresh);

    return {
      ready: true,
      profile: data.profile,
      products: data.products,
      orders: data.orders,
      middlemen: data.middlemen,
      payments: data.payments,
      reviews: data.reviews,
      earnings: getEarningsSummary(data),
      refresh,
      saveProfile: (profile) => run((id) => updateProfile(id, profile)),
      addProduct: (product) => run((id) => createProduct(id, product)),
      editProduct: (productId, patch) =>
        run((id) => updateProduct(id, productId, patch)),
      removeProduct: (productId) => run((id) => deleteProduct(id, productId)),
      advanceOrder: (orderId) => run((id) => advanceOrderStatus(id, orderId)),
      assignDelivery: (orderId, middlemanId) =>
        run((id) => assignMiddleman(id, orderId, middlemanId)),
    };
  }, [data, refresh, run]);

  return (
    <SellerDataContext.Provider value={value}>
      {children}
    </SellerDataContext.Provider>
  );
}

export function useSellerData() {
  const ctx = useContext(SellerDataContext);
  if (!ctx) throw new Error("useSellerData must be used within SellerDataProvider");
  return ctx;
}
