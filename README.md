# HappyShop

A luxury e-commerce storefront: a **React 19 + Vite** front end talking to a
hand-rolled **PHP MVC/DAO** API backed by **MariaDB/MySQL**.

Dark, gold-accented design with a real animation system, a cart that persists to
`localStorage`, and a service layer that mirrors the API one-to-one.

```
happyChop/
├─ backend/            PHP API (front controller + router + MVC + DAO)
│  ├─ config/          app config + database credentials
│  ├─ core/            Database, Model, Controller, Router, Validator, Auth, Str
│  ├─ models/          Product, Category, Review, Order, Contact, Admin
│  ├─ controllers/     Product, Category, Order, Contact, Auth, Stats
│  ├─ middleware/      CORS
│  └─ index.php        autoloader + all routes
├─ database/db.sql     schema + demo data (import this first)
├─ public/             static assets (product images, favicon)
├─ scripts/            generate-product-images.mjs
└─ src/                React app
   ├─ components/      layout · ui · product · cart
   ├─ pages/           Home · Shop · ProductDetail · Categories · CategoryDetail · Contact · Checkout · NotFound
   ├─ services/        axios client + per-resource API modules
   ├─ context/         Cart + Toast providers
   ├─ hooks/           useApi
   ├─ lib/             format helpers + inline SVG icons
   └─ styles/          tokens · base · animations · layout · components · pages
```

## Requirements

- PHP 8.1+ (developed on 8.2) with PDO MySQL
- MariaDB 10.4+ / MySQL 5.7+
- Node 18+ and npm
- Apache (XAMPP) or any server that can serve `backend/` with `.htaccess` rewrites

## Getting started

1. **Create the database** (drops and recreates the `happyshop` tables):

   ```bash
   mysql -u root < database/db.sql
   ```

   With XAMPP on Windows:

   ```powershell
   & "C:\xampp\mysql\bin\mysql.exe" -u root --default-character-set=utf8mb4 `
     -e "source C:/xampp/htdocs/Portfolio projects/happyChop/database/db.sql"
   ```

2. **Configure credentials** in `backend/config/db.php` if they differ from the
   defaults (`localhost` / `root` / empty password / `happyshop`).

3. **Install and run the front end**:

   ```bash
   npm install
   npm run dev
   ```

   The dev server proxies `/api` to the PHP backend, so no CORS setup is needed.
   Point it elsewhere with `VITE_API_TARGET` (see `.env.example`).

4. Open the printed URL (default <http://localhost:5173>).

## API

Base path: `backend/api` → e.g. `http://localhost/<project>/backend/api`.

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/api/products` | `category`, `search`, `sort`, `featured`, `min`, `max`, `page`, `per_page` |
| GET | `/api/products/{slug}` | detail + reviews + related |
| POST | `/api/products/{slug}/reviews` | `author`, `rating` (1–5), `comment` |
| GET | `/api/categories` | with product counts |
| GET | `/api/categories/{slug}` | category + paginated products |
| POST | `/api/orders` | `items: [{ product_id, quantity }]` — totals recalculated server-side |
| POST | `/api/contacts` | contact message |
| POST | `/api/auth/login` | admin credentials → bearer token |
| GET | `/api/auth/me` | current admin |
| GET | `/api/admin/stats` | dashboard totals (auth) |
| POST/PUT/DELETE | `/api/products`, `/api/products/{id}` | admin CRUD (auth) |
| POST/PUT/DELETE | `/api/categories`, `/api/categories/{id}` | admin CRUD (auth) |
| GET | `/api/orders`, `/api/orders/{reference}` | admin (auth) |
| PUT | `/api/orders/{id}/status` | admin (auth) |
| GET/PUT/DELETE | `/api/contacts`, `/api/contacts/{id}/read`, `/api/contacts/{id}` | admin (auth) |

Responses use a `{ success, message, data }` envelope; lists return
`data: { items, meta: { total, page, per_page, pages } }`.

Seeded admin login: **admin@happyshop.test / admin123**.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server with API proxy |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |
| `node scripts/generate-product-images.mjs` | Regenerate the placeholder product SVGs |

## Notes

- Product images are locally generated on-brand SVGs so the storefront looks
  complete offline; they can be replaced by real uploads later.
- The admin panel (using `/api/auth/login` and the admin endpoints) is the next
  phase.
