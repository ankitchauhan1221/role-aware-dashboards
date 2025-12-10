# RBAC Backend

## Setup
1. Install dependencies: `npm install`
2. Create .env with MONGO_URI, JWT secrets, PORT
3. Run: `npm start`
4. Seed data: `npm run seed`

## API Structure
- /auth/register, /login, /refresh, /logout
- /users (GET, POST, PATCH/:id, DELETE/:id)
- /reports (GET)