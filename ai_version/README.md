<div align="center">

# 🌊 Oued-Souss Alert

### Système de Surveillance et d'Alerte des Crues Agricoles

**Région Souss-Massa · Maroc**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

*Projet SIBD 2025-2026 · ENSIASD Taroudant · Pr. S. EL-ATEIF*

</div>

---

## 📋 Table des Matières

- [Vue d'ensemble](#-vue-densemble)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation rapide](#-installation-rapide)
- [Structure du projet](#-structure-du-projet)
- [Base de données](#-base-de-données)
- [Backend API](#-backend-api)
- [Frontend](#-frontend)
- [Tests](#-tests)
- [Sécurité](#-sécurité)
- [Équipe](#-équipe)

---

## 🎯 Vue d'ensemble

**Oued-Souss Alert** est un prototype de système d'information critique pour la surveillance
des crues agricoles dans la région Souss-Massa, développé conformément à la circulaire **FLCN 2026**.

### Fonctionnalités principales

| Fonctionnalité | Description |
|---|---|
| 🗺️ Carte interactive | Visualisation temps réel des zones à risque sur carte Leaflet |
| 📊 Calcul d'indice | Procédure stockée croisant niveau d'eau + historique pluies |
| 🔔 Alertes automatiques | Triggers PostgreSQL déclenchant des alertes si seuil critique dépassé |
| 🛡️ Sécurité RBAC | Contrôle d'accès basé sur les rôles (Admin, Opérateur, Lecteur, Sécurité) |
| 📈 Historique | Graphiques d'évolution des mesures et indices de risque |
| 🔄 Temps réel | Polling automatique toutes les 30 secondes sur les alertes actives |

### Niveaux de risque
```
🟢 FAIBLE    indice < 0.4   → Situation normale
🟡 MOYEN     indice < 0.7   → Vigilance recommandée
🟠 ÉLEVÉ     indice < 0.9   → Surveillance renforcée
🔴 CRITIQUE  indice ≥ 0.9   → Intervention immédiate
```

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────┐
│              FRONTEND  React + Vite                  │
│                   localhost:5173                     │
│                                                      │
│  Pages : Dashboard · Zones · Alertes                 │
│          Mesures · Indices                           │
│  Auth  : JWT + RBAC côté client                      │
│  Carte : Leaflet centré sur Souss-Massa              │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP/JSON + JWT
                       │ Proxy Vite → /api
┌──────────────────────▼──────────────────────────────┐
│              BACKEND  Node.js + Express              │
│                   localhost:3000                     │
│                                                      │
│  Middleware : JWT · RBAC · Validation · Rate Limit   │
│  Routes    : /auth · /zones · /capteurs              │
│              /mesures · /alertes · /indices          │
│              /dashboard                              │
└──────────────────────┬──────────────────────────────┘
                       │ SQL (pg pool)
┌──────────────────────▼──────────────────────────────┐
│              DATABASE  PostgreSQL                    │
│           oued_souss_alert                           │
│                                                      │
│  Tables    : zones · capteurs · mesures              │
│              indices_risque · alertes                │
│  Triggers  : validation · alerte · fermeture         │
│  Procédures: calculate_flood_risk · archive          │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Prérequis

| Outil | Version minimale | Vérification |
|---|---|---|
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| PostgreSQL | 14+ | `psql --version` |
| Git | 2.x | `git --version` |

---

## 🚀 Installation rapide

### 1. Cloner le repository
```bash
git clone https://github.com/votre-equipe/oued-souss-alert.git
cd oued-souss-alert
```

### 2. Initialiser la base de données
```bash
# Créer la base de données
psql -U postgres -c "CREATE DATABASE oued_souss_alert;"

# Initialiser toutes les tables, triggers, procédures et données
psql -U postgres -d oued_souss_alert -f database/init.sql
```

### 3. Configurer et démarrer le backend
```bash
cd backend
cp .env.example .env
# Éditer .env avec vos paramètres PostgreSQL
npm install
npm run dev
# → http://localhost:3000
```

### 4. Démarrer le frontend
```bash
# Dans un nouveau terminal
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### 5. Accéder à l'application

Ouvrez `http://localhost:5173` et connectez-vous avec un compte de démo :

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | admin@souss.ma | admin123 |
| Opérateur | oper@souss.ma | oper123 |
| Lecteur | reader@souss.ma | lecteur123 |
| Sécurité | security@souss.ma | sec123 |

---

## 📁 Structure du projet
```
oued-souss-alert/
│
├── 📂 database/                  # Base de données PostgreSQL
│   ├── schema/
│   │   ├── tables.sql            # Création des tables (3FN)
│   │   ├── constraints.sql       # Contraintes métier
│   │   └── indexes.sql           # Index de performance
│   ├── functions/                # Fonctions PL/pgSQL
│   ├── triggers/                 # Triggers automatiques
│   ├── procedures/               # Procédures stockées
│   ├── seed/
│   │   └── mock_data.sql         # Données de test réalistes
│   └── init.sql                  # Script d'initialisation complet
│
├── 📂 backend/                   # API Node.js + Express
│   ├── src/
│   │   ├── config/               # DB pool + RBAC roles
│   │   ├── controllers/          # Logique des routes
│   │   ├── middleware/           # JWT + RBAC + validation
│   │   ├── routes/               # Définition des endpoints
│   │   ├── services/             # Logique métier
│   │   └── utils/                # Logger + sanitize
│   ├── tests/
│   │   ├── unit/                 # Tests unitaires Jest
│   │   └── integration/          # Tests d'intégration Supertest
│   └── package.json
│
├── 📂 frontend/                  # Dashboard React + Vite
│   ├── src/
│   │   ├── api/                  # Appels Axios par ressource
│   │   ├── components/           # Composants réutilisables
│   │   ├── context/              # AuthContext + AlertContext
│   │   ├── hooks/                # Hooks personnalisés
│   │   ├── pages/                # Pages de l'application
│   │   ├── router/               # AppRouter + PrivateRoute
│   │   ├── styles/               # CSS variables + globals
│   │   └── utils/                # Formatters
│   └── package.json
│
└── README.md                     # Ce fichier
```

---

## 🗄️ Base de données

Voir [database/README.md](database/README.md) pour la documentation complète.

### Schéma simplifié
```
zones (1) ──< capteurs (1) ──< mesures_niveau_eau
                           ──< mesures_pluie
zones (1) ──< indices_risque
zones (1) ──< alertes
```

### Formule de calcul du risque
```
indice = (niveau_normalisé × 0.6) + (pluie_normalisée × 0.4)

où :
  niveau_normalisé = niveau_actuel / seuil_critique        [0, 1]
  pluie_normalisée = moyenne_pluie_7j / 150mm_max_region   [0, 1]

Poids : 60% niveau (indicateur direct) + 40% pluie (indicateur prédictif)
```

---

## 🔌 Backend API

Voir [backend/README.md](backend/README.md) pour la documentation complète.

### Endpoints principaux
```
POST   /api/auth/login                     Authentification JWT
GET    /api/dashboard/overview             Vue globale dashboard
GET    /api/zones                          Liste des zones
POST   /api/mesures/niveau                 Insérer mesure niveau eau
POST   /api/mesures/pluie                  Insérer mesure pluie
POST   /api/indices/zone/:id/calculate     Calculer indice de risque
GET    /api/alertes/actives                Alertes actives temps réel
PATCH  /api/alertes/:id/resolve            Résoudre une alerte
```

---

## 🎨 Frontend

Voir [frontend/README.md](frontend/README.md) pour la documentation complète.

### Pages

| Page | Route | Description |
|---|---|---|
| Dashboard | `/` | Carte + stats + alertes temps réel |
| Zones | `/zones` | Gestion des zones géographiques |
| Alertes | `/alertes` | Liste, filtres et résolution |
| Mesures | `/mesures` | Insertion et graphiques |
| Indices | `/indices` | Calcul et historique |

---

## 🧪 Tests
```bash
# Backend : lancer tous les tests
cd backend
npm test

# Avec rapport de couverture
npm test -- --coverage
```

### Résultats attendus
```
Test Suites : 9 passed
Tests       : 52 passed
Coverage    : ~71%
```

### Scénarios QA couverts

- ✅ Rejet valeur aberrante niveau eau (-50m)
- ✅ Rejet valeur aberrante pluie (-10mm)
- ✅ Temps de réponse alertes < 1 seconde
- ✅ Contrôle d'accès RBAC par rôle
- ✅ Protection injection SQL (sanitizeId)
- ✅ Calcul indice de risque correct

---

## 🔒 Sécurité

| Mécanisme | Description |
|---|---|
| JWT | Tokens expirés après 8h, vérifiés à chaque requête |
| RBAC | 4 rôles avec permissions granulaires par ressource |
| Anti-SQLi | Requêtes paramétrées + validation stricte des entrées |
| Rate Limiting | 500 req/15min globales, 1000 req/min pour les alertes |
| Helmet | Protection des headers HTTP |
| Triggers | Validation des données directement en base |

---

## 👥 Équipe

**Équipe 1 — Oued-Souss Alert**
*ENSIASD Taroudant · Promotion 2025-2026*

| Pôle | Membres |
|---|---|
| 🏗️ Architects | ABRARDI Mohamed, AGLAGAL Khadija, AHMITER Youssef |
| 🤖 Augmenteds | AISSAOUI Wissal, AIT OUARAB Ouissal, AIT-BELLA Abdelhamid |
| 🔴 Red Team | ABDALLI Fatima, AGHAD Ilham |
| 🔵 Blue Team | AHANNACH E. OUIAM, AIT EL HADJ Mohamed |
| ✅ QA Engineer | AIT HAMOU Fdila, AL MOWINA Saleh |

**Encadré par :** Pr. S. EL-ATEIF

---

## 📄 Licence

Ce projet est développé dans le cadre académique de l'ENSIASD Taroudant.