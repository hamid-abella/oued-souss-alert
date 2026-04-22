# Oued-Souss Alert — Project Roadmap

demo #Video Demo https://youtu.be/REaTBFaXzok?si=knrjpLFuG34IpHQH






> **School project** | React + Vite + TS + Tailwind + Shadcn · Node + Express · MongoDB

---

## Stack overview

| Layer       | Technology                                           |
| ----------- | ---------------------------------------------------- |
| Frontend    | React + Vite + TypeScript + Tailwind CSS + Shadcn/ui |
| Backend     | Node.js + Express + TypeScript                       |
| Database    | MongoDB + Mongoose                                   |
| HTTP client | Axios                                                |
| Routing     | React Router DOM                                     |

---

## Step 1 — Project setup & folder structure

### What you do

Create the two apps inside one root folder. No business logic yet — just a working skeleton that boots.

### Commands

```bash
# 1. Create the root folder
mkdir oued-souss-alert
cd oued-souss-alert

# 2. Create & initialize the backend
mkdir backend
cd backend
npm init -y
npm install express mongoose dotenv cors
npm install -D typescript ts-node @types/node @types/express nodemon
npx tsc --init
cd ..

# 3. Create the frontend
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install tailwindcss @tailwindcss/vite
npx shadcn@latest init --preset b1a1PEylk
npm install axios react-router-dom
npm install -D @types/react-router-dom
cd ..
```

### Files to create manually

#### `backend/src/server.ts`

The entry point of the backend. It initializes Express, enables CORS so the frontend (port 5173) can talk to it, connects to MongoDB by calling `connectDB()`, mounts all routes under `/api`, and starts listening on the port defined in `.env`.

#### `backend/.env`

Stores two environment variables: `MONGO_URI=mongodb://localhost:27017/oued-souss` and `PORT=3001`. Never commit this file — add it to `.gitignore`.

#### `backend/src/config/db.ts`

Contains a single `connectDB()` function that calls `mongoose.connect()` using the URI from `.env`. It is imported and called once inside `server.ts` at startup.

#### `backend/nodemon.json`

Tells nodemon to watch `.ts` files inside `src/` and compile them on the fly with `ts-node`. This way you never have to restart the server manually during development.

#### `frontend/src/services/api.ts`

Empty for now. This file will hold every Axios function that talks to the backend. Creating it in step 1 keeps the folder structure clean from the start.

#### `frontend/src/types/index.ts`

Empty for now. Will contain the TypeScript interfaces shared across components (`Zone`, `Capteur`, `Mesure`, `Alerte`).

> **Expected result:** Running `npx nodemon src/server.ts` in `backend/` logs "MongoDB connected" and "Server running on port 3001". Running `npm run dev` in `frontend/` shows the default Vite page.

---

## Step 2 — Database models (MongoDB schemas)

### What you do

Define what your data looks like. Each file in `backend/src/models/` is a Mongoose schema — it describes the shape of one collection in MongoDB.

### No new commands needed for this step.

### Files to create

#### `backend/src/models/Zone.ts`

Defines a **zone agricole**. Fields: `nom` (string), `localisation` (object with `lat` and `lng` as numbers), `statut` (string — one of `"normal"`, `"attention"`, `"danger"`). The `statut` field will be updated automatically when an alert is triggered.

#### `backend/src/models/Capteur.ts`

Defines a **sensor**. Fields: `nom` (string), `type` (string, e.g. `"niveau_eau"`), `zoneId` (reference to a Zone document), `statut` (string — `"online"` or `"offline"`), `derniereMesure` (date — updated every time the sensor sends data). The `statut` and `derniereMesure` fields are used by the watchdog in Step 4.

#### `backend/src/models/Mesure.ts`

Defines a **measurement** sent by a sensor. Fields: `niveauEau` (number), `debit` (number), `dateMesure` (date — defaults to now), `capteurId` (reference to a Capteur). Every time a measurement is saved, the alert engine in Step 3 will check it.

#### `backend/src/models/SeuilCritique.ts`

Defines the **critical threshold** for a zone. Fields: `niveauMax` (number), `zoneId` (reference to a Zone). There is one threshold per zone.

#### `backend/src/models/Alerte.ts`

Defines an **alert**. Fields: `dateAlerte` (date — defaults to now), `niveauRisque` (string — `"modéré"` or `"danger"`), `mesureId` (reference to the Mesure that triggered it), `zoneId` (reference to the Zone concerned).

#### `backend/src/models/PluieHistorique.ts`

Defines a **historical rain record**. Fields: `date` (date), `quantiteMm` (number — rainfall in millimeters). Used by the risk index calculation in Step 3.

> **Expected result:** All models are importable with no TypeScript errors. No routes yet — just the schema definitions.

---

## Step 3 — Backend logic & API routes

### What you do

Write the core intelligence of the system: the alert engine (equivalent of the MySQL trigger), the risk index calculator, and all the REST API routes the frontend will call.

### No new commands needed for this step.

### Utility files

