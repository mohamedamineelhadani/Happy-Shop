-- ============================================================
--  HappyShop — database schema + demo data
--  MariaDB 10.4+ / MySQL 5.7+
--
--  Import with:
--    C:\xampp\mysql\bin\mysql.exe -u root < database\db.sql
--  or through phpMyAdmin.
-- ============================================================

CREATE DATABASE IF NOT EXISTS happyshop
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE happyshop;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS archive;
DROP TABLE IF EXISTS contact;
DROP TABLE IF EXISTS rating;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
--  Categories
-- ------------------------------------------------------------
CREATE TABLE categories (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  slug        VARCHAR(140) NOT NULL,
  description VARCHAR(400) DEFAULT NULL,
  icon        VARCHAR(60)  DEFAULT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
--  Products
-- ------------------------------------------------------------
CREATE TABLE products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT DEFAULT NULL,
  title       VARCHAR(250) NOT NULL,
  slug        VARCHAR(280) NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  old_price   DECIMAL(10,2) DEFAULT NULL,
  description TEXT NOT NULL,
  image       VARCHAR(500) DEFAULT NULL,
  stock       INT NOT NULL DEFAULT 0,
  featured    TINYINT(1) NOT NULL DEFAULT 0,
  status      ENUM('active','draft','archived') NOT NULL DEFAULT 'active',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_products_slug (slug),
  KEY idx_products_category (category_id),
  KEY idx_products_featured (featured),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id)
    REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
