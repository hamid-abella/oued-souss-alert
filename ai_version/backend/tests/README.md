# Tests - Oued-Souss Alert

## Structure
- `unit/`        : Tests unitaires des services et utilitaires
- `integration/` : Tests des routes API complètes

## Lancer les tests
npm test

## Scénarios QA couverts
- Insertion valeur aberrante niveau eau (-50m) → rejet par trigger
- Insertion valeur aberrante pluie (-10mm) → rejet par trigger
- Calcul indice de risque zone 1 → vérification classification
- Génération automatique alerte CRITIQUE → vérifier présence dans alertes
- Fermeture automatique alerte → niveau eau < 50% seuil
- Résolution manuelle alerte → PATCH /api/alertes/:id/resolve
- Accès sans token → 401
- Accès rôle lecteur sur DELETE → 403