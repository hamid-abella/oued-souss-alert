// =============================================================
// Project: Oued-Souss Alert
// File: tests/unit/zones.service.test.js
// Description: Unit tests for zones service
// =============================================================

const zonesService = require('../../src/services/zones.service');
const pool         = require('../../src/config/db');

jest.mock('../../src/config/db');

describe('zones.service', () => {

  afterEach(() => jest.clearAllMocks());

  describe('getAllZones', () => {
    it('should return a list of zones', async () => {
      const mockZones = [
        { zone_id: 1, name: 'Zone A', zone_type: 'agricultural' },
        { zone_id: 2, name: 'Zone B', zone_type: 'urban' },
      ];
      pool.query.mockResolvedValue({ rows: mockZones });

      const result = await zonesService.getAllZones();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Zone A');
      expect(pool.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('createZone', () => {
    it('should create a new zone', async () => {
      const mockZone = { zone_id: 1, name: 'Zone A', critical_level: 3.5 };
      pool.query.mockResolvedValue({ rows: [mockZone] });

      const data = { name: 'Zone A', zone_type: 'agricultural', critical_level: 3.5 };
      const result = await zonesService.createZone(data);

      expect(result.name).toBe('Zone A');
    });
  });

});
