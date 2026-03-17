# 🎨 Frontend — Oued-Souss Alert

## Technologies

- **React** 18 + **Vite** 5
- **React Router DOM** 6 — navigation SPA
- **Axios** — appels API avec intercepteurs JWT
- **Recharts** — graphiques (LineChart, AreaChart)
- **React-Leaflet** — carte interactive
- **Lucide React** — icônes
- **date-fns** — formatage des dates en français

---

## Installation
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

> ⚠️ Le backend doit tourner sur `http://localhost:3000`

---

## Structure des fichiers
```
frontend/src/
├── api/                          # Appels HTTP par ressource
│   ├── axios.js                  # Instance Axios + intercepteurs JWT
│   ├── zones.api.js
│   ├── capteurs.api.js
│   ├── mesures.api.js
│   ├── alertes.api.js
│   ├── indices.api.js
│   └── dashboard.api.js
│
├── components/
│   ├── common/                   # Composants réutilisables
│   │   ├── Navbar.jsx            # Barre de navigation + badge alertes
│   │   ├── Sidebar.jsx           # Navigation latérale
│   │   ├── AlertBadge.jsx        # Compteur alertes animé
│   │   ├── RiskIndicator.jsx     # Badge niveau de risque coloré
│   │   └── LoadingSpinner.jsx    # Indicateur de chargement
│   ├── dashboard/
│   │   ├── StatsCard.jsx         # Carte statistique avec icône
│   │   ├── RiskMap.jsx           # Carte Leaflet Souss-Massa
│   │   ├── AlertsFeed.jsx        # Flux alertes avec résolution
│   │   └── RiskChart.jsx         # Graphique évolution indice
│   ├── zones/
│   │   ├── ZoneCard.jsx          # Carte zone avec données + risque
│   │   └── ZoneForm.jsx          # Formulaire création zone
│   ├── mesures/
│   │   ├── MesureForm.jsx        # Formulaire insertion mesure
│   │   └── MesureChart.jsx       # Graphique area niveau/pluie
│   └── alertes/
│       ├── AlerteCard.jsx        # Carte alerte individuelle
│       └── AlertesList.jsx       # Liste avec recherche + filtres
│
├── context/
│   ├── AuthContext.jsx           # JWT + rôle + can() RBAC
│   └── AlertContext.jsx          # Polling 30s alertes actives
│
├── hooks/
│   ├── useZones.js               # Fetch + CRUD zones
│   ├── useAlertes.js             # Fetch + résolution alertes
│   ├── useMesures.js             # Fetch + insertion mesures
│   └── useIndices.js             # Fetch + calcul indices
│
├── pages/
│   ├── LoginPage.jsx             # Connexion JWT + accès démo
│   ├── DashboardPage.jsx         # Vue principale
│   ├── ZonesPage.jsx             # Gestion zones
│   ├── AlertesPage.jsx           # Alertes + filtres statut
│   ├── MesuresPage.jsx           # Graphiques + formulaire
│   └── IndicesPage.jsx           # Calcul + historique
│
├── router/
│   └── AppRouter.jsx             # Routes + PrivateRoute + MainLayout
│
├── styles/
│   ├── theme.css                 # Variables CSS (couleurs, fonts, spacing)
│   └── globals.css               # Reset + styles globaux + animations
│
└── utils/
    └── formatters.js             # Dates, valeurs, couleurs, labels
```

---

## Thème visuel

Le frontend utilise un thème **industriel/nuit** cohérent :
```css
--color-bg:        #080e1a   /* fond nuit profonde */
--color-primary:   #1a7fe8   /* bleu électrique */
--color-faible:    #00c48c   /* vert sécurité */
--color-moyen:     #f5a623   /* ambre vigilance */
--color-eleve:     #f26b38   /* orange danger */
--color-critique:  #e8303a   /* rouge critique */

--font-display: 'Syne'             /* titres */
--font-body:    'Instrument Sans'  /* corps */
--font-mono:    'JetBrains Mono'   /* données */
```

---

## Authentification et RBAC

### Connexion
```javascript
// AuthContext expose :
const { user, login, logout, can, isAuth } = useAuth();

// Vérification permission
if (can('create')) { /* afficher bouton créer */ }
if (can('delete')) { /* afficher bouton supprimer */ }
```

### Comptes de démo

| Rôle | Email | Mot de passe | Permissions |
|---|---|---|---|
| Admin | admin@souss.ma | admin123 | Tout |
| Opérateur | oper@souss.ma | oper123 | Lecture + Insertion + Résolution |
| Lecteur | lecteur@souss.ma | lecteur123 | Lecture seule |
| Sécurité | securite@souss.ma | sec123 | Lecture + Résolution alertes |

---

## Alertes en temps réel
```javascript
// AlertContext — polling automatique toutes les 30 secondes
const { alertes, loading, refresh } = useAlerts();

// Le badge dans Navbar se met à jour automatiquement
// Sans rechargement de page
```

---

## Carte interactive

La carte est centrée sur la région **Souss-Massa** avec :

- **Tuile sombre** CartoDB Dark Matter
- **Marqueurs colorés** selon le niveau de risque
  - 🟢 Petit cercle vert → FAIBLE
  - 🟡 Cercle moyen jaune → MOYEN
  - 🟠 Cercle orange → ÉLEVÉ
  - 🔴 Grand cercle rouge → CRITIQUE
- **Popup au clic** avec détails de la zone

---

## Scripts disponibles
```bash
npm run dev      # Démarrage développement → http://localhost:5173
npm run build    # Build production → dist/
npm run preview  # Prévisualiser le build
```

---

## Problèmes fréquents

**Carte Leaflet blanche :**
```bash
npm install leaflet react-leaflet
# Vérifier que globals.css importe bien theme.css
```

**Erreur CORS :**
```
Vérifier vite.config.js → proxy /api → http://localhost:3000
Vérifier que le backend tourne bien
```

**Token expiré :**
```
Se déconnecter via le bouton Déconnexion
Se reconnecter → nouveau token valide 8h
```

**Données vides :**
```bash
# Réinitialiser les données de test
psql -U postgres -d oued_souss_alert -f database/seed/mock_data.sql
```