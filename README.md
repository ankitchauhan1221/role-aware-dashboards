# Role-Aware Dashboards (RBAC)

Full-stack RBAC demo with Node/Express/Mongo + React. Includes JWT auth, refresh rotation, role/permission guards, seed data, and Postman collection.

## Project Structure

- `backend-rbac/` — Express API (auth, users, reports)
- `frontend-rbac/` — React UI with protected routes and role-based rendering

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB running locally or reachable via connection string

## Backend Setup (`backend-rbac`)

1. Install deps: `npm install`
2. Create `.env` with:

```
MONGO_URI=mongodb://localhost:27017/rbac
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
PORT=5000
```

3. (Optional) Seed users: `node scripts/seedUsers.js`
   - Admin: admin@example.com / Admin@123
   - Manager: manager@example.com / Manager@123
   - User: john@example.com / User@123
4. Start API: `npm start`

## Frontend Setup (`frontend-rbac`)

1. Install deps: `npm install`
2. Start dev server: `npm start`
3. Login with seeded creds above.

## Postman Collection

- Import `backend-rbac/postman_collection.json`
- Set variables: `baseUrl` (default http://localhost:5000), `accessToken`, `refreshToken`, `userId`.

## Key Endpoints

- Auth: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
- Users (protected): `GET /users`, `POST /users`, `PATCH /users/:id`, `DELETE /users/:id`, `GET /users/me`, `PATCH /users/me`
- Reports (protected): `GET /reports`

## Roles & Default Permissions

- ADMIN: manage:users, read:users, edit:users, delete:users, view:reports, read:profile, edit:profile
- MANAGER: read:users, edit:users, view:reports, read:profile, edit:profile
- USER: read:profile, edit:profile

## Notes

- Refresh tokens are stored in DB and rotated on refresh.
- Frontend guards: dashboards/links render based on permissions; User Management and Reports are protected.
- If you change permissions, run `node scripts/updatePermissions.js` to sync stored users.