#### `backend/src/utils/alertEngine.ts`

This is the equivalent of the MySQL trigger, but written in TypeScript. It is called every time a new measurement is saved. It does three things in order:

1. Finds the zone of the sensor that sent the measurement.
2. Fetches the critical threshold for that zone.
3. If `niveauEau > niveauMax`, it creates a new `Alerte` document and updates the zone's `statut` to `"danger"`.

#### `backend/src/utils/indiceRisque.ts`

Calculates a simple flood risk index. It fetches the average `niveauEau` from recent measurements and the average `quantiteMm` from `PluieHistorique`, then adds them together. Returns both the numeric value and a label (`"normal"`, `"modéré"`, `"danger"`). Called by the dashboard route.

#### `backend/src/middleware/validate.ts`

An Express middleware that runs before any route that receives sensor data. It rejects the request with a `400` error if `niveauEau` is missing, below `0`, or above `20`. This is the security layer that blocks injected or aberrant data before it reaches the database.

### Route files

#### `backend/src/routes/mesures.ts`

Exposes `POST /api/mesures`. Receives `{ niveauEau, debit, capteurId }` from the sensor simulator. Runs `validate` middleware first, then saves the measurement to MongoDB, then calls `alertEngine`. Also updates the `derniereMesure` and `statut` of the corresponding sensor to `"online"`.

#### `backend/src/routes/alertes.ts`

Exposes `GET /api/alertes`. Returns all alerts sorted by `dateAlerte` descending, with the related zone and measurement populated. The frontend uses this for the alerts page.

#### `backend/src/routes/zones.ts`

Exposes `GET /api/zones`. Returns all zones with their current `statut` and coordinates. The frontend map uses this to color each zone green, orange, or red.

#### `backend/src/routes/capteurs.ts`

Exposes `GET /api/capteurs`. Returns all sensors with their `statut`, `type`, and `derniereMesure`. Used on the sensors page to show which ones are online or offline.

#### `backend/src/routes/dashboard.ts`

Exposes `GET /api/dashboard`. Returns a summary object containing: total alert count, number of online sensors, number of zones in danger, and the current risk index from `indiceRisque`. Used by the stat cards on the dashboard.

> **Expected result:** Testing `POST /api/mesures` with a high `niveauEau` via Postman or curl creates an alert in MongoDB and changes the zone's statut to "danger".

---

## Step 4 — Sensor watchdog (offline detection)

### What you do

Add a background job that periodically checks if sensors have gone silent. If a sensor has not sent data in the last 10 minutes, it is marked as `"offline"`. This satisfies the QA requirement from the spec.

### No new commands needed for this step.

### File to create

#### `backend/src/utils/capteurWatchdog.ts`

Contains a function `startWatchdog()` that uses `setInterval` to run every 60 seconds. Each time it runs, it queries MongoDB for all sensors where `derniereMesure` is older than 10 minutes and sets their `statut` to `"offline"`. Call `startWatchdog()` once inside `server.ts` after the database connects.

> **Expected result:** If you stop sending measurements for a sensor, its `statut` in MongoDB changes to `"offline"` within ~10 minutes, and the frontend sensors page reflects this.

---

## Step 5 — Frontend: pages & components

### What you do

Build the React app. Fill in `api.ts` with all Axios calls, create the shared TypeScript types, then build each page and its components.

### No new commands needed for this step.

### Services & types

#### `frontend/src/services/api.ts`

Contains all Axios functions that call the backend. Functions to write: `getZones()`, `getAlertes()`, `getCapteurs()`, `getDashboard()`, `postMesure(data)`. All use `http://localhost:3001/api` as the base URL. Having all calls in one file means you only need to change the base URL once for deployment.

#### `frontend/src/types/index.ts`

Contains TypeScript interfaces that match the MongoDB models: `Zone`, `Capteur`, `Mesure`, `Alerte`, `DashboardData`. These are imported by every page and component to get type checking on API responses.

### Reusable components

#### `frontend/src/components/StatCard.tsx`

A simple card that shows a large number and a label below it. Props: `label` (string) and `value` (number or string). Used in the dashboard for "active alerts", "sensors online", "zones in danger". Background: Tailwind `bg-gray-50`.

#### `frontend/src/components/AlertBadge.tsx`

A small colored badge. Props: `niveau` (string). Renders green for `"normal"`, orange for `"modéré"`, red for `"danger"`. Used in tables and lists to show risk level at a glance.

#### `frontend/src/components/MapZones.tsx`

An interactive SVG-based map of the Souss region. Each zone is a clickable colored circle or polygon. It receives a `zones` prop (array of `Zone`) and colors each one based on its `statut`: green, orange, or red. For a school project, a simple hardcoded SVG with colored markers is perfectly sufficient.

#### `frontend/src/components/Navbar.tsx`

A top navigation bar with three links: Dashboard, Alertes, Capteurs. Uses `react-router-dom`'s `<NavLink>` to highlight the active page. Styled with Tailwind.

### Pages

#### `frontend/src/pages/Dashboard.tsx`

