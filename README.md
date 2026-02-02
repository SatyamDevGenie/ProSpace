# ProSpace – Hybrid Office Desk Booking System

A production-ready office desk booking system built with **MERN + TypeScript**, designed for hybrid workplaces. Employees can book desks daily; admins can manage desks, approve or reject bookings, and track usage.

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite, TypeScript, Redux Toolkit, Tailwind CSS, Framer Motion, React Router v7 |
| **Backend** | Node.js, Express 5, TypeScript |
| **Database** | MongoDB (Mongoose) |
| **Auth** | JWT (HttpOnly cookies + Bearer token) |

---

## Project Structure

```
Pro Space 2026/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection
│   │   ├── controllers/    # Auth, User, Desk, Booking
│   │   ├── middlewares/    # Auth, Role
│   │   ├── models/         # User, Desk, Booking
│   │   ├── routes/         # API routes
│   │   ├── app.ts
│   │   └── server.ts
│   ├── postman/            # API collection & environment
│   ├── seeder.ts           # Seed/destroy users
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # UI, Layout, ProtectedRoute
│   │   ├── hooks/          # useAppDispatch
│   │   ├── pages/          # Login, Dashboard, Desks, etc.
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store & slices
│   │   ├── types/          # TypeScript types
│   │   └── lib/            # Utilities
│   └── package.json
└── README.md
```

---

## Prerequisites

- **Node.js** (v18+)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

---

## Quick Start

### 1. Clone & Install

```bash
cd "Pro Space 2026"
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Variables

**Backend** – create `backend/.env`:

```
MONGO_URI=mongodb://localhost:27017/prospace
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
```

**Frontend** – create `frontend/.env`:

```
VITE_API_URL=http://localhost:5000
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

Creates:
- **Admin:** satyam@gmail.com / satyam123
- **User:** aftab@gmail.com / aftab123

### 4. Run Application

**Terminal 1 – Backend:**
```bash
cd backend
npm run dev
```
Backend: http://localhost:5000

**Terminal 2 – Frontend:**
```bash
cd frontend
npm run dev
```
Frontend: http://localhost:5173

---

## Backend API

### Base URL
`http://localhost:5000/api`

### Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | /health | No | - | Health check |
| POST | /auth/register | No | - | Register user |
| POST | /auth/login | No | - | Login (JWT in cookie + response) |
| POST | /auth/logout | Yes | - | Logout |
| GET | /users/me | Yes | User | Get profile |
| GET | /users/me/bookings | Yes | User | My bookings |
| PATCH | /users/me/bookings/:id | Yes | User | Update own booking |
| GET | /users/admin/:userId/bookings | Yes | Admin | User's bookings |
| GET | /desks | Yes | User | All desks |
| GET | /desks/:id | Yes | User | Desk by ID |
| POST | /desks | Yes | Admin | Create desk |
| PUT | /desks/:id | Yes | Admin | Update desk |
| DELETE | /desks/:id | Yes | Admin | Delete desk |
| POST | /bookings/create | Yes | User | Create booking |
| GET | /bookings/me/history | Yes | User | Booking history |
| PATCH | /bookings/me/:id | Yes | User | Update own booking |
| DELETE | /bookings/me/:id | Yes | User | Cancel own booking |
| POST | /bookings/admin/create | Yes | Admin | Create booking for user |
| GET | /bookings/admin/all | Yes | Admin | All bookings |
| PATCH | /bookings/admin/approve/:id | Yes | Admin | Approve booking |
| PATCH | /bookings/admin/reject/:id | Yes | Admin | Reject booking |
| PATCH | /bookings/admin/cancel/:id | Yes | Admin | Admin cancel |

### Sample Request Bodies

**Register:** `{ "name": "John", "email": "john@example.com", "password": "password123" }`

**Login:** `{ "email": "john@example.com", "password": "password123" }`

**Create Desk:** `{ "deskNumber": "D-101" }`

**Create Booking:** `{ "deskId": "<ObjectId>", "date": "2026-02-15" }`

**Admin Create Booking:** `{ "userId": "<ObjectId>", "deskId": "<ObjectId>", "date": "2026-02-15" }`

---

## Frontend

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Vite) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

### Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| /login | Login | Public |
| /register | Register | Public |
| /dashboard | Dashboard | User/Admin |
| /desks | View & book desks | User/Admin |
| /my-bookings | My bookings | User |
| /admin/desks | Manage desks | Admin |
| /admin/bookings | All bookings | Admin |

### State Management (Redux)

- **authSlice** – login, register, logout, fetchProfile
- **deskSlice** – fetchDesks, createDesk, updateDesk, deleteDesk
- **bookingSlice** – create, update, cancel, admin actions
- **userSlice** – fetchProfile

---

## Seeder Commands

```bash
cd backend

# Import (create) seed users
npm run seed

# Destroy seed users
npm run seed:destroy
```

---

## Postman Testing

1. Import `backend/postman/ProSpace_API.postman_collection.json`
2. Import `backend/postman/ProSpace.postman_environment.json` (optional)
3. Select **ProSpace Local** environment
4. Use Login endpoints, then test protected routes (cookie sent automatically)

---

## Booking Workflow

```
PENDING → APPROVED → CANCELLED
PENDING → REJECTED
APPROVED → ADMIN_CANCELLED
```

- One desk per user per day
- One user per desk per day
- Users can update/cancel only PENDING or APPROVED bookings

---

## License

ISC
