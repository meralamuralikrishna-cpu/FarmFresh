const USERS_KEY = "freshfarm_customer_users";
const SESSION_KEY = "freshfarm_customer_session";
const DATA_KEY = "freshfarm_customer_data";
const CATALOG_KEY = "freshfarm_catalog";

export const CATEGORIES = [
  "Cow Milk",
  "Buffalo Milk",
  "Curd",
  "Paneer",
  "Ghee",
  "Buttermilk",
];

export const PAYMENT_METHODS = ["UPI", "Card", "COD"];

export const SUBSCRIPTION_FREQUENCIES = [
  { id: "daily", label: "Daily Milk" },
  { id: "alternate", label: "Alternate Days" },
  { id: "weekly", label: "Weekly" },
  { id: "custom", label: "Custom Schedule" },
];

export const ORDER_STATUS_LABELS = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY_FOR_PICKUP: "Ready for Pickup",
  ASSIGNED: "Assigned",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const TRACKING_STEPS = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const todayISO = () => new Date().toISOString().slice(0, 10);

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function seedCatalog() {
  return [
    {
      id: "c1",
      name: "Fresh Cow Milk",
      category: "Cow Milk",
      price: 56,
      unit: "litre",
      sellerId: "demo-seller",
      sellerName: "Green Pasture Dairy",
      stock: 40,
      available: true,
      rating: 4.6,
      description: "Morning-fresh cow milk, chilled at the farm.",
    },
    {
      id: "c2",
      name: "Buffalo Milk",
      category: "Buffalo Milk",
      price: 72,
      unit: "litre",
      sellerId: "demo-seller",
      sellerName: "Green Pasture Dairy",
      stock: 25,
      available: true,
      rating: 4.8,
      description: "Rich buffalo milk for tea and set curd.",
    },
    {
      id: "c3",
      name: "Homemade Curd",
      category: "Curd",
      price: 60,
      unit: "500g",
      sellerId: "demo-seller",
      sellerName: "Green Pasture Dairy",
      stock: 18,
      available: true,
      rating: 4.9,
      description: "Set overnight from farm milk.",
    },
    {
      id: "c4",
      name: "Fresh Paneer",
      category: "Paneer",
      price: 320,
      unit: "kg",
      sellerId: "demo-seller",
      sellerName: "Green Pasture Dairy",
      stock: 8,
      available: true,
      rating: 4.7,
      description: "Soft paneer made daily.",
    },
    {
      id: "c5",
      name: "Pure Ghee",
      category: "Ghee",
      price: 680,
      unit: "litre",
      sellerId: "demo-seller",
      sellerName: "Green Pasture Dairy",
      stock: 12,
      available: true,
      rating: 5,
      description: "Slow-cooked bilona ghee.",
    },
    {
      id: "c6",
      name: "Farm Buttermilk",
      category: "Buttermilk",
      price: 30,
      unit: "litre",
      sellerId: "demo-seller",
      sellerName: "Green Pasture Dairy",
      stock: 0,
      available: false,
      rating: 4.4,
      description: "Light spiced chaas — restocking tomorrow.",
    },
    {
      id: "c7",
      name: "A2 Cow Milk",
      category: "Cow Milk",
      price: 85,
      unit: "litre",
      sellerId: "farm-2",
      sellerName: "Sunrise Organic Farm",
      stock: 20,
      available: true,
      rating: 4.5,
      description: "A2 protein milk from grass-fed cows.",
    },
    {
      id: "c8",
      name: "Malai Paneer",
      category: "Paneer",
      price: 360,
      unit: "kg",
      sellerId: "farm-2",
      sellerName: "Sunrise Organic Farm",
      stock: 6,
      available: true,
      rating: 4.6,
      description: "Creamy malai paneer for curries.",
    },
  ];
}

