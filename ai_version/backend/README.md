# Oued-Souss Alert 2026

# Prérequis

Avant de commencer, installer :

* Node.js
* PostgreSQL
* Git

Vérifier les installations :

```
node -v
npm -v
psql --version
git --version
```

---

# Installation du projet

## 1 Cloner le projet

```
git clone https://github.com/hamid-abella/oued-souss-alert-2026.git
cd oued-souss-alert-2026
```

---

# Installation de la base de données

Créer la base PostgreSQL :

```
createdb -U postgres oued_souss_db
```

Installer la base :

```
cd database
psql -U postgres -d oued_souss_db -f init.sql
```

Le script `init.sql` installe :

* tables
* contraintes
* index
* fonctions
* triggers
* procedures
* données de test

---

# Installation du backend

Entrer dans le dossier backend :

```
cd backend
```

Installer les dépendances :

```
npm install
```

---

# Configuration des variables d’environnement

Créer le fichier `.env`

```
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=oued_souss_db
```

---

# Lancer le serveur

```
npm run dev
```

Le serveur démarre sur :

```
http://localhost:5000
```

---

# API disponibles

## Zones

```
GET /api/zones
POST /api/zones
```

---

## Capteurs

```
GET /api/sensors
POST /api/sensors
```

---

## Mesures

Simulation de capteurs :

```
POST /api/mesures/niveau
POST /api/mesures/pluie
```

---

## Risque

Calculer l’indice de risque :

```
POST /api/risque/calculate/:zone_id
```

Cette route appelle la procédure :

```
calculate_flood_risk
```

---

## Alertes

```
GET /api/alerts
GET /api/alerts/active
```

# Auteur

Projet universitaire
Oued-Souss Alert 2026
