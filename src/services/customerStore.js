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

/** Default shop catalog — shared so Admin → Products matches /products. */
export function getDefaultCatalogProducts() {
  return seedCatalog();
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

function saveCatalog(catalog) {
  writeJson(CATALOG_KEY, catalog);
}

/**
 * Publish a broker-accepted farmer listing into the customer product catalog.
 */
export function publishToCatalog({
  productId,
  farmerId,
  farmerName,
  farmName,
  product,
}) {
  const catalog = getCatalog();
  const stock = Number(product?.stock) || 0;
  const next = {
    id: productId,
    name: product.name,
    category: product.type || product.category || "Cow Milk",
    price: Number(product.price) || 0,
    unit: product.unit || "litre",
    sellerId: farmerId,
    sellerName: farmName || farmerName || "Farm",
    stock,
    available: product.available !== false && stock > 0,
    rating: 0,
    description: product.description || "",
  };

  const idx = catalog.findIndex((p) => p.id === next.id);
  if (idx >= 0) {
    catalog[idx] = {
      ...catalog[idx],
      ...next,
      rating: catalog[idx].rating ?? 0,
    };
  } else {
    catalog.unshift(next);
  }
  saveCatalog(catalog);
  return next;
}

export function removeFromCatalog(productId) {
  saveCatalog(getCatalog().filter((p) => p.id !== productId));
}

/**
 * Ensure every admin-approved product appears in the shop catalog.
 */
export function syncAdminApprovedToCatalog(adminProducts = []) {
  const catalog = getCatalog();
  const existing = new Set(catalog.map((p) => p.id));
  let changed = false;

  for (const p of adminProducts) {
    if (p.status !== "approved" || !p.id) continue;
    if (existing.has(p.id)) continue;
    catalog.unshift({
      id: p.id,
      name: p.name,
      category: p.category || "Cow Milk",
      price: Number(p.price) || 0,
      unit: p.unit || "litre",
      sellerId: p.sellerId || "unknown",
      sellerName: p.seller || "Farm",
      stock: Number(p.stock) || 0,
      available: (Number(p.stock) || 0) > 0,
      rating: 0,
      description: p.description || "",
    });
    existing.add(p.id);
    changed = true;
  }

  if (changed) saveCatalog(catalog);
  return getCatalog();
}

/**
 * Ensure every broker-accepted submission appears in the shop catalog.
 * @deprecated Prefer admin approval → syncAdminApprovedToCatalog.
 */
export function syncAcceptedSubmissionsToCatalog(submissions = []) {
  const catalog = getCatalog();
  const existing = new Set(catalog.map((p) => p.id));
  let changed = false;

  for (const item of submissions) {
    if (item.status !== "accepted" || !item.productId || !item.product) continue;
    if (existing.has(item.productId)) continue;
    catalog.unshift({
      id: item.productId,
      name: item.product.name,
      category: item.product.type || item.product.category || "Cow Milk",
      price: Number(item.product.price) || 0,
      unit: item.product.unit || "litre",
      sellerId: item.farmerId,
      sellerName: item.farmName || item.farmerName || "Farm",
      stock: Number(item.product.stock) || 0,
      available:
        item.product.available !== false &&
        (Number(item.product.stock) || 0) > 0,
      rating: 0,
      description: item.product.description || "",
    });
    existing.add(item.productId);
    changed = true;
  }

  if (changed) saveCatalog(catalog);
  return getCatalog();
}

export function getProductById(productId) {
  return getCatalog().find((p) => p.id === productId) || null;
}

export function searchCatalog({ query = "", category = "" } = {}) {
  // Keep catalog current with admin-approved products.
  try {
    const raw = localStorage.getItem("freshfarm_admin_data");
    if (raw) {
      const admin = JSON.parse(raw);
      if (Array.isArray(admin?.products)) {
        syncAdminApprovedToCatalog(admin.products);
      }
    }
  } catch {
    /* ignore corrupt storage */
  }

  const q = query.trim().toLowerCase();
  return getCatalog().filter((p) => {
    const matchCat = !category || p.category === category;
    const matchQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.sellerName.toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q);
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
  if (data) {
    // Keep cart line prices / seller ids matched to the live catalog.
    if (Array.isArray(data.cart) && data.cart.length) {
      data.cart = refreshCartItems(data.cart);
      writeJson(dataKey(userId), data);
    }
    return data;
  }
  const seeded = seedCustomerData();
  writeJson(dataKey(userId), seeded);
  return seeded;
}

/**
 * Reprice cart lines from the current /products catalog so cart totals
 * match what the farmer sees after checkout.
 */
export function refreshCartItems(cart = []) {
  return cart
    .map((item) => {
      const live = getProductById(item.productId);
      if (!live) return null;
      const qty = Number(item.qty) || 0;
      if (qty <= 0) return null;
      const price = Number(live.price) || 0;
      return {
        productId: live.id,
        name: live.name,
        price,
        unit: live.unit || item.unit || "unit",
        sellerId: live.sellerId || item.sellerId || "demo-seller",
        sellerName: live.sellerName || item.sellerName || "Farm",
        qty,
        lineTotal: price * qty,
      };
    })
    .filter(Boolean);
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
  const addQty = Number(qty) || 1;
  const price = Number(product.price) || 0;
  const existing = data.cart.find((i) => i.productId === productId);
  if (existing) {
    existing.qty = (Number(existing.qty) || 0) + addQty;
    existing.price = price;
    existing.name = product.name;
    existing.unit = product.unit;
    existing.sellerId = product.sellerId || "demo-seller";
    existing.sellerName = product.sellerName;
    existing.lineTotal = price * existing.qty;
  } else {
    data.cart.push({
      productId: product.id,
      name: product.name,
      price,
      unit: product.unit,
      sellerId: product.sellerId || "demo-seller",
      sellerName: product.sellerName,
      qty: addQty,
      lineTotal: price * addQty,
    });
  }
  data.cart = refreshCartItems(data.cart);
  saveCustomerData(userId, data);
  return data.cart;
}

export function updateCartQty(userId, productId, qty) {
  const data = loadCustomerData(userId);
  if (qty <= 0) {
    data.cart = data.cart.filter((i) => i.productId !== productId);
  } else {
    data.cart = data.cart.map((i) =>
      i.productId === productId ? { ...i, qty: Number(qty) || 0 } : i
    );
  }
  data.cart = refreshCartItems(data.cart);
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

  // Always checkout at live catalog prices so seller/orders matches the cart.
  const items = refreshCartItems(data.cart);
  if (!items.length) {
    throw new Error("Your cart is empty or products are unavailable.");
  }

  for (const item of items) {
    const live = getProductById(item.productId);
    if (!live || !live.available) {
      throw new Error(`${item.name} is out of stock. Update your cart.`);
    }
  }

  const total = items.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.qty),
    0
  );
  const order = {
    id: `co-${uid()}`,
    items,
    total,
    paymentMethod,
    status: "PLACED",
    address: { ...address },
    createdAt: new Date().toISOString(),
    ratings: null,
    customerId: userId,
    customerName: data.profile?.name || "Customer",
    customerPhone: data.profile?.phone || address.phone || "",
  };
  data.orders = [order, ...data.orders];
  data.cart = [];
  pushNotification(
    data,
    "Order placed",
    `Order #${order.id.slice(-8)} placed via ${paymentMethod}. Total ₹${total}.`
  );
  saveCustomerData(userId, data);

  // Forward to farmer portal(s) — delivery only happens after farmer assigns a middleman.
  import("./sellerStore")
    .then(({ receiveCustomerOrder }) => {
      receiveCustomerOrder(order);
    })
    .catch(() => {
      /* seller handoff best-effort in demo */
    });

  return order;
}

