import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import {
  advanceDeliveryStatus,
  getMiddlemanEarnings,
  loadMiddlemanData,
  markDeliveryFailed,
  updateMiddlemanProfile,
} from "../services/middlemanStore";

const MiddlemanDataContext = createContext(null);

function emptyValue(refresh) {
  return {
    ready: false,
    profile: null,
    orders: [],
    earnings: {
      todayEarnings: 0,
      totalEarnings: 0,
      deliveredCount: 0,
      activeDeliveries: 0,
    },
    refresh,
    saveProfile: () => {},
    advanceDelivery: () => {},
    failDelivery: () => {},
  };
}

export function MiddlemanDataProvider({ children }) {
  const { middleman } = useAuth();
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    if (!middleman?.id) return undefined;

    const onOrdersUpdated = (event) => {
      if (event.detail?.middlemanId === middleman.id) refresh();
    };
    const onStorage = (event) => {
      if (event.key === `freshfarm_middleman_data_${middleman.id}`) refresh();
    };

    window.addEventListener("freshfarm:middleman-orders-updated", onOrdersUpdated);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("freshfarm:middleman-orders-updated", onOrdersUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, [middleman?.id, refresh]);

  const data = useMemo(() => {
    if (!middleman?.id) return null;
    void version;
    return loadMiddlemanData(middleman.id);
  }, [middleman, version]);

  const run = useCallback(
    (fn) => {
      if (!middleman?.id) throw new Error("Not signed in");
      const result = fn(middleman.id);
      refresh();
      return result;
    },
    [middleman, refresh]
  );

  const value = useMemo(() => {
    if (!data) return emptyValue(refresh);

    return {
      ready: true,
      profile: data.profile,
      orders: data.orders,
      earnings: getMiddlemanEarnings(data),
      refresh,
      saveProfile: (profile) => run((id) => updateMiddlemanProfile(id, profile)),
      advanceDelivery: (orderId) =>
        run((id) => advanceDeliveryStatus(id, orderId)),
      failDelivery: (orderId) => run((id) => markDeliveryFailed(id, orderId)),
    };
  }, [data, refresh, run]);

  return (
    <MiddlemanDataContext.Provider value={value}>
      {children}
    </MiddlemanDataContext.Provider>
  );
}

export function useMiddlemanData() {
  const ctx = useContext(MiddlemanDataContext);
  if (!ctx) {
    throw new Error("useMiddlemanData must be used within MiddlemanDataProvider");
  }
  return ctx;
}
