# AWEL FASHION COUTURE - PHP & MySQL Database Layer

This directory contains the database definition and API wrapper scripts required to run **Awel Fashion Couture** on a PHP & MySQL backend instead of local storage.

---

## 📂 Directory Structure

*   `schema.sql` - The MySQL database structure, tables, constraints, and seed data.
*   `config.php` - Connection parameters (host, port, username, password, DB name).
*   `db.php` - A secure PDO wrapper class implementing the Singleton pattern to execute queries safely.
*   `api.php` - A JSON REST API router designed to receive requests from a React frontend.

---

## 🛠️ Setup Instructions

### 1. Requirements
Ensure you have the following installed:
*   **PHP 7.4 or 8.x**
*   **MySQL 5.7+ or MariaDB**
*   A local web server environment (like **XAMPP**, **MAMP**, or **Local WP**).

### 2. Import Database
1. Open your MySQL client (e.g., **phpMyAdmin**, TablePlus, or command line).
2. Create a new database named `awel_fashion`.
3. Import the `schema.sql` file:
   ```bash
   mysql -u root -p awel_fashion < schema.sql
   ```
   *This automatically creates all required tables and seeds 8 default items into your product catalog, along with an admin account.*

### 3. Configure Connection
Open `config.php` and configure your credentials:
```php
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'awel_fashion');
define('DB_USER', 'root');   // Your MySQL Username
define('DB_PASS', '');       // Your MySQL Password
```

### 4. Run & Test the PHP Server
If using standard PHP, you can start a local development server in this directory:
```bash
php -S localhost:8000
```

Test the API in your browser or Postman:
*   **Fetch Catalog**: `http://localhost:8000/api.php?action=products`
*   **Response Format**:
    ```json
    {
      "status": "success",
      "products": [
        {
          "id": 1,
          "title": "Aurora Silver Reflective Puffer",
          "category": "Puffers",
          "price": 999.00,
          ...
        }
      ]
    }
    ```

---

## 🌐 Connecting React to your PHP API

In your React frontend application, you can easily switch from LocalStorage or mock data to fetching directly from this secure PHP database. 

### Example Fetch Hook
```typescript
import { useState, useEffect } from 'react';
import { Product } from './types';

export function usePhpProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api.php?action=products')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setProducts(data.products);
        }
      })
      .catch(err => console.error('Failed to load products from PHP:', err))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}
```

### Example Authentication (Login) Call
```typescript
async function handleLogin(email, password) {
  try {
    const response = await fetch('http://localhost:8000/api.php?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    if (result.status === 'success') {
      console.log('Logged in user:', result.user);
      // Save user profile state
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error logging in:', error);
  }
}
```

---

## 🔒 Security Features Included
*   **Prepared Statements**: Employs parameterized PDO queries everywhere to block SQL injection attacks.
*   **Secure Password Storage**: Users' passwords are saved securely using the standard `password_hash()` bcrypt technique. 
*   **Pre-Flight CORS Support**: Configured to work smoothly across cross-origin domains.
