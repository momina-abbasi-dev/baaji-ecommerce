# Baaji — MERN E-commerce

Baaji is a full-stack clothing e-commerce application with a customer storefront and an administrative dashboard.

> **Live demo:** Not currently available.

## Features

- Browse products, view product details, and filter by category or trending products.
- Customer signup and login, profile management, cart, wishlist, and order history.
- Admin tools for managing products, categories, orders, users, banners, events, and videos.
- Checkout currently supports **Cash on Delivery for orders delivered in Pakistan**.
- ImageKit-backed product, category, and event image uploads with server-side type and size validation.
- WhatsApp order notifications through Twilio when configured.

## Tech stack

- **Frontend:** React 19, React Router 7, Vite 7, Tailwind CSS 4, Axios, and Swiper.
- **Backend:** Node.js, Express 5, MongoDB with Mongoose 8, JWT, bcryptjs, Multer, and `file-type`.
- **Integrations:** ImageKit for media and Twilio for WhatsApp notifications.

## Project structure

```text
.
├── src/
│   ├── api.js
│   ├── components/
│   ├── contexts/
│   └── pages/             # Customer pages and pages/admin/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/           # One-time admin setup CLI
│   └── server.js
├── .env.example
└── backend/.env.example
```

## Local setup

Prerequisites: Node.js with npm, a reachable MongoDB database, and ImageKit credentials for media uploads. Twilio credentials are needed for WhatsApp notifications.

1. From the project root, install frontend dependencies and copy the frontend environment example:

   ```sh
   npm install
   cp .env.example .env
   ```

2. Install backend dependencies and copy its environment example:

   ```sh
   cd backend
   npm install
   cp .env.example .env
   ```

   Configure `backend/.env` using the keys in `backend/.env.example`: `PORT`, `MONGO_URI`, `JWT_SECRET`, the ImageKit keys, and the Twilio keys. The frontend `.env` uses `VITE_API_URL` to locate the backend (the example points to `http://localhost:5000`).

3. Create the first admin from the `backend` directory in an interactive terminal:

   ```sh
   npm run create-admin
   ```

   The local CLI hides and confirms the password, normalizes the email, enforces the password length and bcrypt byte limit, and refuses to create another admin if one already exists. It is not exposed as an HTTP endpoint.

4. Start the backend and frontend in separate terminals:

   ```sh
   # Terminal 1: from backend/
   npm run dev
   ```

   ```sh
   # Terminal 2: from the project root
   npm run dev
   ```

On Windows PowerShell, use `Copy-Item .env.example .env` and `Copy-Item backend/.env.example backend/.env` instead of the `cp` commands.

## Security notes and limitations

- Keep `.env` files private and never commit real credentials. The checked-in `.env.example` files are templates.
- Passwords are hashed, and administrative user-management endpoints require authentication and admin authorization.
- Bank Transfer and new payment-proof uploads are disabled. Existing legacy orders may still contain payment-proof metadata or ImageKit URLs; this change does not remove those records or make previously uploaded assets private.
- No online payment gateway is currently available. Checkout is limited to Cash on Delivery in Pakistan.
- No live demo is currently available; production deployment status has not been verified.
