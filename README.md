# ProSpace

**Hybrid Office Desk Booking & Review System**

A full-stack, production-oriented application for hybrid workplaces. Employees book desks, submit and like reviews; admins manage desks, approve or reject bookings, send email notifications, and view analytics—all built with the MERN stack and TypeScript.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Frontend Overview](#frontend-overview)
- [Booking Workflow](#booking-workflow)
- [Email Notifications](#email-notifications)
- [Database Seeding](#database-seeding)
- [Postman Testing](#postman-testing)
- [License](#license)

---

## Features

| Area | Capabilities |
|------|--------------|
| **Authentication** | Register, login, logout with JWT (HttpOnly cookie + Bearer token). Role-based access (User / Admin). |
| **Desks** | List desks, view by ID. Admins: create, update (desk number, active status), delete. |
| **Bookings** | Users: create, view history, update (desk/date), cancel (with optional reason). Admins: create for any user, list all, approve, reject, or cancel with reason. |
| **Reviews** | One review per user; 1–5 star rating + text. Update or delete own review. Like/unlike reviews. Admins: view all reviews. |
| **Users** | Profile (`/users/me`). Admins: list all users, view any user’s booking history. |
| **Analytics** | Admin dashboard with booking/usage analytics (Chart.js). |
| **UX** | Dark/light theme, toasts, modals, protected routes, admin-only routes. |

---

## Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React 19, Vite 7, TypeScript, Redux Toolkit, React Router v7, Tailwind CSS, Framer Motion, Chart.js, React Toastify |
| **Backend** | Node.js, Express 5, TypeScript |
| **Database** | MongoDB (Mongoose) |
| **Auth** | JWT (HttpOnly cookie + Bearer token), bcrypt |
| **Email** | Nodemailer (Gmail SMTP, optional) |

---

## Architecture

- **Backend:** REST API under `/api`. Auth via `protect` middleware (cookie or `Authorization: Bearer`); admin routes use `isAdmin`. Global error handler returns JSON; CORS allows `localhost:3000` and `localhost:5173` with credentials.
- **Frontend:** SPA with React Router. Axios instance uses `withCredentials` and injects Bearer token from `localStorage`. Redux holds auth, desks, bookings, users, and reviews; services call the API.
- **Data:** Mongoose models with indexes (e.g. unique `user+date` and `desk+date` for bookings; one review per user).

---

## Project Structure

```
Pro Space 2026/
├── backend/
│   ├── src/
│   │   ├── config/           # DB connection
│   │   ├── controllers/      # auth, user, desk, booking, review
│   │   ├── middlewares/      # auth (protect), role (isAdmin)
│   │   ├── models/           # User, Desk, Booking, Review
│   │   ├── routes/           # auth, users, desks, bookings, reviews
│   │   ├── utils/            # email (nodemailer)
│   │   ├── app.ts
│   │   └── server.ts
│   ├── postman/              # Collection + environment
│   ├── seeder.ts             # Seed/destroy users
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Layout, ProtectedRoute, UI, modals, ThemeToggle
│   │   ├── contexts/         # ThemeContext
│   │   ├── hooks/            # useAppDispatch
│   │   ├── pages/            # Login, Register, Dashboard, Desks, MyBookings, Reviews, Admin*
│   │   ├── services/         # api, auth, booking, desk, review, user
│   │   ├── store/            # Redux store + slices (auth, desk, booking, user, review)
│   │   ├── types/
│   │   └── lib/
│   └── package.json
└── README.md
```

---

## Prerequisites

- **Node.js** v18+
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

---

## Installation

```bash
git clone <repository-url>
cd "Pro Space 2026"

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string (e.g. `mongodb://localhost:27017/prospace`) |
| `JWT_SECRET` | Yes | Secret for signing JWTs |
| `PORT` | No | Server port (default `5000`) |
| `GMAIL_USER` | No | Sender email for notifications |
| `GMAIL_APP_PASSWORD` | No | App password for Gmail SMTP |
| `ADMIN_EMAIL` | No | Recipient for user-cancelled booking alerts |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | API base URL (default `http://localhost:5000`) |

---

## Running the Application

**1. Backend** (from project root):

```bash
cd backend
npm run dev
```

API: **http://localhost:5000**

**2. Frontend** (new terminal):

```bash
cd frontend
npm run dev
```

App: **http://localhost:5173**

---

## API Reference

**Base URL:** `http://localhost:5000/api`

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Health check |

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register (name, email, password) |
| POST | `/auth/login` | No | Login (email, password); sets cookie + returns token |
| POST | `/auth/logout` | Yes | Logout; clears cookie |

### Users

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/users/me` | Yes | - | Current user profile |
| GET | `/users/me/bookings` | Yes | - | My bookings (with desk populated) |
| PATCH | `/users/me/bookings/:bookingId` | Yes | - | Update own booking (deskId, date) |
| GET | `/users/admin/all` | Yes | Admin | All users (no passwords) |
| GET | `/users/admin/:userId/bookings` | Yes | Admin | Bookings for a user |

### Desks

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/desks` | Yes | - | All desks |
| GET | `/desks/:id` | Yes | - | Desk by ID |
| POST | `/desks` | Yes | Admin | Create desk (deskNumber) |
| PUT | `/desks/:id` | Yes | Admin | Update desk (deskNumber, isActive) |
| DELETE | `/desks/:id` | Yes | Admin | Delete desk |

### Bookings

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/bookings/create` | Yes | - | Create booking (deskId, date) |
| GET | `/bookings/me/history` | Yes | - | My booking history |
| PATCH | `/bookings/me/:id` | Yes | - | Update own booking (deskId, date) |
| PATCH | `/bookings/me/:id/cancel` | Yes | - | Cancel own booking (optional body: reason) |
| POST | `/bookings/admin/create` | Yes | Admin | Create for user (userId, deskId, date, optional status) |
| GET | `/bookings/admin/all` | Yes | Admin | All bookings |
| PATCH | `/bookings/admin/approve/:id` | Yes | Admin | Approve booking |
| PATCH | `/bookings/admin/reject/:id` | Yes | Admin | Reject (optional body: reason) |
| PATCH | `/bookings/admin/cancel/:id` | Yes | Admin | Admin cancel (optional body: reason) |

### Reviews

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/reviews` | Yes | - | Public reviews (with likes, likedByMe) |
| GET | `/reviews/me` | Yes | - | My review (or null) |
| POST | `/reviews` | Yes | - | Create review (rating 1–5, text); one per user |
| PATCH | `/reviews/:id` | Yes | - | Update own review |
| DELETE | `/reviews/:id` | Yes | - | Delete own review |
| PATCH | `/reviews/:id/like` | Yes | - | Toggle like |
| GET | `/reviews/admin/all` | Yes | Admin | All reviews (with like counts) |

### Sample request bodies

- **Register:** `{ "name": "John", "email": "john@example.com", "password": "password123" }`
- **Login:** `{ "email": "john@example.com", "password": "password123" }`
- **Create desk:** `{ "deskNumber": "D-101" }`
- **Create booking:** `{ "deskId": "<ObjectId>", "date": "2026-02-15" }`
- **Admin create booking:** `{ "userId": "<ObjectId>", "deskId": "<ObjectId>", "date": "2026-02-15" }` (optional: `"status": "PENDING" | "APPROVED"`)
- **Create review:** `{ "rating": 5, "text": "Great desk!" }`

---

## Frontend Overview

### Scripts (`frontend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript build + Vite production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Routes & access

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | Dashboard | User / Admin |
| `/desks` | View & book desks | User / Admin |
| `/my-bookings` | My bookings | User / Admin |
| `/reviews` | Submit / view / like reviews | User / Admin |
| `/admin/desks` | Manage desks | Admin |
| `/admin/bookings` | All bookings, approve/reject/cancel | Admin |
| `/admin/analytics` | Analytics dashboard | Admin |
| `/admin/reviews` | All reviews | Admin |

### State (Redux)

- **authSlice** — login, register, logout, fetchProfile
- **deskSlice** — fetchDesks, createDesk, updateDesk, deleteDesk
- **bookingSlice** — create, history, update, cancel; admin create/all/approve/reject/cancel
- **userSlice** — profile, admin all users, admin user bookings
- **reviewSlice** — get public, get my review, create, update, delete, toggleLike; admin getAll

---

## Booking Workflow

- **Status flow:** `PENDING` → `APPROVED` or `REJECTED`; `PENDING`/`APPROVED` → `CANCELLED` (user) or `ADMIN_CANCELLED` (admin).
- **Rules:** One desk per user per day; one user per desk per day (enforced by unique indexes). Users can update/cancel only `PENDING` or `APPROVED`; no update/cancel for past dates.

---

## Email Notifications

When Gmail env vars are set, the backend sends:

- **Booking approved** → user email
- **Booking rejected** → user email (with reason)
- **Admin cancelled** → user email (with reason)
- **User cancelled** → `ADMIN_EMAIL` (with reason)

---

## Database Seeding

From `backend/`:

```bash
npm run seed        # Create/update seed users
npm run seed:destroy # Remove seed users
```

**Seed users:**

| Role | Email | Password |
|------|-------|----------|
| Admin | satyamsawant54@gmail.com | satyam123 |
| User | aftab@gmail.com | aftab123 |

---

## Postman Testing

1. Import `backend/postman/ProSpace_API.postman_collection.json`.
2. Import `backend/postman/ProSpace.postman_environment.json` (optional).
3. Set environment (e.g. **ProSpace Local**) with `base_url: http://localhost:5000`.
4. Use Login request; then call protected routes (cookie or Bearer token).

Note: Create-booking path in API is `POST /api/bookings/create`; cancel is `PATCH /api/bookings/me/:id/cancel`.

---

## License

ISC
