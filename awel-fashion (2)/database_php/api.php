<?php
/**
 * AWEL FASHION COUTURE - REST API Gateway
 * Serves JSON endpoints for the frontend application using PHP & MySQL.
 */

// Enable CORS so the React frontend can talk to this PHP backend
if (defined('ALLOW_CORS') && ALLOW_CORS || true) {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Content-Type: application/json; charset=UTF-8");

    // Handle preflight OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

require_once __DIR__ . '/db.php';

$db = DB::getInstance();
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Parse incoming raw JSON body
$input = json_decode(file_get_contents('php://input'), true) ?? [];

switch ($action) {

    // ─────────────────────────────────────────────────────────────────────────
    // ACTION: GET PRODUCTS
    // ─────────────────────────────────────────────────────────────────────────
    case 'products':
        try {
            // Retrieve all primary products
            $products = $db->fetchAll("SELECT * FROM products ORDER BY id ASC");
            
            // Map table column names to frontend camelCase properties
            $formattedProducts = [];
            foreach ($products as $p) {
                // Fetch color-specific images if any
                $colorImagesRows = $db->fetchAll("SELECT color, image_url FROM product_color_images WHERE product_id = ?", [$p['id']]);
                $colorImages = [];
                foreach ($colorImagesRows as $row) {
                    if (!isset($colorImages[$row['color']])) {
                        $colorImages[$row['color']] = [];
                    }
                    $colorImages[$row['color']][] = $row['image_url'];
                }

                $formattedProducts[] = [
                    'id' => (int)$p['id'],
                    'title' => $p['title'],
                    'category' => $p['category'],
                    'price' => (float)$p['price'],
                    'originalPrice' => $p['original_price'] ? (float)$p['original_price'] : null,
                    'rating' => (float)$p['rating'],
                    'reviews' => (int)$p['reviews'],
                    'color' => $p['color'],
                    'size' => $p['size'],
                    'popularity' => (int)$p['popularity'],
                    'icon' => $p['icon'],
                    'iconBg' => $p['icon_bg'],
                    'image' => $p['image'],
                    'description' => $p['description'],
                    'colorImages' => !empty($colorImages) ? $colorImages : null
                ];
            }

            echo json_encode(["status" => "success", "products" => $formattedProducts]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    // ─────────────────────────────────────────────────────────────────────────
    // ACTION: USER REGISTER
    // ─────────────────────────────────────────────────────────────────────────
    case 'register':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["status" => "error", "message" => "Method not allowed"]);
            break;
        }

        $firstName = trim($input['firstName'] ?? '');
        $lastName = trim($input['lastName'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($firstName) || empty($lastName) || empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Please fill out all fields"]);
            break;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid email address format"]);
            break;
        }

        try {
            // Check if user already exists
            $existing = $db->fetch("SELECT id FROM users WHERE email = ?", [$email]);
            if ($existing) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Email address is already registered"]);
                break;
            }

            // Hash password securely
            $passwordHash = password_hash($password, PASSWORD_BCRYPT);
            
            // Insert user
            $userId = $db->insert(
                "INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)",
                [$firstName, $lastName, $email, $passwordHash]
            );

            // Return user details (without hash)
            echo json_encode([
                "status" => "success",
                "message" => "Registration successful",
                "user" => [
                    "firstName" => $firstName,
                    "lastName" => $lastName,
                    "email" => $email,
                    "joinDate" => date('Y-m-d')
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    // ─────────────────────────────────────────────────────────────────────────
    // ACTION: USER LOGIN
    // ─────────────────────────────────────────────────────────────────────────
    case 'login':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["status" => "error", "message" => "Method not allowed"]);
            break;
        }

        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Please enter your email and password"]);
            break;
        }

        try {
            $user = $db->fetch("SELECT * FROM users WHERE email = ?", [$email]);
            
            if (!$user || !password_verify($password, $user['password_hash'])) {
                http_response_code(401);
                echo json_encode(["status" => "error", "message" => "Invalid email or password"]);
                break;
            }

            echo json_encode([
                "status" => "success",
                "message" => "Login successful",
                "user" => [
                    "id" => (int)$user['id'],
                    "firstName" => $user['first_name'],
                    "lastName" => $user['last_name'],
                    "email" => $user['email'],
                    "joinDate" => date('Y-m-d', strtotime($user['join_date'])),
                    "role" => $user['role']
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    // ─────────────────────────────────────────────────────────────────────────
    // ACTION: ADD PRODUCT (ADMIN ONLY)
    // ─────────────────────────────────────────────────────────────────────────
    case 'add_product':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["status" => "error", "message" => "Method not allowed"]);
            break;
        }

        // Normally you would verify an admin token or cookie session here
        $title = trim($input['title'] ?? '');
        $category = trim($input['category'] ?? '');
        $price = (float)($input['price'] ?? 0);
        $originalPrice = isset($input['originalPrice']) ? (float)$input['originalPrice'] : null;
        $color = trim($input['color'] ?? 'Black');
        $size = trim($input['size'] ?? 'M');
        $icon = trim($input['icon'] ?? '🧥');
        $iconBg = trim($input['iconBg'] ?? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)');
        $image = trim($input['image'] ?? '');
        $description = trim($input['description'] ?? '');

        if (empty($title) || empty($category) || $price <= 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing required product parameters"]);
            break;
        }

        try {
            $productId = $db->insert(
                "INSERT INTO products (title, category, price, original_price, color, size, icon, icon_bg, image, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [$title, $category, $price, $originalPrice, $color, $size, $icon, $iconBg, $image, $description]
            );

            // Insert color-specific images if provided
            if (isset($input['colorImages']) && is_array($input['colorImages'])) {
                foreach ($input['colorImages'] as $col => $imgs) {
                    if (is_array($imgs)) {
                        foreach ($imgs as $imgUrl) {
                            $db->insert(
                                "INSERT INTO product_color_images (product_id, color, image_url) VALUES (?, ?, ?)",
                                [$productId, $col, $imgUrl]
                            );
                        }
                    }
                }
            }

            echo json_encode([
                "status" => "success",
                "message" => "Product added successfully",
                "productId" => (int)$productId
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    // ─────────────────────────────────────────────────────────────────────────
    // DEFAULT UNHANDLED ACTION
    // ─────────────────────────────────────────────────────────────────────────
    default:
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Invalid Action or Endpoint. Valid parameters include 'products', 'login', 'register', and 'add_product'."
        ]);
        break;
}
