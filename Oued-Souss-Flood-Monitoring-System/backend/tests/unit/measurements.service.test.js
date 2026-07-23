// =============================================================
// Project: Oued-Souss Alert
// File: tests/unit/measurements.service.test.js
// Description: Unit tests for measurements service
// QA Task: Failing sensor scenario (e.g. -50m or -10mm)
// =============================================================

const measurementsService = require('../../src/services/measurements.service');
const pool                = require('../../src/config/db');

jest.mock('../../src/config/db');

describe('measurements.service', () => {

  afterEach(() => jest.clearAllMocks());

  // -----------------------------------------------------------
  describe('insertWaterLevel', () => {

    it('should insert a valid water level measurement', async () => {
      const mockMeasurement = { measurement_id: 1, sensor_id: 1, water_level_m: 2.5 };
      pool.query.mockResolvedValue({ rows: [mockMeasurement] });

      const result = await measurementsService.insertWaterLevel(1, 2.5);

      expect(result.water_level_m).toBe(2.5);
      expect(pool.query).toHaveBeenCalledTimes(1);
    });

    it('QA: should reject negative water level value (-50m => failing sensor)', async () => {
      // PostgreSQL trigger trg_check_water_level raises an exception
      pool.query.mockRejectedValue(
        new Error('Invalid water level value: -50 m. Allowed range: [0, 20]')
      );

      await expect(
        measurementsService.insertWaterLevel(1, -50)
      ).rejects.toThrow('Invalid water level value');
    });

    it('QA: should reject water level value > 20m', async () => {
      pool.query.mockRejectedValue(
        new Error('Invalid water level value: 25 m. Allowed range: [0, 20]')
      );

      await expect(
        measurementsService.insertWaterLevel(1, 25)
      ).rejects.toThrow('Invalid water level value');
    });

  });

  // -----------------------------------------------------------
  describe('insertRain', () => {

    it('should insert a valid rain measurement', async () => {
      const mockMeasurement = { measurement_id: 1, sensor_id: 2, rain_mm: 45.0 };
      pool.query.mockResolvedValue({ rows: [mockMeasurement] });

      const result = await measurementsService.insertRain(2, 45.0);
      expect(result.rain_mm).toBe(45.0);
    });

    it('QA: should reject negative rain value', async () => {
      pool.query.mockRejectedValue(
        new Error('Invalid rain value: -10 mm. Allowed range: [0, 500]')
      );

      await expect(
        measurementsService.insertRain(2, -10)
      ).rejects.toThrow('Invalid rain value');
    });

    it('QA: should reject rain value > 500mm', async () => {
      pool.query.mockRejectedValue(
        new Error('Invalid rain value: 600 mm. Allowed range: [0, 500]')
      );

      await expect(
        measurementsService.insertRain(2, 600)
      ).rejects.toThrow('Invalid rain value');
    });

  });

  // -----------------------------------------------------------
  describe('getWaterLevelByZone', () => {

    it('should return water level measurements for a zone', async () => {
      const mockMeasurements = [
        { measurement_id: 1, water_level_m: 2.5, zone_id: 1 },
        { measurement_id: 2, water_level_m: 3.0, zone_id: 1 },
      ];
      pool.query.mockResolvedValue({ rows: mockMeasurements });

      const result = await measurementsService.getWaterLevelByZone(1);
      expect(result).toHaveLength(2);
    });

  });

});
