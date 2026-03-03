# Oued-Souss Alert - Database

Base de données PostgreSQL pour la surveillance des crues agricoles
dans la région Souss-Massa.

## Structure du dossier

database/
  - tables.sql       → Création des tables
  - constraints.sql  → Clés étrangères
  - indexes.sql      → Index pour optimisation
  - seed.sql         → Données de test
  - install.sql      → Script d’installation complet

---

## Prérequis

- PostgreSQL installé
- Accès à psql

---

## Installation complète

### 1️⃣ Cloner le projet

git clone https://github.com/hamid-abella/oued-souss-alert.git
cd oued-souss-alert

### 2️⃣ Créer la base

createdb -U postgres oued_souss_db

### 3️⃣ Installer la base

cd database
psql -U postgres -d oued_souss_db -f install.sql

---

## Architecture

- Modèle relationnel normalisé en 3FN
- Index optimisés pour requêtes temps réel
- Compatible dashboard et système d’alerte automatique

---

## Auteur

Projet Oued-Souss Alert