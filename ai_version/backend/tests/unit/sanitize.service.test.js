// =============================================================
// Projet : Oued-Souss Alert
// Fichier : tests/unit/sanitize.test.js
// Description : Tests unitaires des utilitaires de sanitisation
// Spec : Protection anti-injection SQL
// =============================================================

const { sanitizeId, sanitizeNumeric } = require('../../src/utils/sanitize');

describe('sanitize utils', () => {

  describe('sanitizeId', () => {

    it('doit retourner un entier valide', () => {
      expect(sanitizeId('5')).toBe(5);
      expect(sanitizeId(10)).toBe(10);
    });

    it('doit rejeter un ID non numérique (tentative injection)', () => {
      expect(() => sanitizeId('abc')).toThrow('ID invalide');
      expect(() => sanitizeId("1; DROP TABLE zones;--")).toThrow('ID invalide');
      expect(() => sanitizeId('')).toThrow('ID invalide');
    });

    it('doit rejeter un ID négatif ou nul', () => {
      expect(() => sanitizeId(-1)).toThrow('ID invalide');
      expect(() => sanitizeId(0)).toThrow('ID invalide');
    });

  });

  describe('sanitizeNumeric', () => {

    it('doit retourner la valeur si dans l\'intervalle', () => {
      expect(sanitizeNumeric(2.5, 0, 20)).toBe(2.5);
      expect(sanitizeNumeric(0,   0, 20)).toBe(0);
      expect(sanitizeNumeric(20,  0, 20)).toBe(20);
    });

    it('doit rejeter une valeur hors intervalle', () => {
      expect(() => sanitizeNumeric(-1,  0, 20)).toThrow('hors intervalle');
      expect(() => sanitizeNumeric(21,  0, 20)).toThrow('hors intervalle');
      expect(() => sanitizeNumeric(600, 0, 500)).toThrow('hors intervalle');
    });

  });

});