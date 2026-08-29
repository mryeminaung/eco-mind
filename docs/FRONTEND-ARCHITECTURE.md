# EcoMind frontend architecture

React 19 + Vite 6 app in `frontend/`. Dev server: `http://localhost:3000`. Tailwind CSS 4, React Router 7, Space Grotesk + Padauk fonts.

Path alias: `@/` → `frontend/src/`.

## Tree

```
frontend/src/
  main.tsx                 Entry, fonts, CSS
  App.tsx                  Providers + routes
  types.ts                 Shared domain types
  index.css                Theme tokens (lima / emerald)
  i18n/                    LocaleProvider, en.json, my.json
  layout/                  Dashboard shell (sidebar, header, footer)
  features/                Route-level product areas
  shared/                  API client, UI primitives, badges, points
```

Product code lives under `features/`. App-wide chrome stays in `layout/` and `shared/`. Older mirrored folders (`src/auth`, `src/dashboard`, …) are leftovers and are not what `App.tsx` imports.

## Providers

`App.tsx` wraps the tree as:

1. `LocaleProvider` — English / Myanmar, key `ecomind-locale` in `localStorage`, sets `document.documentElement.lang`
2. `AuthProvider` — session from JWT (`rc_token`), `GET /api/auth/me` on boot
3. `BrowserRouter`

`t(key, vars)` interpolates `{name}` style placeholders. Missing Myanmar keys fall back to English.

## Routing

| Path | Page | Who |
| --- | --- | --- |
| `/` | Landing | Public |
| `/community` | Community impact | Public (join needs login) |
| `/login`, `/register` | Auth split layout | Public |
| `/dashboard` | Citizen overview | USER |
| `/rewards` | Green Rewards + badge timeline | USER |
| `/scan` | AI scanner | USER, ADMIN |
| `/request-pickup`, `/requests` | Create + track collections | USER, ADMIN |
| `/centers`, `/centers/:id` | Recycling centers | USER, RECYCLER, ADMIN |
| `/services`, `/hubs` | Public directories | Anyone (also in dashboard shell) |
| `/collector`, `/recycler-dashboard` | Pickup queue | RECYCLER, ADMIN |
| `/overview` | Admin impact home | ADMIN |
| `/admin/users` | Manage users | ADMIN |
| `/settings` | Profile + password | Signed-in |

`ProtectedRoute` sends unsigned or wrong-role users to `/`. After login, `roleHomePath` sends USER → `/dashboard`, RECYCLER → `/collector`, ADMIN → `/overview`.

Alias paths (`/recycling-centers`, `/requests`, `/recycler-dashboard`) keep the same pages as the primary URLs.

## Features

Each folder owns pages (and sometimes local components). Barrel `index.ts` files re-export the public page.

| Folder | Responsibility |
| --- | --- |
| `features/landing` | Marketing homepage + `MarketingLayout` (logo, language, auth links) |
| `features/auth` | `AuthContext`, `ProtectedRoute`, login/register, split layout |
| `features/dashboard` | Citizen overview, Green Rewards (points + badge tiers) |
| `features/scanner` | Photo upload, loading steps, result card |
| `features/pickups` | Collection request table/modal; admin `HomePage` is also here (`/overview`) |
| `features/collector` | Recycler queue (accept / reject / collect / complete) |
| `features/centers` | Center list, detail, add/edit/delete dialogs |
| `features/services` | Recycler directory |
| `features/hubs` | Drop-off hubs |
| `features/community` | Events, sorting guide, township rankings |
| `features/admin` | User table (role + delete) |
| `features/settings` | Name, email, password |

`CollectorPortalPage` and `RequestPickupPage` exist on disk but are not routed. Live flows use `RecyclerRequestsPage` and `CreateRequestPage`.

## Layout and navigation

`DashboardLayout` is a persistent emerald sidebar + top bar (`LanguageToggle`, `UserMenu`) + `Outlet`.

Sidebar links are role-filtered:

- **USER:** Overview, Green Rewards, Scanner, Centers, My Collections
- **RECYCLER:** Pickup queue, Centers, Services, Hubs
- **ADMIN:** Overview, Centers, Manage Users
- **All signed-in:** Settings

Marketing pages use `MarketingLayout` instead of the sidebar.

## Data layer

`shared/api.ts` is the only HTTP client.

- Base URL: `VITE_API_URL` + `/api`, or `/api` when unset (Vite proxies to `http://localhost:8000`)
- Attaches `Authorization: Bearer` from `localStorage` key `rc_token`
- Throws `Error` with the server `error` string
- Scanner has a local fallback result if the API is down
- Some public list methods still fall back to `shared/seedData.ts` if the request fails

Auth methods used by `AuthContext`: `register`, `login`, `getMe`, `updateProfile`, `changePassword`.

## i18n

Custom, not i18next.

- Dictionaries: `i18n/en.json`, `i18n/my.json`
- `useLocale()` → `{ locale, setLocale, t }`
- `LanguageToggle` (UK / Myanmar flags) on marketing, dashboard, and auth layouts
- `i18n/labels.ts` maps city / material / status codes to keys
- API codes (`USER`, `PENDING`, MMK, kg, EcoMind) stay English
- User-typed text and AI result bodies stay as returned

## Shared UI and helpers

| Path | Role |
| --- | --- |
| `shared/ui/*` | Button, card, dialog, input, select, textarea, badge |
| `shared/components/PageSectionHeader` | Gradient page title + pills + actions |
| `shared/components/BrandLogo` | `/eco-mind.png` wordmark |
| `shared/components/CollectionStatusBadge` | Localized request status |
| `shared/components/WasteCategoryBadge` | Material chip (EN / MY label) |
| `shared/components/ImpactOverview` | Public + admin impact stats |
| `shared/badgeAward.ts` | Point tiers: 0 / 100 / 250 / 500 |
| `shared/pointsCalculator.ts` | Client-side Green Points preview |

Theme tokens (`lima-*`, `emerald-*`) are in `index.css`. Visual language is lima/emerald on a dark emerald-teal header.

## Roles vs screens

| Capability | USER | RECYCLER | ADMIN |
| --- | --- | --- | --- |
| Scan waste | Yes | No (route blocked) | Route allowed; not in sidebar |
| Create collection | Yes | No | Route allowed; not in sidebar |
| Earn / view rewards | Yes | No | No `/rewards` |
| Full request queue | No | Yes | Route allowed; not in sidebar |
| Center CRUD | Read | Read | Create / edit / delete |
| Manage users | No | No | Yes |

## Env

`frontend/.env`:

```
VITE_API_URL=
```

Leave empty locally so `/api` is proxied. Set it only when the API is on another origin.

## Scripts

From `frontend/`: `npm run dev` (port 3000), `npm run build`, `npm run lint` (`tsc --noEmit`). Repo root `npm run dev` starts API + frontend together.
