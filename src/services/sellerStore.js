const USERS_KEY = "pail_seller_users";
const SESSION_KEY = "pail_seller_session";
const DATA_KEY = "pail_seller_data";

export const PRODUCT_TYPES = [
  "Cow Milk",
  "Buffalo Milk",
  "Curd",
  "Paneer",
  "Ghee",
  "Buttermilk",
];

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
      email: "farmer@pail.demo",
      address: "Village Kheda, Anand, Gujarat",
      bio: "Family-run dairy producing fresh milk and traditional dairy products.",
    },
    products: [
      {
        id: "p1",
        name: "Fresh Cow Milk",
        type: "Cow Milk",
        price: 56,
        unit: "litre",
        stock: 40,
        available: true,
        description: "Morning-fresh cow milk, chilled at the farm.",
      },
      {
        id: "p2",
        name: "Buffalo Milk",
        type: "Buffalo Milk",
        price: 72,
        unit: "litre",
        stock: 25,
        available: true,
        description: "Rich buffalo milk for tea and set curd.",
      },
      {
        id: "p3",
        name: "Homemade Curd",
        type: "Curd",
        price: 60,
        unit: "500g",
        stock: 18,
        available: true,
        description: "Set overnight from farm milk.",
      },
      {
        id: "p4",
        name: "Fresh Paneer",
        type: "Paneer",
        price: 320,
        unit: "kg",
        stock: 8,
        available: true,
        description: "Soft paneer made daily.",
      },
      {
        id: "p5",
        name: "Pure Ghee",
        type: "Ghee",
        price: 680,
        unit: "litre",
        stock: 12,
        available: true,
        description: "Slow-cooked bilona ghee.",
      },
      {
        id: "p6",
        name: "Farm Buttermilk",
        type: "Buttermilk",
        price: 30,
        unit: "litre",
        stock: 0,
        available: false,
        description: "Light spiced chaas — restocking tomorrow.",
      },
    ],
    middlemen: [
      {
        id: "m1",
        name: "Suresh Delivery",
        phone: "9000011111",
        area: "Anand East",
        status: "available",
      },
      {
        id: "m2",
        name: "Kiran Logistics",
        phone: "9000022222",
        area: "Anand West",
        status: "available",
      },
      {
        id: "m3",
        name: "Mehta Express",
        phone: "9000033333",
        area: "Nearby villages",
        status: "busy",
      },
    ],
    orders: [
      {
        id: "o1",
        customerName: "Priya Shah",
        address: "12 Lake Road, Anand",
        phone: "9811100001",
        items: [
          { productId: "p1", name: "Fresh Cow Milk", qty: 2, price: 56 },
          { productId: "p3", name: "Homemade Curd", qty: 1, price: 60 },
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
        items: [{ productId: "p2", name: "Buffalo Milk", qty: 3, price: 72 }],
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
          { productId: "p4", name: "Fresh Paneer", qty: 1, price: 320 },
          { productId: "p5", name: "Pure Ghee", qty: 1, price: 680 },
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
        items: [{ productId: "p1", name: "Fresh Cow Milk", qty: 5, price: 56 }],
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
        items: [{ productId: "p3", name: "Homemade Curd", qty: 2, price: 60 }],
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
    email.toLowerCase() === "farmer@pail.demo" &&
    password === "farmer123" &&
    !users.some((u) => u.email === "farmer@pail.demo")
  ) {
    const demo = {
      id: "demo-seller",
      name: "Ramesh Patel",
      email: "farmer@pail.demo",
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

export function loadSellerData(userId) {
  const data = readJson(dataKey(userId), null);
  if (data) return data;
  const seeded = seedData();
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
  };
  data.products = [next, ...data.products];
  saveSellerData(userId, data);
  return next;
}

export function updateProduct(userId, productId, patch) {
  const data = loadSellerData(userId);
  data.products = data.products.map((p) =>
    p.id === productId ? { ...p, ...patch } : p
  );
  saveSellerData(userId, data);
  return data.products.find((p) => p.id === productId);
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

export function advanceOrderStatus(userId, orderId) {
  const data = loadSellerData(userId);
  const order = data.orders.find((o) => o.id === orderId);
  if (!order) throw new Error("Order not found.");
  const next = NEXT_STATUS[order.status];
  if (!next) throw new Error("Order cannot be advanced further from seller side.");
  order.status = next;
  saveSellerData(userId, data);
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
