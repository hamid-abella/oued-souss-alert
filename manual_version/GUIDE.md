# Oued-Souss Alert — Per-File Writing Guide

> For every file: exactly what to create, what to import, what logic to write, and why — no code shown.

---

# STEP 1 — Config & Entry Point

---

## `backend/nodemon.json`

**What to create:** A JSON config file with 3 fields.

- Set the `watch` field to point at your `src/` folder
- Set the `ext` field to only watch `.ts` files
- Set the `exec` field to run `ts-node src/server.ts` when a change is detected

That's it. Nodemon reads this file automatically when you run `npx nodemon`.

---

## `backend/.env`

**What to create:** A plain text file with 2 lines.

- Line 1: your MongoDB connection string pointing to a local database called `oued-souss`
- Line 2: the port number your server will listen on (use `3001`)

Also create a `.gitignore` file next to it and add `.env` to it so you never accidentally push your secrets.

---

## `backend/src/config/db.ts`

**What to create:** A file that exports one async function called `connectDB`.

- Import `mongoose` and `dotenv`
- Call `dotenv.config()` at the top so your `.env` variables are loaded
- Inside `connectDB`, call `mongoose.connect()` and pass it `process.env.MONGO_URI`
- Wrap it in a try/catch — if the connection fails, log the error and call `process.exit(1)` to stop the app
- If it succeeds, log `"MongoDB connected"`

This function is called once at startup inside `server.ts`.

---

## `backend/src/server.ts`

**What to create:** The main entry point. Ties together Express, CORS, all routes, the database, and the watchdog.

Do this in order inside the file:

1. Import `express`, `cors`, `dotenv`
2. Import `connectDB` from your config file
3. Import all 5 route files (mesures, alertes, zones, capteurs, dashboard)
4. Import `startWatchdog` from your utils
5. Call `dotenv.config()`
6. Create the Express app with `express()`
7. Add two middlewares: `app.use(cors())` and `app.use(express.json())`
8. Mount each route at its path: `/api/mesures`, `/api/alertes`, `/api/zones`, `/api/capteurs`, `/api/dashboard`
9. Call `connectDB()` — and only inside its `.then()`, call `startWatchdog()` and then `app.listen(PORT, ...)`

The reason you start the server inside `.then()` is to guarantee the database is ready before accepting any requests.

---

# STEP 2 — Models

Each model file follows the exact same pattern:

1. Import `mongoose` and `Schema` and `Document`
2. Create a TypeScript interface (prefixed with `I`) that extends `Document` and lists all fields with their types
3. Create a `Schema` that mirrors that interface, with validation rules
4. Export `mongoose.model('ModelName', TheSchema)`

---

## `backend/src/models/Zone.ts`

**Fields to define:**

- `nom` — string, required
- `localisation` — a nested object with `lat` and `lng`, both numbers, both required
- `statut` — string, must be one of `'normal'`, `'attention'`, `'danger'`, defaults to `'normal'`

Use `enum` on the `statut` field so Mongoose rejects any other value automatically.

---

## `backend/src/models/Capteur.ts`

**Fields to define:**

- `nom` — string, required
- `type` — string, required (e.g. `"niveau_eau"`)
- `zoneId` — a reference to the Zone collection using `Schema.Types.ObjectId` and `ref: 'Zone'`
- `statut` — string, either `'online'` or `'offline'`, defaults to `'online'`
- `derniereMesure` — date, defaults to `Date.now`

The `derniereMesure` and `statut` fields are what the watchdog will read and update.

---

## `backend/src/models/Mesure.ts`

**Fields to define:**

- `niveauEau` — number, required
- `debit` — number, required
- `dateMesure` — date, defaults to `Date.now`
- `capteurId` — reference to the Capteur collection

---

## `backend/src/models/SeuilCritique.ts`

**Fields to define:**

- `niveauMax` — number, required
- `zoneId` — reference to Zone, required, and mark it as `unique: true`

The `unique: true` enforces one threshold per zone at the database level.

---

## `backend/src/models/Alerte.ts`

**Fields to define:**

- `dateAlerte` — date, defaults to `Date.now`
- `niveauRisque` — string, either `'modéré'` or `'danger'`, required
- `mesureId` — reference to Mesure
- `zoneId` — reference to Zone

Both references are important — `mesureId` lets you trace exactly which reading caused the alert, `zoneId` lets you know which zone is affected.

