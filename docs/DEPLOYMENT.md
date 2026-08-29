# Deployment guide

EcoMind is two apps: a Vite frontend (`frontend/`) and an Express API (`server/`). You can host them separately or serve the built frontend from the API.

| App | Default local URL | Production role |
| --- | --- | --- |
| Frontend | http://localhost:3000 | Static SPA (Vercel, Netlify, Nginx, or Express) |
| Server | http://localhost:8000 | Node process. Health: `GET /api/health` |

Requires Node.js 20+ on the build machine.

---

## Environment variables

Do not commit `.env` files. Copy from the examples, then set the same names on the host.

### Server (`server/.env`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | On PaaS | Listen port. Default `8000`. Render / Railway / Fly set this automatically |
| `NODE_ENV` | Combined host | Set `production` so Express also serves `frontend/dist` |
| `JWT_SECRET` | Yes | Sign JWTs. Use a long random string. Do not ship the example value |
| `MONGODB_URI` | Yes in production | Atlas or self-hosted Mongo. Without it, data stays in memory and is lost on restart |
| `APP_URL` | Recommended | Public frontend origin. Sent as OpenRouter `HTTP-Referer` |
| `OPENROUTER_API_KEY` | For live scanner | Preferred vision provider |
| `OPENROUTER_MODEL` | No | Default `google/gemini-2.5-flash` |
| `GEMINI_API_KEY` | No | Fallback if OpenRouter is unset |

JWT lifetime is 7 days.

### Frontend (`frontend/.env` at **build** time)

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | When API is on another origin | API origin only, no trailing slash. Example: `https://ecomind-api.onrender.com` |
| `VITE_SITE_URL` | For social previews | Public frontend origin, no trailing slash. Production: `https://eco-mind-myanmar.vercel.app` |

Vite bakes `VITE_*` into the JS bundle. Changing it later means a rebuild.

| Hosting style | `VITE_API_URL` |
| --- | --- |
| Local Vite + local API | Leave empty (proxy `/api` → port 8000) |
| Same origin (Express serves `dist`) | Leave empty (browser calls `/api` on the same host) |
| Split (Vercel + Render) | Public API URL, no `/api` suffix |

---

## Option A — Split hosts (typical)

Frontend on Vercel (or Netlify). API on Render, Railway, or Fly. MongoDB on Atlas.

### 1. MongoDB Atlas

1. Create a free cluster and a database user.
2. Allow the API host IPs (or `0.0.0.0/0` if the host has no static IP).
3. Connection string:

```
mongodb+srv://USER:PASSWORD@cluster.mongodb.net/ecomind?retryWrites=true&w=majority
```

### 2. Deploy the server

From the repo, the API root is `server/`.

**Build**

```bash
cd server
npm ci
npm run build
```

**Start**

```bash
cd server
npm start
```

That runs `node dist/server.cjs`. Set env vars on the host (not only in a local file).

**Render example**

| Setting | Value |
| --- | --- |
| Root directory | `server` |
| Build command | `npm ci && npm run build` |
| Start command | `npm start` |
| Health check | `/api/health` |

Add `JWT_SECRET`, `MONGODB_URI`, `APP_URL` (your Vercel URL), and an OpenRouter or Gemini key.

Confirm:

```bash
curl https://your-api.onrender.com/api/health
```

You should see `"status": "ok"` and `"database": "MongoDB Connected"`.

### 3. Deploy the frontend

`frontend/vercel.json` already rewrites unknown paths to `index.html` (React Router).

**Vercel**

| Setting | Value |
| --- | --- |
| Root directory | `frontend` |
| Framework | Vite |
| Build command | `npm run build` |
| Output | `dist` |
| Env | `VITE_API_URL=https://your-api.onrender.com` |
| | `VITE_SITE_URL=https://eco-mind-myanmar.vercel.app` |

Redeploy after you change `VITE_API_URL` or `VITE_SITE_URL`.

**Netlify** (if you prefer)

- Base: `frontend`
- Build: `npm run build`
- Publish: `dist`
- Redirect: `/*` → `/index.html` (status 200)
- Env: `VITE_API_URL` as above

The API already enables CORS for all origins, so a different frontend domain works.

---

## Option B — One VPS (Express serves the SPA)

Use this on a single Ubuntu box, Docker host, or any Node process that can see both folders.

```bash
npm run install:all
```

`frontend/.env` — leave `VITE_API_URL` empty.

`server/.env` — set `JWT_SECRET`, `MONGODB_URI`, `APP_URL=https://your-domain.com`, vision keys.

```bash
cd frontend && npm run build
cd ../server && npm run build
export NODE_ENV=production
cd server && npm start
```

From the repo root you can also run `npm run build` then `npm start` after setting `NODE_ENV=production`.

Express then:

1. Serves `/api/*` as usual
2. Serves `frontend/dist` as static files
3. Falls back to `index.html` for client routes

Put Nginx or Caddy in front for TLS. Example Nginx:

```nginx
server {
  listen 443 ssl;
  server_name your-domain.com;

  location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    client_max_body_size 25m;
  }
}
```

`client_max_body_size 25m` matches the scanner upload limit.

Keep the process up with systemd or PM2:

```bash
cd /var/www/recycle-connect
NODE_ENV=production PORT=8000 pm2 start server/dist/server.cjs --name ecomind-api
```

`cwd` for that process must be `server/` (or the `frontend/dist` path `../frontend/dist` will miss).

---

## Build checklist

```bash
# Install
npm run install:all

# Typecheck
npm run lint

# Production bundles
npm run build
# → frontend/dist
# → server/dist/server.cjs
```

---

## After deploy

1. Open the frontend URL. Landing page should load.
2. `GET /api/health` — Mongo connected, vision provider as expected.
3. Log in with a real account (create one via Register). Demo users exist only if the seed ran against that database.
4. Citizen: scan (needs a vision key or you get the mock), create a pickup.
5. Recycler: accept → collect → complete (points award).
6. Admin: `/overview`, centers CRUD, `/admin/users`.

Seeded demo logins (`password123`) apply to a freshly seeded DB, not to an empty Atlas cluster. Create the first admin in Mongo or promote a user with `PATCH /api/users/:id` after you have one admin.

---

## Common failures

| Symptom | Cause |
| --- | --- |
| Login works locally, 401 in production | Frontend built without `VITE_API_URL`, or it still points at localhost |
| `/dashboard` 404 on refresh | Host is not rewriting the SPA to `index.html` |
| Health says In-Memory Store | `MONGODB_URI` missing, wrong, or Atlas IP not allowed |
| Users vanish after restart | Running without Mongo |
| Scanner always mock | No `OPENROUTER_API_KEY` or `GEMINI_API_KEY` |
| Render boot loop | Old deploys that ignored `PORT`. Current server reads `process.env.PORT` |
| Combined host has no CSS/JS | `frontend` was not built, or start cwd is not `server/` |
| CORS errors | Rare (API allows all origins). Check you did not put `/api` on `VITE_API_URL` |

`VITE_API_URL` must be `https://host` not `https://host/api`. The client already appends `/api`.

---

## Security

- Rotate `JWT_SECRET` before the first public deploy. Existing tokens become invalid.
- Use HTTPS on both hosts.
- Restrict Atlas to the API IPs when you can.
- Scanner posts large base64 images (up to 25 MB). Confirm the host request-size limit.
- Do not deploy with the example JWT secret or demo passwords as the only admin path.
