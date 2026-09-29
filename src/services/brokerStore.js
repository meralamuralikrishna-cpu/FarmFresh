import { queueBrokerAcceptedProduct, syncBrokerAcceptedToAdmin } from "./adminStore";

const USERS_KEY = "freshfarm_broker_users";
const SESSION_KEY = "freshfarm_broker_session";
const PROFILE_KEY = "freshfarm_broker_profile";
const SUBMISSIONS_KEY = "freshfarm_broker_submissions";

export const SUBMISSION_STATUSES = ["pending", "accepted", "rejected"];

export const SUBMISSION_STATUS_LABELS = {
  pending: "Awaiting broker",
  accepted: "Accepted",
  rejected: "Rejected",
};

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

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

function ensureDemoBroker() {
  let users = readJson(USERS_KEY, []);
  if (!users.some((u) => u.email === "broker@freshfarm.demo")) {
    users = [
      ...users,
      {
        id: "demo-broker",
        name: "Ananya Broker",
        email: "broker@freshfarm.demo",
        phone: "9800012345",
        password: "broker123",
        role: "broker",
        region: "Anand & nearby",
      },
    ];
    writeJson(USERS_KEY, users);
  }
  if (!localStorage.getItem(PROFILE_KEY)) {
    writeJson(PROFILE_KEY, {
      name: "Ananya Broker",
      email: "broker@freshfarm.demo",
      phone: "9800012345",
      region: "Anand & nearby",
      bio: "Connects local dairy farmers with FreshFarm customers. Farmer sets the product price.",
    });
  }
  return users;
}

export function getUsers() {
  return ensureDemoBroker();
}

export function loginBroker({ email, password }) {
  const users = ensureDemoBroker();
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) throw new Error("Invalid email or password.");

  writeJson(SESSION_KEY, {
    userId: user.id,
    email: user.email,
    role: "broker",
  });
  return { id: user.id, name: user.name, email: user.email, role: "broker" };
}

export function logoutBroker() {
  localStorage.removeItem(SESSION_KEY);
}

export function getBrokerSession() {
  return readJson(SESSION_KEY, null);
}

export function getBrokerProfile() {
  ensureDemoBroker();
  return readJson(PROFILE_KEY, {
    name: "Broker",
    email: "broker@freshfarm.demo",
    phone: "",
    region: "",
    bio: "",
  });
}

export function updateBrokerProfile(patch) {
  const next = { ...getBrokerProfile(), ...patch };
  writeJson(PROFILE_KEY, next);
  return next;
}

export function getSubmissions() {
  const submissions = readJson(SUBMISSIONS_KEY, []);
  // Broker-accepted listings appear under Admin → Products for final approval.
  syncBrokerAcceptedToAdmin(submissions);
  return submissions;
}

function saveSubmissions(list) {
  writeJson(SUBMISSIONS_KEY, list);
}

/**
 * Farmer submits product details (including farmer-set price) to the broker.
 */
export function submitFarmerListing({
  farmerId,
  farmerName,
  farmName,
  product,
}) {
  const submissions = getSubmissions();
  const entry = {
    id: uid(),
    farmerId,
    farmerName: farmerName || "Farmer",
    farmName: farmName || "Farm",
    productId: product.id,
    product: {
      name: product.name,
      type: product.type,
      price: Number(product.price) || 0,
      unit: product.unit || "litre",
      stock: Number(product.stock) || 0,
      available: product.available !== false,
      description: product.description || "",
    },
    status: "pending",
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
    note: "",
  };
  saveSubmissions([entry, ...submissions]);
  return entry;
}

function syncFarmerProductStatus(farmerId, productId, status) {
  const dataKey = `freshfarm_seller_data_${farmerId}`;
  const data = readJson(dataKey, null);
  if (!data?.products) return;
  data.products = data.products.map((p) =>
    p.id === productId ? { ...p, brokerStatus: status } : p
  );
  writeJson(dataKey, data);
}

export function acceptSubmission(submissionId, note = "") {
  const submissions = getSubmissions();
  const item = submissions.find((s) => s.id === submissionId);
  if (!item) throw new Error("Submission not found.");
  if (item.status !== "pending") {
    throw new Error("This listing was already reviewed.");
  }
  item.status = "accepted";
  item.reviewedAt = new Date().toISOString();
  item.note = note;
  saveSubmissions(submissions);
  syncFarmerProductStatus(item.farmerId, item.productId, "accepted");
  // Forward to Admin → Products for platform approval.
  queueBrokerAcceptedProduct(item);
  return item;
}

export function rejectSubmission(submissionId, note = "") {
  const submissions = getSubmissions();
  const item = submissions.find((s) => s.id === submissionId);
  if (!item) throw new Error("Submission not found.");
  if (item.status !== "pending") {
    throw new Error("This listing was already reviewed.");
  }
  item.status = "rejected";
  item.reviewedAt = new Date().toISOString();
  item.note = note || "Rejected by broker";
  saveSubmissions(submissions);
  syncFarmerProductStatus(item.farmerId, item.productId, "rejected");
  return item;
}

export function getBrokerStats(submissions = getSubmissions()) {
  return {
    pending: submissions.filter((s) => s.status === "pending").length,
    accepted: submissions.filter((s) => s.status === "accepted").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
    total: submissions.length,
  };
}