---

## `backend/src/models/PluieHistorique.ts`

**Fields to define:**

- `date` — date, required
- `quantiteMm` — number, required (rainfall in millimeters)

---

# STEP 3 — Middleware

---

## `backend/src/middleware/validate.ts`

**What to create:** An Express middleware function called `validateMesure` that runs before the mesures route.

Import `Request`, `Response`, `NextFunction` from `express`.

Write a series of `if` checks in this exact order. After each failed check, send a `400` response with a descriptive error message and `return` immediately:

1. Check if `niveauEau` is missing or null
2. Check if `niveauEau` is not a number
3. Check if `niveauEau` is less than `0`
4. Check if `niveauEau` is greater than `20`
5. Check if `capteurId` is missing

If all checks pass, call `next()` to pass control to the route handler.

The `return` after each `res.send` is critical — without it, Express will try to send a second response and crash.

---

# STEP 4 — Utils

---

## `backend/src/utils/alertEngine.ts`

**What to create:** An async function called `runAlertEngine` that takes a `Mesure` document as its argument.

Import `Capteur`, `SeuilCritique`, `Alerte`, and `Zone` models.

Inside the function, do these 3 things in order:

1. Use `Capteur.findById(mesure.capteurId)` to find which sensor sent this reading. If not found, return early.
2. Use `SeuilCritique.findOne({ zoneId: capteur.zoneId })` to get the threshold for that zone. If not found, return early.
3. Compare `mesure.niveauEau` against `seuil.niveauMax`. If it exceeds it:
   - Create a new `Alerte` with `niveauRisque: 'danger'`, the mesure ID, and the zone ID
   - Update the Zone's `statut` to `'danger'` using `Zone.findByIdAndUpdate`

This function is the direct equivalent of the MySQL `AFTER INSERT` trigger from the original spec — same logic, just written in TypeScript and called manually from the route.

---

## `backend/src/utils/indiceRisque.ts`

**What to create:** An async function called `calculerIndiceRisque` that returns an object with a `valeur` (number) and a `label` (string).

Import `Mesure` and `PluieHistorique` models.

Inside the function:

1. Fetch the 10 most recent measurements using `.find().sort({ dateMesure: -1 }).limit(10)` and calculate their average `niveauEau`
2. Fetch the 10 most recent rain records using the same pattern and calculate their average `quantiteMm`
3. Add both averages together to get the index value
4. Decide the label based on the value: below 10 → `'normal'`, below 16 → `'modéré'`, 16 and above → `'danger'`
5. Return both the rounded value and the label

---

## `backend/src/utils/capteurWatchdog.ts`

**What to create:** A function called `startWatchdog` that starts a background interval loop.

Import the `Capteur` model.

Inside `startWatchdog`:

1. Use `setInterval` with a delay of `60 * 1000` (60 seconds)
2. Inside the interval callback:
   - Calculate `tenMinutesAgo` as `new Date(Date.now() - 10 * 60 * 1000)`
   - Call `Capteur.updateMany()` with a filter: find all sensors where `derniereMesure` is less than `tenMinutesAgo` using the `$lt` MongoDB operator, and set their `statut` to `'offline'`
3. Log a message each time it runs so you can see it's working

Call `startWatchdog()` once in `server.ts` right after the database connects.

---

# STEP 5 — Routes

Each route file follows the same pattern:

1. Import `Router` from express
2. Create `const router = Router()`
3. Define your route(s) on `router`
4. Export `router` as default

---

## `backend/src/routes/mesures.ts`

**Route to create:** `POST /` (becomes `POST /api/mesures` when mounted in server.ts)

Before the handler, add `validateMesure` as middleware (import it from your middleware file).

Inside the handler, do these things in order:

1. Destructure `niveauEau`, `debit`, `capteurId` from `req.body`
2. Call `Mesure.create(...)` to save the measurement
3. Call `Capteur.findByIdAndUpdate(...)` to set `statut: 'online'` and `derniereMesure: new Date()` on the sensor that sent it
4. Call `runAlertEngine(mesure)` and pass the saved measurement
5. Respond with `201` and the saved measurement

Wrap everything in try/catch — respond with `500` on error.

---

## `backend/src/routes/alertes.ts`

**Route to create:** `GET /`

Inside the handler:

