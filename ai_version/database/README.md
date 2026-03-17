# 🗄️ Base de Données — Oued-Souss Alert

## Technologies

- **PostgreSQL** 14+
- **PL/pgSQL** pour les triggers et procédures stockées
- **Normalisation 3FN** respectée

---

## Installation
```bash
# Créer la base
psql -U postgres -c "CREATE DATABASE oued_souss_alert;"

# Initialiser (tables + triggers + procédures + données)
psql -U postgres -d oued_souss_alert -f init.sql
```

---

## Structure des fichiers
```
database/
├── init.sql                      # Point d'entrée — exécuter ce fichier
├── schema/
│   ├── tables.sql                # 6 tables principales + 2 tables archives
│   ├── constraints.sql           # Contraintes CHECK supplémentaires
│   └── indexes.sql               # 7 index de performance
├── functions/
│   ├── fn_check_valeurs_aberrantes.sql   # Validation niveau eau + pluie
│   ├── fn_trigger_alerte_critique.sql    # Génération alerte si CRITIQUE
│   ├── fn_update_niveau_alerte.sql       # Fermeture alerte si niveau baisse
│   └── fn_get_risk_trend.sql             # Analyse tendance du risque
├── triggers/
│   ├── trg_check_niveau_eau.sql  # BEFORE INSERT mesures_niveau_eau
│   ├── trg_check_pluie.sql       # BEFORE INSERT mesures_pluie
│   ├── trg_generate_alerte.sql   # AFTER INSERT indices_risque
│   └── trg_close_alerte.sql      # AFTER INSERT mesures_niveau_eau
├── procedures/
│   ├── calculate_flood_risk.sql  # Calcul indice de risque (0 à 1)
│   └── archive_old_measurements.sql  # Archivage anciennes mesures
└── seed/
    └── mock_data.sql             # 5 zones + capteurs + mesures de test
```

---

## Schéma des tables

### `zones`
| Colonne | Type | Description |
|---|---|---|
| zone_id | SERIAL PK | Identifiant unique |
| nom | VARCHAR(100) | Nom de la zone |
| type_zone | VARCHAR(50) | agricole / urbaine / mixte |
| superficie | DECIMAL(10,2) | Surface en hectares |
| latitude | DECIMAL(9,6) | Coordonnée GPS |
| longitude | DECIMAL(9,6) | Coordonnée GPS |
| seuil_critique | NUMERIC | Niveau d'eau en mètres déclenchant l'alerte |

### `capteurs`
| Colonne | Type | Description |
|---|---|---|
| capteur_id | SERIAL PK | Identifiant unique |
| zone_id | INTEGER FK | Zone associée |
| type_capteur | VARCHAR(50) | niveau_eau / pluie |
| date_installation | DATE | Date de mise en service |
| statut | VARCHAR(20) | actif / maintenance / hors_service |

### `mesures_niveau_eau`
| Colonne | Type | Description |
|---|---|---|
| mesure_id | SERIAL PK | Identifiant unique |
| capteur_id | INTEGER FK | Capteur ayant effectué la mesure |
| date_heure | TIMESTAMP | Date et heure exacte |
| niveau_eau | NUMERIC(5,2) | Valeur en mètres **[0, 20]** |

### `mesures_pluie`
| Colonne | Type | Description |
|---|---|---|
| mesure_id | SERIAL PK | Identifiant unique |
| capteur_id | INTEGER FK | Capteur ayant effectué la mesure |
| date_heure | TIMESTAMP | Date et heure exacte |
| pluie_mm | NUMERIC(5,2) | Quantité en millimètres **[0, 500]** |

### `indices_risque`
| Colonne | Type | Description |
|---|---|---|
| indice_id | SERIAL PK | Identifiant unique |
| zone_id | INTEGER FK | Zone analysée |
| date_calcul | TIMESTAMP | Date du calcul |
| valeur_indice | NUMERIC(5,2) | Indice normalisé **[0, 1]** |
| niveau_risque | VARCHAR(20) | FAIBLE / MOYEN / ELEVE / CRITIQUE |

