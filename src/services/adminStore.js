const USERS_KEY = "freshfarm_admin_users";
const SESSION_KEY = "freshfarm_admin_session";
const DATA_KEY = "freshfarm_admin_data";

export const COMPLAINT_STATUSES = ["Open", "In Progress", "Resolved"];

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
    customers: [
      {
        id: "cu1",
        name: "Priya Shah",
        email: "priya@example.com",
        phone: "9811100001",
        status: "active",
        joined: earlier.toISOString().slice(0, 10),
      },
      {
        id: "cu2",
        name: "Amit Desai",
        email: "amit@example.com",
        phone: "9811100002",
        status: "active",
        joined: earlier.toISOString().slice(0, 10),
      },
      {
        id: "cu3",
        name: "Neha Joshi",
        email: "neha@example.com",
        phone: "9811100003",
        status: "active",
        joined: todayISO(),
      },
      {
        id: "cu4",
        name: "customer@freshfarm.demo",
        email: "customer@freshfarm.demo",
        phone: "9800000000",
        status: "active",
        joined: todayISO(),
      },
    ],
    sellers: [
      {
        id: "se1",
        farmName: "Green Pasture Dairy",
        ownerName: "Ramesh Patel",
        email: "farmer@freshfarm.demo",
        phone: "9876543210",
        status: "approved",
        products: 6,
      },
      {
        id: "se2",
        farmName: "Sunrise Dairy",
        ownerName: "Lakshmi Reddy",
        email: "sunrise@freshfarm.demo",
        phone: "9876500002",
        status: "pending",
        products: 2,
      },
      {
        id: "se3",
        farmName: "Hilltop Farms",
        ownerName: "Arjun Singh",
        email: "hilltop@freshfarm.demo",
        phone: "9876500003",
        status: "approved",
        products: 4,
      },
    ],
    middlemen: [
      {
        id: "mi1",
        name: "Suresh Delivery",
        email: "delivery@freshfarm.demo",
        phone: "9000011111",
        area: "Anand East",
        status: "active",
        deliveries: 42,
      },
      {
        id: "mi2",
        name: "Kiran Logistics",
        email: "kiran@freshfarm.demo",
        phone: "9000022222",
        area: "Anand West",
        status: "active",
        deliveries: 28,
      },
      {
        id: "mi3",
        name: "Mehta Express",
        email: "mehta@freshfarm.demo",
        phone: "9000033333",
        area: "Nearby villages",
        status: "busy",
        deliveries: 35,
      },
    ],
    products: [
      {
        id: "ap1",
        name: "Fresh Cow Milk",
        seller: "Green Pasture Dairy",
        category: "Cow Milk",
        price: 56,
        status: "approved",
      },
      {
        id: "ap2",
        name: "Buffalo Milk",
        seller: "Green Pasture Dairy",
        category: "Buffalo Milk",
        price: 72,
        status: "approved",
      },
      {
        id: "ap3",
        name: "Organic Paneer",
        seller: "Sunrise Dairy",
        category: "Paneer",
        price: 350,
        status: "pending",
      },
      {
        id: "ap4",
        name: "Village Ghee",
        seller: "Hilltop Farms",
        category: "Ghee",
        price: 720,
        status: "approved",
      },
      {
        id: "ap5",
        name: "Spiced Buttermilk",
        seller: "Sunrise Dairy",
        category: "Buttermilk",
        price: 35,
        status: "pending",
      },
    ],
    orders: [
      {
        id: "ao1",
        customer: "Priya Shah",
        seller: "Green Pasture Dairy",
        middleman: "—",
        total: 172,
        status: "PLACED",
        createdAt: now.toISOString().slice(0, 10),
      },
      {
        id: "ao2",
        customer: "Amit Desai",
        seller: "Green Pasture Dairy",
        middleman: "—",
        total: 216,
        status: "CONFIRMED",
        createdAt: now.toISOString().slice(0, 10),
      },
      {
        id: "ao3",
        customer: "Vikram Rao",
        seller: "Green Pasture Dairy",
        middleman: "Suresh Delivery",
        total: 280,
        status: "ASSIGNED",
        createdAt: earlier.toISOString().slice(0, 10),
      },
      {
        id: "ao4",
        customer: "Sneha Mehta",
        seller: "Green Pasture Dairy",
        middleman: "Suresh Delivery",
        total: 120,
        status: "DELIVERED",
        createdAt: earlier.toISOString().slice(0, 10),
      },
      {
        id: "ao5",
        customer: "Neha Joshi",
        seller: "Hilltop Farms",
        middleman: "—",
        total: 450,
        status: "CANCELLED",
        createdAt: earlier.toISOString().slice(0, 10),
      },
    ],
    payments: [
      {
        id: "pay-a1",
        orderId: "ao4",
        customer: "Sneha Mehta",
        amount: 120,
        method: "UPI",
        status: "Paid",
        date: earlier.toISOString().slice(0, 10),
      },
      {
        id: "pay-a2",
        orderId: "ao3",
        customer: "Vikram Rao",
        amount: 280,
        method: "COD",
        status: "Pending",
        date: now.toISOString().slice(0, 10),
      },
      {
        id: "pay-a3",
        orderId: "ao2",
        customer: "Amit Desai",
        amount: 216,
        method: "Card",
        status: "Paid",
        date: now.toISOString().slice(0, 10),
      },
      {
        id: "pay-a4",
        orderId: "sub-batch",
        customer: "Subscription batch",
        amount: 4480,
        method: "UPI",
        status: "Paid",
        date: todayISO(),
      },
    ],
    subscriptions: [
      {
        id: "sub1",
        customer: "Priya Shah",
        product: "Fresh Cow Milk",
        frequency: "Daily",
        quantity: 1,
        status: "Active",
      },
      {
        id: "sub2",
        customer: "Amit Desai",
        product: "Buffalo Milk",
        frequency: "Alternate Days",
        quantity: 2,
        status: "Paused",
      },
      {
        id: "sub3",
        customer: "Neha Joshi",
        product: "Homemade Curd",
        frequency: "Weekly",
        quantity: 2,
        status: "Active",
      },
    ],
    reviews: [
      {
        id: "ar1",
        customer: "Sneha Mehta",
        target: "Homemade Curd",
        type: "Product",
        rating: 5,
        comment: "Thick and fresh.",
      },
      {
        id: "ar2",
        customer: "Rahul Iyer",
        target: "Green Pasture Dairy",
        type: "Seller",
        rating: 4,
        comment: "Reliable morning milk.",
      },
      {
        id: "ar3",
        customer: "Anita Patel",
        target: "Suresh Delivery",
        type: "Delivery",
        rating: 5,
        comment: "On time every day.",
      },
    ],
    complaints: [
      {
        id: "cmp1",
        user: "Amit Desai",
        orderId: "ao2",
        subject: "Late delivery slot",
        description: "Expected before 7 AM, arrived at 8:15.",
        status: "Open",
        date: todayISO(),
      },
      {
        id: "cmp2",
        user: "Neha Joshi",
        orderId: "ao5",
        subject: "Wrong product",
        description: "Ordered buffalo milk, received cow milk.",
        status: "In Progress",
        date: earlier.toISOString().slice(0, 10),
      },
      {
        id: "cmp3",
        user: "Priya Shah",
        orderId: "ao1",
        subject: "Billing mismatch",
        description: "Charged for 3 litres but ordered 2.",
        status: "Resolved",
        date: earlier.toISOString().slice(0, 10),
      },
    ],
    offers: [
      {
        id: "off1",
        code: "FRESH10",
        discount: 10,
        expiry: "2026-12-31",
        status: "active",
      },
      {
        id: "off2",
        code: "MILK50",
        discount: 50,
        expiry: "2026-10-31",
        status: "active",
      },
    ],
  };
}

