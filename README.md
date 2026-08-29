# RecycleConnect Myanmar

Community recycling platform for Myanmar. Citizens scan recyclable items, find centers, and request doorstep collection. Recyclers accept or reject pickups and update status. Admins manage centers and users.

## Features

- JWT authentication with hashed passwords
- Role-based access: **USER**, **RECYCLER**, **ADMIN**
- AI waste scanner (Gemini when `GEMINI_API_KEY` is set, mock fallback otherwise)
- Recycling center finder
- Collection requests: `PENDING` → `ACCEPTED` → `COLLECTED` → `COMPLETED` (or `REJECTED`)
- Green Points awarded when a request is completed
- MongoDB when `MONGODB_URI` is set, in-memory store otherwise

## Roles

| Role | Can do |
| --- | --- |
| USER | Scan items, view centers, create collection requests, earn points |
| RECYCLER | View pickup requests, accept or reject, update collection status |
| ADMIN | Manage recycling centers and user accounts |

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Express, Mongoose, JWT, bcrypt
- Optional: MongoDB, Google Gemini

## Setup

Requires Node.js.

```bash
npm run install:all
```

Copy environment placeholders:

```bash
cp .env.example .env
```

Optional values in `.env`:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection. Leave unset to use the in-memory store |
| `GEMINI_API_KEY` | Gemini vision for the waste scanner |
| `JWT_SECRET` | Token signing key. Change this in production |

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

| Role | Email |
| --- | --- |
| USER | `citizen@recycleconnect.mm` |
| RECYCLER | `recycler@recycleconnect.mm` |
| ADMIN | `admin@recycleconnect.mm` |

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
