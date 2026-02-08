# Grocery Store Backend API

This document describes the backend REST API implemented for the Grocery Store Angular frontend.

Base URL (local): http://localhost:5000/api

Requirements
- Node 18+ (or compatible)
- MongoDB connection configured in `.env` as `MONGO_URI`
- Optional: `JWT_TOKEN` (otherwise `JWT_SECRET` or fallback used)

Run locally

```bash
cd grocery-store-backend
npm install
# create .env with MONGO_URI (and optionally JWT_TOKEN, ADMIN_EMAIL, ADMIN_PASSWORD)
npm run dev
```

Auth
- All protected endpoints require `Authorization: Bearer {token}` header.
- Login endpoints return `{ token, user }`.

Error format

All error responses use:

```json
{
  "success": false,
  "message": "Error message",
  "error": "detailed stack or info (optional)"
}
```

Endpoints

1) Authentication

- POST /api/auth/login
  - Purpose: user login
  - Body: `{ "email": "user@example.com", "password": "password" }`
  - Response: `{ "token": "...", "user": { id, email, name, role } }`

- POST /api/auth/admin/login
  - Purpose: admin login (user must have role `admin`)
  - Body and response: same as `/login`

2) Products

- GET /api/products
  - Purpose: list products with optional filters
  - Query params: `categoryId`, `minPrice`, `maxPrice`, `inStock` (`true|false`), `search`, `sortBy` (`price|name`), `sortOrder` (`asc|desc`), `page` (default 1), `pageSize` (default 12)
  - Response: `{ data: [...], total, page, pageSize, totalPages }`

- GET /api/products/featured
  - Purpose: get featured products
  - Response: `[...]` (array of products)

- GET /api/products/:id
  - Purpose: single product details

- POST /api/products (admin only)
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ name, description, price, category, categoryId, image, stock, unit }`
  - Response: `{ success: true, data: product, message }`

- PUT /api/products/:id (admin only)
  - Update product fields; same headers/body as POST

- DELETE /api/products/:id (admin only)

- POST /api/products/:id/image (admin only)
  - Purpose: upload product image
  - Headers: `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`
  - Form field: `image` (file)
  - Response: `{ success: true, data: { imageUrl } }`
  - Uploaded files are served from `/uploads/<filename>`

3) Categories

- GET /api/categories
  - Returns array of categories with `productCount` for each

- GET /api/categories/:id

- POST /api/categories (admin only)
  - Body: `{ name, description, image }`

- PUT /api/categories/:id (admin only)

- DELETE /api/categories/:id (admin only)

4) Cart

- All cart routes require authentication header `Authorization: Bearer {token}`.

- GET /api/cart
  - Get current user's cart items. Response: array of `{ id, product, quantity, subtotal }`

- POST /api/cart
  - Body: `{ productId, quantity }`
  - Adds to cart (increments if exists). Response: `{ success: true, data: cartItem }`

- PUT /api/cart/:itemId
  - Body: `{ quantity }` — update quantity

- DELETE /api/cart/:itemId
  - Remove single cart item

- DELETE /api/cart/clear
  - Clear user's cart

5) Contact

- POST /api/contact
  - Body: `{ name, email, message }`
  - Response: `{ success: true, message: 'Message sent successfully' }`

CORS

- CORS is enabled and currently allows `*`. Adjust `src/app.js` CORS config if you want to lock to the frontend origin.

File uploads

- Image uploads accept `jpg`, `jpeg`, `png`, `webp` and are stored in `uploads/` directory. Access via `http://{host}/uploads/{filename}`.

Notes for frontend integration

- Use `Authorization: Bearer ${token}` for protected calls.
- Login returns `token` and `user` object — store token in localStorage or cookie as needed.
- For product listing, pass pagination and filters as query params described above.

Contact
- If you want, I can also add example cURL requests or a Postman collection for quick integration tests.
