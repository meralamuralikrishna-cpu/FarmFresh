import { submitFarmerListing } from "./brokerStore";
import { receiveAssignedOrder } from "./middlemanStore";
import {
  getCatalog,
  getDefaultCatalogProducts,
  getProductById,
  publishToCatalog,
} from "./customerStore";

function mirrorCustomerStatus(orderId, status, extra) {
  if (!orderId) return;
  import("./customerStore")
    .then(({ syncCustomerOrderStatus }) => {
      syncCustomerOrderStatus(orderId, status, extra);
    })
    .catch(() => {});
}

function catalogToSellerProduct(p) {
  return {
    id: p.id,
    name: p.name,
    type: p.category || p.type || "Cow Milk",
    price: Number(p.price) || 0,
    unit: p.unit || "litre",
    stock: Number(p.stock) || 0,
    available: p.available !== false && (Number(p.stock) || 0) > 0,
    brokerStatus: "accepted",
    description: p.description || "",
  };
}

function demoSellerProductsFromCatalog() {
  return getDefaultCatalogProducts()
    .filter((p) => p.sellerId === "demo-seller")
    .map(catalogToSellerProduct);
}

const USERS_KEY = "freshfarm_seller_users";
const SESSION_KEY = "freshfarm_seller_session";
const DATA_KEY = "freshfarm_seller_data";

export const PRODUCT_TYPES = [
  "Cow Milk",
  "Buffalo Milk",
  "Curd",
  "Paneer",
  "Ghee",
  "Buttermilk",
];

export const BROKER_STATUS_LABELS = {
  pending: "Sent to Product Reviewer",
  accepted: "Product Reviewer accepted",
  rejected: "Product Reviewer rejected",
};

export const ORDER_STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "READY_FOR_PICKUP",
];

export const ORDER_STATUS_LABELS = {
  PLACED: "New",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY_FOR_PICKUP: "Ready for Pickup",
  ASSIGNED: "Assigned",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
};

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

function seedData() {
  const now = new Date();
  const earlier = new Date(now.getTime() - 86400000 * 2);

  return {
    profile: {
      farmName: "Green Pasture Dairy",
      ownerName: "Ramesh Patel",
      phone: "9876543210",
      email: "farmer@freshfarm.demo",
      address: "Village Kheda, Anand, Gujarat",
      bio: "Family-run dairy producing fresh milk and traditional dairy products.",
    },
    // Same Green Pasture items as /products (catalog ids c1–c6).
    products: demoSellerProductsFromCatalog(),
    middlemen: [
      {
        id: "m1",
        name: "Suresh Delivery",
        phone: "9000011111",
        email: "delivery@freshfarm.demo",
        area: "Anand East",
        status: "available",
        portalUserId: "demo-middleman",
      },
      {
        id: "m2",
        name: "Kiran Logistics",
        phone: "9000022222",
        email: "kiran@freshfarm.demo",
        area: "Anand West",
        status: "available",
        portalUserId: "demo-middleman-kiran",
      },
      {
        id: "m3",
        name: "Mehta Express",
        phone: "9000033333",
        email: "mehta@freshfarm.demo",
        area: "Nearby villages",
        status: "busy",
        portalUserId: "demo-middleman-mehta",
      },
    ],
    orders: [
      {
        id: "o1",
        customerName: "Priya Shah",
        address: "12 Lake Road, Anand",
        phone: "9811100001",
        items: [
          { productId: "c1", name: "Fresh Cow Milk", qty: 2, price: 56 },
          { productId: "c3", name: "Homemade Curd", qty: 1, price: 60 },
        ],
        total: 172,
        status: "PLACED",
        middlemanId: null,
        createdAt: now.toISOString(),
      },
      {
        id: "o2",
        customerName: "Amit Desai",
        address: "88 Market Lane",
        phone: "9811100002",
        items: [{ productId: "c2", name: "Buffalo Milk", qty: 3, price: 72 }],
        total: 216,
        status: "CONFIRMED",
        middlemanId: null,
        createdAt: now.toISOString(),
      },
      {
        id: "o3",
        customerName: "Neha Joshi",
        address: "5 Garden Colony",
        phone: "9811100003",
        items: [
          { productId: "c4", name: "Fresh Paneer", qty: 1, price: 320 },
          { productId: "c5", name: "Pure Ghee", qty: 1, price: 680 },
        ],
        total: 1000,
        status: "PREPARING",
        middlemanId: null,
        createdAt: earlier.toISOString(),
      },
      {
        id: "o4",
        customerName: "Vikram Rao",
        address: "21 Station Road",
        phone: "9811100004",
        items: [{ productId: "c1", name: "Fresh Cow Milk", qty: 5, price: 56 }],
        total: 280,
        status: "READY_FOR_PICKUP",
        middlemanId: null,
        createdAt: earlier.toISOString(),
      },
      {
        id: "o5",
        customerName: "Sneha Mehta",
        address: "9 River View",
        phone: "9811100005",
        items: [{ productId: "c3", name: "Homemade Curd", qty: 2, price: 60 }],
        total: 120,
        status: "DELIVERED",
        middlemanId: "m1",
        createdAt: earlier.toISOString(),
        deliveredAt: earlier.toISOString(),
      },
    ],
    payments: [
      {
        id: "pay1",
        orderId: "o5",
        customerName: "Sneha Mehta",
        amount: 120,
        method: "UPI",
        status: "Paid",
        date: earlier.toISOString().slice(0, 10),
      },
      {
        id: "pay2",
        orderId: "o0",
        customerName: "Walk-in / prior sale",
        amount: 840,
        method: "COD",
        status: "Paid",
        date: todayISO(),
      },
      {
        id: "pay3",
        orderId: "o0b",
        customerName: "Subscription batch",
        amount: 1120,
        method: "UPI",
        status: "Paid",
        date: todayISO(),
      },
    ],
    reviews: [
      {
        id: "r1",
        customerName: "Sneha Mehta",
        productName: "Homemade Curd",
        rating: 5,
        comment: "Thick and fresh — tastes like homemade.",
        date: earlier.toISOString().slice(0, 10),
      },
      {
        id: "r2",
        customerName: "Rahul Iyer",
        productName: "Fresh Cow Milk",
        rating: 4,
        comment: "Arrived cold. Would love slightly earlier slot.",
        date: todayISO(),
      },
      {
        id: "r3",
        customerName: "Kavita Nair",
        productName: "Pure Ghee",
        rating: 5,
        comment: "Aroma is excellent. Will reorder.",
        date: todayISO(),
      },
    ],
  };
}

