// =============================================================
// Projet : Oued-Souss Alert
// Fichier : tests/unit/alertes.service.test.js
// Description : Tests unitaires du service alertes
// =============================================================

const alertesService = require('../../src/services/alertes.service');
const pool           = require('../../src/config/db');

jest.mock('../../src/config/db');

describe('alertes.service', () => {

  afterEach(() => jest.clearAllMocks());

  // -----------------------------------------------------------
  describe('getAlertesActives', () => {

    it('doit retourner uniquement les alertes actives', async () => {
      const mockAlertes = [
        { alerte_id: 1, statut: 'ACTIVE', type_alerte: 'CRUE', zone_nom: 'Aït Melloul' },
        { alerte_id: 2, statut: 'ACTIVE', type_alerte: 'CRUE', zone_nom: 'Taroudant'   },
      ];
      pool.query.mockResolvedValue({ rows: mockAlertes });

      const result = await alertesService.getAlertesActives();

      expect(result).toHaveLength(2);
      result.forEach(a => expect(a.statut).toBe('ACTIVE'));
    });

    it('doit retourner un tableau vide s\'il n\'y a pas d\'alertes actives', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await alertesService.getAlertesActives();
      expect(result).toEqual([]);
    });

  });

  // -----------------------------------------------------------
  describe('resolveAlerte', () => {

    it('doit résoudre une alerte existante', async () => {
      const mockAlerte = { alerte_id: 1, statut: 'RESOLUE' };
      pool.query.mockResolvedValue({ rows: [mockAlerte] });

      const result = await alertesService.resolveAlerte(1);

      expect(result.statut).toBe('RESOLUE');
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('RESOLUE'),
        [1]
      );
    });

    it('doit retourner null si alerte introuvable', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await alertesService.resolveAlerte(999);
      expect(result).toBeNull();
    });

  });

});