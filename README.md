# HappyShop

A luxury e-commerce storefront and a matching admin dashboard: two **React 19 +
Vite** front ends talking to a hand-rolled **PHP MVC/DAO** API backed by
**MariaDB/MySQL**.

Dark, gold-accented design with a real animation system, a cart that persists to
`localStorage`, and a service layer that mirrors the API one-to-one.

```
happyChop/
├─ backend/            PHP API (front controller + router + MVC + DAO)
│  ├─ config/          app config + database credentials + upload paths
│  ├─ core/            Database, Model, Controller, Router, Validator, Auth, Str, Upload
│  ├─ models/          Product, Category, Review, Order, Contact, Subscriber, Admin
│  ├─ controllers/     Product, Category, Order, Contact, Subscriber, Upload, Auth, Stats
│  ├─ middleware/      CORS
│  ├─ public/          served static assets (product images live here)
│  └─ index.php        autoloader + all routes
├─ admin/              React admin dashboard (separate Vite app)
│  ├─ src/
│  │  ├─ components/   layout · ui · product · category
│  │  ├─ pages/        Login · Dashboard · Products · ProductEdit · Categories · Orders · OrderDetail · Messages · Subscribers · Profile
│  │  ├─ services/     axios client + per-resource API modules
│  │  ├─ context/      Auth + Toast providers
│  │  ├─ hooks/        useApi
│  │  └─ lib/          format helpers + inline SVG icons
│  └─ vite.config.js   dev server on :5174, proxies /api and /images
├─ database/db.sql     schema + demo data (import this first)
├─ public/             storefront static assets (favicon)
├─ scripts/            generate-product-images.mjs
└─ src/                React storefront
   ├─ components/      layout · ui · product · cart
   ├─ pages/           Home · Shop · ProductDetail · Categories · CategoryDetail · Contact · Checkout · Favorites · NotFound
   ├─ services/        axios client + per-resource API modules
   ├─ context/         Cart + Wishlist + Toast providers
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

5. **Install and run the admin dashboard** (a separate app):

   ```bash
   cd admin
   npm install
   npm run dev
   ```

   It runs on <http://localhost:5174> and proxies `/api` to the same backend.
   Sign in with the seeded account below.

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
| POST | `/api/subscribers` | newsletter sign-up (`email`) |
| POST | `/api/auth/login` | admin credentials → bearer token |
| GET | `/api/auth/me` | current admin |
| PUT | `/api/auth/profile` | update the signed-in admin's name/email/password (auth) |
| GET | `/api/admin/stats` | dashboard totals (auth) |
| GET | `/api/admin/products` | every product incl. drafts/archived (auth) |
| POST | `/api/admin/uploads` | multipart image upload (`image`) → `{ url, filename, size, mime }` (auth) |
| POST/PUT/DELETE | `/api/products`, `/api/products/{id}` | admin CRUD (auth) |
| POST/PUT/DELETE | `/api/categories`, `/api/categories/{id}` | admin CRUD (auth) |
| GET | `/api/orders`, `/api/orders/{reference}` | admin (auth) |
| PUT | `/api/orders/{id}` | edit customer details (auth) |
| PUT | `/api/orders/{id}/status` | admin (auth) |
| GET/PUT/DELETE | `/api/contacts`, `/api/contacts/{id}/read`, `/api/contacts/{id}` | admin (auth) |
| GET/PUT/DELETE | `/api/subscribers`, `/api/subscribers/{id}` | admin (auth) |

Responses use a `{ success, message, data }` envelope; lists return
`data: { items, meta: { total, page, per_page, pages } }`.

Seeded admin login: **admin@happyshop.test / admin123**.

## Scripts

Storefront (run from the repo root):

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server with API proxy (port 5173) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |
| `node scripts/generate-product-images.mjs` | Regenerate the placeholder product SVGs |

Admin (run from `admin/`): same `dev` / `build` / `preview` / `lint` scripts;
the dev server listens on port 5174.

## Admin dashboard

A separate Vite app in `admin/` that shares only the API. It covers:

- **Login** with the seeded admin (bearer token stored in `localStorage`).
- **Dashboard** — revenue, counts, orders by status, low stock, recent orders.
- **Products** — search/filter, create, edit, delete, and **image upload**
  (drag & drop or browse → `POST /api/admin/uploads`, with preview).
- **Categories** — inline create/edit/delete.
- **Orders** — filter, change status inline, and edit customer details.
- **Messages** — read contact submissions and delete them.
- **Subscribers** — review sign-ups and toggle their active status.
- **Profile** — update your own name, email address and password.

## Notes

- Product images are locally generated on-brand SVGs so the storefront looks
  complete offline. They live in `backend/public/images/products/` alongside
  admin uploads: `POST /api/admin/uploads` stores an image (JPG/PNG/WEBP/GIF,
  ≤5 MB) there and returns its URL, which is saved on the product's `image`
  field via the product CRUD endpoints. Override the location with `UPLOAD_DIR` /
  `UPLOAD_URL` in `backend/config/config.php`.
- Both dev servers proxy `/images` to the backend's `public/` folder, so
  `/images/products/...` resolves in the storefront and the admin dashboard. In
  production, serve the backend's `public/` folder at `/images` (or point
  `VITE_MEDIA_TARGET` at it).
- Favourites (the heart button) are stored per-browser in `localStorage`; they can
  be moved server-side once customer accounts exist.
- Product status controls storefront visibility: `active` is live, `draft` and
  `archived` are hidden.
