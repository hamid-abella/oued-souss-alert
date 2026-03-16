// =============================================================
// Projet : Oued-Souss Alert
// Fichier : tests/unit/indices.service.test.js
// Description : Tests unitaires du service indices de risque
// Spec : Comparaison IA vs Manuel sur la précision du calcul
// =============================================================

const indicesService = require('../../src/services/indices.service');
const pool           = require('../../src/config/db');

jest.mock('../../src/config/db');

describe('indices.service', () => {

  afterEach(() => jest.clearAllMocks());

  // -----------------------------------------------------------
  describe('calculateFloodRisk', () => {

    it('doit appeler la procédure stockée et retourner l\'indice calculé', async () => {
      const mockIndice = {
        indice_id:     10,
        zone_id:       1,
        valeur_indice: 0.85,
        niveau_risque: 'ELEVE',
        date_calcul:   new Date()
      };

      // Premier appel : CALL calculate_flood_risk (pas de retour)
      // Deuxième appel : SELECT dernier indice
      pool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [mockIndice] });

      const result = await indicesService.calculateFloodRisk(1);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(
        1, 'CALL calculate_flood_risk($1)', [1]
      );
      expect(result.niveau_risque).toBe('ELEVE');
      expect(result.valeur_indice).toBe(0.85);
    });

    it('doit propager l\'erreur si la procédure échoue', async () => {
      pool.query.mockRejectedValue(new Error('Zone introuvable'));
      await expect(indicesService.calculateFloodRisk(999)).rejects.toThrow('Zone introuvable');
    });

  });

  // -----------------------------------------------------------
  describe('getRiskTrend', () => {

    it('doit retourner tendance "augmentation" si indice_fin > indice_debut', async () => {
      pool.query.mockResolvedValue({
        rows: [{
          zone_id:      1,
          indice_debut: 0.3,
          indice_fin:   0.8,
          tendance:     'augmentation'
        }]
      });

      const result = await indicesService.getRiskTrend(
        1,
        '2026-03-01',
        '2026-03-16'
      );

      expect(result.tendance).toBe('augmentation');
    });

    it('doit retourner tendance "diminution" si indice_fin < indice_debut', async () => {
      pool.query.mockResolvedValue({
        rows: [{
          zone_id:      1,
          indice_debut: 0.9,
          indice_fin:   0.2,
          tendance:     'diminution'
        }]
      });

      const result = await indicesService.getRiskTrend(1, '2026-03-01', '2026-03-16');
      expect(result.tendance).toBe('diminution');
    });

    it('doit retourner tendance "stable" si indices égaux', async () => {
      pool.query.mockResolvedValue({
        rows: [{
          zone_id:      1,
          indice_debut: 0.5,
          indice_fin:   0.5,
          tendance:     'stable'
        }]
      });

      const result = await indicesService.getRiskTrend(1, '2026-03-01', '2026-03-16');
      expect(result.tendance).toBe('stable');
    });

  });

  // -----------------------------------------------------------
  describe('getIndicesByZone', () => {

    it('doit retourner l\'historique des indices d\'une zone', async () => {
      const mockIndices = [
        { indice_id: 3, valeur_indice: 0.9, niveau_risque: 'CRITIQUE' },
        { indice_id: 2, valeur_indice: 0.6, niveau_risque: 'ELEVE'    },
        { indice_id: 1, valeur_indice: 0.3, niveau_risque: 'FAIBLE'   },
      ];
      pool.query.mockResolvedValue({ rows: mockIndices });

      const result = await indicesService.getIndicesByZone(1, 30);
      expect(result).toHaveLength(3);
      expect(result[0].niveau_risque).toBe('CRITIQUE');
    });

  });

});