# FreshFarm — Presentation Workflow

**Milk Selling Platform** · Frontend demo (React) · Role-based portals

> Use this doc as a **presentation script**: walk top → bottom. Each section is one slide idea.

---

## Slide 1 — What is FreshFarm?

A farm-to-home dairy marketplace where:

- **Farmers** list milk & dairy products
- **Brokers** review listings before they go live
- **Admins** approve products for the shop
- **Customers** buy and track orders
- **Middlemen** pick up and deliver

**Tech note (one line):** Frontend-only React demo — auth & data in `localStorage` (no live backend).

---

## Slide 2 — Who uses the system?

| Role | Portal | One-line job |
|------|--------|--------------|
| Customer | `/login` | Browse, cart, checkout, track orders |
| Farmer (Seller) | `/seller/login` | List products, manage orders, assign delivery |
| Broker | `/broker/login` | Accept or reject farmer listings |
| Middleman | `/middleman/login` | Pick up & deliver assigned orders |
| Admin | `/admin/login` | Oversee users, products, orders, payments |

---

## Slide 3 — Big picture (end-to-end)

```
   FARMER                    BROKER                   ADMIN
  submits product  ──────►  accept / reject  ──────►  approve / reject
  (sets price)              listing                  for customer shop
                                                        │
                                                        ▼
                                                   CUSTOMER
                                              browse → cart → checkout
                                              order = PLACED
                                                        │
                                                        ▼
                                                   FARMER
                                    confirm → prepare → ready for pickup
                                    assign middleman
                                                        │
                                                        ▼
                                                  MIDDLEMAN
                                    accept → pick up → out for delivery
                                    → DELIVERED
                                                        │
                                                        ▼
                                                   CUSTOMER
                                              receives order / can review
```

**Story in one sentence:** Farmer lists → Broker & Admin approve → Customer buys → Farmer prepares → Middleman delivers.

---

## Slide 4 — Product listing workflow

**Goal:** Only quality listings reach the customer shop.

```
Farmer                    Broker                     Admin                  Shop
──────                    ──────                     ─────                  ────
Submit product
+ selling price
       │
       ▼
  brokerStatus:
  "pending"  ──────────►  Review submission
                          Accept / Reject
                               │
                    (on Accept)│
                               ▼
                          Queued as pending ───► Approve / Reject
                                                      │
                                           (on Approve)│
                                                       ▼
                                                  Live on /products
```

**Demo path**

1. Farmer → `/seller/login` → **Submit to broker** (`/seller/products/new`)
2. Broker → `/broker/login` → **Submissions** → Accept
3. Admin → `/admin/login` → **Products** → Approve
4. Customer sees it on `/products`

---

## Slide 5 — Customer shopping workflow

```
Browse catalog (/products)
        │
        ▼
Sign in (/login)
        │
        ▼
Add to cart / wishlist
        │
        ▼
Checkout (payment simulated)
        │
        ▼
Order created → status: PLACED
        │
        ▼
Track order · addresses · subscriptions · notifications
```

**Key pages:** Home → Products → Cart → Checkout → Orders

---

## Slide 6 — Order & delivery lifecycle

### Farmer side

```
PLACED → CONFIRMED → PREPARING → READY_FOR_PICKUP → ASSIGNED
```

### Middleman side

```
ASSIGNED → ACCEPTED → PICKED_UP → OUT_FOR_DELIVERY → DELIVERED
                                                      (or FAILED)
```

### Combined story

| Step | Who | Action |
|------|-----|--------|
| 1 | Customer | Places order |
| 2 | Farmer | Confirms & prepares |
| 3 | Farmer | Marks ready, assigns middleman |
| 4 | Middleman | Accepts, picks up, delivers |
| 5 | Customer | Sees **Delivered**; can review |

---

## Slide 7 — Role interactions (who talks to whom)

| From | To | What happens |
|------|----|--------------|
| Farmer | Broker | Submits product + price for review |
| Broker | Farmer | Accept / reject (status sync) |
| Broker | Admin | Accepted listing goes to Admin → Products |
| Admin | Shop | Approve → product appears for customers |
| Customer | Farmer | Places order |
| Farmer | Middleman | Assigns ready order for delivery |
| Middleman | Customer | Delivers the order |
| Admin | Everyone | Monitors users, catalog, orders, payments, complaints |

---

## Slide 8 — Portals at a glance (for live demo)

| Portal | Start here | Show next |
|--------|------------|-----------|
| Farmer | `/seller/login` | Products → Orders → Assign delivery |
| Broker | `/broker/login` | Dashboard → Submissions |
| Admin | `/admin/login` | Products → Orders → Analytics |
| Customer | `/login` | Products → Cart → Checkout → Orders |
| Middleman | `/middleman/login` | Assigned → Pickup → Deliveries |

**Demo tip:** Every portal has one-click demo login (no real password needed). Clear site storage to reset demo data.

---

## Slide 9 — How it works under the hood (short)

```
React pages (per role)
        │
        ▼
AuthContext + role data providers
        │
        ▼
localStorage stores
  customerStore · sellerStore · brokerStore
  middlemanStore · adminStore
```

- Each role has its own session in `localStorage`
- Route guards protect each portal (`RequireSeller`, `RequireBroker`, …)
- Farmer submit syncs into `brokerStore` so accept/reject stays consistent

---

## Slide 10 — Closing / takeaways

1. **Multi-role dairy marketplace** — farmer → broker → admin → customer → middleman  
2. **Clear approval chain** before products go live  
3. **Full order lifecycle** from place to deliver  
4. **Presentation-ready demo** with one-click role logins  

**Tagline:** *From farm listing to doorstep delivery — in one workflow.*