### `alertes`
| Colonne | Type | Description |
|---|---|---|
| alerte_id | SERIAL PK | Identifiant unique |
| zone_id | INTEGER FK | Zone concernée |
| indice_id | INTEGER FK | Indice qui a déclenché l'alerte (nullable) |
| capteur_id | INTEGER FK | Capteur source (nullable) |
| date_alerte | TIMESTAMP | Date de génération |
| type_alerte | VARCHAR(50) | CRUE / PRECIPITATION_INTENSE / DEPASSEMENT_SEUIL |
| message | TEXT | Description de l'alerte |
| statut | VARCHAR(20) | ACTIVE / RESOLUE |

---

## Triggers

### `trg_check_niveau_eau`
```sql
-- Se déclenche : BEFORE INSERT ON mesures_niveau_eau
-- Rôle : rejette toute valeur hors [0, 20] mètres
-- Cas QA : capteur défaillant envoyant -50m → rejeté automatiquement
```

### `trg_check_pluie`
```sql
-- Se déclenche : BEFORE INSERT ON mesures_pluie
-- Rôle : rejette toute valeur hors [0, 500] mm
```

### `trg_generate_alerte`
```sql
-- Se déclenche : AFTER INSERT ON indices_risque
-- Rôle : crée une alerte si niveau_risque = 'CRITIQUE'
-- Inclut : traçabilité zone + indice + capteur
```

### `trg_close_alerte`
```sql
-- Se déclenche : AFTER INSERT ON mesures_niveau_eau
-- Rôle : résout les alertes actives si niveau < 50% du seuil
```

---

## Procédures stockées

### `calculate_flood_risk(p_zone_id INT)`

Calcule l'indice de risque de crue pour une zone donnée.
```sql
-- Appel
CALL calculate_flood_risk(1);

-- Formule
indice = (niveau_normalisé × 0.6) + (pluie_normalisée × 0.4)

-- Classification
indice ≥ 0.9  → CRITIQUE
indice ≥ 0.7  → ELEVE
indice ≥ 0.4  → MOYEN
indice <  0.4 → FAIBLE
```

### `archive_old_measurements(p_date_limite TIMESTAMP)`

Déplace les anciennes mesures vers les tables d'archive.
```sql
-- Appel : archiver les mesures de plus de 6 mois
CALL archive_old_measurements(NOW() - INTERVAL '6 months');
```

---

## Données de test

Le fichier `seed/mock_data.sql` contient :

- **5 zones** de la région Souss-Massa avec coordonnées GPS réelles
- **10 capteurs** (niveau eau + pluie par zone)
- **Mesures historiques** sur 7 jours avec scénario de crue pour Zone 1
- **Appels** à `calculate_flood_risk` pour générer indices et alertes
```bash
# Réinitialiser les données de test
psql -U postgres -d oued_souss_alert -f database/seed/mock_data.sql
```

---

## Requêtes utiles
```sql
-- État général du système
SELECT z.nom, ir.niveau_risque, ir.valeur_indice,
       COUNT(a.alerte_id) FILTER (WHERE a.statut = 'ACTIVE') AS alertes_actives
FROM zones z
LEFT JOIN indices_risque ir ON ir.zone_id = z.zone_id
LEFT JOIN alertes a ON a.zone_id = z.zone_id
GROUP BY z.nom, ir.niveau_risque, ir.valeur_indice
ORDER BY ir.valeur_indice DESC NULLS LAST;

-- Dernières alertes actives
SELECT z.nom, a.type_alerte, a.message, a.date_alerte
FROM alertes a JOIN zones z ON a.zone_id = z.zone_id
WHERE a.statut = 'ACTIVE'
ORDER BY a.date_alerte DESC;

-- Historique des mesures d'une zone
SELECT date_heure, niveau_eau
FROM mesures_niveau_eau m
JOIN capteurs c ON m.capteur_id = c.capteur_id
WHERE c.zone_id = 1
ORDER BY date_heure DESC
LIMIT 20;
```