function seedCustomerData(profileOverrides = {}) {
  const earlier = new Date(Date.now() - 86400000 * 3).toISOString();
  const yesterday = new Date(Date.now() - 86400000).toISOString();

  return {
    profile: {
      name: "Priya Shah",
      email: "customer@freshfarm.demo",
      phone: "9811100001",
      ...profileOverrides,
    },
    addresses: [
      {
        id: "a1",
        label: "Home",
        line1: "12 Lake Road",
        city: "Anand",
        state: "Gujarat",
        pincode: "388001",
        phone: "9811100001",
        isDefault: true,
      },
      {
        id: "a2",
        label: "Office",
        line1: "3rd Floor, Market Complex",
        city: "Anand",
        state: "Gujarat",
        pincode: "388002",
        phone: "9811100001",
        isDefault: false,
      },
    ],
    cart: [],
    wishlist: ["c5", "c3"],
    orders: [
      {
        id: "co1",
        items: [
          {
            productId: "c1",
            name: "Fresh Cow Milk",
            qty: 2,
            price: 56,
            sellerName: "Green Pasture Dairy",
          },
        ],
        total: 112,
        paymentMethod: "UPI",
        status: "DELIVERED",
        address: {
          label: "Home",
          line1: "12 Lake Road",
          city: "Anand",
          state: "Gujarat",
          pincode: "388001",
          phone: "9811100001",
        },
        createdAt: earlier,
        deliveredAt: earlier,
        ratings: { product: 5, seller: 5, delivery: 4 },
      },
      {
        id: "co2",
        items: [
          {
            productId: "c3",
            name: "Homemade Curd",
            qty: 1,
            price: 60,
            sellerName: "Green Pasture Dairy",
          },
          {
            productId: "c4",
            name: "Fresh Paneer",
            qty: 1,
            price: 320,
            sellerName: "Green Pasture Dairy",
          },
        ],
        total: 380,
        paymentMethod: "COD",
        status: "OUT_FOR_DELIVERY",
        address: {
          label: "Home",
          line1: "12 Lake Road",
          city: "Anand",
          state: "Gujarat",
          pincode: "388001",
          phone: "9811100001",
        },
        createdAt: yesterday,
        ratings: null,
      },
    ],
    subscriptions: [
      {
        id: "s1",
        productId: "c1",
        productName: "Fresh Cow Milk",
        sellerName: "Green Pasture Dairy",
        qty: 1,
        unit: "litre",
        price: 56,
        frequency: "daily",
        customDays: [],
        status: "active",
        nextDelivery: todayISO(),
        skippedDates: [],
      },
    ],
    notifications: [
      {
        id: "n1",
        title: "Order out for delivery",
        body: "Order #co2 is on the way. Keep COD ready if needed.",
        read: false,
        createdAt: yesterday,
      },
      {
        id: "n2",
        title: "Milk subscription reminder",
        body: "Your daily cow milk delivery is scheduled for tomorrow morning.",
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "n3",
        title: "Order delivered",
        body: "Order #co1 was delivered. Rate your experience!",
        read: true,
        createdAt: earlier,
      },
    ],
  };
}

export function getCatalog() {
  let catalog = readJson(CATALOG_KEY, null);
  if (!catalog) {
    catalog = seedCatalog();
    writeJson(CATALOG_KEY, catalog);
  }
  return catalog;
}

export function getProductById(productId) {
  return getCatalog().find((p) => p.id === productId) || null;
}

export function searchCatalog({ query = "", category = "" } = {}) {
  const q = query.trim().toLowerCase();
  return getCatalog().filter((p) => {
    const matchCat = !category || p.category === category;
    const matchQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.sellerName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return matchCat && matchQ;
  });
}

export function getUsers() {
  return readJson(USERS_KEY, []);
}

export function registerCustomer({ name, email, phone, password }) {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }
  const user = {
    id: uid(),
    name,
    email: email.toLowerCase(),
    phone,
    password,
    role: "customer",
  };
  users.push(user);
  writeJson(USERS_KEY, users);

  const data = seedCustomerData({
    name,
    email: email.toLowerCase(),
    phone,
  });
  data.cart = [];
  data.wishlist = [];
  data.orders = [];
  data.subscriptions = [];
  data.notifications = [
    {
      id: uid(),
      title: "Welcome to FreshFarm",
      body: "Browse farm-fresh dairy and set up a milk subscription anytime.",
      read: false,
      createdAt: new Date().toISOString(),
    },
  ];
  writeJson(`${DATA_KEY}_${user.id}`, data);
  writeJson(SESSION_KEY, {
    userId: user.id,
    email: user.email,
    role: "customer",
  });
  return { id: user.id, name: user.name, email: user.email, role: "customer" };
}

export function loginCustomer({ email, password }) {
  let users = getUsers();

  if (
    email.toLowerCase() === "customer@freshfarm.demo" &&
    password === "customer123" &&
    !users.some((u) => u.email === "customer@freshfarm.demo")
  ) {
    const demo = {
      id: "demo-customer",
      name: "Priya Shah",
      email: "customer@freshfarm.demo",
      phone: "9811100001",
      password: "customer123",
      role: "customer",
    };
    users = [...users, demo];
    writeJson(USERS_KEY, users);
    if (!localStorage.getItem(`${DATA_KEY}_${demo.id}`)) {
      writeJson(`${DATA_KEY}_${demo.id}`, seedCustomerData());
    }
  }

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) throw new Error("Invalid email or password.");

  if (!localStorage.getItem(`${DATA_KEY}_${user.id}`)) {
    writeJson(
      `${DATA_KEY}_${user.id}`,
      seedCustomerData({
        name: user.name,
        email: user.email,
        phone: user.phone,
      })
    );
  }

  writeJson(SESSION_KEY, {
    userId: user.id,
    email: user.email,
    role: "customer",
  });
  return { id: user.id, name: user.name, email: user.email, role: "customer" };
}

