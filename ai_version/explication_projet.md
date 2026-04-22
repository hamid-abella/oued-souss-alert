# 🌊 Fiche de Présentation : Oued-Souss Alert

**Projet :** Système de Surveillance et d'Alerte des Crues Agricoles
**Région :** Souss-Massa, Maroc
**Cadre :** Circulaire FLCN 2026

Ce document est conçu pour t'aider à présenter et expliquer clairement ton projet à ton professeur. Il détaille l'objectif, le fonctionnement technique, et comment manipuler l'interface utilisateur.

---

## 1. 🎯 Objectif du Projet
**Oued-Souss Alert** est une application web en temps réel (un prototype) visant à surveiller les risques d'inondation dans les zones agricoles de la région Souss-Massa. 
À partir de capteurs virtuels (niveau d'eau et précipitations), le système calcule automatiquement des indices de risque et déclenche des alertes si les seuils critiques sont dépassés, permettant ainsi une intervention préventive.

---

## 2. 🏗️ L'Architecture Technique (Les 3 Tiers)
Le projet est bâti sur une architecture moderne, robuste et séparée en 3 couches distinctes :

1.  **La Base de Données (PostgreSQL) :** 
    Ce n'est pas un simple espace de stockage. C'est le **cerveau métier** du système. Elle utilise des fonctionnalités avancées (Triggers et Procédures Stockées) pour garantir l'intégrité absolue des données et réagir automatiquement aux changements de niveau d'eau.
2.  **Le Backend (Node.js + Express) :**
    C'est le pont (l'API) entre la base de données et l'interface. Il sécurise l'application (Tokens JWT), gère les droits d'accès (qui peut faire quoi) et expose les routes (ex: `/api/alertes`).
3.  **Le Frontend (React + Vite) :**
    C'est l'interface utilisateur (Dashboard) dynamique et en temps réel. Elle affiche la carte (avec la librairie *Leaflet*), et interroge le backend toutes les 30 secondes pour mettre à jour les données (polling) sans avoir besoin de rafraîchir la page.

---

## 3. 🧠 Le Cœur du Système : Comment le risque est-il calculé ?

Pour impressionner ton professeur, explique que la logique de décision est centralisée dans la **Base de données** via une **Procédure Stockée** (`calculate_flood_risk`).

**La Formule Mathématique :**
Le système combine deux facteurs pour obtenir un indice compris entre 0 et 1 :
*   **60%** du poids est donné au **Niveau d'eau actuel** (Indicateur Direct). On regarde le niveau de l'eau par rapport au *seuil critique* dangereux de la zone.
*   **40%** du poids est accordé aux **Précipitations de pluie** (Indicateur Prédictif).

**Les 4 Niveaux de Risque :**
*   🟢 **FAIBLE (Indice < 0.4)** → Situation normale.
*   🟡 **MOYEN (Indice < 0.7)** → Vigilance recommandée.
*   🟠 **ÉLEVÉ (Indice < 0.9)** → Surveillance renforcée.
*   🔴 **CRITIQUE (Indice ≥ 0.9)** → Danger, intervention immédiate ! (Génère une alerte)

---

## 4. ⚙️ L'Automatisation (Les Triggers)

Ton projet est "intelligent" grâce aux **Triggers** (déclencheurs) PostgreSQL :

1.  **Anti-Erreur :** Si un capteur défaillant envoie une valeur absurde (ex: *niveau d'eau de -50m*), un Trigger bloque l'insertion.
2.  **Alerte Instantanée :** Dès que le risque est calculé à "CRITIQUE", un Trigger crée **automatiquement** une alerte.
3.  **Urgence Absolue :** Même si on n'a pas encore calculé le risque global, si le niveau d'eau dépasse le seuil absolu de la zone, un Trigger lance instantanément une alerte d'urgence !
4.  **Auto-Résolution :** Si le niveau d'eau redescend sous la barre de sécurité (50% du seuil), le système "ferme" l'alerte de lui-même.

---

## 5. 💻 Comment utiliser le Dashboard (Frontend)

L'interface est taillée pour une salle de contrôle. Voici l'explication des menus :

### 🗺️ Accueil (Dashboard)
*   **Fonction :** C'est la vue globale pour le décideur.
*   **Que montrer :** La **Carte interactive** montrant la région de Souss-Massa. Les zones ont des points de couleurs (Vert, Jaune, Rouge). Montre aussi le flux des alertes récentes sur le côté, qui se met à jour tout seul.

### 📍 Zones
*   **Fonction :** Configurer les paramètres géographiques.
*   **Que montrer :** Comment tu crées une zone (agricole ou urbaine) et surtout comment tu définis pour chaque zone son **seuil critique de débordement** en mètres.

### 📊 Mesures (Les capteurs)
*   **Fonction :** Simuler la réception des données de terrain.
*   **Que montrer :** C'est ici que tu peux "injecter" manuellement le niveau de l'eau d'une zone et voir les graphiques de l'historique de cette zone.

### 📈 Indices
*   **Fonction :** L'interface manuelle de la procédure stockée.
*   **Que montrer :** Tu choisis une zone, et tu cliques sur calculer pour forcer l'évaluation du risque avec les dernières mesures. 

### 🔔 Alertes
*   **Fonction :** Le carnet des urgences de la région.
*   **Que montrer :** Liste complète des alertes. Tu peux montrer comment un membre de la sécurité peut venir ici et cliquer sur **Résoudre** une fois que l'équipe est intervenue.

---

## 6. 🔒 Rôles et Sécurité (RBAC)
C’est un excellent point technique à aborder. Il y a 4 rôles prévus, avec des droits stricts :
1.  **Administrateur** (`admin@souss.ma` / `admin123`) : Fait tout.
2.  **Opérateur** (`oper@souss.ma` / `oper123`) : Ne peut pas créer de zones, mais ajoute les mesures des capteurs et gère les alertes.
3.  **Sécurité** (`securite@souss.ma` / `sec123`) : Gère uniquement les alertes, impossible de fausser les données d'un capteur.
4.  **Lecteur** (`reader@souss.ma` / `lecteur123`) : Ne fait que regarder de manière transparente (Dashboards purs).

---

## 💡 Le "Scénario Parfait" pour ta démonstration :

Si tu as 2 minutes pour montrer le projet à ton professeur, fais exactement ceci :

1. Connecte-toi en **Administrateur**.
2. Montre le **Dashboard** ("Regardez Monsieur, la carte est verte, tout va bien").
3. Va dans l'onglet **Mesures** et ajoute une énorme valeur de *Niveau d'eau* pour une petite zone définie (ex: 15 mètres).
4. Va dans **Indices** et lance le calcul pour cette zone (Le "cerveau" s'active).
5. Retourne immédiatement sur le **Dashboard** : Montre à ton professeur que la zone sur la carte est passée au **Rouge**, et qu'une **Alerte Nouvelle** a surgi d'elle-même dans le panneau latéral grâce aux triggers.
6. Résous l'alerte pour finir la boucle.

*C'est la démonstration la plus impressionnante de l'intelligence de ton système !*
