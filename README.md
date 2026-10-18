# AuthVault — Full-Stack Authentication Project

A complete JWT + cookie-based authentication system built with **Express.js**, **MongoDB**, **React**, and **Vite**.

---

## Project Structure

```
Auth-project/
├── backend/                  ← Express.js API (organized from root)
│   ├── server.js             ← Entry point (listens on port 3000)
│   ├── package.json
│   ├── .env                  ← MongoDB URI + JWT secret (DO NOT COMMIT)
│   └── src/
│       ├── app.js            ← Express app, CORS, middleware, routes
│       ├── config/
│       │   ├── config.js     ← Environment variable loader
│       │   └── database.js   ← Mongoose connection
│       ├── controllers/
│       │   └── auth.controller.js
│       ├── models/
│       │   ├── user.model.js
│       │   └── session.model.js
│       └── routes/
│           └── auth.routes.js
│
├── Frontend/                 ← React + Vite frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── .env                  ← VITE_API_BASE_URL (safe, no secrets)
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── InputField.jsx
│       │   └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   └── Dashboard.jsx
│       ├── services/
│       │   └── api.js        ← Centralized Axios client
│       └── context/
│           └── AuthContext.jsx
│
├── .gitignore
└── README.md
```

---

## Backend API Reference

**Base URL:** `http://localhost:3000/api/auth`

| Method | Endpoint         | Body / Auth                          | Description               |
|--------|-----------------|---------------------------------------|---------------------------|
| POST   | `/register`     | `{ username, email, password }`       | Register new user         |
| POST   | `/login`        | `{ email, password }`                 | Login, returns accessToken + sets refreshToken cookie |
| GET    | `/get-me`       | `Authorization: Bearer <accessToken>` | Get current user          |
| GET    | `/refresh-token`| Cookie: `refreshToken`                | Rotate tokens             |
| POST   | `/logout`       | Cookie: `refreshToken`                | Revoke current session    |
| POST   | `/logout-all`   | Cookie: `refreshToken`                | Revoke all sessions       |

### Authentication Flow
1. Login/Register → receive `accessToken` in response body + `refreshToken` httpOnly cookie
2. All authenticated requests send `Authorization: Bearer <accessToken>` header
3. When accessToken expires, call `GET /api/auth/refresh-token` to get a new one
4. Logout revokes the session in MongoDB and clears the cookie

---

## Setup & Running

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (URI already configured in `backend/.env`)

### 1. Start the Backend

```bash
cd backend
npm install          # if node_modules not present
npm run dev          # starts with nodemon on port 3000
```

### 2. Start the Frontend

```bash
cd Frontend
npm install          # if node_modules not present
npm run dev          # starts Vite dev server on http://localhost:5173
```

### 3. Open the app

Navigate to **http://localhost:5173** in your browser.

---

## Environment Variables

### Backend (`backend/.env`)
```
MONGO_URI=mongodb+srv://...
JWT_SECRETS=your_jwt_secret_here
```

### Frontend (`Frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:3000
```
> Copy `Frontend/.env.example` to `Frontend/.env` if it doesn't exist.

---

## Backend Path Changes Made

The following files were **copied** (originals preserved at root) into `backend/`:

| Original Location              | Copied to                         |
|-------------------------------|-----------------------------------|
| `server.js`                   | `backend/server.js`               |
| `package.json`                | `backend/package.json`            |
| `.env`                        | `backend/.env`                    |
| `src/app.js`                  | `backend/src/app.js`              |
| `src/config/config.js`        | `backend/src/config/config.js`    |
| `src/config/database.js`      | `backend/src/config/database.js`  |
| `src/controllers/auth.controller.js` | `backend/src/controllers/auth.controller.js` |
| `src/models/user.model.js`    | `backend/src/models/user.model.js`|
| `src/models/session.model.js` | `backend/src/models/session.model.js` |
| `src/routes/auth.routes.js`   | `backend/src/routes/auth.routes.js` |

**No import paths were changed** — all relative imports within `src/` remain identical since the folder structure `src/config`, `src/controllers`, etc. was preserved exactly inside `backend/`.

---

## Known Limitations

- The backend sets the `refreshToken` cookie with `secure: true` and `sameSite: 'strict'`. During local development over HTTP, the browser will **not** send/store this cookie. To test locally, either:
  - Remove `secure: true` from cookie options in `backend/src/controllers/auth.controller.js` (development only), or
  - Use a local HTTPS proxy (e.g., `mkcert`).
- `sameSite: 'strict'` means the cookie is only sent for same-site requests. In development, the frontend (`:5173`) and backend (`:3000`) are same-origin subdomain-wise but different ports, so the cookie **will** be sent.
