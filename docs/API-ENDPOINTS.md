# EcoMind API endpoints

Express API at `http://localhost:8000`. JSON bodies. Default envelope:

```json
{ "success": true, "data": {}, "message": "optional", "count": 0 }
```

Errors:

```json
{ "success": false, "error": "Human-readable message" }
```

| Code | Meaning |
| --- | --- |
| 400 | Validation failed |
| 401 | Missing or invalid JWT |
| 403 | Role not allowed, or citizen accessing another user's data |
| 404 | Resource not found |
| 409 | Email already registered |
| 500 | Server error |

## Auth

Protected routes expect:

```http
Authorization: Bearer <jwt>
```

JWT is issued on register/login and again if the user changes email. Roles: `USER`, `RECYCLER`, `ADMIN`. Self-register is limited to `USER` or `RECYCLER`.

| Method | Path | Auth | Roles | Description |
| --- | --- | --- | --- | --- |
| GET | `/api/health` | Public | — | App name, DB mode, vision provider |
| POST | `/api/auth/register` | Public | — | Create account, return `{ token, user }` |
| POST | `/api/auth/login` | Public | — | Sign in, return `{ token, user }` |
| GET | `/api/auth/me` | JWT | Any | Current user |
| PATCH | `/api/auth/me` | JWT | Any | Update name/email. Email change requires `currentPassword` and may return a new `token` |
| PATCH | `/api/auth/password` | JWT | Any | Change password (`currentPassword`, `newPassword` min 6 chars) |

### `POST /api/auth/register`

```json
{ "name": "May", "email": "may@example.com", "password": "secret1", "role": "USER" }
```

`role` optional, default `USER`. `ADMIN` is rejected.

### `POST /api/auth/login`

```json
{ "email": "citizen@ecomind.mm", "password": "password123" }
```

Demo accounts (password `password123`): `citizen@ecomind.mm`, `recycler@ecomind.mm`, `admin@ecomind.mm`.

## Users (admin)

