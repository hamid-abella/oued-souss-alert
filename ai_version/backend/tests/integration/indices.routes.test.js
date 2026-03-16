// =============================================================
// Projet : Oued-Souss Alert
// Fichier : tests/integration/indices.routes.test.js
// Description : Tests d'intégration du calcul d'indice de risque
// Spec : Comparaison IA vs Manuel sur la précision du calcul
// =============================================================

const request = require('supertest');
const app     = require('../../src/app');
const pool    = require('../../src/config/db');
const jwt     = require('jsonwebtoken');

jest.mock('../../src/config/db');

const tokenOperateur = jwt.sign(
  { id: 2, role: 'operateur', nom: 'Oper' },
  process.env.JWT_SECRET || 'test_secret'
);

describe('POST /api/indices/zone/:zoneId/calculate', () => {

  it('doit déclencher le calcul et retourner l\'indice', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [] }) // CALL calculate_flood_risk
      .mockResolvedValueOnce({             // SELECT dernier indice
        rows: [{
          indice_id:     5,
          zone_id:       1,
          valeur_indice: 0.75,
          niveau_risque: 'ELEVE'
        }]
      });

    const res = await request(app)
      .post('/api/indices/zone/1/calculate')
      .set('Authorization', `Bearer ${tokenOperateur}`);

    expect(res.status).toBe(201);
    expect(res.body.niveau_risque).toBe('ELEVE');
    expect(res.body.valeur_indice).toBe(0.75);
  });

  it('doit retourner 400 si zoneId invalide', async () => {
    const res = await request(app)
      .post('/api/indices/zone/abc/calculate')
      .set('Authorization', `Bearer ${tokenOperateur}`);

    expect(res.status).toBe(400);
  });

});

describe('GET /api/indices/zone/:zoneId/trend', () => {

  it('doit retourner la tendance du risque', async () => {
    pool.query.mockResolvedValue({
      rows: [{
        zone_id:      1,
        indice_debut: 0.3,
        indice_fin:   0.85,
        tendance:     'augmentation'
      }]
    });

    const res = await request(app)
      .get('/api/indices/zone/1/trend')
      .query({ date_debut: '2026-03-01', date_fin: '2026-03-16' })
      .set('Authorization', `Bearer ${tokenOperateur}`);

    expect(res.status).toBe(200);
    expect(res.body.tendance).toBe('augmentation');
  });

});