1. Call `Alerte.find()` chained with `.sort({ dateAlerte: -1 })`
2. Chain `.populate('zoneId', 'nom statut')` — this replaces the zone ID with the zone's name and statut
3. Chain `.populate('mesureId', 'niveauEau debit dateMesure')` — replaces the mesure ID with the actual reading data
4. Respond with the result as JSON

The two `.populate()` calls are what allow the frontend to display zone names and water levels instead of raw IDs.

---

## `backend/src/routes/zones.ts`

**Route to create:** `GET /`

Inside the handler: call `Zone.find()` and respond with the result. That's it — simple.

---

## `backend/src/routes/capteurs.ts`

**Route to create:** `GET /`

Inside the handler:

1. Call `Capteur.find()` chained with `.populate('zoneId', 'nom')`
2. Respond with the result

The populate replaces the zone ID with just the zone name so the frontend can display it.

---

## `backend/src/routes/dashboard.ts`

**Route to create:** `GET /`

Inside the handler, run all 4 of these at the same time using `Promise.all([...])`:

1. `Alerte.countDocuments()` — total number of alerts
2. `Capteur.countDocuments({ statut: 'online' })` — count only online sensors
3. `Zone.countDocuments({ statut: 'danger' })` — count only danger zones
4. `calculerIndiceRisque()` — your risk index utility

Destructure the 4 results from the array and respond with a JSON object containing all of them.

Using `Promise.all` means all 4 queries run simultaneously — much faster than running them one after another.

---

# STEP 6 — Frontend Types & Services

---

## `frontend/src/types/index.ts`

**What to create:** 5 TypeScript interfaces that mirror your MongoDB models exactly.

- `Zone` — `_id`, `nom`, `localisation` (with `lat` and `lng`), `statut` (union of the 3 string values)
- `Capteur` — `_id`, `nom`, `type`, `zoneId` (use `Zone | string` because it can be populated or just an ID), `statut`, `derniereMesure`
- `Mesure` — `_id`, `niveauEau`, `debit`, `dateMesure`, `capteurId`
- `Alerte` — `_id`, `dateAlerte`, `niveauRisque`, `mesureId` (type `Mesure`), `zoneId` (type `Zone`)
- `DashboardData` — `totalAlertes`, `capteursOnline`, `zonesEnDanger`, `indiceRisque` (an object with `valeur` number and `label` string)

Export all 5 interfaces. Every page and component will import from this file.

---

## `frontend/src/services/api.ts`

**What to create:** 5 exported async functions, one per backend route.

Import `axios` and all your types.

Define `BASE_URL` as a constant set to `http://localhost:3001/api`. All functions use this.

The 5 functions to write:

- `getZones()` — GET to `/zones`, returns `Zone[]`
- `getAlertes()` — GET to `/alertes`, returns `Alerte[]`
- `getCapteurs()` — GET to `/capteurs`, returns `Capteur[]`
- `getDashboard()` — GET to `/dashboard`, returns `DashboardData`
- `postMesure(data)` — POST to `/mesures`, accepts an object with `niveauEau`, `debit`, `capteurId`

Each function calls `axios.get(...)` or `axios.post(...)` and returns `res.data`.

---

# STEP 7 — React Components

---

## `frontend/src/components/AlertBadge.tsx`

**What to create:** A component that takes a `niveau` prop and renders a small colored pill.

- Define a `Props` interface with `niveau` typed as the union `'normal' | 'modéré' | 'danger'`
- Create an object called `colorMap` that maps each value to a pair of Tailwind classes: green background + dark green text for normal, orange for modéré, red for danger
- In the JSX, render a `<span>` and use `colorMap[niveau]` as the className
- Add `rounded-full` and some padding to make it look like a pill

---

## `frontend/src/components/StatCard.tsx`

**What to create:** A card component that displays a big number with a label.

- Props: `label` (string), `value` (number or string), and an optional `color` prop (`'default' | 'danger' | 'warning' | 'success'`)
- Create a `colorMap` object that maps each color name to a Tailwind text color class
- Render a `<div>` with a white background, rounded corners, and a border
- Inside: render the `label` in small muted text, and `value` in large bold text using the color from `colorMap`

---

## `frontend/src/components/MapZones.tsx`

**What to create:** A component that renders an SVG map showing the zones as colored circles.