All routes require JWT + `ADMIN`.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/users` | List public users |
| GET | `/api/users/:id` | One user (no password) |
| PATCH | `/api/users/:id` | Update `name`, `role`, and/or `points` |
| DELETE | `/api/users/:id` | Delete user. Cannot delete yourself |

`role` must be `USER`, `RECYCLER`, or `ADMIN`. Changing `points` also updates `badgeAward`.

## Collection requests (live pickup flow)

This is the queue the citizen and recycler UIs use.

Statuses: `PENDING` → `ACCEPTED` → `COLLECTED` → `COMPLETED`, or `REJECTED`.

Completing a request awards Green Points to the citizen (Plastic 10, Paper 5, Glass 8, Metal 15 per kg).

| Method | Path | Auth | Roles | Description |
| --- | --- | --- | --- | --- |
| GET | `/api/requests` | JWT | Any | List. Citizens are scoped to their own `userId` |
| GET | `/api/requests/:id` | JWT | Any | One request. Citizens can only read their own |
| POST | `/api/requests` | JWT | USER, ADMIN | Create request |
| PATCH | `/api/requests/:id/status` | JWT | RECYCLER, ADMIN | Update status |
| DELETE | `/api/requests/:id` | JWT | Any | Citizens may delete only their own `PENDING` requests |

### Query (`GET /api/requests`)

`status`, `userId` (ignored for `USER`; they always see their own), `recyclerId`, `material`.

### `POST /api/requests`

```json
{
  "material": "Plastic bottles",
  "quantity": "10 kg",
  "address": "No. 15, Inya Road, Kamayut, Yangon",
  "description": "Stacked by the gate"
}
```

Required: `material`, `quantity`, `address`. Optional: `description`, `recyclerId`.

### `PATCH /api/requests/:id/status`

```json
{ "status": "ACCEPTED", "recyclerId": "rec-1" }
```

If `status` is `ACCEPTED` and `recyclerId` is omitted, the current user id is used. `REJECTED` clears `recyclerId`.

## AI scanner

| Method | Path | Auth | Roles | Description |
| --- | --- | --- | --- | --- |
| POST | `/api/scan` | JWT | USER, ADMIN | Identify waste from a photo |

Body: `{ "image": "<base64 or data URI>", "mimeType": "image/jpeg" }`.

Response includes `data` (material, recyclable, instructions, MMK estimate, impact) and `source` (`OpenRouter`, `Gemini`, or mock). Body limit is 25 MB.

## Rewards

Badge tiers from points: Green Starter (0), Active Recycler (100), Zero-Waste Hero (250), Eco Guardian (500).

| Method | Path | Auth | Roles | Description |
| --- | --- | --- | --- | --- |
| GET | `/api/rewards/rates` | Public | — | Points per kg and rule text |
| GET | `/api/rewards/user/:userId` | JWT | Any | Reward profile. Citizens may only read their own id |
| POST | `/api/rewards/calculate` | JWT | Any | Preview points for `{ material, quantity }` |
| POST | `/api/rewards/award` | JWT | RECYCLER, ADMIN | Manual award (`material`, `quantity`, optional `requestId`, `userId`) |

## Recycling centers

Directory is public. Writes are admin-only.

| Method | Path | Auth | Roles | Description |
| --- | --- | --- | --- | --- |
| GET | `/api/recycling-centers` | Public | — | List. Query: `material`, `search` |
| GET | `/api/recycling-centers/:id` | Public | — | One center |
| POST | `/api/recycling-centers` | JWT | ADMIN | Create |
| PUT | `/api/recycling-centers/:id` | JWT | ADMIN | Update |
| DELETE | `/api/recycling-centers/:id` | JWT | ADMIN | Delete |

Create/update fields: `name`, `location`, `phone`, `openingHours`, `acceptedMaterials` (string array or comma-separated string). All required on create.

## Public directories

| Method | Path | Auth | Query | Description |
| --- | --- | --- | --- | --- |
| GET | `/api/services` | Public | `city`, `material` | Verified recycler / scrap-dealer directory |
| GET | `/api/services/:id` | Public | — | One service |
| GET | `/api/hubs` | Public | `city` | Drop-off hubs |
| GET | `/api/stats` | Public | — | Impact totals + `dbStatus` |
| GET | `/api/community/events` | Public | — | Cleanup events |
| POST | `/api/community/events/:id/join` | JWT | — | Increment volunteer count |

`city` values used in seed data: `Yangon`, `Mandalay`, `Naypyidaw`, `Bago`, `Mawlamyine`, `Taunggyi`. `material` values: `plastic`, `paper`, `metal`, `glass`, `electronic`, `organic`, `textile`.

## Legacy pickups

Mounted but not used by the current citizen/recycler screens (those use `/api/requests`).

| Method | Path | Auth | Roles | Description |
| --- | --- | --- | --- | --- |
| GET | `/api/pickups` | Public | — | List. Query: `city`, `status`, `phone` |
| GET | `/api/pickups/:id` | Public | — | One pickup |
| POST | `/api/pickups` | JWT | USER, ADMIN | Create structured pickup |
| PATCH | `/api/pickups/:id/status` | JWT | RECYCLER, ADMIN | Update `status`, collector, `actualWeightKg` |

Create requires `citizenName`, `citizenPhone`, `city`, `township`, `address`, `items`, `totalEstimatedWeightKg`.

## Storage and AI

- MongoDB when `MONGODB_URI` is set (`server/.env`). Otherwise in-memory store (lost on restart).
- Scanner uses OpenRouter if `OPENROUTER_API_KEY` is set, else Gemini if `GEMINI_API_KEY` is set, else a mock result.
- `JWT_SECRET` signs tokens. Change it in production.

## Frontend mapping

The React client lives in `frontend/src/shared/api.ts`. It prefixes paths with `VITE_API_URL` + `/api`, or `/api` when empty (Vite proxies to port 8000). JWT is stored as `rc_token` in `localStorage`.
