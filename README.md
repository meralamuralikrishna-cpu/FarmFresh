# FreshFarm

Demo milk-selling platform that connects local farms with customers — fresh dairy from farm to door.

Frontend-only React app. Auth, catalog, orders, deliveries, and admin data are stored in the browser (`localStorage`). There is no real backend or payment gateway.

## Stack

- React 19 + Vite
- React Router
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Oxlint

## Roles

| Role | Login | What you can do |
|------|--------|-----------------|
| **Customer** | `/login` | Browse products, cart, wishlist, checkout, orders, subscriptions, addresses, notifications |
| **Seller / Farmer** | `/seller/login` | Manage products & stock, confirm orders, assign delivery, earnings, reviews |
| **Middleman / Delivery** | `/middleman/login` | Accept assigned orders, pickup/delivery status, earnings, profile |
| **Admin** | `/admin/login` | Users, sellers, middlemen, products, orders, payments, complaints, analytics |

Public pages: home, about, contact, and product browse/detail.

## Demo login

Every portal uses one-click demo sign-in — no email or password fields.

- Customer → **Continue as demo customer**
- Seller → **Continue as demo seller**
- Delivery → **Continue as demo delivery partner**
- Admin → **Continue as demo admin**

## Styling

Tailwind CSS v4 is wired through `@tailwindcss/vite`. Brand tokens live in `src/index.css` (`@theme`) as utilities like `bg-pasture`, `text-ink`, `font-display`, and `shadow-soft`. Existing page CSS still works alongside Tailwind.

## Scripts

```bash
npm install
npm run dev      # development server
npm run build    # production build
npm run preview  # preview production build
npm run lint     # Oxlint
```

## Project layout

```
src/
  pages/
    customer/   # shop, cart, checkout, orders, subscriptions
    seller/     # farmer workspace
    middleman/  # delivery partner
    admin/      # control center
    public/     # home, about, contact
  context/      # auth + role data providers
  services/     # localStorage stores (customer, middleman, admin, …)
  components/   # shared layout, navbar, footer
```

## Notes

- Data resets if you clear site storage for this origin.
- Payment methods in checkout are simulated for demo flow only.
- Built against the milk-selling system architecture (customer / seller / middleman / admin portals).
