# EcoMind Myanmar

Community recycling platform for Myanmar. Citizens scan recyclable items, find centers, and request doorstep collection. Recyclers accept or reject pickups and update status. Admins manage centers and users.

## Features per role

Self-register as **USER** or **RECYCLER**. Admin accounts are seeded or assigned by an existing admin.

### Anyone (no login)

- View the landing page and platform overview
- Browse recycling centers, services, and drop-off hubs
- View community events on the public community page
- See public impact stats and material buyback rates
- Register or log in

### USER (Citizen)

Home after login: `/dashboard`

- Scan a waste photo with the AI scanner
- See material type, recyclability, prep steps, and estimated MMK value
- Browse recycling centers, services, and drop-off hubs
- Create a doorstep collection request
- Track own requests: `PENDING` → `ACCEPTED` → `COLLECTED` → `COMPLETED` (or `REJECTED`)
- Preview Green Points before submitting a request
- Earn Green Points when a recycler marks a request completed
- View points, impact, badges, and points history on the citizen dashboard
- Join community cleanup events
- Update name, email, and password in Settings

### RECYCLER (Collector)

Home after login: `/collector`

- View the full collection request queue
- Filter and search requests by status, material, or address
- Accept a pending request
- Reject a pending request
- Mark an accepted request as collected
- Complete a collected request and log the waste
- Award Green Points to the citizen on completion
- Browse recycling services and drop-off hubs
- Update name, email, and password in Settings

### ADMIN

Home after login: `/overview`

- See platform impact, scrap rates, and featured partners
- Use every USER feature (scanner, requests, pickups)
- Use every RECYCLER feature (request queue and status updates)
- List all user accounts
- Change a user's role (`USER`, `RECYCLER`, or `ADMIN`)
- Delete a user (not yourself)
- Add, edit, or delete recycling centers
- Update name, email, and password in Settings

## Platform

- JWT authentication with hashed passwords
- Role-based access: **USER**, **RECYCLER**, **ADMIN**
- AI waste scanner (OpenRouter when `OPENROUTER_API_KEY` is set, Gemini or mock fallback otherwise)
- Collection requests: `PENDING` → `ACCEPTED` → `COLLECTED` → `COMPLETED` (or `REJECTED`)
- Green Points rates: Plastic 10, Paper 5, Glass 8, Metal 15 per kg
- MongoDB when `MONGODB_URI` is set, in-memory store otherwise

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Express, Mongoose, JWT, bcrypt
- Optional: MongoDB, OpenRouter (or Gemini) for vision

## Setup

Requires Node.js.

```bash
npm run install:all
```

Copy environment placeholders into each app folder:

```bash
cp frontend/.env.example frontend/.env
cp server/.env.example server/.env
```

Optional values in `server/.env`:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection. Leave unset to use the in-memory store |
| `OPENROUTER_API_KEY` | OpenRouter vision for the waste scanner |
| `OPENROUTER_MODEL` | Optional OpenRouter model. Default: `google/gemini-2.5-flash` |
| `GEMINI_API_KEY` | Optional direct Gemini fallback if OpenRouter is unset |
| `JWT_SECRET` | Token signing key. Change this in production |

`frontend/.env` only needs `VITE_API_URL`. Leave it empty locally so Vite proxies `/api` to the API.

## Run

```bash
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:8000
- Health: http://localhost:8000/api/health

The app opens on the landing page. Use **Register** or **Login** from there.

### Demo accounts

Password for all three: `password123`

| Role | Email | Opens |
| --- | --- | --- |
| USER | `citizen@ecomind.mm` | `/dashboard` |
| RECYCLER | `recycler@ecomind.mm` | `/collector` |
| ADMIN | `admin@ecomind.mm` | `/overview` |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | API and frontend together |
| `npm run dev:server` | API only |
| `npm run dev:client` | Frontend only |
| `npm run build` | Production build |
| `npm run start` | Serve the built API |
| `npm run lint` | Typecheck frontend and server |

## Project layout

```
frontend/   React app (landing, auth, citizen, recycler, admin)
server/     Express API, models, JWT middleware, role guards
```