function dataKey() {
  return DATA_KEY;
}

export function getUsers() {
  return readJson(USERS_KEY, []);
}

export function loginAdmin({ email, password }) {
  let users = getUsers();

  if (
    email.toLowerCase() === "admin@freshfarm.demo" &&
    password === "admin123" &&
    !users.some((u) => u.email === "admin@freshfarm.demo")
  ) {
    const demo = {
      id: "demo-admin",
      name: "FreshFarm Admin",
      email: "admin@freshfarm.demo",
      password: "admin123",
      role: "admin",
    };
    users = [...users, demo];
    writeJson(USERS_KEY, users);
    if (!localStorage.getItem(dataKey())) {
      writeJson(dataKey(), seedData());
    }
  }

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) throw new Error("Invalid email or password.");

  if (!localStorage.getItem(dataKey())) {
    writeJson(dataKey(), seedData());
  }

  writeJson(SESSION_KEY, {
    userId: user.id,
    email: user.email,
    role: "admin",
  });
  return { id: user.id, name: user.name, email: user.email, role: "admin" };
}

export function logoutAdmin() {
  localStorage.removeItem(SESSION_KEY);
}

export function getAdminSession() {
  return readJson(SESSION_KEY, null);
}

export function loadAdminData() {
  const data = readJson(dataKey(), null);
  if (data) return data;
  const seeded = seedData();
  writeJson(dataKey(), seeded);
  return seeded;
}

export function saveAdminData(data) {
  writeJson(dataKey(), data);
}

export function setSellerStatus(sellerId, status) {
  const data = loadAdminData();
  data.sellers = data.sellers.map((s) =>
    s.id === sellerId ? { ...s, status } : s
  );
  saveAdminData(data);
}

export function setProductStatus(productId, status) {
  const data = loadAdminData();
  data.products = data.products.map((p) =>
    p.id === productId ? { ...p, status } : p
  );
  saveAdminData(data);
}

export function removeProduct(productId) {
  const data = loadAdminData();
  data.products = data.products.filter((p) => p.id !== productId);
  saveAdminData(data);
}

export function setCustomerStatus(customerId, status) {
  const data = loadAdminData();
  data.customers = data.customers.map((c) =>
    c.id === customerId ? { ...c, status } : c
  );
  saveAdminData(data);
}

export function setMiddlemanStatus(middlemanId, status) {
  const data = loadAdminData();
  data.middlemen = data.middlemen.map((m) =>
    m.id === middlemanId ? { ...m, status } : m
  );
  saveAdminData(data);
}

export function setComplaintStatus(complaintId, status) {
  const data = loadAdminData();
  data.complaints = data.complaints.map((c) =>
    c.id === complaintId ? { ...c, status } : c
  );
  saveAdminData(data);
}

export function getAnalytics(data) {
  const paid = data.payments.filter((p) => p.status === "Paid");
  const revenue = paid.reduce((sum, p) => sum + p.amount, 0);
  const milkSold = data.orders
    .filter((o) => o.status === "DELIVERED")
    .reduce((sum, o) => sum + o.total, 0);
  return {
    totalRevenue: revenue,
    orderCount: data.orders.length,
    milkSoldEstimate: milkSold,
    customers: data.customers.length,
    sellers: data.sellers.length,
    middlemen: data.middlemen.length,
    pendingProducts: data.products.filter((p) => p.status === "pending").length,
    openComplaints: data.complaints.filter((c) => c.status !== "Resolved").length,
    activeSubscriptions: data.subscriptions.filter((s) => s.status === "Active")
      .length,
  };
}