export function getUsers() {
  return readJson(USERS_KEY, []);
}

export function registerSeller({ name, email, phone, password, farmName }) {
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
    farmName,
    role: "seller",
  };
  users.push(user);
  writeJson(USERS_KEY, users);

  const data = seedData();
  data.profile = {
    ...data.profile,
    farmName: farmName || data.profile.farmName,
    ownerName: name,
    phone,
    email: email.toLowerCase(),
  };
  writeJson(`${DATA_KEY}_${user.id}`, data);
  writeJson(SESSION_KEY, { userId: user.id, email: user.email, role: "seller" });
  return { id: user.id, name: user.name, email: user.email, role: "seller" };
}

export function loginSeller({ email, password }) {
  let users = getUsers();

  // Demo account for quick access
  if (
    email.toLowerCase() === "farmer@freshfarm.demo" &&
    password === "farmer123" &&
    !users.some((u) => u.email === "farmer@freshfarm.demo")
  ) {
    const demo = {
      id: "demo-seller",
      name: "Ramesh Patel",
      email: "farmer@freshfarm.demo",
      phone: "9876543210",
      password: "farmer123",
      farmName: "Green Pasture Dairy",
      role: "seller",
    };
    users = [...users, demo];
    writeJson(USERS_KEY, users);
    if (!localStorage.getItem(`${DATA_KEY}_${demo.id}`)) {
      writeJson(`${DATA_KEY}_${demo.id}`, seedData());
    }
  }

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) throw new Error("Invalid email or password.");

  if (!localStorage.getItem(`${DATA_KEY}_${user.id}`)) {
    writeJson(`${DATA_KEY}_${user.id}`, seedData());
  }

  writeJson(SESSION_KEY, {
    userId: user.id,
    email: user.email,
    role: "seller",
  });
  return { id: user.id, name: user.name, email: user.email, role: "seller" };
}

export function logoutSeller() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  return readJson(SESSION_KEY, null);
}

function dataKey(userId) {
  return `${DATA_KEY}_${userId}`;
}

