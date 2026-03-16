// =============================================================
// Projet : Oued-Souss Alert
// Fichier : tests/unit/mesures.service.test.js
// Description : Tests unitaires du service mesures
// Tâche QA : Scénario capteur défaillant (ex: -50m)
// =============================================================

const mesuresService = require('../../src/services/mesures.service');
const pool           = require('../../src/config/db');

jest.mock('../../src/config/db');

describe('mesures.service', () => {

  afterEach(() => jest.clearAllMocks());

  // -----------------------------------------------------------
  describe('insertMesureNiveauEau', () => {

    it('doit insérer une mesure valide de niveau d\'eau', async () => {
      const mockMesure = { mesure_id: 1, capteur_id: 1, niveau_eau: 2.5 };
      pool.query.mockResolvedValue({ rows: [mockMesure] });

      const result = await mesuresService.insertMesureNiveauEau(1, 2.5);

      expect(result.niveau_eau).toBe(2.5);
      expect(pool.query).toHaveBeenCalledTimes(1);
    });

    it('QA : doit rejeter une valeur négative (-50m => capteur défaillant)', async () => {
      // Le trigger PostgreSQL trg_check_niveau_eau lève une exception
      pool.query.mockRejectedValue(
        new Error('Valeur niveau eau invalide: -50 m. Intervalle accepté: [0, 20]')
      );

      await expect(
        mesuresService.insertMesureNiveauEau(1, -50)
      ).rejects.toThrow('Valeur niveau eau invalide');
    });

    it('QA : doit rejeter une valeur supérieure à 20m', async () => {
      pool.query.mockRejectedValue(
        new Error('Valeur niveau eau invalide: 25 m. Intervalle accepté: [0, 20]')
      );

      await expect(
        mesuresService.insertMesureNiveauEau(1, 25)
      ).rejects.toThrow('Valeur niveau eau invalide');
    });

  });

  // -----------------------------------------------------------
  describe('insertMesurePluie', () => {

    it('doit insérer une mesure valide de pluie', async () => {
      const mockMesure = { mesure_id: 1, capteur_id: 2, pluie_mm: 45.0 };
      pool.query.mockResolvedValue({ rows: [mockMesure] });

      const result = await mesuresService.insertMesurePluie(2, 45.0);
      expect(result.pluie_mm).toBe(45.0);
    });

    it('QA : doit rejeter une valeur de pluie négative', async () => {
      pool.query.mockRejectedValue(
        new Error('Valeur pluie invalide: -10 mm. Intervalle accepté: [0, 500]')
      );

      await expect(
        mesuresService.insertMesurePluie(2, -10)
      ).rejects.toThrow('Valeur pluie invalide');
    });

    it('QA : doit rejeter une valeur de pluie > 500mm', async () => {
      pool.query.mockRejectedValue(
        new Error('Valeur pluie invalide: 600 mm. Intervalle accepté: [0, 500]')
      );

      await expect(
        mesuresService.insertMesurePluie(2, 600)
      ).rejects.toThrow('Valeur pluie invalide');
    });

  });

  // -----------------------------------------------------------
  describe('getMesuresNiveauByZone', () => {

    it('doit retourner les mesures d\'une zone', async () => {
      const mockMesures = [
        { mesure_id: 1, niveau_eau: 2.5, zone_id: 1 },
        { mesure_id: 2, niveau_eau: 3.0, zone_id: 1 },
      ];
      pool.query.mockResolvedValue({ rows: mockMesures });

      const result = await mesuresService.getMesuresNiveauByZone(1, 50);
      expect(result).toHaveLength(2);
    });

  });

});