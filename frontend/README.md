# RecycleConnect Myanmar Web

React frontend for RecycleConnect Myanmar. Landing and auth come first, then role-specific screens for citizens, recyclers, and admins.

Dev server: **http://localhost:3000**. Vite proxies `/api` to **http://localhost:8000**.

## Setup

Start the API from `../server` (or `npm run dev` at the repo root). Then:

```bash
npm install
npm run dev
```

## Auth flow

1. `/` landing
2. `/login` or `/register`
3. Role home: USER → `/dashboard`, RECYCLER → `/collector`, ADMIN → `/admin/users`

Signed-out visits to protected pages return to the landing page first. The JWT is stored in `localStorage` as `rc_token` and sent on API calls as `Authorization: Bearer <token>`.

Register as `USER` or `RECYCLER`. Admin is seeded or assigned from the API.

### Demo accounts

Password: `password123`

| Role | Email |
| --- | --- |
| USER | `citizen@recycleconnect.mm` |
| RECYCLER | `recycler@recycleconnect.mm` |
| ADMIN | `admin@recycleconnect.mm` |

## Routes

| Path | Access | Screen |
| --- | --- | --- |
| `/` | Public | Landing |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/overview` | Public (in app shell) | Overview |
| `/centers` | Public | Recycling center finder |
| `/services` | Public | Recycler directory |
| `/hubs` | Public | Drop-off hubs |
| `/community` | Public | Community impact |
| `/scan` | USER, ADMIN | AI waste scanner |
| `/request-pickup` | USER, ADMIN | Create collection request |
| `/dashboard` | USER, ADMIN | Green Points |
| `/collector` | RECYCLER, ADMIN | Pickup queue |
| `/admin/users` | ADMIN | Manage users |

Admins can add, edit, and delete recycling centers on `/centers`.

## Roles

| Role | UI |
| --- | --- |
| USER | Scanner, requests, points |
| RECYCLER | Pickup queue, accept/reject, status updates |
| ADMIN | User management and center management |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite on port 3000 |
| `npm run build` | Production build to `dist` |
| `npm run preview` | Preview the build |
| `npm run lint` | Typecheck |

## Theme

Tailwind v4 in `src/index.css`. Fonts are Figtree and Padauk. Colors use the **lima** scale (`lima-50` … `lima-950`). Existing `emerald-*` classes map to lima.

## Layout

```
src/
  landing/          Public landing page
  auth/             Auth context, guards, login, register
  layout/           App shell and sidebar
  scanner/          AI waste scanner
  centers/          Recycling center finder
  pickups/          Collection requests and overview
  dashboard/        Green Points
  collector/        Recycler pickup queue
  admin/            User management
  services/ hubs/ community/
  shared/           API client, UI, seed fallbacks
```

Import alias: `@/` → `src/`.