const MIDDLEMAN_PORTAL_DEFAULTS = {
  m1: {
    email: "delivery@freshfarm.demo",
    portalUserId: "demo-middleman",
  },
  m2: {
    email: "kiran@freshfarm.demo",
    portalUserId: "demo-middleman-kiran",
  },
  m3: {
    email: "mehta@freshfarm.demo",
    portalUserId: "demo-middleman-mehta",
  },
};

function normalizeMiddlemen(list = []) {
  return list.map((m) => {
    const defaults = MIDDLEMAN_PORTAL_DEFAULTS[m.id] || {};
    return {
      ...m,
      email: m.email || defaults.email || "",
      portalUserId: m.portalUserId || defaults.portalUserId || `portal-${m.id}`,
    };
  });
}

/**
 * Keep farmer /seller/products aligned with live /products for this farm.
 * Pulls catalog items by sellerId, farm name, and known Green Pasture names
 * (incl. leftovers like "Village Ghee") so out-of-stock shop items can be restocked.
 */
function alignSellerProductsWithCatalog(userId, data) {
  const farmName = (data.profile?.farmName || "").trim().toLowerCase();
  const catalog = getCatalog();
  const defaults =
    userId === "demo-seller" ? getDefaultCatalogProducts().filter((p) => p.sellerId === "demo-seller") : [];

  const knownNames = new Set(
    [
      ...defaults.map((p) => p.name.toLowerCase()),
      "village ghee",
      "fresh cow milk",
      "buffalo milk",
      "pure ghee",
      "homemade curd",
      "fresh paneer",
      "farm buttermilk",
    ].map((n) => n.toLowerCase())
  );

  const catalogMine = catalog.filter((p) => {
    const sellerIdMatch =
      p.sellerId === userId ||
      (userId === "demo-seller" &&
        (!p.sellerId ||
          p.sellerId === "demo-seller" ||
          p.sellerId === "unknown"));
    const farmMatch =
      farmName &&
      String(p.sellerName || "")
        .trim()
        .toLowerCase() === farmName;
    const nameMatch =
      userId === "demo-seller" && knownNames.has(String(p.name || "").toLowerCase());
    return sellerIdMatch || farmMatch || nameMatch;
  });

  // Always include default Green Pasture seed rows for the demo farmer.
  const wanted = new Map();
  for (const p of defaults) wanted.set(p.id, p);
  for (const p of catalogMine) wanted.set(p.id, p);

  const byId = new Map((data.products || []).map((p) => [p.id, p]));
  const byName = new Map(
    [...byId.values()].map((p) => [String(p.name || "").toLowerCase(), p])
  );

  // Drop legacy p1–p6 seeds.
  let changed = false;
  for (const id of ["p1", "p2", "p3", "p4", "p5", "p6"]) {
    if (byId.delete(id)) changed = true;
  }

  for (const [id, c] of wanted.entries()) {
    if (byId.has(id)) continue;

    // Avoid duplicating if an old row already has the same name.
    const nameKey = String(c.name || "").toLowerCase();
    const existingByName = byName.get(nameKey);
    if (existingByName && String(existingByName.id).startsWith("p")) {
      byId.delete(existingByName.id);
    } else if (existingByName && existingByName.id !== id) {
      // Keep farmer row; also ensure catalog id exists for shop sync.
    }

    byId.set(id, catalogToSellerProduct(c));
    byName.set(nameKey, byId.get(id));
    changed = true;
  }

  // Village Ghee leftover with no catalog id in defaults — still show for restock.
  const village = catalog.find(
    (p) => String(p.name || "").toLowerCase() === "village ghee"
  );
  if (village && userId === "demo-seller" && !byId.has(village.id)) {
    byId.set(village.id, catalogToSellerProduct(village));
    changed = true;
  }

  // Force rematch until every wanted catalog id is present.
  const missing = [...wanted.keys()].some((id) => !byId.has(id));
  if (missing || data._productsVersion !== 3 || changed) {
    data.products = [...byId.values()].sort((a, b) =>
      String(a.name).localeCompare(String(b.name))
    );
    data._productsVersion = 3;
  }

  return data;
}

