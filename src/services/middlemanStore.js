const USERS_KEY = "freshfarm_middleman_users";
const SESSION_KEY = "freshfarm_middleman_session";
const DATA_KEY = "freshfarm_middleman_data";

export const DELIVERY_STATUSES = [
  "ASSIGNED",
  "ACCEPTED",
  "AT_SELLER",
  "PICKED_UP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED",
];

export const DELIVERY_STATUS_LABELS = {
  ASSIGNED: "Assigned",
  ACCEPTED: "Accepted",
  AT_SELLER: "At Seller",
  PICKED_UP: "Picked Up",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  FAILED: "Failed Delivery",
};

const NEXT_STATUS = {
  ASSIGNED: "ACCEPTED",
  ACCEPTED: "AT_SELLER",
  AT_SELLER: "PICKED_UP",
  PICKED_UP: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED",
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
  const earlier = new Date(now.getTime() - 86400000);

  return {
    profile: {
      name: "Suresh Delivery",
      phone: "9000011111",
      email: "delivery@freshfarm.demo",
      vehicle: "Bike — GJ-01-AB-1234",
      area: "Anand East",
      bio: "Reliable morning milk delivery across Anand East.",
    },
    orders: [
      {
        id: "md1",
        orderRef: "o4",
        customerName: "Vikram Rao",
        customerPhone: "9811100004",
        address: "21 Station Road, Anand",
        sellerName: "Green Pasture Dairy",
        sellerAddress: "Village Kheda, Anand",
        sellerPhone: "9876543210",
        items: [{ name: "Fresh Cow Milk", qty: 5, unit: "litre" }],
        total: 280,
        status: "ASSIGNED",
        assignedAt: now.toISOString(),
        pickupTime: null,
        deliveryTime: null,
        earning: 40,
      },
      {
        id: "md2",
        orderRef: "o6",
        customerName: "Anita Patel",
        customerPhone: "9811100006",
        address: "44 College Road",
        sellerName: "Green Pasture Dairy",
        sellerAddress: "Village Kheda, Anand",
        sellerPhone: "9876543210",
        items: [
          { name: "Buffalo Milk", qty: 2, unit: "litre" },
          { name: "Homemade Curd", qty: 1, unit: "500g" },
        ],
        total: 204,
        status: "ACCEPTED",
        assignedAt: earlier.toISOString(),
        pickupTime: null,
        deliveryTime: null,
        earning: 35,
      },
      {
        id: "md3",
        orderRef: "o7",
        customerName: "Rohan Shah",
        customerPhone: "9811100007",
        address: "7 Lake View Apartments",
        sellerName: "Green Pasture Dairy",
        sellerAddress: "Village Kheda, Anand",
        sellerPhone: "9876543210",
        items: [{ name: "Fresh Paneer", qty: 1, unit: "kg" }],
        total: 320,
        status: "AT_SELLER",
        assignedAt: earlier.toISOString(),
        pickupTime: null,
        deliveryTime: null,
        earning: 45,
      },
      {
        id: "md4",
        orderRef: "o8",
        customerName: "Meera Joshi",
        customerPhone: "9811100008",
        address: "19 Temple Street",
        sellerName: "Green Pasture Dairy",
        sellerAddress: "Village Kheda, Anand",
        sellerPhone: "9876543210",
        items: [{ name: "Pure Ghee", qty: 1, unit: "litre" }],
        total: 680,
        status: "OUT_FOR_DELIVERY",
        assignedAt: earlier.toISOString(),
        pickupTime: earlier.toISOString(),
        deliveryTime: null,
        earning: 55,
      },
      {
        id: "md5",
        orderRef: "o5",
        customerName: "Sneha Mehta",
        customerPhone: "9811100005",
        address: "9 River View",
        sellerName: "Green Pasture Dairy",
        sellerAddress: "Village Kheda, Anand",
        sellerPhone: "9876543210",
        items: [{ name: "Homemade Curd", qty: 2, unit: "500g" }],
        total: 120,
        status: "DELIVERED",
        assignedAt: earlier.toISOString(),
        pickupTime: earlier.toISOString(),
        deliveryTime: earlier.toISOString(),
        earning: 30,
      },
    ],
  };
}

function dataKey(userId) {
  return `${DATA_KEY}_${userId}`;
}

export function getUsers() {
  return readJson(USERS_KEY, []);
}

