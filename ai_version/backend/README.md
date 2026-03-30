# ⚙️ Backend — Oued-Souss Alert

## Technologies

- **Node.js** 18+
- **Express** 4.x
- **PostgreSQL** via `pg` (pool de connexions)
- **JWT** pour l'authentification
- **Jest + Supertest** pour les tests

---

## Installation
```bash
cd backend
npm install
cp .env.example .env
# Configurer les variables dans .env
npm run dev
```

---

## Variables d'environnement

Créer un fichier `.env` à la racine de `backend/` :
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oued_souss_alert
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
JWT_SECRET=oued_souss_secret_key_2026
FRONTEND_URL=http://localhost:5173
```

---

## Structure des fichiers
```
backend/
├── src/
│   ├── config/
│   │   ├── db.js             # Pool de connexion PostgreSQL
│   │   └── roles.js          # Définition RBAC (rôles + permissions) en anglais
│   ├── controllers/          # Traitement des requêtes HTTP
│   │   ├── auth.controller.js
│   │   ├── zones.controller.js
│   │   ├── sensors.controller.js
│   │   ├── measurements.controller.js
│   │   ├── alerts.controller.js
│   │   ├── risk-indices.controller.js
│   │   └── dashboard.controller.js
│   ├── middleware/
│   │   ├── auth.js           # JWT + RBAC (authenticateJWT, authorizeRole)
│   │   ├── errorHandler.js   # Gestionnaire global des erreurs
│   │   └── validate.js       # Validation express-validator
│   ├── routes/               # Définition des endpoints
│   │   ├── auth.routes.js
│   │   ├── zones.routes.js
│   │   ├── sensors.routes.js
│   │   ├── measurements.routes.js
│   │   ├── alerts.routes.js
│   │   ├── risk-indices.routes.js
│   │   └── dashboard.routes.js
│   ├── services/             # Logique métier + requêtes SQL
│   │   ├── auth.service.js
│   │   ├── zones.service.js
│   │   ├── sensors.service.js
│   │   ├── measurements.service.js
│   │   ├── alerts.service.js
│   │   ├── risk-indices.service.js
│   │   └── dashboard.service.js
│   ├── utils/
│   │   ├── logger.js         # Winston (logs console + fichiers)
│   │   └── sanitize.js       # Protection anti-injection SQL
│   ├── app.js                # Configuration Express + middlewares
│   └── server.js             # Point d'entrée
├── tests/
│   ├── unit/                 # Tests unitaires des services (Jest)
│   └── integration/          # Tests des API routes (Supertest)
├── logs/                     # Fichiers de logs (gitignored)
├── jest.config.js
├── .env.example
└── package.json
```

---

## Documentation API

### Authentification
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@souss.ma",
  "password": "admin123"
}
```

Réponse :
```json
{
  "token": "eyJhbGci...",
  "user": {
    "user_id": 1,
    "name": "Admin",
    "email": "admin@souss.ma",
    "role": "admin"
  }
}
```

> Toutes les routes suivantes nécessitent le header :
> `Authorization: Bearer <token>`

---

### Zones

| Méthode | Route | Rôle requis | Description |
|---|---|---|---|
| GET | `/api/zones` | tous | Liste zones + dernier indice |
| GET | `/api/zones/:id` | tous | Détail d'une zone |
| POST | `/api/zones` | admin | Créer une zone |
| PUT | `/api/zones/:id` | admin | Modifier une zone |
| DELETE | `/api/zones/:id` | admin | Supprimer une zone |

**Body POST/PUT :**
```json
{
  "name": "Zone Agricole Aït Melloul",
  "zone_type": "agricultural",
  "area_ha": 450,
  "latitude": 30.3372,
  "longitude": -9.4988,
  "critical_level": 3.50
}
```

---

### Measurements (Mesures)

| Méthode | Route | Rôle requis | Description |
|---|---|---|---|
| POST | `/api/measurements/water-level` | admin, operator | Insérer mesure niveau eau |
| POST | `/api/measurements/rain` | admin, operator | Insérer mesure pluie |
| GET | `/api/measurements/water-level/zone/:id` | tous | Historique niveau par zone |
| GET | `/api/measurements/rain/zone/:id` | tous | Historique pluie par zone |

**Body POST water-level :**
```json
{
  "sensor_id": 1,
  "water_level_m": 2.5
}
```
> ⚠️ `water_level_m` doit être entre **0 et 20 mètres**

**Body POST rain :**
```json
{
  "sensor_id": 2,
  "rain_mm": 45.0
}
```
> ⚠️ `rain_mm` doit être entre **0 et 500 mm**

---

### Risk Indices (Indices de risque)

| Méthode | Route | Rôle requis | Description |
|---|---|---|---|
| POST | `/api/risk/zone/:id/calculate` | admin, operator | Lancer le calcul |
| GET | `/api/risk/zone/:id` | tous | Historique des indices |
| GET | `/api/risk/zone/:id/trend` | tous | Tendance du risque |

**Paramètres GET trend :**
```
?start_date=2026-03-01&end_date=2026-03-16
```

---

### Alerts (Alertes)

| Méthode | Route | Rôle requis | Description |
|---|---|---|---|
| GET | `/api/alerts/active` | tous | Alertes actives uniquement |
| GET | `/api/alerts` | tous | Toutes les alertes |
| GET | `/api/alerts/zone/:id` | tous | Alertes d'une zone |
| PATCH | `/api/alerts/:id/resolve` | admin, operator, security | Résoudre une alerte |

---

### Dashboard

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/dashboard/overview` | Toutes zones + état risque + alertes |
| GET | `/api/dashboard/stats` | Compteurs globaux |
| GET | `/health` | Health check |

---

## RBAC — Permissions par rôle

| Ressource | Admin | Operator | Reader | Security |
|---|---|---|---|---|
| zones | CRUD | R | R | R |
| sensors | CRUD | R+U | R | R |
| measurements | R+C+D | R+C | R | R |
| alerts | CRUD | R+U | R | R+U |
| risk_indices | R+C | R+C | R | R |
| dashboard | R | R | R | R |

---

## Tests
```bash
# Lancer tous les tests
npm test

# Avec couverture de code
npm test -- --coverage
```

### Scénarios QA implémentés

| Test | Fichier | Résultat attendu |
|---|---|---|
| Insertion -50m niveau eau | measurements.service.test.js | Rejet d'exception |
| Insertion -10mm pluie | measurements.service.test.js | Rejet d'exception |
| Calcul tendance risque | risk-indices.service.test.js | string (increasing/decreasing/stable) |
| Temps réponse alertes actives | alerts.routes.test.js | < 1000ms |

---

## Scripts et Seeds
Note : Les scripts obsolètes à la racine ont été nettoyés pour garantir une *Clean Architecture*. Pour populer la base de données, utiliser les fichiers SQL présents dans `database/seed/`.

---

## Logs

Les logs sont écrits dans `logs/` :
```
logs/app.log      → tous les logs (INFO + ERROR)
logs/error.log    → erreurs uniquement
```