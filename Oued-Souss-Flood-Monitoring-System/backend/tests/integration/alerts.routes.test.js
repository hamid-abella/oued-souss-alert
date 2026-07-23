// =============================================================
// Project: Oued-Souss Alert
// File: tests/integration/alerts.routes.test.js
// Description: Integration tests for /api/alerts
// QA Task: Alert response time < 1000ms
// =============================================================

const request = require('supertest');
const app     = require('../../src/app');
const pool    = require('../../src/config/db');
const jwt     = require('jsonwebtoken');

jest.mock('../../src/config/db');

describe('Alerts Routes', () => {
  let token;

  beforeAll(() => {
    // Generate an admin token for testing
    token = jwt.sign(
      { user_id: 1, role: 'admin', email: 'admin@souss.ma' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
  });

  afterEach(() => jest.clearAllMocks());

  describe('GET /api/alerts/active', () => {
    it('QA: should return active alerts within 1000ms', async () => {
      const mockAlerts = [
        { alert_id: 1, status: 'ACTIVE', alert_type: 'FLOOD' },
      ];
      pool.query.mockResolvedValue({ rows: mockAlerts });

      const start = Date.now();
      const res = await request(app)
        .get('/api/alerts/active')
        .set('Authorization', `Bearer ${token}`);
      const duration = Date.now() - start;

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(duration).toBeLessThan(1000); // QA scenario
    });
  });

});