export function registerMiddleman({ name, email, phone, password, area, vehicle }) {
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
    area: area || "",
    vehicle: vehicle || "",
    role: "middleman",
  };
  users.push(user);
  writeJson(USERS_KEY, users);

  const data = seedData();
  data.profile = {
    ...data.profile,
    name,
    phone,
    email: email.toLowerCase(),
    area: area || data.profile.area,
    vehicle: vehicle || data.profile.vehicle,
  };
  writeJson(dataKey(user.id), data);
  writeJson(SESSION_KEY, {
    userId: user.id,
    email: user.email,
    role: "middleman",
  });
  return { id: user.id, name: user.name, email: user.email, role: "middleman" };
}

export function loginMiddleman({ email, password }) {
  let users = getUsers();

  if (
    email.toLowerCase() === "delivery@freshfarm.demo" &&
    password === "delivery123" &&
    !users.some((u) => u.email === "delivery@freshfarm.demo")
  ) {
    const demo = {
      id: "demo-middleman",
      name: "Suresh Delivery",
      email: "delivery@freshfarm.demo",
      phone: "9000011111",
      password: "delivery123",
      area: "Anand East",
      vehicle: "Bike — GJ-01-AB-1234",
      role: "middleman",
    };
    users = [...users, demo];
    writeJson(USERS_KEY, users);
    if (!localStorage.getItem(dataKey(demo.id))) {
      writeJson(dataKey(demo.id), seedData());
    }
  }

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) throw new Error("Invalid email or password.");

  if (!localStorage.getItem(dataKey(user.id))) {
    writeJson(dataKey(user.id), seedData());
  }

  writeJson(SESSION_KEY, {
    userId: user.id,
    email: user.email,
    role: "middleman",
  });
  return { id: user.id, name: user.name, email: user.email, role: "middleman" };
}

export function logoutMiddleman() {
  localStorage.removeItem(SESSION_KEY);
}

export function getMiddlemanSession() {
  return readJson(SESSION_KEY, null);
}

export function loadMiddlemanData(userId) {
  const data = readJson(dataKey(userId), null);
  if (data) return data;
  const seeded = seedData();
  writeJson(dataKey(userId), seeded);
  return seeded;
}

export function saveMiddlemanData(userId, data) {
  writeJson(dataKey(userId), data);
}

export function updateMiddlemanProfile(userId, profile) {
  const data = loadMiddlemanData(userId);
  data.profile = { ...data.profile, ...profile };
  saveMiddlemanData(userId, data);
  return data.profile;
}

export function advanceDeliveryStatus(userId, orderId) {
  const data = loadMiddlemanData(userId);
  const order = data.orders.find((o) => o.id === orderId);
  if (!order) throw new Error("Order not found.");
  const next = NEXT_STATUS[order.status];
  if (!next) throw new Error("Cannot advance this delivery further.");
  order.status = next;
  if (next === "PICKED_UP") order.pickupTime = new Date().toISOString();
  if (next === "DELIVERED") order.deliveryTime = new Date().toISOString();
  saveMiddlemanData(userId, data);
  syncDeliveryBackToSeller(order);
  return order;
}

export function markDeliveryFailed(userId, orderId) {
  const data = loadMiddlemanData(userId);
  const order = data.orders.find((o) => o.id === orderId);
  if (!order) throw new Error("Order not found.");
  if (order.status === "DELIVERED" || order.status === "FAILED") {
    throw new Error("This delivery is already closed.");
  }
  order.status = "FAILED";
  saveMiddlemanData(userId, data);
  syncDeliveryBackToSeller(order);
  return order;
}

/**
 * Farmer assigned a ready order → show it in the delivery portal.
 */
export function receiveAssignedOrder({
  portalUserId,
  email,
  phone,
  sellerId,
  sellerProfile,
  order,
}) {
  const portalId = resolvePortalUserId({ portalUserId, email, phone });
  ensurePortalUser({
    id: portalId,
    email,
    phone,
  });

  const data = loadMiddlemanData(portalId);
  if (data.orders.some((o) => o.orderRef === order.id || o.sellerOrderId === order.id)) {
    return data.orders.find(
      (o) => o.orderRef === order.id || o.sellerOrderId === order.id
    );
  }

  const earning = Math.max(25, Math.round((Number(order.total) || 0) * 0.12));
  const entry = {
    id: uid(),
    orderRef: order.id,
    sellerOrderId: order.id,
    sellerId,
    customerName: order.customerName || "Customer",
    customerPhone: order.phone || "",
    address: order.address || "",
    sellerName: sellerProfile?.farmName || "Farm",
    sellerAddress: sellerProfile?.address || "",
    sellerPhone: sellerProfile?.phone || "",
    items: (order.items || []).map((i) => ({
      name: i.name,
      qty: i.qty,
      unit: i.unit || "unit",
    })),
    total: Number(order.total) || 0,
    status: "ASSIGNED",
    assignedAt: new Date().toISOString(),
    pickupTime: null,
    deliveryTime: null,
    earning,
  };

  data.orders = [entry, ...data.orders];
  saveMiddlemanData(portalId, data);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("freshfarm:middleman-orders-updated", {
        detail: { middlemanId: portalId, orderId: entry.id },
      })
    );
  }
  return entry;
}

