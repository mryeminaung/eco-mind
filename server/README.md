# RecycleConnect Myanmar API

Express backend for RecycleConnect Myanmar. Handles JWT auth, role-based access, collection requests, recycling centers, rewards, and the waste scanner.

Listens on **http://localhost:8000**.

## Setup

From the repo root, copy `.env.example` to `.env`. Then from this folder:

```bash
npm install
npm run dev
```

Health check: http://localhost:8000/api/health

MongoDB is optional. If `MONGODB_URI` is missing or the connection fails, the API uses the in-memory store.

## Environment

Loaded from the repo-root `.env` via `dotenv`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `JWT_SECRET` | No | Signs tokens. Falls back to an MVP default |
| `MONGODB_URI` | No | MongoDB connection string |
| `GEMINI_API_KEY` | No | Gemini vision for `POST /api/scan` |
| `NODE_ENV` | No | In `production`, serves `frontend/dist` |

## Auth

- Passwords are hashed with bcrypt
- Login and register return a JWT (7 days)
- Send `Authorization: Bearer <token>` on protected routes
- `protect` requires a valid token
- `authorize(...roles)` allows only those roles

### Roles

| Role | Access |
| --- | --- |
| USER | Scan waste, create collection requests, view own requests and points |
| RECYCLER | List pickup requests, accept/reject, update status |
| ADMIN | All of the above, plus manage centers and users |

Self-register as `USER` or `RECYCLER`. Admin accounts are seeded or assigned by an admin.

### Demo accounts

Password: `password123`

| Role | Email |
| --- | --- |
| USER | `citizen@recycleconnect.mm` |
| RECYCLER | `recycler@recycleconnect.mm` |
| ADMIN | `admin@recycleconnect.mm` |

## Routes

| Method | Path | Access |
| --- | --- | --- |
| GET | `/api/health` | Public |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |
| GET | `/api/users` | ADMIN |
| PATCH | `/api/users/:id` | ADMIN |
| DELETE | `/api/users/:id` | ADMIN |
| POST | `/api/scan` | USER, ADMIN |
| GET | `/api/recycling-centers` | Public |
| POST / PUT / DELETE | `/api/recycling-centers` | ADMIN |
| GET | `/api/requests` | Authenticated (USER sees own) |
| POST | `/api/requests` | USER, ADMIN |
| PATCH | `/api/requests/:id/status` | RECYCLER, ADMIN |
| GET | `/api/rewards/user/:userId` | Authenticated |
| POST | `/api/rewards/award` | RECYCLER, ADMIN |
| GET | `/api/pickups` | Public |
| POST | `/api/pickups` | USER, ADMIN |
| PATCH | `/api/pickups/:id/status` | RECYCLER, ADMIN |
| GET | `/api/services`, `/api/hubs`, `/api/stats`, `/api/community` | Public |

Collection status: `PENDING` → `ACCEPTED` → `COLLECTED` → `COMPLETED`, or `REJECTED`. Completing a request awards Green Points.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Run with `tsx` |
| `npm run build` | Bundle to `dist/server.cjs` |
| `npm run start` | Run the built server |
| `npm run lint` | Typecheck |
| `npm run clean` | Remove `dist` |

## Layout

```
src/
  server.ts           Entry point
  config/db.ts        Mongo connection
  middleware/auth.ts  protect, authorize
  utils/auth.ts       JWT and password helpers
  models/             Mongoose schemas
  data/               In-memory store + seeds
  routes/             Express routers
  controllers/        Request handlers
  services/           Gemini scanner
```
