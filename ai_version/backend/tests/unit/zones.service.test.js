// =============================================================
// Projet : Oued-Souss Alert
// Fichier : tests/unit/zones.service.test.js
// Description : Tests unitaires du service zones
// =============================================================

const zonesService = require('../../src/services/zones.service');
const pool         = require('../../src/config/db');

// Mock du pool PostgreSQL pour isoler les tests
jest.mock('../../src/config/db');

describe('zones.service', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // -----------------------------------------------------------
  describe('getAllZones', () => {

    it('doit retourner la liste de toutes les zones', async () => {
      const mockZones = [
        { zone_id: 1, nom: 'Zone Aït Melloul', niveau_risque: 'FAIBLE' },
        { zone_id: 2, nom: 'Zone Taroudant',   niveau_risque: 'MOYEN'  },
      ];
      pool.query.mockResolvedValue({ rows: mockZones });

      const result = await zonesService.getAllZones();

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0].nom).toBe('Zone Aït Melloul');
    });

    it('doit retourner un tableau vide si aucune zone', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await zonesService.getAllZones();
      expect(result).toEqual([]);
    });

  });

  // -----------------------------------------------------------
  describe('getZoneById', () => {

    it('doit retourner la zone correspondant à l\'ID', async () => {
      const mockZone = { zone_id: 1, nom: 'Zone Aït Melloul', seuil_critique: 3.5 };
      pool.query.mockResolvedValue({ rows: [mockZone] });

      const result = await zonesService.getZoneById(1);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM zones WHERE zone_id = $1',
        [1]
      );
      expect(result.zone_id).toBe(1);
    });

    it('doit retourner null si zone inexistante', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await zonesService.getZoneById(999);
      expect(result).toBeNull();
    });

  });

  // -----------------------------------------------------------
  describe('createZone', () => {

    it('doit créer une zone et retourner les données insérées', async () => {
      const newZone = {
        nom:            'Zone Test',
        type_zone:      'agricole',
        superficie:     100,
        latitude:       30.44,
        longitude:      -9.59,
        seuil_critique: 3.0
      };
      pool.query.mockResolvedValue({ rows: [{ zone_id: 6, ...newZone }] });

      const result = await zonesService.createZone(newZone);

      expect(result.zone_id).toBe(6);
      expect(result.nom).toBe('Zone Test');
    });

    it('doit propager l\'erreur si seuil_critique <= 0', async () => {
      pool.query.mockRejectedValue(new Error('CHECK constraint violation'));
      await expect(
        zonesService.createZone({ seuil_critique: -1 })
      ).rejects.toThrow('CHECK constraint violation');
    });

  });

  // -----------------------------------------------------------
  describe('deleteZone', () => {

    it('doit supprimer la zone et la retourner', async () => {
      pool.query.mockResolvedValue({ rows: [{ zone_id: 1, nom: 'Zone Aït Melloul' }] });
      const result = await zonesService.deleteZone(1);
      expect(result.zone_id).toBe(1);
    });

    it('doit retourner null si zone introuvable', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await zonesService.deleteZone(999);
      expect(result).toBeNull();
    });

  });

});