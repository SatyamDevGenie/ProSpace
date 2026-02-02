# ProSpace Frontend

React + TypeScript frontend for ProSpace - Hybrid Office Desk Booking System.

## Tech Stack
- **React 19** + **Vite** + **TypeScript**
- **Redux Toolkit** (store, slices, useSelector, useAppDispatch)
- **Tailwind CSS**
- **Framer Motion**
- **React Router v7**

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env` or create `.env` with:
   ```
   VITE_API_URL=http://localhost:5000
   ```

3. **Run backend first**
   ```bash
   cd ../backend && npm run dev
   ```

4. **Run frontend**
   ```bash
   npm run dev
   ```

5. **Open** http://localhost:5173

## Test Users (after running `npm run seed` in backend)
- **Admin:** satyam@gmail.com / satyam123
- **User:** aftab@gmail.com / aftab123

## Features
- ✅ Login / Register / Logout
- ✅ Dashboard (stats overview)
- ✅ View & book desks
- ✅ My Bookings (view, update, cancel)
- ✅ Admin: Manage desks (CRUD)
- ✅ Admin: All bookings (approve, reject, cancel, create for user)
- ✅ Responsive layout (mobile, tablet, desktop)
- ✅ Protected routes & role-based access