The main page. On load, it calls `getDashboard()` and `getZones()`. Displays four `StatCard` components at the top (active alerts, online sensors, zones in danger, risk index). Below that, shows the `MapZones` component with live zone colors. Auto-refreshes every 30 seconds using `setInterval` inside a `useEffect`.

#### `frontend/src/pages/Alertes.tsx`

Calls `getAlertes()` on load. Renders a table with columns: date, zone name, water level, risk level (using `AlertBadge`). Sorted newest first. Allows the professor to see the full alert history.

#### `frontend/src/pages/Capteurs.tsx`

Calls `getCapteurs()` on load. Renders a table with columns: sensor name, type, zone, statut (online/offline), last measurement date. Offline sensors are highlighted in red so they stand out immediately.

#### `frontend/src/App.tsx`

Sets up React Router with three routes: `/` → Dashboard, `/alertes` → Alertes, `/capteurs` → Capteurs. Wraps everything in `<Navbar>` so the nav appears on every page.

> **Expected result:** The full app is navigable. The dashboard shows live data from MongoDB, the map colors zones correctly, and the alerts table is populated after running the sensor simulator.

---

## Step 6 — Security & QA tests

### What you do

Simulate the two attack/failure scenarios described in the spec, and verify the system handles them correctly.

### Commands (run from a terminal to simulate data)

```bash
# Simulate a normal measurement
curl -X POST http://localhost:3001/api/mesures \
  -H "Content-Type: application/json" \
  -d '{"niveauEau": 3.5, "debit": 12, "capteurId": "<your_capteur_id>"}'

# Simulate a data injection attack (should be rejected with 400)
curl -X POST http://localhost:3001/api/mesures \
  -H "Content-Type: application/json" \
  -d '{"niveauEau": 999, "debit": 0, "capteurId": "<your_capteur_id>"}'

# Simulate a flood situation (should trigger an alert)
curl -X POST http://localhost:3001/api/mesures \
  -H "Content-Type: application/json" \
  -d '{"niveauEau": 18, "debit": 80, "capteurId": "<your_capteur_id>"}'

# Simulate aberrant data (negative value — should be rejected with 400)
curl -X POST http://localhost:3001/api/mesures \
  -H "Content-Type: application/json" \
  -d '{"niveauEau": -50, "debit": 0, "capteurId": "<your_capteur_id>"}'
```

### What to verify

| Test scenario                      | Expected behavior                                                     |
| ---------------------------------- | --------------------------------------------------------------------- |
| `niveauEau = 999`                  | Rejected with HTTP 400. Nothing saved in MongoDB.                     |
| `niveauEau = -50`                  | Rejected with HTTP 400. Nothing saved in MongoDB.                     |
| `niveauEau = 18` (above threshold) | Alert created. Zone statut set to "danger". Dashboard shows red zone. |
| Sensor sends nothing for 10+ min   | Sensor statut changes to "offline". Capteurs page shows it in red.    |

> **Expected result:** All four scenarios behave as described above. This is what you demonstrate to the professor.

---

## Running the app

Open **two terminals** at the same time:

```bash
# Terminal 1 — backend
cd oued-souss-alert/backend
npx nodemon src/server.ts

# Terminal 2 — frontend
cd oued-souss-alert/frontend
npm run dev
```

| Service     | URL                       |
| ----------- | ------------------------- |
| Frontend    | http://localhost:5173     |
| Backend API | http://localhost:3001/api |
| MongoDB     | mongodb://localhost:27017 |

> Make sure MongoDB is running locally before starting the backend. On most systems: `mongod` or start it via MongoDB Compass.

---

## Final folder structure

```
oued-souss-alert/
│
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── config/
│   │   │   └── db.ts
│   │   ├── models/
│   │   │   ├── Zone.ts
│   │   │   ├── Capteur.ts
│   │   │   ├── Mesure.ts
│   │   │   ├── Alerte.ts
│   │   │   ├── SeuilCritique.ts
│   │   │   └── PluieHistorique.ts
│   │   ├── routes/
│   │   │   ├── mesures.ts
│   │   │   ├── alertes.ts
│   │   │   ├── zones.ts
│   │   │   ├── capteurs.ts
│   │   │   └── dashboard.ts
│   │   ├── utils/
│   │   │   ├── alertEngine.ts
│   │   │   ├── indiceRisque.ts
│   │   │   └── capteurWatchdog.ts
│   │   └── middleware/
│   │       └── validate.ts
│   ├── .env
│   ├── nodemon.json
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── types/
    │   │   └── index.ts
    │   ├── services/
    │   │   └── api.ts
    │   ├── pages/
    │   │   ├── Dashboard.tsx
    │   │   ├── Alertes.tsx
    │   │   └── Capteurs.tsx
    │   └── components/
    │       ├── Navbar.tsx
    │       ├── StatCard.tsx
    │       ├── AlertBadge.tsx
    │       └── MapZones.tsx
    ├── tailwind.config.js
    ├── vite.config.ts
    └── package.json
```
