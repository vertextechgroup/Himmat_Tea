# Himmat Tea Backend Setup Guide

## Prerequisites

1. PostgreSQL database installed and running
2. Node.js 18+ and npm installed

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

Update your `.env` file with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/himmat_tea?schema=public"
```

### 3. Initialize Prisma

```bash
npx prisma generate
npx prisma db push
```

### 4. Seed the Database

Run the seed API endpoint to populate with sample data:

POST request to: `/api/seed`

Or you can use curl:
```bash
curl -X POST http://localhost:3000/api/seed
```

### 5. Start the Development Server

```bash
npm run dev
```

## Default Login Credentials

- Username: `admin`
- Password: `admin123`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer by ID
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Admin Users
- `GET /api/admin-users` - Get all admin users
- `POST /api/admin-users` - Create admin user
- `GET /api/admin-users/:id` - Get admin user by ID
- `PUT /api/admin-users/:id` - Update admin user
- `DELETE /api/admin-users/:id` - Delete admin user

### Auth
- `POST /api/auth/login` - Admin login

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create review

### Blog
- `GET /api/blog` - Get all blog posts
- `POST /api/blog` - Create blog post

### Coupons
- `GET /api/coupons` - Get all coupons
- `POST /api/coupons` - Create coupon

### Collections
- `GET /api/collections` - Get all collections
- `POST /api/collections` - Create collection

### Brewing Guides
- `GET /api/brewing-guides` - Get all brewing guides
- `POST /api/brewing-guides` - Create brewing guide

### FAQs
- `GET /api/faqs` - Get all FAQs
- `POST /api/faqs` - Create FAQ

### Purchase Orders
- `GET /api/purchase-orders` - Get all purchase orders
- `POST /api/purchase-orders` - Create purchase order

### Inventory
- `GET /api/inventory/transactions` - Get inventory transactions

### Analytics
- `GET /api/analytics` - Get analytics data

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings

### Seed
- `POST /api/seed` - Seed database with sample data

## Database Schema

The database includes:
- Products with variants and batches
- Customers with loyalty program
- Orders with items and internal notes
- Admin users with role-based access
- Reviews, blog posts, coupons
- Collections, brewing guides, FAQs
- Purchase orders and inventory transactions
- Settings and analytics

## Next Steps

1. Update the StoreContext to use the API instead of localStorage
2. Integrate API calls in dashboard components
3. Add authentication middleware
4. Implement pagination for large datasets
5. Add validation and error handling
