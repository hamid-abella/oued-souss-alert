# Rapport Red Team — Oued-Souss Alert
Date : 08/04/2026  
Testeurs :ABDALLI Fatima, AGHAD Ilham

## Test 1 — Data Injection
- Attaque : Injection de water_level_m = -50 → BLOQUÉ ✅
- Attaque : Injection de water_level_m = 9999 → BLOQUÉ ✅
- Attaque : Injection de water_level_m = 19.99 → ACCEPTÉ ⚠️

## Vulnérabilité trouvée 
- Valeur 19.99m acceptée car dans la plage (0-20)
- A déclenché une fausse alerte LEVEL_EXCEEDED
- Zone Agricole Ait Melloul — seuil réel : 3.50m

## Vulnérabilité 2 — Divulgation d'erreur SQL 
- URL : /api/alerts/actives
- Erreur exposée : "syntaxe en entrée invalide pour le type integer"
- Le serveur révèle la structure interne de la base de données