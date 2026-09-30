# FreshFarm — Project Workflow

Milk selling platform workflow documentation. Frontend-only React demo; authentication and application data are stored in `localStorage` (no live backend).

---

## 1. System Overview

FreshFarm is a farm-to-home dairy marketplace that connects five roles in a single business flow:

| Role | Portal entry | Responsibility |
|------|--------------|----------------|
| Customer | `/login` | Browse products, place orders, track delivery |
| Farmer (Seller) | `/seller/login` | List products, manage orders, assign delivery |
| Broker | `/broker/login` | Review and accept or reject farmer listings |
| Middleman | `/middleman/login` | Pick up and deliver assigned orders |
| Admin | `/admin/login` | Oversee users, products, orders, payments, and complaints |

**Business flow (summary):** Farmer lists a product → Broker reviews → Admin publishes → Customer purchases → Farmer prepares → Middleman delivers.

---

## 2. End-to-End Business Flow

```
Farmer submits product (sets price)
        │
        ▼
Broker accepts or rejects listing
        │  (accepted)
        ▼
Admin reviews product (pending)
        │  (approved)
        ▼
Customer browses → cart → checkout → order PLACED
        │
        ▼
Farmer advances order:
  PLACED → CONFIRMED → PREPARING → READY_FOR_PICKUP
        │
        ▼
Farmer assigns middleman → ASSIGNED
        │
        ▼
Middleman:
  ASSIGNED → ACCEPTED → PICKED_UP → OUT_FOR_DELIVERY → DELIVERED
        │
        ▼
Customer receives order (review / subscription available)
Admin monitors activity across all portals
```

---

## 3. Product Listing Workflow

**Purpose:** Ensure only reviewed and approved products appear in the customer catalog.

### Process

1. Farmer signs in at `/seller/login` and opens **Submit to broker** (`/seller/products/new`).
2. Farmer enters product details and sets the selling price.
3. On submit:
   - Product is saved with `brokerStatus: "pending"`.
   - Listing is queued in the broker store.
4. Broker signs in at `/broker/login` and opens **Submissions** (`/broker/submissions`).
5. Broker **Accepts** or **Rejects** the listing:
   - Status syncs back to the farmer product.
   - On accept, the listing is sent to **Admin → Products** as `pending`.
6. Admin reviews at `/admin/products`:
   - **Approve** → product is published to `/products`.
   - **Reject / Remove** → product remains off the customer catalog.

### Related routes

| Role | Route | Purpose |
|------|-------|---------|
| Farmer | `/seller` | Dashboard |
| Farmer | `/seller/products` | Product list and broker status |
| Farmer | `/seller/products/new` | Submit listing to broker |
| Farmer | `/seller/products/:id/edit` | Edit product |
| Broker | `/broker` | Dashboard (pending / accepted / rejected) |
| Broker | `/broker/submissions` | Review listings |
| Broker | `/broker/profile` | Profile |
| Admin | `/admin/products` | Approve or reject products |

---

## 4. Customer Shopping Workflow

1. Browse the public catalog at `/products` or `/products/:productId`.
2. Sign in at `/login` (required for cart, checkout, and account features).
3. Add items to cart (`/cart`) or wishlist (`/wishlist`).
4. Complete checkout at `/checkout` (payment is simulated).
5. Order is created with status **`PLACED`**.
6. Customer can track orders, manage addresses, subscriptions, and notifications.

### Customer routes

| Route | Purpose |
|-------|---------|
| `/` | Home |
| `/products` | Catalog |
| `/products/:productId` | Product detail |
| `/login` | Customer login |
| `/cart` | Cart |
| `/checkout` | Checkout |
| `/orders` | Order list |
| `/orders/:orderId` | Order detail |
| `/account` | Profile |
| `/account/addresses` | Addresses |
| `/wishlist` | Wishlist |
| `/subscription` | Subscriptions |
| `/notifications` | Notifications |
| `/about`, `/contact` | Public information |

---

## 5. Order Management (Farmer)

After a customer places an order, the farmer manages it from `/seller/orders`.

### Farmer order status chain

```
PLACED → CONFIRMED → PREPARING → READY_FOR_PICKUP → ASSIGNED
```

1. Farmer confirms and prepares the order.
2. Marks the order **Ready for Pickup**.
3. Assigns a middleman → status becomes **`ASSIGNED`**.
4. Farmer can also view deliveries, earnings, and reviews.

### Farmer operations routes

| Route | Purpose |
|-------|---------|
| `/seller/orders` | Advance order status |
| `/seller/deliveries` | Delivery overview |
| `/seller/earnings` | Earnings |
| `/seller/reviews` | Reviews |
| `/seller/profile` | Farm profile |

---

## 6. Delivery Workflow (Middleman)

1. Middleman signs in at `/middleman/login`.
2. Views assigned orders at `/middleman/assigned`.
3. Advances delivery status:

```
ASSIGNED → ACCEPTED → PICKED_UP → OUT_FOR_DELIVERY → DELIVERED
```

Failed deliveries can be marked **FAILED**.

4. Pickup and deliveries screens support the same lifecycle.
5. Earnings and profile are available after completed deliveries.

### Middleman routes

| Route | Purpose |
|-------|---------|
| `/middleman/login` | Delivery partner sign-in |
| `/middleman` | Dashboard |
| `/middleman/assigned` | Assigned orders |
| `/middleman/pickup` | Pickup |
| `/middleman/deliveries` | Deliveries |
| `/middleman/earnings` | Earnings |
| `/middleman/profile` | Profile |

---

## 7. Admin Oversight

Admin signs in at `/admin/login` and monitors platform activity.

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard |
| `/admin/users` | Customers / users |
| `/admin/sellers` | Farmers |
| `/admin/middlemen` | Delivery partners |
| `/admin/products` | Product approvals |
| `/admin/orders` | Orders |
| `/admin/payments` | Payments |
| `/admin/complaints` | Complaints |
| `/admin/analytics` | Analytics |

---

## 8. Role Interaction Map

| From | To | Interaction |
|------|----|-------------|
| Farmer | Broker | Submits product and price for review |
| Broker | Farmer | Accepts or rejects listing (status sync) |
| Broker | Admin | Accepted listing queued in Admin → Products |
| Admin | Customer shop | Approves product → publishes to `/products` |
| Customer | Farmer | Places order for products |
| Farmer | Middleman | Assigns ready order for delivery |
| Middleman | Customer | Picks up and delivers order |
| Admin | All roles | Oversees users, catalog, orders, payments, complaints |

---

## 9. Technical Architecture

```
src/
  pages/          # UI per role
  context/        # AuthContext + role data providers
  services/       # localStorage stores
    customerStore.js
    sellerStore.js
    brokerStore.js
    middlemanStore.js
    adminStore.js
```

- Each role maintains a separate session key in `localStorage`.
- `AuthContext` tracks the active signed-in role.
- Route guards (`RequireSeller`, `RequireBroker`, `RequireMiddleman`, `RequireCustomer`, `RequireAdmin`) protect portals without a valid session.
- Farmer product submission writes into `brokerStore` so accept/reject stays synchronized across portals.

---

## 10. Demo Access

Each portal supports one-click demo login (no real credentials required):

- Customer → Continue as demo customer  
- Farmer → Continue as demo farmer  
- Broker → Continue as demo broker  
- Middleman → Continue as demo delivery partner  
- Admin → Continue as demo admin  

Clearing site storage resets all demo data.