/**
 * Keep the customer order status in sync with farmer / delivery updates.
 */
export function syncCustomerOrderStatus(customerOrderId, status, extra = {}) {
  if (!customerOrderId || !status) return;

  // Customer orders live under freshfarm_customer_data_<userId>
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith("freshfarm_customer_data_")) continue;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const data = JSON.parse(raw);
      if (!Array.isArray(data.orders)) continue;
      const idx = data.orders.findIndex((o) => o.id === customerOrderId);
      if (idx < 0) continue;
      data.orders[idx] = {
        ...data.orders[idx],
        status,
        ...extra,
      };
      if (status === "ASSIGNED") {
        pushNotification(
          data,
          "Out for farm pickup",
          `Order #${customerOrderId.slice(-8)} was assigned to a delivery partner.`
        );
      } else if (status === "OUT_FOR_DELIVERY") {
        pushNotification(
          data,
          "Out for delivery",
          `Order #${customerOrderId.slice(-8)} is on the way.`
        );
      } else if (status === "DELIVERED") {
        pushNotification(
          data,
          "Delivered",
          `Order #${customerOrderId.slice(-8)} was delivered. Enjoy!`
        );
      } else if (status === "CONFIRMED") {
        pushNotification(
          data,
          "Order confirmed",
          `Order #${customerOrderId.slice(-8)} was confirmed by the farm.`
        );
      } else if (status === "READY_FOR_PICKUP") {
        pushNotification(
          data,
          "Ready for pickup",
          `Order #${customerOrderId.slice(-8)} is ready at the farm.`
        );
      }
      writeJson(key, data);
      return;
    } catch {
      /* skip corrupt */
    }
  }
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
  return refreshCartItems(cart || []).reduce(
    (sum, i) => sum + Number(i.price) * Number(i.qty),
    0
  );
}

export function unreadCount(notifications) {
  return notifications.filter((n) => !n.read).length;
}
