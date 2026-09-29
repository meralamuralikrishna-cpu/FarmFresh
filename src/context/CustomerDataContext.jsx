import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import {
  addAddress,
  addToCart,
  cancelOrder,
  cancelSubscription,
  cartTotal,
  clearCart,
  createSubscription,
  deleteAddress,
  loadCustomerData,
  markAllNotificationsRead,
  markNotificationRead,
  pauseSubscription,
  placeOrder,
  rateOrder,
  resumeSubscription,
  skipSubscriptionDelivery,
  toggleWishlist,
  unreadCount,
  updateAddress,
  updateCartQty,
  updateCustomerProfile,
  updateSubscription,
  getCatalog,
  getProductById,
  searchCatalog,
  syncAdminApprovedToCatalog,
} from "../services/customerStore";
import { loadAdminData } from "../services/adminStore";

const CustomerDataContext = createContext(null);

function emptyValue(refresh) {
  return {
    ready: false,
    profile: null,
    addresses: [],
    cart: [],
    cartCount: 0,
    cartSum: 0,
    wishlist: [],
    orders: [],
    subscriptions: [],
    notifications: [],
    unread: 0,
    catalog: getCatalog(),
    refresh,
    getProduct: getProductById,
    searchProducts: searchCatalog,
    saveProfile: () => {},
    addNewAddress: () => {},
    editAddress: () => {},
    removeAddress: () => {},
    addItemToCart: () => {},
    setCartQty: () => {},
    emptyCart: () => {},
    toggleWish: () => {},
    checkout: () => {},
    cancelCustomerOrder: () => {},
    submitRating: () => {},
    readNotification: () => {},
    readAllNotifications: () => {},
    startSubscription: () => {},
    editSubscription: () => {},
    skipDelivery: () => {},
    pauseSub: () => {},
    resumeSub: () => {},
    endSubscription: () => {},
  };
}

export function CustomerDataProvider({ children }) {
  const { customer, refreshCustomerName } = useAuth();
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  const data = useMemo(() => {
    if (!customer?.id) return null;
    void version;
    return loadCustomerData(customer.id);
  }, [customer, version]);

  const run = useCallback(
    (fn) => {
      if (!customer?.id) throw new Error("Please sign in to continue.");
      const result = fn(customer.id);
      refresh();
      return result;
    },
    [customer, refresh]
  );

  const value = useMemo(() => {
    // Admin-approved products appear in the customer shop.
    try {
      syncAdminApprovedToCatalog(loadAdminData().products || []);
    } catch {
      /* ignore */
    }
    const catalog = getCatalog();
    if (!data) {
      return {
        ...emptyValue(refresh),
        catalog,
      };
    }

    return {
      ready: true,
      profile: data.profile,
      addresses: data.addresses,
      cart: data.cart,
      cartCount: data.cart.reduce((n, i) => n + i.qty, 0),
      cartSum: cartTotal(data.cart),
      wishlist: data.wishlist,
      orders: data.orders,
      subscriptions: data.subscriptions,
      notifications: data.notifications,
      unread: unreadCount(data.notifications),
      catalog,
      refresh,
      getProduct: getProductById,
      searchProducts: searchCatalog,
      saveProfile: (profile) => {
        const next = run((id) => updateCustomerProfile(id, profile));
        if (profile.name) refreshCustomerName(profile.name);
        return next;
      },
      addNewAddress: (address) => run((id) => addAddress(id, address)),
      editAddress: (addressId, patch) =>
        run((id) => updateAddress(id, addressId, patch)),
      removeAddress: (addressId) => run((id) => deleteAddress(id, addressId)),
      addItemToCart: (productId, qty) =>
        run((id) => addToCart(id, productId, qty)),
      setCartQty: (productId, qty) =>
        run((id) => updateCartQty(id, productId, qty)),
      emptyCart: () => run((id) => clearCart(id)),
      toggleWish: (productId) => run((id) => toggleWishlist(id, productId)),
      checkout: (payload) => run((id) => placeOrder(id, payload)),
      cancelCustomerOrder: (orderId) => run((id) => cancelOrder(id, orderId)),
      submitRating: (orderId, ratings) =>
        run((id) => rateOrder(id, orderId, ratings)),
      readNotification: (notificationId) =>
        run((id) => markNotificationRead(id, notificationId)),
      readAllNotifications: () => run((id) => markAllNotificationsRead(id)),
      startSubscription: (payload) =>
        run((id) => createSubscription(id, payload)),
      editSubscription: (subId, patch) =>
        run((id) => updateSubscription(id, subId, patch)),
      skipDelivery: (subId, date) =>
        run((id) => skipSubscriptionDelivery(id, subId, date)),
      pauseSub: (subId) => run((id) => pauseSubscription(id, subId)),
      resumeSub: (subId) => run((id) => resumeSubscription(id, subId)),
      endSubscription: (subId) => run((id) => cancelSubscription(id, subId)),
    };
  }, [data, refresh, run, refreshCustomerName]);

  return (
    <CustomerDataContext.Provider value={value}>
      {children}
    </CustomerDataContext.Provider>
  );
}

export function useCustomerData() {
  const ctx = useContext(CustomerDataContext);
  if (!ctx) {
    throw new Error("useCustomerData must be used within CustomerDataProvider");
  }
  return ctx;
}