function resolvePortalUserId({ portalUserId, email, phone }) {
  if (portalUserId) return portalUserId;

  const users = getUsers();
  if (email) {
    const byEmail = users.find(
      (u) => u.email?.toLowerCase() === String(email).toLowerCase()
    );
    if (byEmail) return byEmail.id;
  }
  if (phone) {
    const byPhone = users.find((u) => u.phone === phone);
    if (byPhone) return byPhone.id;
  }
  return `portal-${String(phone || email || "unknown").replace(/\W+/g, "")}`;
}

function ensurePortalUser({ id, email, phone }) {
  let users = getUsers();
  if (users.some((u) => u.id === id)) return;

  // Keep demo delivery account available for m1 assignments.
  if (id === "demo-middleman") {
    users = [
      ...users,
      {
        id: "demo-middleman",
        name: "Suresh Delivery",
        email: email || "delivery@freshfarm.demo",
        phone: phone || "9000011111",
        password: "delivery123",
        area: "Anand East",
        vehicle: "Bike — GJ-01-AB-1234",
        role: "middleman",
      },
    ];
    writeJson(USERS_KEY, users);
    return;
  }

  users = [
    ...users,
    {
      id,
      name: "Delivery Partner",
      email: email || `${id}@freshfarm.demo`,
      phone: phone || "",
      password: "delivery123",
      area: "",
      vehicle: "",
      role: "middleman",
    },
  ];
  writeJson(USERS_KEY, users);
}

function syncDeliveryBackToSeller(deliveryOrder) {
  if (!deliveryOrder?.sellerId || !deliveryOrder?.sellerOrderId) return;

  const sellerKey = `freshfarm_seller_data_${deliveryOrder.sellerId}`;
  const sellerData = readJson(sellerKey, null);
  if (!sellerData?.orders) return;

  const sellerStatus =
    deliveryOrder.status === "DELIVERED"
      ? "DELIVERED"
      : deliveryOrder.status === "OUT_FOR_DELIVERY"
        ? "OUT_FOR_DELIVERY"
        : deliveryOrder.status === "FAILED"
          ? "ASSIGNED"
          : "ASSIGNED";

  let customerOrderId = deliveryOrder.sellerOrderId;
  sellerData.orders = sellerData.orders.map((o) => {
    if (o.id !== deliveryOrder.sellerOrderId) return o;
    customerOrderId = o.customerOrderId || o.id;
    return {
      ...o,
      status: sellerStatus,
      ...(sellerStatus === "DELIVERED"
        ? { deliveredAt: new Date().toISOString() }
        : {}),
    };
  });
  writeJson(sellerKey, sellerData);

  // Mirror onto the customer order so /orders updates too.
  try {
    import("./customerStore").then(({ syncCustomerOrderStatus }) => {
      syncCustomerOrderStatus(customerOrderId, sellerStatus, {
        ...(sellerStatus === "DELIVERED"
          ? { deliveredAt: new Date().toISOString() }
          : {}),
      });
    });
  } catch {
    /* ignore */
  }
}

export function getMiddlemanEarnings(data) {
  const delivered = data.orders.filter((o) => o.status === "DELIVERED");
  const today = todayISO();
  const todayEarnings = delivered
    .filter((o) => o.deliveryTime && o.deliveryTime.slice(0, 10) === today)
    .reduce((sum, o) => sum + (o.earning || 0), 0);
  const totalEarnings = delivered.reduce((sum, o) => sum + (o.earning || 0), 0);
  const active = data.orders.filter(
    (o) => !["DELIVERED", "FAILED"].includes(o.status)
  ).length;
  return {
    todayEarnings,
    totalEarnings,
    deliveredCount: delivered.length,
    activeDeliveries: active,
  };
}