export function logoutCustomer() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCustomerSession() {
  return readJson(SESSION_KEY, null);
}

function dataKey(userId) {
  return `${DATA_KEY}_${userId}`;
}

export function loadCustomerData(userId) {
  const data = readJson(dataKey(userId), null);
  if (data) return data;
  const seeded = seedCustomerData();
  writeJson(dataKey(userId), seeded);
  return seeded;
}

export function saveCustomerData(userId, data) {
  writeJson(dataKey(userId), data);
}

function pushNotification(data, title, body) {
  data.notifications = [
    {
      id: uid(),
      title,
      body,
      read: false,
      createdAt: new Date().toISOString(),
    },
    ...data.notifications,
  ];
}

export function updateCustomerProfile(userId, profile) {
  const data = loadCustomerData(userId);
  data.profile = { ...data.profile, ...profile };
  saveCustomerData(userId, data);
  return data.profile;
}

export function addAddress(userId, address) {
  const data = loadCustomerData(userId);
  const next = { id: uid(), isDefault: data.addresses.length === 0, ...address };
  if (next.isDefault) {
    data.addresses = data.addresses.map((a) => ({ ...a, isDefault: false }));
  }
  data.addresses = [next, ...data.addresses];
  saveCustomerData(userId, data);
  return next;
}

export function updateAddress(userId, addressId, patch) {
  const data = loadCustomerData(userId);
  if (patch.isDefault) {
    data.addresses = data.addresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
  }
  data.addresses = data.addresses.map((a) =>
    a.id === addressId ? { ...a, ...patch } : a
  );
  saveCustomerData(userId, data);
  return data.addresses.find((a) => a.id === addressId);
}

export function deleteAddress(userId, addressId) {
  const data = loadCustomerData(userId);
  const removed = data.addresses.find((a) => a.id === addressId);
  data.addresses = data.addresses.filter((a) => a.id !== addressId);
  if (removed?.isDefault && data.addresses[0]) {
    data.addresses[0].isDefault = true;
  }
  saveCustomerData(userId, data);
}

export function addToCart(userId, productId, qty = 1) {
  const product = getProductById(productId);
  if (!product || !product.available) throw new Error("Product unavailable.");
  const data = loadCustomerData(userId);
  const existing = data.cart.find((i) => i.productId === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    data.cart.push({
      productId,
      name: product.name,
      price: product.price,
      unit: product.unit,
      sellerName: product.sellerName,
      qty,
    });
  }
  saveCustomerData(userId, data);
  return data.cart;
}

export function updateCartQty(userId, productId, qty) {
  const data = loadCustomerData(userId);
  if (qty <= 0) {
    data.cart = data.cart.filter((i) => i.productId !== productId);
  } else {
    data.cart = data.cart.map((i) =>
      i.productId === productId ? { ...i, qty } : i
    );
  }
  saveCustomerData(userId, data);
  return data.cart;
}

export function clearCart(userId) {
  const data = loadCustomerData(userId);
  data.cart = [];
  saveCustomerData(userId, data);
}

export function toggleWishlist(userId, productId) {
  const data = loadCustomerData(userId);
  if (data.wishlist.includes(productId)) {
    data.wishlist = data.wishlist.filter((id) => id !== productId);
  } else {
    data.wishlist = [productId, ...data.wishlist];
  }
  saveCustomerData(userId, data);
  return data.wishlist;
}

export function placeOrder(userId, { addressId, paymentMethod }) {
  const data = loadCustomerData(userId);
  if (!data.cart.length) throw new Error("Your cart is empty.");
  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    throw new Error("Choose UPI, Card, or COD.");
  }
  const address = data.addresses.find((a) => a.id === addressId);
  if (!address) throw new Error("Select a delivery address.");

  const total = data.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const order = {
    id: `co-${uid()}`,
    items: data.cart.map((i) => ({ ...i })),
    total,
    paymentMethod,
    status: "PLACED",
    address: { ...address },
    createdAt: new Date().toISOString(),
    ratings: null,
  };
  data.orders = [order, ...data.orders];
  data.cart = [];
  pushNotification(
    data,
    "Order placed",
    `Order #${order.id.slice(-6)} placed via ${paymentMethod}. Total ₹${total}.`
  );
  saveCustomerData(userId, data);
  return order;
}

