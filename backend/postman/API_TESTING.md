# ProSpace API – Postman Testing Guide

## Import

1. Open Postman → **Import** → select `ProSpace_API.postman_collection.json`
2. Select **ProSpace Local** environment (or create one with `base_url: http://localhost:5000`)

---

## API Collection (22 Endpoints)

| # | Method | Endpoint | Auth | Role |
|---|--------|----------|------|------|
| **01 - Health** |
| 01 | GET | /api/health | No | - |
| **02 - Auth** |
| 02 | POST | /api/auth/register | No | - |
| 03 | POST | /api/auth/login | No | - |
| 04 | POST | /api/auth/login | No | - |
| 05 | POST | /api/auth/logout | Yes | - |
| **03 - User** |
| 06 | GET | /api/users/me | Yes | User |
| 07 | GET | /api/users/me/bookings | Yes | User |
| 08 | PATCH | /api/users/me/bookings/:bookingId | Yes | User |
| 09 | GET | /api/users/admin/:userId/bookings | Yes | Admin |
| **04 - Desks** |
| 10 | GET | /api/desks | Yes | User |
| 11 | GET | /api/desks/:id | Yes | User |
| 12 | POST | /api/desks | Yes | Admin |
| 13 | PUT | /api/desks/:id | Yes | Admin |
| 14 | DELETE | /api/desks/:id | Yes | Admin |
| **05 - Bookings (User)** |
| 15 | POST | /api/bookings | Yes | User |
| 16 | GET | /api/bookings/me/history | Yes | User |
| 17 | PATCH | /api/bookings/me/:id | Yes | User |
| 18 | DELETE | /api/bookings/me/:id | Yes | User |
| **06 - Bookings (Admin)** |
| 19 | GET | /api/bookings/admin/all | Yes | Admin |
| 20 | PATCH | /api/bookings/admin/approve/:id | Yes | Admin |
| 21 | PATCH | /api/bookings/admin/reject/:id | Yes | Admin |
| 22 | PATCH | /api/bookings/admin/cancel/:id | Yes | Admin |

---

## Test One by One (User Flow)

1. **01. GET Health Check** – Verify server is running
2. **03. POST Login (User - Aftab)** – Login as user (or 02. Register first)
3. **10. GET All Desks** – Get desks (auto-saves `desk_id`)
4. **15. POST Create Booking** – Create booking (auto-saves `booking_id`)
5. **16. GET My Booking History** – View your bookings
6. **17. PATCH Update My Booking** – Update if PENDING
7. **18. DELETE Cancel My Booking** – Cancel booking
8. **06. GET My Profile** – View profile
9. **07. GET My Bookings** – Alternative booking list
10. **05. POST Logout** – Clear cookie

---

## Test One by One (Admin Flow)

1. **01. GET Health Check**
2. **04. POST Login (Admin - Satyam)** – Login as admin
3. **12. POST Create Desk** – Create desk
4. **10. GET All Desks** – List desks
5. **11. GET Desk By ID** – Get single desk
6. **13. PUT Update Desk** – Update desk
7. **19. GET All Bookings** – View all bookings
8. **20. PATCH Approve Booking** – Approve a PENDING booking
9. **21. PATCH Reject Booking** – Reject a PENDING booking
10. **22. PATCH Admin Cancel Booking** – Admin cancel any booking
11. **09. GET Admin - User Bookings** – View specific user's bookings (set `user_id`)

---

## Seeder Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | satyam@gmail.com | satyam123 |
| User | aftab@gmail.com | aftab123 |

Run `npm run seed` in backend to create these users.

---

## Variables (Auto-set)

- `desk_id` – Set after **10. GET All Desks** or **12. POST Create Desk**
- `booking_id` – Set after **15. POST Create Booking**
- `user_id` – Set after **03. POST Login** (or set manually for Admin User Bookings)
