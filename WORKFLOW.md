# FreshFarm — Full Project Workflow

Frontend-only React demo. All auth and data live in `localStorage` (no real backend).

---

## Roles at a glance

| Role | Portal | Job |
|------|--------|-----|
| **Customer** | `/login` | Buy dairy products |
| **Farmer (Seller)** | `/seller/login` | List products (set price), manage orders, assign delivery |
| **Broker** | `/broker/login` | Review / accept / reject farmer listings |
| **Middleman** | `/middleman/login` | Pick up and deliver assigned orders |
| **Admin** | `/admin/login` | Oversee users, products, orders, payments, complaints |

---

## End-to-end business flow

```
Farmer submits product (sets price)
        │
        ▼
Broker accepts or rejects listing
        │  (accepted)
        ▼
Admin → Products (pending review)
        │  (admin approves)
        ▼
Customer browses → cart → checkout → order PLACED
        │
        ▼
Farmer advances order:
  PLACED → CONFIRMED → PREPARING → READY_FOR_PICKUP
        │
        ▼
Farmer assigns a middleman → ASSIGNED
        │
        ▼
Middleman:
  ASSIGNED → ACCEPTED → PICKED_UP → OUT_FOR_DELIVERY → DELIVERED
        │
        ▼
Customer sees delivered order (can review / subscribe)
Admin can monitor everything across portals
```

---

## 1. Farmer → Broker → Admin (product listing)

1. Farmer signs in at `/seller/login`.
2. Opens **Submit to broker** (`/seller/products/new`).
3. Fills product details and **sets the selling price**.
4. On submit:
   - Product is saved on the farmer side with `brokerStatus: "pending"`.
   - Same listing is queued in the broker store (`brokerStore.submitFarmerListing`).
5. Broker signs in at `/broker/login`.
6. Opens **Submissions** (`/broker/submissions`).
7. Sees farmer name, product, and farmer-set price.
8. **Accept** or **Reject**:
   - Broker submission status updates.
   - Farmer product `brokerStatus` syncs to `accepted` or `rejected`.
   - On **Accept**, the listing is sent to **Admin → Products** (`/admin/products`) as `pending`.
9. Admin reviews at `/admin/products`:
   - **Approve** → product is published to the customer shop (`/products`).
   - **Reject / Remove** → product stays off the customer catalog.

**Broker pages**

| Route | Purpose |
|-------|---------|
| `/broker/login` | Demo broker sign-in |
| `/broker` | Dashboard (pending / accepted / rejected counts) |
| `/broker/submissions` | Review listings |
| `/broker/profile` | Broker profile |

**Farmer product pages**

| Route | Purpose |
|-------|---------|
| `/seller` | Dashboard |
| `/seller/products` | Product list + broker status badges |
| `/seller/products/new` | Submit new listing to broker |
| `/seller/products/:id/edit` | Edit product |

---

## 2. Customer shopping flow

1. Browse public catalog: `/products`, `/products/:productId`.
2. Sign in at `/login` (required for cart / checkout / account).
3. Add items to cart (`/cart`) or wishlist (`/wishlist`).
4. Checkout (`/checkout`) — payment is simulated.
5. Order is created with status **`PLACED`**.
6. Customer can track orders (`/orders`, `/orders/:orderId`), manage addresses, subscriptions, and notifications.

**Customer routes**

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
| `/about`, `/contact` | Public info |

---

## 3. Farmer order & delivery assignment

After a customer places an order, the farmer manages it in `/seller/orders`.

**Farmer order status chain**

```
PLACED → CONFIRMED → PREPARING → READY_FOR_PICKUP → ASSIGNED
                                                      │
                                                      └─ then middleman takes over
```

1. Farmer confirms and prepares the order.
2. Marks it **Ready for Pickup**.
3. Assigns a middleman (`assignMiddleman`) → status becomes **`ASSIGNED`**.
4. Farmer can also view deliveries, earnings, and reviews.

**Farmer ops pages**

| Route | Purpose |
|-------|---------|
| `/seller/orders` | Advance order status |
| `/seller/deliveries` | Delivery overview |
| `/seller/earnings` | Earnings |
| `/seller/reviews` | Reviews |
| `/seller/profile` | Farm profile |

---

## 4. Middleman delivery flow

1. Middleman signs in at `/middleman/login`.
2. Sees assigned orders (`/middleman/assigned`).
3. Advances delivery status:

```
ASSIGNED → ACCEPTED → PICKED_UP → OUT_FOR_DELIVERY → DELIVERED
```

(Failed deliveries can be marked **FAILED**.)

4. Pickup / deliveries screens support the same lifecycle.
5. Earnings and profile are available after deliveries.

**Middleman routes**

| Route | Purpose |
|-------|---------|
| `/middleman/login` | Demo delivery sign-in |
| `/middleman` | Dashboard |
| `/middleman/assigned` | Assigned orders |
| `/middleman/pickup` | Pickup |
| `/middleman/deliveries` | Deliveries |
| `/middleman/earnings` | Earnings |
| `/middleman/profile` | Profile |

---

## 5. Admin oversight

Admin signs in at `/admin/login` and monitors the platform (demo data in `adminStore`).

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard |
| `/admin/users` | Customers / users |
| `/admin/sellers` | Farmers |
| `/admin/middlemen` | Delivery partners |
| `/admin/products` | Products |
| `/admin/orders` | Orders |
| `/admin/payments` | Payments |
| `/admin/complaints` | Complaints |
| `/admin/analytics` | Analytics |

---

## Data & auth (how it works technically)

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

- Each role has its own session key in `localStorage`.
- `AuthContext` tracks who is signed in (customer / seller / broker / middleman / admin).
- Route guards (`RequireSeller`, `RequireBroker`, `RequireMiddleman`, `RequireCustomer`, `RequireAdmin`) block portals without a session.
- Farmer product submit calls into `brokerStore` so broker and farmer stay in sync on accept/reject.

---

## Demo sign-in

Every portal uses one-click demo login (no real email/password required in the UI):

- Customer → Continue as demo customer  
- Farmer → Continue as demo farmer  
- Broker → Continue as demo broker  
- Middleman → Continue as demo delivery partner  
- Admin → Continue as demo admin  

Clearing site storage resets all demo data.

---

## Quick map: who talks to whom

| From | To | Interaction |
|------|----|-------------|
| Farmer | Broker | Submits product + price for review |
| Broker | Admin | Accepts listing → queues in Admin → Products |
| Admin | Customer shop | Approves product → publishes to `/products` |
| Broker | Farmer | Accepts / rejects listing (status sync) |
| Customer | Farmer | Places order for products |
| Farmer | Middleman | Assigns ready order for delivery |
| Middleman | Customer | Picks up and delivers order |
| Admin | Everyone | Oversees users, catalog, orders, payments, complaints |
