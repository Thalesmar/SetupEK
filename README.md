<h1 align="center">
  <br>
  SetupEK
  <br>
</h1>

<p align="center">
  A full-stack e-commerce platform for gaming peripherals — built for enthusiasts, by enthusiasts.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Railway-Backend-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" />
</p>

---

## 📦 Overview

**SetupEK** is a modern gaming peripherals e-commerce web application targeting the Moroccan market. It features a full product catalogue across multiple categories, user authentication with JWT, a shopping cart, a favorites system, and a checkout flow — all backed by a RESTful Express API.

---

## ✨ Features

- 🛍️ **Product catalogue** — Mice, Keyboards, Mousepads, Headsets, IEMs, Controllers, Microphones, Accessories
- 🔎 **Filtering & sorting** by brand, price, and availability per category
- 🛒 **Shopping cart** with persistent state via React Context
- ❤️ **Favorites** list with add/remove toggle
- 🔐 **Authentication** — Sign up, login, and protected account route via JWT
- 📦 **Product detail pages** with full specs, images, and SKU
- 💬 **Floating WhatsApp** button for direct customer support
- 📱 **Responsive design** across all screen sizes
- ⚡ **Optimised assets** — images compressed at build time via `vite-plugin-image-optimizer`

---

## 🗂️ Project Structure

```
SetupEK/
├── frontend/          # React + Vite + TypeScript (deployed on Vercel)
│   ├── src/
│   │   ├── Categories/       # Per-category product pages
│   │   ├── Components/       # Shared UI components (Header, Footer, etc.)
│   │   ├── context/          # React Context (Cart, Favorites, Products)
│   │   ├── pages/            # Route-level pages (Home, Shop, Auth, etc.)
│   │   ├── types.ts          # Shared TypeScript types
│   │   └── config.ts         # API base URL configuration
│   └── vite.config.ts
│
├── backend/           # Express + TypeScript (deployed on Railway)
│   ├── controllers/          # Data access logic (users, products)
│   ├── middlewares/          # JWT auth middleware
│   ├── routes/               # API route definitions
│   ├── db/                   # JSON file database
│   │   ├── products.json
│   │   └── users.json
│   └── server/server.ts      # Express app entry point
│
├── railway.json       # Railway deployment config
└── vercel.json        # Vercel SPA rewrite rules
```

---

## 🛠️ Tech Stack

| Layer       | Technology                                            |
|-------------|-------------------------------------------------------|
| Frontend    | React 19, TypeScript, Vite 8, Tailwind CSS v4         |
| Animations  | Framer Motion, GSAP, Three.js                         |
| Routing     | React Router DOM v7                                   |
| Backend     | Node.js, Express 5, TypeScript                        |
| Auth        | JSON Web Tokens (JWT), bcrypt                         |
| Database    | JSON flat-file (via `fs/promises`)                    |
| Security    | Helmet, CORS                                          |
| Hosting     | Vercel (frontend) · Railway (backend)                 |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm v9+

### 1. Clone the repository

```bash
git clone https://github.com/Thalesmar/SetupEK.git
cd SetupEK
```

### 2. Start the Backend

```bash
cd backend
```

Create a `.env` file:

```env
PORT=8080
JWT_SECRET=your_super_secret_key
ACCESS_TOKEN_EXPIRES=1h
REFRESH_TOKEN_EXPIRES=7d
```

Install dependencies and run:

```bash
npm install
npm run dev
```

The API will be available at `http://localhost:8080`.

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

> By default the frontend points to `http://127.0.0.1:8080/api`. To override this, create a `.env.local` file inside `/frontend`:
> ```env
> VITE_API_URL=http://localhost:8080/api
> ```

---

## 🌐 API Reference

All routes are prefixed with `/api`.

### Auth

| Method | Endpoint      | Auth Required | Description              |
|--------|---------------|:-------------:|--------------------------|
| POST   | `/signup`     | ❌            | Register a new user      |
| POST   | `/login`      | ❌            | Login and receive a JWT  |
| GET    | `/account`    | ✅            | Get current user details |
| GET    | `/profile`    | ✅            | Protected profile route  |

### Products

| Method | Endpoint          | Auth Required | Description              |
|--------|-------------------|:-------------:|--------------------------|
| GET    | `/products`       | ❌            | Get all products         |
| GET    | `/products/:id`   | ❌            | Get a product by ID      |

---

## ☁️ Deployment

### Frontend → Vercel

1. Import the repository at [vercel.com](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add environment variable:
   ```
   VITE_API_URL = https://your-backend.up.railway.app/api
   ```
4. Deploy. Vercel will automatically run `npm run build`.

### Backend → Railway

1. Import the repository at [railway.app](https://railway.app).
2. Railway uses `railway.json` to detect the `backend` root automatically.
3. Add environment variables under **Variables**:
   ```
   PORT=8080
   JWT_SECRET=your_secret
   ```
4. Railway runs `npm run build` then `npm start` (`node dist/server/server.js`).

> **Generate a Public Domain** under the service's *Networking* tab and use that URL as your `VITE_API_URL` on Vercel.

---

## 📁 Product Categories

| Category      | Brands featured              |
|---------------|------------------------------|
| 🖱️ Mice       | VXE, ATK, FGG                |
| ⌨️ Keyboards  | FGG                          |
| 🖥️ Mousepads  | X-Raypad                     |
| 🎧 Headsets   | ATK                          |
| 🎵 IEMs       | Tangzu                       |
| 🎮 Controllers| ATK                          |
| 🎙️ Microphones| ATK                          |
| 🔧 Accessories| Various                      |

---

## 📄 License

[MIT](./LICENSE) — © 2025 Thales
