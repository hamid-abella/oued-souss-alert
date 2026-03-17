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
│   │   └── roles.js          # Définition RBAC (rôles + permissions)
│   ├── controllers/          # Traitement des requêtes HTTP
│   │   ├── auth.controller.js
│   │   ├── zones.controller.js
│   │   ├── capteurs.controller.js
│   │   ├── mesures.controller.js
│   │   ├── alertes.controller.js
│   │   ├── indices.controller.js
│   │   └── dashboard.controller.js
│   ├── middleware/
│   │   ├── auth.js           # JWT + RBAC (authenticateJWT, authorizeRole)
│   │   ├── errorHandler.js   # Gestionnaire global des erreurs
│   │   └── validate.js       # Validation express-validator
│   ├── routes/               # Définition des endpoints
│   │   ├── auth.routes.js
│   │   ├── zones.routes.js
│   │   ├── capteurs.routes.js
│   │   ├── mesures.routes.js
│   │   ├── alertes.routes.js
│   │   ├── indices.routes.js
│   │   └── dashboard.routes.js
│   ├── services/             # Logique métier + requêtes SQL
│   │   ├── auth.service.js
│   │   ├── zones.service.js
│   │   ├── capteurs.service.js
│   │   ├── mesures.service.js
│   │   ├── alertes.service.js
│   │   ├── indices.service.js
│   │   └── dashboard.service.js
│   ├── utils/
│   │   ├── logger.js         # Winston (logs console + fichiers)
│   │   └── sanitize.js       # Protection anti-injection SQL
│   ├── app.js                # Configuration Express + middlewares
│   └── server.js             # Point d'entrée
├── tests/
│   ├── unit/                 # Tests unitaires des services
│   └── integration/          # Tests des routes HTTP
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
  "role": "admin",
  "nom": "Admin"
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
  "nom": "Zone Agricole Aït Melloul",
  "type_zone": "agricole",
  "superficie": 450,
  "latitude": 30.3372,
  "longitude": -9.4988,
  "seuil_critique": 3.50
}
```

---

### Mesures

| Méthode | Route | Rôle requis | Description |
|---|---|---|---|
| POST | `/api/mesures/niveau` | admin, operateur | Insérer mesure niveau eau |
| POST | `/api/mesures/pluie` | admin, operateur | Insérer mesure pluie |
| GET | `/api/mesures/niveau/zone/:id` | tous | Historique niveau par zone |
| GET | `/api/mesures/pluie/zone/:id` | tous | Historique pluie par zone |

**Body POST niveau :**
```json
{
  "capteur_id": 1,
  "niveau_eau": 2.5
}
```
> ⚠️ niveau_eau doit être entre **0 et 20 mètres**

**Body POST pluie :**
```json
{
  "capteur_id": 2,
  "pluie_mm": 45.0
}
```
> ⚠️ pluie_mm doit être entre **0 et 500 mm**

---

### Indices de risque

| Méthode | Route | Rôle requis | Description |
|---|---|---|---|
| POST | `/api/indices/zone/:id/calculate` | admin, operateur | Lancer le calcul |
| GET | `/api/indices/zone/:id` | tous | Historique des indices |
| GET | `/api/indices/zone/:id/trend` | tous | Tendance du risque |

**Paramètres GET trend :**
```
?date_debut=2026-03-01&date_fin=2026-03-16
```

---

### Alertes

| Méthode | Route | Rôle requis | Description |
|---|---|---|---|
| GET | `/api/alertes/actives` | tous | Alertes actives uniquement |
| GET | `/api/alertes` | tous | Toutes les alertes |
| GET | `/api/alertes/zone/:id` | tous | Alertes d'une zone |
| PATCH | `/api/alertes/:id/resolve` | admin, operateur, securite | Résoudre |

---

### Dashboard

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/dashboard/overview` | Toutes zones + état risque + alertes |
| GET | `/api/dashboard/stats` | Compteurs globaux |
| GET | `/health` | Health check |

---

## RBAC — Permissions par rôle

| Ressource | Admin | Opérateur | Lecteur | Sécurité |
|---|---|---|---|---|
| zones | CRUD | R | R | R |
| capteurs | CRUD | R+U | R | R |
| mesures | R+C+D | R+C | R | R |
| alertes | CRUD | R+U | R | R+U |
| indices | R+C | R+C | R | R |
| dashboard | R | R | R | R |

---

## Tests
```bash
# Lancer tous les tests
npm test

# Avec couverture de code
npm test -- --coverage

# Un fichier spécifique
npm test -- tests/unit/mesures.service.test.js

# Tests d'intégration uniquement
npm test -- tests/integration/
```

### Résultats
```
Test Suites : 9 passed
Tests       : 52 passed
Coverage    : ~71%
```

### Scénarios QA

| Test | Fichier | Résultat attendu |
|---|---|---|
| Insertion -50m niveau eau | mesures.service.test.js | Rejet 400 |
| Insertion -10mm pluie | mesures.service.test.js | Rejet 400 |
| Temps réponse alertes | alertes.routes.test.js | < 1000ms |
| Lecteur tente DELETE zone | zones.routes.test.js | 403 Forbidden |
| ID injection SQL | zones.routes.test.js | 400 Bad Request |
| Calcul tendance risque | indices.service.test.js | augmentation/stable/diminution |

---

## Logs

Les logs sont écrits dans `logs/` :
```
logs/app.log      → tous les logs (INFO + ERROR)
logs/error.log    → erreurs uniquement
```

Format :
```
[2026-03-16 14:30:22] INFO  : POST /api/mesures/niveau - IP: 127.0.0.1
[2026-03-16 14:30:22] ERROR : Valeur niveau eau invalide: -50
```