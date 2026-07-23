// =============================================================
// Project: Oued-Souss Alert
// File: tests/unit/risk-indices.service.test.js
// Description: Unit tests for risk indices service
// QA Task: Risk trend calculation verification
// =============================================================

const riskIndicesService = require('../../src/services/risk-indices.service');
const pool               = require('../../src/config/db');

jest.mock('../../src/config/db');

describe('risk-indices.service', () => {

  afterEach(() => jest.clearAllMocks());

  // -----------------------------------------------------------
  describe('calculateRisk', () => {

    it('should calculate and return the new risk index', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ zone_id: 1 }] }) // check zone
        .mockResolvedValueOnce({ rows: [] })               // call procedure
        .mockResolvedValueOnce({ rows: [{ index_value: 0.85, risk_level: 'HIGH' }] }); // select result

      const result = await riskIndicesService.calculateRisk(1);

      expect(result.index_value).toBe(0.85);
      expect(result.risk_level).toBe('HIGH');
      expect(pool.query).toHaveBeenCalledTimes(3);
    });

    it('should return null if zone does not exist', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await riskIndicesService.calculateRisk(999);
      expect(result).toBeNull();
    });

  });

  // -----------------------------------------------------------
  describe('getTrend', () => {

    it('QA: should return the risk trend', async () => {
      const mockTrend = {
        zone_id: 1,
        trend: 'increasing',
        avg_index: 0.65
      };
      
      pool.query.mockResolvedValue({ rows: [mockTrend] });

      const result = await riskIndicesService.getTrend(1, '2026-03-01', '2026-03-15');

      expect(result.trend).toBe('increasing');
      expect(pool.query).toHaveBeenCalledTimes(1);
    });

  });

});