export function loadSellerData(userId) {
  const data = readJson(dataKey(userId), null);
  if (data) {
    // Older demo data may lack brokerStatus — treat as already accepted.
    data.products = (data.products || []).map((p) => ({
      ...p,
      brokerStatus: p.brokerStatus || "accepted",
    }));
    data.middlemen = normalizeMiddlemen(data.middlemen || []);
    alignSellerProductsWithCatalog(userId, data);
    writeJson(dataKey(userId), data);
    return data;
  }
  const seeded = seedData();
  seeded._productsVersion = 3;
  writeJson(dataKey(userId), seeded);
  return seeded;
}

export function saveSellerData(userId, data) {
  writeJson(dataKey(userId), data);
}

export function createProduct(userId, product) {
  const data = loadSellerData(userId);
  const next = {
    id: uid(),
    available: true,
    stock: 0,
    price: 0,
    unit: "litre",
    description: "",
    ...product,
    brokerStatus: "pending",
  };
  data.products = [next, ...data.products];
  saveSellerData(userId, data);

  // Farmer sets the price; listing is forwarded to the broker for review.
  submitFarmerListing({
    farmerId: userId,
    farmerName: data.profile?.ownerName || "Farmer",
    farmName: data.profile?.farmName || "Farm",
    product: next,
  });

  return next;
}

export function updateProduct(userId, productId, patch) {
  const data = loadSellerData(userId);
  data.products = data.products.map((p) => {
    if (p.id !== productId) return p;
    const next = { ...p, ...patch };
    // Restocking should put the item back on the shop.
    if ("stock" in patch) {
      const stock = Number(next.stock) || 0;
      next.stock = stock;
      next.available = stock > 0;
    }
    return next;
  });
  saveSellerData(userId, data);
  const updated = data.products.find((p) => p.id === productId);

  // Keep customer /products in sync for broker-accepted (live) listings.
  if (updated && (updated.brokerStatus || "accepted") === "accepted") {
    publishToCatalog({
      productId: updated.id,
      farmerId: userId,
      farmerName: data.profile?.ownerName,
      farmName: data.profile?.farmName,
      product: {
        name: updated.name,
        type: updated.type,
        category: updated.type,
        price: updated.price,
        unit: updated.unit,
        stock: updated.stock,
        available: updated.available,
        description: updated.description || "",
      },
    });
  }

  return updated;
}

export function deleteProduct(userId, productId) {
  const data = loadSellerData(userId);
  data.products = data.products.filter((p) => p.id !== productId);
  saveSellerData(userId, data);
}

export function updateProfile(userId, profile) {
  const data = loadSellerData(userId);
  data.profile = { ...data.profile, ...profile };
  saveSellerData(userId, data);
  return data.profile;
}

const NEXT_STATUS = {
  PLACED: "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "READY_FOR_PICKUP",
};

/**
 * Customer checkout → farmer Orders as PLACED.
 * Delivery portal only gets it later, after farmer assigns a middleman.
 */
export function receiveCustomerOrder(customerOrder) {
  if (!customerOrder?.items?.length) return [];

  // Checkout creates a price/product snapshot for the order. Keep that snapshot
  // when forwarding it to the seller: the catalog may change after checkout.
  const normalizedItems = customerOrder.items.map((item) => {
    const live = getProductById(item.productId);
    const price = Number(item.price ?? live?.price) || 0;
    const qty = Number(item.qty) || 0;
    return {
      productId: item.productId || live?.id,
      name: item.name || live?.name || "Product",
      qty,
      price,
      unit: item.unit || live?.unit || "unit",
      sellerId: item.sellerId || live?.sellerId || "demo-seller",
      sellerName: item.sellerName || live?.sellerName || "Farm",
      lineTotal: price * qty,
    };
  });

  const groups = new Map();
  for (const item of normalizedItems) {
    const sellerId = item.sellerId || "demo-seller";
    if (!groups.has(sellerId)) groups.set(sellerId, []);
    groups.get(sellerId).push(item);
  }

  const created = [];
  for (const [sellerId, items] of groups.entries()) {
    const portalId = resolveSellerPortalId(sellerId);
    const data = loadSellerData(portalId);
    if (
      data.orders.some(
        (o) => o.id === customerOrder.id || o.customerOrderId === customerOrder.id
      )
    ) {
      continue;
    }

    const address = customerOrder.address
      ? [
          customerOrder.address.line1,
          customerOrder.address.city,
          customerOrder.address.state,
          customerOrder.address.pincode,
        ]
          .filter(Boolean)
          .join(", ")
      : "";

    const total = items.reduce((sum, i) => sum + Number(i.lineTotal), 0);
    const entry = {
      id: customerOrder.id,
      customerOrderId: customerOrder.id,
      customerId: customerOrder.customerId,
      customerName: customerOrder.customerName || "Customer",
      address,
      phone:
        customerOrder.customerPhone ||
        customerOrder.address?.phone ||
        "",
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        qty: i.qty,
        price: i.price,
        unit: i.unit,
        lineTotal: i.lineTotal,
      })),
      total,
      paymentMethod: customerOrder.paymentMethod,
      status: "PLACED",
      middlemanId: null,
      createdAt: customerOrder.createdAt || new Date().toISOString(),
    };

    data.orders = [entry, ...data.orders];
    saveSellerData(portalId, data);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("freshfarm:seller-orders-updated", {
          detail: { sellerId: portalId, orderId: entry.id },
        })
      );
    }
    created.push(entry);
  }

  return created;
}

