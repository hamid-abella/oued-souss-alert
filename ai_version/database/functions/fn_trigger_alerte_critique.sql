-- =============================================================
-- Projet : Oued-Souss Alert
-- Fichier : functions/fn_trigger_alerte_critique.sql
-- Description : Génération automatique d'alerte quand indice = CRITIQUE
--               Inclut traçabilité du capteur déclencheur
-- Correction : Vérification d'alerte active existante avant insertion
--              pour éviter les doublons lors d'appels successifs
-- =============================================================

CREATE OR REPLACE FUNCTION generate_alerte_critique()
RETURNS TRIGGER AS $$
DECLARE
    v_capteur_id INT;
BEGIN
    -- Vérifier si le niveau de risque calculé est critique
    IF NEW.niveau_risque = 'CRITIQUE' THEN

        -- Ne pas créer de doublon si une alerte ACTIVE existe déjà pour cette zone
        IF EXISTS (
            SELECT 1 FROM alertes
            WHERE zone_id = NEW.zone_id
              AND statut  = 'ACTIVE'
        ) THEN
            RETURN NEW; -- alerte déjà ouverte, rien à faire
        END IF;

        -- Récupérer le capteur de niveau d'eau le plus récent de cette zone
        -- pour assurer la traçabilité de l'alerte
        SELECT c.capteur_id INTO v_capteur_id
        FROM capteurs c
        JOIN mesures_niveau_eau m ON m.capteur_id = c.capteur_id
        WHERE c.zone_id = NEW.zone_id
          AND c.statut = 'actif'           -- uniquement capteurs actifs
        ORDER BY m.date_heure DESC
        LIMIT 1;

        -- Insérer l'alerte avec référence complète zone + indice + capteur
        INSERT INTO alertes (
            zone_id,
            indice_id,
            capteur_id,
            date_alerte,
            type_alerte,
            message,
            statut
        )
        VALUES (
            NEW.zone_id,
            NEW.indice_id,
            v_capteur_id,
            NOW(),
            'CRUE',
            FORMAT(
                'Risque critique de crue détecté. Zone: %s | Indice: %s | Capteur: %s',
                NEW.zone_id,
                NEW.valeur_indice,
                v_capteur_id
            ),
            'ACTIVE'
        );

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;