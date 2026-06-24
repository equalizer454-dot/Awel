-- AWEL FASHION COUTURE Database Schema
-- Compatible with MySQL 5.7+ / 8.0+ / MariaDB
-- Created on 2026-06-23

CREATE DATABASE IF NOT EXISTS `awel_fashion` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `awel_fashion`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `join_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `role` VARCHAR(20) DEFAULT 'user', -- 'user' or 'admin'
  INDEX (`email`)
) ENGINE=InnoDB;

-- 2. Products Table
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `original_price` DECIMAL(10, 2) NULL,
  `rating` DECIMAL(2, 1) DEFAULT 5.0,
  `reviews` INT DEFAULT 0,
  `color` VARCHAR(30) NOT NULL,
  `size` VARCHAR(10) NOT NULL,
  `popularity` INT DEFAULT 50,
  `icon` VARCHAR(10) NOT NULL,
  `icon_bg` VARCHAR(100) NOT NULL,
  `image` VARCHAR(255) NULL,
  `description` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Product Color Specific Images
CREATE TABLE IF NOT EXISTS `product_color_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `color` VARCHAR(30) NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Cart Items Table
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `size` VARCHAR(10) NOT NULL,
  `color` VARCHAR(30) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_product_variant` (`user_id`, `product_id`, `size`, `color`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Wishlist Table
CREATE TABLE IF NOT EXISTS `wishlist` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_product_wish` (`user_id`, `product_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ─────────────────────────────────────────────────────────────────────────────
-- SEED DATA FOR PRODUCTS
-- Matches standard catalog items in defaultProducts.ts
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO `products` (`id`, `title`, `category`, `price`, `original_price`, `rating`, `reviews`, `color`, `size`, `popularity`, `icon`, `icon_bg`, `image`, `description`) VALUES
(1, 'Aurora Silver Reflective Puffer', 'Puffers', 999.00, 1399.00, 4.9, 142, 'Silver', 'M', 98, '🧥', 'linear-gradient(135deg, #475569 0%, #334155 100%)', '/src/assets/images/silver_gloss_puffer_1781865862910.jpg', 'Featured in COLLECTION ARTIC 01. The Aurora Silver reflective puffer jacket is built with lightweight insulated padding, specialized reflective foil exterior, and adjustable utility strings. Completely waterproof and windproof.'),
(2, 'Orbit Silver High-Gloss Puffer', 'Puffers', 1299.99, NULL, 5.0, 98, 'Silver', 'L', 99, '🧥', 'linear-gradient(135deg, #64748b 0%, #475569 100%)', '/src/assets/images/cyber_arctic_hero_1781865846975.jpg', 'The epitome of high-gloss extreme cold-line defense. Engineered with premium down feathers, double-insulation shell layers, and high-visibility metallic luster inspired by deep orbital operations.'),
(3, 'Stealth Black Heavy Shield Puffer', 'Puffers', 1199.99, 1499.00, 4.8, 120, 'Black', 'XL', 95, '🔌', 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', '/src/assets/images/stealth_black_puffer_1781865879062.jpg', 'Tactical matte-black extreme puff design with a thermal inner lining, storm cuffs, and custom metal hardware. Made for heavy snow shielding in deep sub-zero conditions.'),
(4, 'Glacier White Insulated Puffer', 'Puffers', 1299.00, NULL, 4.9, 165, 'White', 'S', 97, '❄️', 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)', '/src/assets/images/glacier_white_puffer_1781865895283.jpg', 'Pure white pristine insulation jacket inspired by colossal glacier fields. Crafted in double-layered windproof fabric with ultra-breathable temperature-regulated down filling.'),
(5, 'Polar Gloss Deep Blue Puffer', 'Puffers', 999.99, NULL, 4.7, 78, 'Blue', 'M', 91, '🌐', 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', '/src/assets/images/silver_gloss_puffer_1781865862910.jpg', 'High-density wet-look blue puffer coat. Features clean vertical lines, asymmetric zippers, and specialized micro-air pockets that retain heat indefinitely while keeping an incredibly lightweight feel.'),
(6, 'Icefield Blue Tech Puffer Jacket', 'Puffers', 999.00, NULL, 4.8, 114, 'Blue', 'L', 96, '🌀', 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)', '/src/assets/images/cyber_arctic_hero_1781865846975.jpg', 'Part of the Metal Edition Extreme Cold Line. Crafted from fully seam-sealed technology shells, this dynamic icefield blue jacket features storm cuffs and standard utility buckles.'),
(7, 'Sub-Zero Pro Polar Goggles', 'Goggles', 349.00, 420.00, 5.0, 56, 'Silver', 'OS', 99, '🥽', 'linear-gradient(135deg, #64748b 0%, #334155 100%)', NULL, 'High-spec polar goggles with magnetic anti-fog lenses, full UV400 filtration, and breathable high-density triple-layer foam cushions designed to fit perfectly with the puffer utility hoods.'),
(8, 'Glacier Summit Platform Boots', 'Boots', 499.00, NULL, 4.8, 82, 'White', '10', 94, '🥾', 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)', NULL, 'Rugged high-top alpine platform boots designed for heavy snow. Features thermal neoprene socks, double speed-lacing wire systems, and heavy-grip claw tread Vibram outsoles.');


-- Seed admin account (Password is 'admin1234')
INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password_hash`, `role`) VALUES
(1, 'Awel', 'Admin', 'admin@awel.com', '$2y$10$O0O9V96YyEw.Qn7wS4CgXe9N7yDq2Tfe9K.M5bCg0b6rU/b.Vn63W', 'admin');