function resolveSellerPortalId(sellerId) {
  if (!sellerId || sellerId === "demo-seller") return "demo-seller";

  const users = getUsers();
  const match = users.find((u) => u.id === sellerId);
  if (match) return match.id;

  // Unknown catalog sellerId — route to demo farmer so the order is still actionable.
  return "demo-seller";
}

/**
 * Recover customer orders whose asynchronous checkout handoff was missed
 * while this seller portal was closed or loading.
 */
export function syncPendingCustomerOrdersForSeller(userId) {
  if (!userId || typeof localStorage === "undefined") return;

  const sellerData = loadSellerData(userId);
  const farmName = String(sellerData.profile?.farmName || "")
    .trim()
    .toLowerCase();

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key?.startsWith("freshfarm_customer_data_")) continue;

    const customerData = readJson(key, null);
    if (!Array.isArray(customerData?.orders)) continue;

    for (const order of customerData.orders) {
      if (order.status !== "PLACED" || !order.items?.length) continue;
      const belongsToSeller = order.items.some((item) => {
        if (item.sellerId === userId) return true;
        return (
          String(item.sellerName || "").trim().toLowerCase() === farmName &&
          (!item.sellerId || item.sellerId === "unknown")
        );
      });
      if (belongsToSeller) receiveCustomerOrder(order);
    }
  }
}

export function advanceOrderStatus(userId, orderId) {
  const data = loadSellerData(userId);
  const order = data.orders.find((o) => o.id === orderId);
  if (!order) throw new Error("Order not found.");
  const next = NEXT_STATUS[order.status];
  if (!next) throw new Error("Order cannot be advanced further from seller side.");
  order.status = next;
  saveSellerData(userId, data);
  mirrorCustomerStatus(order.customerOrderId || order.id, next);
  return order;
}

export function assignMiddleman(userId, orderId, middlemanId) {
  const data = loadSellerData(userId);
  const order = data.orders.find((o) => o.id === orderId);
  if (!order) throw new Error("Order not found.");
  if (order.status !== "READY_FOR_PICKUP" && order.status !== "ASSIGNED") {
    throw new Error("Order must be ready for pickup before assigning delivery.");
  }
  const middleman = data.middlemen.find((m) => m.id === middlemanId);
  if (!middleman) throw new Error("Middleman not found.");
  order.middlemanId = middlemanId;
  order.status = "ASSIGNED";
  middleman.status = "busy";
  saveSellerData(userId, data);

  receiveAssignedOrder({
    portalUserId: middleman.portalUserId,
    email: middleman.email,
    phone: middleman.phone,
    sellerId: userId,
    sellerProfile: data.profile,
    order,
  });

  mirrorCustomerStatus(order.customerOrderId || order.id, "ASSIGNED");
  return order;
}

export function getEarningsSummary(data) {
  const today = todayISO();
  const paid = data.payments.filter((p) => p.status === "Paid");
  const todaySales = paid
    .filter((p) => p.date === today)
    .reduce((sum, p) => sum + p.amount, 0);
  const totalSales = paid.reduce((sum, p) => sum + p.amount, 0);
  const activeOrders = data.orders.filter((o) =>
    ["PLACED", "CONFIRMED", "PREPARING", "READY_FOR_PICKUP", "ASSIGNED"].includes(
      o.status
    )
  ).length;
  return { todaySales, totalSales, activeOrders, productCount: data.products.length };
}
