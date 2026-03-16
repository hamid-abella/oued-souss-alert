-- =============================================================
-- Projet : Oued-Souss Alert
-- Fichier : functions/fn_check_valeurs_aberrantes.sql
-- Description : Fonctions de validation des données capteurs
--               Empêche l'insertion de valeurs physiquement impossibles
-- Tâche QA : Scénario capteur en panne (ex: -50m)
-- =============================================================

-- Fonction de validation du niveau d'eau
-- Intervalle réaliste : 0m (sec) à 20m (crue exceptionnelle Oued Souss)
CREATE OR REPLACE FUNCTION check_niveau_eau_valide()
RETURNS TRIGGER AS $$
BEGIN
    -- Rejet des valeurs aberrantes (ex: -50m envoyé par capteur défaillant)
    IF NEW.niveau_eau < 0 OR NEW.niveau_eau > 20 THEN
        RAISE EXCEPTION
            'Valeur niveau eau invalide: % m. Intervalle accepté: [0, 20]',
            NEW.niveau_eau;
    END IF;

    RETURN NEW; -- insertion autorisée
END;
$$ LANGUAGE plpgsql;


-- Fonction de validation de la quantité de pluie
-- Intervalle réaliste : 0mm à 500mm (max enregistré au Maroc)
CREATE OR REPLACE FUNCTION check_pluie_valide()
RETURNS TRIGGER AS $$
BEGIN
    -- Rejet des valeurs négatives ou physiquement impossibles
    IF NEW.pluie_mm < 0 OR NEW.pluie_mm > 500 THEN
        RAISE EXCEPTION
            'Valeur pluie invalide: % mm. Intervalle accepté: [0, 500]',
            NEW.pluie_mm;
    END IF;

    RETURN NEW; -- insertion autorisée
END;
$$ LANGUAGE plpgsql;