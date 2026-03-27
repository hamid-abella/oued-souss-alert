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
│   ├── tables.sql                # 7 tables principales + 2 tables archives
│   ├── constraints.sql           # Contraintes CHECK supplémentaires
│   └── indexes.sql               # Index de performance
├── functions/
│   ├── fn_check_outlier_values.sql   # Validation niveau eau + pluie
│   ├── fn_trigger_critical_alert.sql # Génération alerte si CRITICAL (anti-doublon)
│   ├── fn_update_alert_level.sql     # Fermeture alerte si niveau baisse
│   └── fn_get_risk_trend.sql         # Analyse tendance du risque
├── triggers/
│   ├── trg_check_water_level.sql         # BEFORE INSERT water_level_measurements
│   ├── trg_check_rain.sql                # BEFORE INSERT rain_measurements
│   ├── trg_generate_critical_alert.sql   # AFTER INSERT risk_indices
│   └── trg_close_alert.sql               # AFTER INSERT water_level_measurements
├── procedures/
│   ├── calculate_flood_risk.sql      # Calcul indice de risque (0 à 1)
│   └── archive_old_measurements.sql  # Archivage anciennes mesures
└── seed/
    └── seed_realistic.sql            # 5 zones + capteurs + mesures de test
```

---

## Schéma des tables

### `users`
| Colonne | Type | Description |
|---|---|---|
| user_id | SERIAL PK | Identifiant unique |
| name | VARCHAR(100) | Nom complet |
| email | VARCHAR(150) | Email unique |
| password | VARCHAR(255) | Mot de passe hashé (bcrypt) |
| role | VARCHAR(20) | admin / operator / reader / security |
| active | BOOLEAN | Compte actif (désactiver sans supprimer) |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de dernière modification |

### `zones`
| Colonne | Type | Description |
|---|---|---|
| zone_id | SERIAL PK | Identifiant unique |
| name | VARCHAR(100) | Nom de la zone |
| zone_type | VARCHAR(50) | agricultural / urban / mixed |
| area_ha | DECIMAL(10,2) | Surface en hectares |
| latitude | DECIMAL(9,6) | Coordonnée GPS |
| longitude | DECIMAL(9,6) | Coordonnée GPS |
| critical_level | NUMERIC | Niveau d'eau en mètres déclenchant l'alerte |

### `sensors`
| Colonne | Type | Description |
|---|---|---|
| sensor_id | SERIAL PK | Identifiant unique |
| zone_id | INTEGER FK | Zone associée |
| sensor_type | VARCHAR(50) | water_level / rain |
| installation_date | DATE | Date de mise en service |
| status | VARCHAR(20) | active / maintenance / offline |

### `water_level_measurements`
| Colonne | Type | Description |
|---|---|---|
| measurement_id | SERIAL PK | Identifiant unique |
| sensor_id | INTEGER FK | Capteur ayant effectué la mesure |
| timestamp | TIMESTAMP | Date et heure exacte |
| water_level_m | NUMERIC(5,2) | Valeur en mètres **[0, 20]** |

### `rain_measurements`
| Colonne | Type | Description |
|---|---|---|
| measurement_id | SERIAL PK | Identifiant unique |
| sensor_id | INTEGER FK | Capteur ayant effectué la mesure |
| timestamp | TIMESTAMP | Date et heure exacte |
| rain_mm | NUMERIC(5,2) | Quantité en millimètres **[0, 500]** |

### `risk_indices`
| Colonne | Type | Description |
|---|---|---|
| index_id | SERIAL PK | Identifiant unique |
| zone_id | INTEGER FK | Zone analysée |
| calculation_date | TIMESTAMP | Date du calcul |
| index_value | NUMERIC(5,2) | Indice normalisé **[0, 1]** |
| risk_level | VARCHAR(20) | LOW / MEDIUM / HIGH / CRITICAL |

### `alerts`
| Colonne | Type | Description |
|---|---|---|
| alert_id | SERIAL PK | Identifiant unique |
| zone_id | INTEGER FK | Zone concernée |
| index_id | INTEGER FK | Indice qui a déclenché l'alerte (nullable) |
| sensor_id | INTEGER FK | Capteur source (nullable) |
| alert_date | TIMESTAMP | Date de génération |
| alert_type | VARCHAR(50) | FLOOD / LEVEL_EXCEEDED / HEAVY_RAIN |
| message | TEXT | Description de l'alerte |
| status | VARCHAR(20) | ACTIVE / RESOLVED |

---

## Triggers

### `trg_check_water_level`
```sql
-- Se déclenche : BEFORE INSERT ON water_level_measurements
-- Rôle : rejette toute valeur hors [0, 20] mètres
-- Cas QA : capteur défaillant envoyant -50m → rejeté automatiquement
```

### `trg_check_rain`
```sql
-- Se déclenche : BEFORE INSERT ON rain_measurements
-- Rôle : rejette toute valeur hors [0, 500] mm
```

### `trg_generate_critical_alert`
```sql
-- Se déclenche : AFTER INSERT ON risk_indices
-- Rôle : crée une alerte si risk_level = 'CRITICAL'
-- Anti-doublon : vérifie qu'aucune alerte ACTIVE n'existe déjà pour la zone
-- Inclut : traçabilité zone + indice + capteur
```

### `trg_close_alert`
```sql
-- Se déclenche : AFTER INSERT ON water_level_measurements
-- Rôle : résout toutes les alertes actives de la zone si niveau < 50% du seuil
-- Note : la fermeture est zonale (tous les capteurs de la zone sont considérés)
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