- Props: `zones` (array of `Zone`)
- Create a `statusColor` object mapping `'normal'` → green hex, `'attention'` → orange hex, `'danger'` → red hex
- Create a `zonePositions` object that maps each zone name to hardcoded `x` and `y` coordinates on the SVG canvas (viewBox `0 0 600 300`)
- Use `useState` to track which zone name is hovered (start as `null`)
- In the JSX, render an SVG with:
  - A decorative `<path>` element representing the river (a curved blue line)
  - A `<text>` label "Oued Souss" near the river
  - Map over the `zones` array — for each zone, render a `<g>` containing a `<circle>` colored by statut and a `<text>` showing the statut inside it. On `onMouseEnter` set hovered to the zone name, on `onMouseLeave` set it back to null. When hovered, show the zone name above the circle.
- Below the SVG, add a legend row with 3 small colored circles and their labels

---

## `frontend/src/components/Navbar.tsx`

**What to create:** A horizontal navigation bar that highlights the active page.

- Import `NavLink` from `react-router-dom` (not `Link` — `NavLink` provides an `isActive` boolean)
- Define a `linkClass` function that takes `{ isActive }` and returns Tailwind classes — a blue filled style when active, a plain gray hover style when not
- Render a `<nav>` with a border-bottom, white background, and horizontal flex layout
- Inside: the app title as plain text, then 3 `NavLink` elements pointing to `/`, `/alertes`, `/capteurs`
- Add `end` prop to the `/` link so it doesn't stay active on every page

---

# STEP 8 — Pages

Each page follows this exact pattern:

1. Declare state with `useState` — one for the data, one for `loading` boolean
2. Write a `fetchData` async function that calls the right API function and sets state
3. Call `fetchData` inside `useEffect` with an empty dependency array `[]` so it runs on mount
4. If `loading` is true, render a loading message
5. Render the actual content

---

## `frontend/src/pages/Dashboard.tsx`

**State to declare:** `data` typed as `DashboardData | null`, `zones` typed as `Zone[]`, `loading` as boolean.

**In `useEffect`:**

- Call `getDashboard()` and `getZones()` at the same time using `Promise.all`
- Set both results into state
- Also set up a `setInterval` that calls `fetchData` every `30000` ms (30 seconds)
- Return a cleanup function that calls `clearInterval` — this stops the interval when you navigate away

**In the JSX, render in order:**

1. A page title
2. A grid of 4 `StatCard` components — total alerts, sensors online, zones in danger, risk index value
3. An `AlertBadge` showing the current risk level label
4. The `MapZones` component passing the `zones` state as prop

---

## `frontend/src/pages/Alertes.tsx`

**State to declare:** `alertes` typed as `Alerte[]`, `loading` as boolean.

**In `useEffect`:** Call `getAlertes()` and set the result into `alertes`.

**In the JSX:**

- If no alerts, render a "no alerts yet" message
- Otherwise render a `<table>` with 4 columns: Date, Zone, Water level, Risk
- For each alert in the array, render a `<tr>` with:
  - Date formatted with `new Date(alerte.dateAlerte).toLocaleString()`
  - Zone name — use `typeof alerte.zoneId === 'object' ? alerte.zoneId.nom : alerte.zoneId` to safely handle both populated and unpopulated cases
  - Water level from `alerte.mesureId?.niveauEau` (use optional chaining)
  - An `AlertBadge` component with `alerte.niveauRisque`

---

## `frontend/src/pages/Capteurs.tsx`

**State to declare:** `capteurs` typed as `Capteur[]`, `loading` as boolean.

**In `useEffect`:** Call `getCapteurs()` and set the result.

**In the JSX:**

- Render a `<table>` with 5 columns: Name, Type, Zone, Status, Last measurement
- For each sensor, store `isOffline = capteur.statut === 'offline'` in a variable
- Apply a red background to the entire row when `isOffline` is true, normal white otherwise
- Render the status as a small pill span — red pill for offline, green pill for online
- Format `derniereMesure` with `new Date(...).toLocaleString()`

---

## `frontend/src/App.tsx`

**What to create:** The root component that sets up routing.

- Import `BrowserRouter`, `Routes`, `Route` from `react-router-dom`
- Import `Navbar` and all 3 pages
- Wrap everything in `<BrowserRouter>`
- Inside, render `<Navbar />` first so it appears on every page
- Then render `<Routes>` with 3 `<Route>` elements:
  - `path="/"` → `<Dashboard />`
  - `path="/alertes"` → `<Alertes />`
  - `path="/capteurs"` → `<Capteurs />`
