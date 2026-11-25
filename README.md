# Safia — Online Ordering (High-Fidelity Prototype)

Individual Systems Analysis and Design coursework (CW2). A React + TypeScript + Vite prototype of a redesigned customer-facing ordering experience for a bakery.

> **Academic prototype — not an official Safia application.** It uses no real Safia APIs, inventory, branches, payment or delivery services. All products, prices (UZS), addresses, branches, orders and payments are sample/simulated data.

## Install and run

Requires Node.js 18+ (built with Node 22). Package manager: **npm** (no pnpm lockfile existed; `package-lock.json` is included).

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # TypeScript check
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
npm test           # pricing-rule self-checks (8 assertions)
```

Demo login: any valid Uzbek mobile number (e.g. `90 123 45 67`), verification code **123456**.
Routing uses `HashRouter`, so the built `dist/` also works from any static host.

## The 12 screens

| #   | Screen                                                     | Route                               |
| --- | ---------------------------------------------------------- | ----------------------------------- |
| 1   | Welcome / Login (phone + simulated code)                   | `/#/`                               |
| 2   | Home / Product Catalogue (search, categories, empty state) | `/#/catalogue`                      |
| 3   | Product Details (quantity, stock limit)                    | `/#/product/:id`                    |
| 4   | Shopping Cart                                              | `/#/cart`                           |
| 5   | Fulfilment Selection                                       | `/#/fulfilment`                     |
| 6A  | Delivery Details                                           | `/#/delivery`                       |
| 7A  | Schedule Pre-order                                         | `/#/schedule?type=delivery\|pickup` |
| 6B  | Pickup Details                                             | `/#/pickup`                         |
| 8   | Order Review (promo, fees, total)                          | `/#/review`                         |
| 9   | Payment (simulated success / failure / pending)            | `/#/payment`                        |
| 10  | Order Confirmation                                         | `/#/confirmation/:ref`              |
| 11  | Order History / Tracking                                   | `/#/orders`, `/#/orders/:ref`       |
| 12  | Profile                                                    | `/#/profile`                        |

## Implemented features

- Phone validation, simulated OTP, protected routes, logout.
- Search (header, live) and category filtering; empty-search state.
- Cart add/remove/quantity, stock limits (on detail page, cart and add buttons), automatic subtotal, empty state.
- Delivery/pickup branching; cart preserved when switching; sample addresses, custom address with validation; sample branches.
- Date + time-slot selection (past dates blocked, past slots today disabled); pre-order scheduling up to 30 days ahead.
- Promo codes (`WELCOME10` = 10% from 50 000 UZS; `BAKE20` = 20 000 UZS off from 150 000 UZS) with validation messages.
- **Final total = subtotal + applicable fees − confirmed discounts.** Delivery fee 15 000 UZS, free from 200 000 UZS; pickup never has a delivery fee.
- Payment simulation: success, failed (no order created, cart kept, retry), pending (order saved as "Awaiting payment"). No card data collected.
- Unique order references, order confirmation, history (2 sample + your orders), order detail with simulated status timeline.
- Profile editing with validation, support info, order history link, "Reset prototype data".
- Cart, checkout draft, customer and orders persisted in `localStorage` (keys `safia.*`).
- Responsive: mobile (375), tablet (768), desktop (1440) — top nav on desktop, bottom tab bar on mobile; no horizontal overflow on tested pages.

## Structure

```
src/
  components/  Layout, ProductCard, OrderSummary, Shared
  context/     StoreContext (cart, checkout draft, orders, customer, persistence)
  data/        sample products, addresses, branches, slots, promos, sample orders
  pages/       one file per screen (6A/6B/7A share FulfilmentDetails)
  styles/      global.css (design tokens as CSS variables)
  types/       Customer, Product, Category, Cart, CartItem, Order, OrderItem, Fulfilment, Address, Branch, TimeSlot, Payment, Promotion
  utils/       pricing.ts (+ selfcheck.ts)
design-references/  the five supplied Figma screenshots
scripts/e2e_check.py  optional Playwright smoke test
```

## Design notes and known limitations

- Tokens were matched by eye to the five screenshots (burgundy `#8E2428`, cream `#F6EEE4`, Playfair Display headings, DM Sans UI text). Fonts load from Google Fonts, so a connection is needed for exact typography (system serif/sans fallbacks otherwise).
- Only three real photographs exist (the croissant hero, Butter Croissant, Rustic Seeded Loaf — cropped from your screenshots). Other products show a tonal placeholder tile; replace with real photos in `public/images/` and `src/data/index.ts`.
- Screens 6A, 7A, 6B, 8, 9, 10, 11, 12 and the login were designed from the shared design language, not from screenshots.
- The demo is client-side only: no backend, no real SMS, payment or tracking. Order statuses are static simulations.

## Recording the (max one minute) demonstration

1. `npm install && npm run dev`, open the URL in Chrome; use DevTools device mode (iPhone 14, 390×844).
2. Start a screen recorder (Windows: Win+G; macOS: Shift+Cmd+5; or OBS).
3. Suggested ~55 s script: login (90 123 45 67 / 123456) → search "rustic" → open Butter Croissant, add 2 → cart → Continue → Home delivery → pick address, tomorrow, slot → review, apply `WELCOME10` → payment: show _Fail_ then retry with _Succeed_ → confirmation → Orders → Profile.
4. Trim to ≤ 60 s and export as MP4.
