// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/utils/sanitize.js
// Description : Utilitaires de sanitisation des entrées
// Spec : Protection anti-injection SQL
// =============================================================

// Vérifie qu'un paramètre est un entier positif valide
const sanitizeId = (id) => {
  // Vérifier que la valeur est STRICTEMENT un entier (pas de caractères supplémentaires)
  const str = String(id).trim();

  // Regex : uniquement des chiffres, rien d'autre
  if (!/^\d+$/.test(str)) {
    throw new Error(`ID invalide : ${id}`);
  }

  const parsed = parseInt(str, 10);

  if (isNaN(parsed) || parsed <= 0) {
    throw new Error(`ID invalide : ${id}`);
  }

  return parsed;
};

// Vérifie qu'une valeur numérique est dans un intervalle
const sanitizeNumeric = (value, min, max) => {
  const parsed = parseFloat(value);
  if (isNaN(parsed) || parsed < min || parsed > max) {
    throw new Error(`Valeur ${value} hors intervalle [${min}, ${max}]`);
  }
  return parsed;
};

module.exports = { sanitizeId, sanitizeNumeric };