-- Seuls les capteurs status = 'active' sont pris en compte
-- (aussi bien pour le niveau d'eau que pour les précipitations)

-- Classification
indice ≥ 0.9  → CRITICAL
indice ≥ 0.7  → HIGH
indice ≥ 0.4  → MEDIUM
indice <  0.4 → LOW
```

### `archive_old_measurements(p_cutoff_date TIMESTAMP)`

Déplace les anciennes mesures vers les tables d'archive.
```sql
-- Appel : archiver les mesures de plus de 6 mois
CALL archive_old_measurements(NOW() - INTERVAL '6 months');
```

Les tables d'archive (`water_level_measurements_archive`, `rain_measurements_archive`) ne
comportent pas de contraintes de clé étrangère, afin d'éviter des erreurs
d'intégrité si des capteurs ont été supprimés après la prise des mesures.

---

## Données de test

Le fichier `seed/seed_realistic.sql` contient :

- **5 zones** de la région Souss-Massa avec coordonnées GPS réelles
- **10 capteurs** (niveau eau + pluie par zone)
- **4 comptes utilisateurs** (admin, operator, reader, security)
- **Mesures historiques** sur 7 jours avec scénario de crue pour Zone 1
- **Mesures Zone 5** couvrant le scénario capteur pluie `offline`
- **Appels** à `calculate_flood_risk` pour générer indices et alertes

```bash
# Réinitialiser complètement les données de test
psql -U postgres -d oued_souss_alert -c "
TRUNCATE alerts, risk_indices, rain_measurements, water_level_measurements,
         sensors, zones, users RESTART IDENTITY CASCADE;"

psql -U postgres -d oued_souss_alert -f database/seed/seed_realistic.sql
```

> **Attention** : sans le `TRUNCATE` préalable, relancer `seed_realistic.sql`
> génère des doublons dans `risk_indices`. La protection anti-doublon de
> `generate_critical_alert()` empêche les doublons dans `alerts`, mais
> `risk_indices` reste additif.

---

## Requêtes utiles
```sql
-- État général du système
SELECT z.name, ir.risk_level, ir.index_value,
       COUNT(a.alert_id) FILTER (WHERE a.status = 'ACTIVE') AS alertes_actives
FROM zones z
LEFT JOIN risk_indices ir ON ir.zone_id = z.zone_id
LEFT JOIN alerts a ON a.zone_id = z.zone_id
GROUP BY z.name, ir.risk_level, ir.index_value
ORDER BY ir.index_value DESC NULLS LAST;

-- Dernières alertes actives
SELECT z.name AS zone_name, a.alert_type, a.message, a.alert_date
FROM alerts a JOIN zones z ON a.zone_id = z.zone_id
WHERE a.status = 'ACTIVE'
ORDER BY a.alert_date DESC;

-- Historique des mesures d'une zone
SELECT timestamp, water_level_m
FROM water_level_measurements m
JOIN sensors c ON m.sensor_id = c.sensor_id
WHERE c.zone_id = 1
ORDER BY timestamp DESC
LIMIT 20;

-- Tendance du risque sur une période
SELECT * FROM get_risk_trend(1, NOW() - INTERVAL '7 days', NOW());
```