export function cancelOrder(userId, orderId) {
  const data = loadCustomerData(userId);
  const order = data.orders.find((o) => o.id === orderId);
  if (!order) throw new Error("Order not found.");
  if (["DELIVERED", "CANCELLED", "OUT_FOR_DELIVERY"].includes(order.status)) {
    throw new Error("This order can no longer be cancelled.");
  }
  order.status = "CANCELLED";
  pushNotification(
    data,
    "Order cancelled",
    `Order #${order.id.slice(-6)} was cancelled.`
  );
  saveCustomerData(userId, data);
  return order;
}

export function rateOrder(userId, orderId, ratings) {
  const data = loadCustomerData(userId);
  const order = data.orders.find((o) => o.id === orderId);
  if (!order) throw new Error("Order not found.");
  if (order.status !== "DELIVERED") {
    throw new Error("You can rate only after delivery.");
  }
  order.ratings = {
    product: Number(ratings.product) || 0,
    seller: Number(ratings.seller) || 0,
    delivery: Number(ratings.delivery) || 0,
  };
  pushNotification(data, "Thanks for rating", "Your feedback helps local farms.");
  saveCustomerData(userId, data);
  return order;
}

export function markNotificationRead(userId, notificationId) {
  const data = loadCustomerData(userId);
  data.notifications = data.notifications.map((n) =>
    n.id === notificationId ? { ...n, read: true } : n
  );
  saveCustomerData(userId, data);
}

export function markAllNotificationsRead(userId) {
  const data = loadCustomerData(userId);
  data.notifications = data.notifications.map((n) => ({ ...n, read: true }));
  saveCustomerData(userId, data);
}

function nextDeliveryDate(frequency, customDays = []) {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  if (frequency === "weekly") d.setDate(d.getDate() + 6);
  if (frequency === "alternate") d.setDate(d.getDate() + 1);
  if (frequency === "custom" && customDays.length) {
    for (let i = 0; i < 14; i += 1) {
      const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
      if (customDays.includes(day)) break;
      d.setDate(d.getDate() + 1);
    }
  }
  return d.toISOString().slice(0, 10);
}

export function createSubscription(userId, payload) {
  const product = getProductById(payload.productId);
  if (!product) throw new Error("Product not found.");
  const data = loadCustomerData(userId);
  const sub = {
    id: uid(),
    productId: product.id,
    productName: product.name,
    sellerName: product.sellerName,
    qty: Number(payload.qty) || 1,
    unit: product.unit,
    price: product.price,
    frequency: payload.frequency,
    customDays: payload.customDays || [],
    status: "active",
    nextDelivery: nextDeliveryDate(payload.frequency, payload.customDays),
    skippedDates: [],
  };
  data.subscriptions = [sub, ...data.subscriptions];
  pushNotification(
    data,
    "Subscription started",
    `${product.name} — ${SUBSCRIPTION_FREQUENCIES.find((f) => f.id === payload.frequency)?.label || payload.frequency}.`
  );
  saveCustomerData(userId, data);
  return sub;
}

export function updateSubscription(userId, subId, patch) {
  const data = loadCustomerData(userId);
  data.subscriptions = data.subscriptions.map((s) =>
    s.id === subId ? { ...s, ...patch } : s
  );
  saveCustomerData(userId, data);
  return data.subscriptions.find((s) => s.id === subId);
}

export function skipSubscriptionDelivery(userId, subId, date = todayISO()) {
  const data = loadCustomerData(userId);
  const sub = data.subscriptions.find((s) => s.id === subId);
  if (!sub) throw new Error("Subscription not found.");
  if (!sub.skippedDates.includes(date)) {
    sub.skippedDates = [...sub.skippedDates, date];
  }
  const next = new Date(sub.nextDelivery);
  next.setDate(next.getDate() + (sub.frequency === "alternate" ? 2 : 1));
  sub.nextDelivery = next.toISOString().slice(0, 10);
  pushNotification(
    data,
    "Delivery skipped",
    `Skipped ${sub.productName} for ${date}. Next: ${sub.nextDelivery}.`
  );
  saveCustomerData(userId, data);
  return sub;
}

export function pauseSubscription(userId, subId) {
  return updateSubscription(userId, subId, { status: "paused" });
}

export function resumeSubscription(userId, subId) {
  return updateSubscription(userId, subId, { status: "active" });
}

export function cancelSubscription(userId, subId) {
  const data = loadCustomerData(userId);
  const sub = data.subscriptions.find((s) => s.id === subId);
  if (!sub) throw new Error("Subscription not found.");
  sub.status = "cancelled";
  pushNotification(
    data,
    "Subscription cancelled",
    `${sub.productName} subscription has been cancelled.`
  );
  saveCustomerData(userId, data);
  return sub;
}

export function cartTotal(cart) {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function unreadCount(notifications) {
  return notifications.filter((n) => !n.read).length;
}