--  Reviews
-- ------------------------------------------------------------
CREATE TABLE reviews (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  author     VARCHAR(150) NOT NULL,
  rating     TINYINT NOT NULL,
  comment    VARCHAR(600) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_reviews_product (product_id),
  CONSTRAINT fk_reviews_product FOREIGN KEY (product_id)
    REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
--  Orders
-- ------------------------------------------------------------
CREATE TABLE orders (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  reference     VARCHAR(30) NOT NULL,
  customer_name VARCHAR(200) NOT NULL,
  email         VARCHAR(200) NOT NULL,
  phone         VARCHAR(50)  NOT NULL,
  address       VARCHAR(400) DEFAULT NULL,
  city          VARCHAR(120) DEFAULT NULL,
  note          VARCHAR(600) DEFAULT NULL,
  subtotal      DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping      DECIMAL(10,2) NOT NULL DEFAULT 0,
  total         DECIMAL(10,2) NOT NULL DEFAULT 0,
  status        ENUM('pending','confirmed','shipped','delivered','cancelled')
                NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_orders_reference (reference),
  KEY idx_orders_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  order_id   INT NOT NULL,
  product_id INT DEFAULT NULL,
  title      VARCHAR(250) NOT NULL,
  price      DECIMAL(10,2) NOT NULL,
  quantity   INT NOT NULL,
  image      VARCHAR(500) DEFAULT NULL,
  KEY idx_items_order (order_id),
  CONSTRAINT fk_items_order FOREIGN KEY (order_id)
    REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_items_product FOREIGN KEY (product_id)
    REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
--  Contact messages
-- ------------------------------------------------------------
CREATE TABLE contacts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  full_name  VARCHAR(200) NOT NULL,
  email      VARCHAR(200) NOT NULL,
  phone      VARCHAR(50)  DEFAULT NULL,
  subject    VARCHAR(200) DEFAULT NULL,
  message    TEXT NOT NULL,
  is_read    TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_contacts_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
--  Admins (used by the admin panel)
-- ------------------------------------------------------------
CREATE TABLE admins (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(200) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin','editor') NOT NULL DEFAULT 'admin',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_admins_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  Demo data
-- ============================================================

INSERT INTO categories (id, name, slug, description, icon) VALUES
  (1, 'Watches',       'watches',     'Precision timepieces for every moment.',  'watch'),
  (2, 'Audio',         'audio',       'Immersive sound, engineered to move you.', 'headphones'),
  (3, 'Fashion',       'fashion',     'Tailored essentials with timeless style.', 'shirt'),
  (4, 'Computers',     'computers',   'Power and performance, beautifully refined.', 'laptop'),
  (5, 'Home & Living', 'home-living', 'Elevate every corner of your home.',      'sofa'),
  (6, 'Accessories',   'accessories', 'The details that define you.',            'bag');

INSERT INTO products
  (id, category_id, title, slug, price, old_price, description, image, stock, featured, status) VALUES
  (1,  1, 'Aurora Chronograph', 'aurora-chronograph', 1290.00, 1590.00,
      'A sapphire-crystal chronograph with a brushed steel case and hand-finished automatic movement. Water resistant to 100m.',
      '/images/products/aurora-chronograph.svg', 12, 1, 'active'),
  (2,  1, 'Obsidian Automatic', 'obsidian-automatic', 2490.00, NULL,
      'Matte black titanium case paired with a midnight dial. A 72-hour power reserve and exhibition case-back.',
      '/images/products/obsidian-automatic.svg', 8, 1, 'active'),
  (3,  1, 'Heritage Gold Classic', 'heritage-gold-classic', 899.00, 1050.00,
      'A dress watch with a warm gold-tone case, Roman numerals and a genuine leather strap.',
      '/images/products/heritage-gold-classic.svg', 15, 0, 'active'),
  (4,  2, 'Eclipse Wireless Headphones', 'eclipse-wireless-headphones', 549.00, 649.00,
      'Active noise cancelling over-ear headphones with 40-hour battery life and adaptive spatial audio.',
      '/images/products/eclipse-wireless-headphones.svg', 24, 1, 'active'),
  (5,  2, 'Resonance Pro Earbuds', 'resonance-pro-earbuds', 279.00, NULL,
      'True wireless earbuds with hybrid ANC, wireless charging case and studio-tuned drivers.',
      '/images/products/resonance-pro-earbuds.svg', 40, 0, 'active'),
  (6,  2, 'Studio Monitor Speakers', 'studio-monitor-speakers', 720.00, NULL,
      'A pair of powered bookshelf monitors with a silk dome tweeter and a woven fibre woofer.',
      '/images/products/studio-monitor-speakers.svg', 10, 0, 'active'),
  (7,  3, 'Cashmere Overcoat', 'cashmere-overcoat', 640.00, 780.00,
      'A double-faced cashmere overcoat with a relaxed silhouette and horn buttons. Fully lined.',
      '/images/products/cashmere-overcoat.svg', 14, 1, 'active'),
  (8,  3, 'Silk Evening Shirt', 'silk-evening-shirt', 210.00, NULL,
      'A fluid mulberry-silk shirt with a concealed placket and mother-of-pearl buttons.',
      '/images/products/silk-evening-shirt.svg', 30, 0, 'active'),
  (9,  3, 'Tailored Wool Blazer', 'tailored-wool-blazer', 480.00, NULL,
      'A half-canvassed blazer in Italian virgin wool with a soft shoulder and notch lapel.',
      '/images/products/tailored-wool-blazer.svg', 18, 0, 'active'),
  (10, 4, 'Titan Gaming Laptop', 'titan-gaming-laptop', 2899.00, 3299.00,
      'A 16-inch gaming laptop with a 240Hz display, RTX-class graphics and vapour-chamber cooling.',
      '/images/products/titan-gaming-laptop.svg', 6, 1, 'active'),
  (11, 4, 'Ultrabook Air 14', 'ultrabook-air-14', 1499.00, NULL,
      'A 1.1kg magnesium-alloy ultrabook with a 14-inch OLED panel and all-day battery life.',
      '/images/products/ultrabook-air-14.svg', 20, 0, 'active'),
  (12, 4, 'Creator Desktop Pro', 'creator-desktop-pro', 3499.00, NULL,
      'A compact workstation for creators: 16-core CPU, 64GB memory and a 2TB NVMe drive.',
      '/images/products/creator-desktop-pro.svg', 5, 0, 'active'),
  (13, 5, 'Velvet Lounge Chair', 'velvet-lounge-chair', 780.00, NULL,
      'A sculpted lounge chair upholstered in plush velvet with a solid oak frame.',
      '/images/products/velvet-lounge-chair.svg', 9, 0, 'active'),
  (14, 5, 'Marble Coffee Table', 'marble-coffee-table', 1150.00, 1350.00,
      'A honed Carrara marble top on a brushed brass base. Each piece is unique.',
      '/images/products/marble-coffee-table.svg', 7, 1, 'active'),
  (15, 5, 'Ambient Floor Lamp', 'ambient-floor-lamp', 320.00, NULL,
      'A dimmable floor lamp with a linen shade and a warm, glare-free glow.',
      '/images/products/ambient-floor-lamp.svg', 22, 0, 'active'),
  (16, 6, 'Leather Weekender Bag', 'leather-weekender-bag', 430.00, NULL,
      'A full-grain leather weekender with solid brass hardware and a cotton twill lining.',
      '/images/products/leather-weekender-bag.svg', 16, 1, 'active'),
  (17, 6, 'Aviator Sunglasses', 'aviator-sunglasses', 190.00, 240.00,
      'Classic aviators with polarised lenses and a lightweight titanium frame.',
      '/images/products/aviator-sunglasses.svg', 35, 0, 'active'),
  (18, 6, 'Minimalist Steel Wallet', 'minimalist-steel-wallet', 95.00, NULL,
      'A slim RFID-blocking wallet in brushed stainless steel that holds up to eight cards.',
      '/images/products/minimalist-steel-wallet.svg', 50, 0, 'active');

INSERT INTO reviews (product_id, author, rating, comment) VALUES
  (1, 'Amine H.',  5, 'The finish is superb — looks far more expensive than it is.'),
  (1, 'Sofia L.',  4, 'Beautiful watch, the strap took a few days to soften.'),
  (2, 'Karim B.',  5, 'The dial is stunning in person. Worth every dirham.'),
  (2, 'Nadia R.',  5, 'Lightweight for titanium and incredibly accurate.'),
  (3, 'Yassine E.',4, 'Elegant and understated. Great for the office.'),
  (3, 'Leila M.',  4, 'Lovely classic look, the gold tone is subtle.'),
  (4, 'Omar T.',   5, 'Noise cancelling is excellent on flights. Battery lasts forever.'),
  (4, 'Hana K.',   5, 'Comfortable for long sessions and the sound is rich.'),
  (4, 'Mehdi A.',  4, 'Great sound, though the case is a little bulky.'),
  (5, 'Sara B.',   5, 'Perfect fit and the ANC is impressive for the size.'),
  (5, 'Rachid N.', 4, 'Very good earbuds, charging case feels premium.'),
  (6, 'Imane F.',  4, 'Clean, neutral sound. Great for my home studio.'),
  (6, 'Anas D.',   5, 'Punchy and detailed. Build quality is excellent.'),
  (7, 'Salma G.',  5, 'Incredibly soft cashmere — my favourite coat now.'),
  (7, 'Hicham O.', 4, 'Beautiful tailoring. Runs slightly large.'),
  (8, 'Lina S.',   5, 'The silk is gorgeous and drapes beautifully.'),
  (8, 'Youssef B.',4, 'Elegant shirt, needs careful washing.'),
  (9, 'Meryem A.', 5, 'Excellent construction for the price. Fits like made-to-measure.'),
  (9, 'Tarik Z.',  4, 'Sharp blazer, the shoulder is nicely soft.'),
  (10,'Adam R.',   5, 'Runs everything at ultra settings without breaking a sweat.'),
  (10,'Khadija L.',5, 'The screen is gorgeous. Fast and quiet under load.'),
  (11,'Bilal M.',  4, 'Incredibly light and the OLED is beautiful.'),
  (11,'Nour H.',   5, 'Perfect for travel. Battery easily lasts a full day.'),
  (12,'Simo K.',   5, 'Renders 4K timelines effortlessly. Silent too.'),
  (12,'Aya T.',    4, 'Powerful workstation, a little pricey.'),
  (13,'Ghita P.',  5, 'So comfortable and the velvet feels luxurious.'),
  (13,'Reda C.',   4, 'Statement piece. Colour is exactly as pictured.'),
  (14,'Sanae W.',  5, 'The marble veining is beautiful — a real centrepiece.'),
  (14,'Othmane J.',5, 'Heavy, solid and stunning in the living room.'),
  (15,'Rim Y.',    4, 'Warm light and a very elegant shade.'),
  (15,'Fouad A.',  4, 'Easy to dim and looks great in the corner.'),
  (16,'Zineb M.',  5, 'The leather smells amazing and it is beautifully made.'),
  (16,'Marouane S.',5,'Roomy enough for a weekend and looks the part.'),
  (17,'Ilham B.',  4, 'Great lenses and very light on the face.'),
  (17,'Hamza R.',  4, 'Classic aviators, good value.'),
  (18,'Douae N.',  5, 'So slim it disappears in my pocket. Love it.'),
  (18,'Walid F.',  4, 'Simple and strong. Cards stay secure.');

INSERT INTO orders
  (id, reference, customer_name, email, phone, address, city, note, subtotal, shipping, total, status, created_at) VALUES
  (1, 'HS-2026-0001', 'Sara Ben Ali', 'sara@example.com', '+212600000002',
      '12 Rue des Fleurs', 'Casablanca', NULL, 1839.00, 0.00, 1839.00, 'delivered', '2026-01-14 10:24:00'),
  (2, 'HS-2026-0002', 'Yassine El Idrissi', 'yassine@example.com', '+212600000003',
      '48 Avenue Hassan II', 'Rabat', 'Please call before delivery.', 1375.00, 30.00, 1405.00, 'shipped', '2026-02-02 16:05:00'),
  (3, 'HS-2026-0003', 'Mohamed Amine El Hadani', 'amine@example.com', '+212600000001',
      '7 Boulevard Zerktouni', 'Marrakech', NULL, 2899.00, 0.00, 2899.00, 'pending', '2026-03-21 09:12:00');

INSERT INTO order_items (order_id, product_id, title, price, quantity, image) VALUES
  (1, 4,  'Eclipse Wireless Headphones', 549.00,  1, '/images/products/eclipse-wireless-headphones.svg'),
  (1, 1,  'Aurora Chronograph',          1290.00, 1, '/images/products/aurora-chronograph.svg'),
  (2, 7,  'Cashmere Overcoat',           640.00,  2, '/images/products/cashmere-overcoat.svg'),
  (2, 18, 'Minimalist Steel Wallet',     95.00,   1, '/images/products/minimalist-steel-wallet.svg'),
  (3, 10, 'Titan Gaming Laptop',         2899.00, 1, '/images/products/titan-gaming-laptop.svg');

INSERT INTO contacts (full_name, email, phone, subject, message, is_read) VALUES
  ('Mohamed Amine El Hadani', 'amine@example.com',    '+212600000001', 'Delivery times',   'Hello, I would like to ask about delivery times.', 1),
  ('Sara Ben Ali',            'sara@example.com',     '+212600000002', 'Product question', 'I want to know more details about the third product.', 0),
  ('Yassine El Idrissi',      'yassine@example.com',  '+212600000003', 'Payment issue',    'I had an issue with the payment. Please assist.', 0);

-- Default admin login:  admin@happyshop.test  /  admin123
INSERT INTO admins (name, email, password_hash, role) VALUES
  ('Mohamed Amine El Hadani', 'admin@happyshop.test',
   '$2y$10$BQJvm/riH2ZdgV8b4xp0mue5BYxvGPQymEPbVscEDjsl4toA/idqC', 'admin');