- Add a `min-h-screen bg-gray-50` div around everything for the full-page background

---

# STEP 9 — Seed file (for demo data)

## `backend/src/seed.ts`

**What to create:** A standalone script you run once before the demo to populate the database.

- Import mongoose, dotenv, and all 4 models you need: Zone, Capteur, SeuilCritique, PluieHistorique
- Call `mongoose.connect()` using the URI from `.env`
- Delete all existing documents from each collection using `.deleteMany({})` — so you start clean
- Create 3 zones with names like `'Zone Souss 1'`, `'Zone Souss 2'`, `'Zone Souss 3'`, each with a `localisation` and `statut: 'normal'`
- Create 1 capteur per zone, linked via `zoneId`
- Create 1 threshold per zone using `SeuilCritique.create` — use different values like 10, 12, 8 so the demo is interesting
- Create 3–5 rainfall records with different dates and quantities
- At the end, log the ID of each capteur — you'll paste these IDs into the curl test commands from the roadmap
- Call `mongoose.disconnect()` when done

**Run it with:** `npx ts-node src/seed.ts` from inside the `backend/` folder.

---

# Summary table

| File                        | What to write inside                                                         |
| --------------------------- | ---------------------------------------------------------------------------- |
| `nodemon.json`              | 3 JSON fields: watch, ext, exec                                              |
| `.env`                      | MONGO_URI and PORT                                                           |
| `config/db.ts`              | One async `connectDB` function using mongoose.connect                        |
| `server.ts`                 | Express setup, CORS, route mounting, DB connect, watchdog start              |
| `models/Zone.ts`            | Schema with nom, localisation, statut (enum)                                 |
| `models/Capteur.ts`         | Schema with nom, type, zoneId (ref), statut, derniereMesure                  |
| `models/Mesure.ts`          | Schema with niveauEau, debit, dateMesure, capteurId (ref)                    |
| `models/SeuilCritique.ts`   | Schema with niveauMax, zoneId (ref, unique)                                  |
| `models/Alerte.ts`          | Schema with dateAlerte, niveauRisque (enum), mesureId (ref), zoneId (ref)    |
| `models/PluieHistorique.ts` | Schema with date, quantiteMm                                                 |
| `middleware/validate.ts`    | 5 if-checks on niveauEau and capteurId, then next()                          |
| `utils/alertEngine.ts`      | Find capteur → find seuil → compare → create alerte + update zone            |
| `utils/indiceRisque.ts`     | Average last 10 mesures + last 10 pluies → return value + label              |
| `utils/capteurWatchdog.ts`  | setInterval every 60s → updateMany sensors offline if > 10min silent         |
| `routes/mesures.ts`         | POST: validate → save mesure → update capteur → run alertEngine              |
| `routes/alertes.ts`         | GET: find all, sort desc, populate zone and mesure                           |
| `routes/zones.ts`           | GET: find all zones                                                          |
| `routes/capteurs.ts`        | GET: find all, populate zone name                                            |
| `routes/dashboard.ts`       | GET: Promise.all with 3 counts + indiceRisque                                |
| `types/index.ts`            | 5 interfaces: Zone, Capteur, Mesure, Alerte, DashboardData                   |
| `services/api.ts`           | 5 axios functions with BASE_URL constant                                     |
| `components/AlertBadge.tsx` | Pill span with colorMap lookup on niveau prop                                |
| `components/StatCard.tsx`   | Card with big value and muted label, optional color prop                     |
| `components/MapZones.tsx`   | SVG with circles per zone, colored by statut, hover shows name               |
| `components/Navbar.tsx`     | NavLink bar with active style function                                       |
| `pages/Dashboard.tsx`       | useState + useEffect + Promise.all + setInterval + 4 StatCards + MapZones    |
| `pages/Alertes.tsx`         | useState + useEffect + table with AlertBadge per row                         |
| `pages/Capteurs.tsx`        | useState + useEffect + table with red row for offline sensors                |
| `App.tsx`                   | BrowserRouter + Navbar + 3 Routes                                            |
| `seed.ts`                   | Delete all → create 3 zones → 3 capteurs → 3 seuils → rain records → log IDs |
