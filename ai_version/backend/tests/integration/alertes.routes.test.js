// =============================================================
// Projet : Oued-Souss Alert
// Fichier : tests/integration/alertes.routes.test.js
// Description : Tests d'intégration des routes alertes
// Spec : Temps de réponse < 1 seconde pour les alertes critiques
// =============================================================

const request = require('supertest');
const app     = require('../../src/app');
const pool    = require('../../src/config/db');
const jwt     = require('jsonwebtoken');

jest.mock('../../src/config/db');

const tokenAdmin   = jwt.sign({ id: 1, role: 'admin',   nom: 'Admin'   }, process.env.JWT_SECRET || 'test_secret');
const tokenLecteur = jwt.sign({ id: 3, role: 'lecteur', nom: 'Lecteur' }, process.env.JWT_SECRET || 'test_secret');

describe('GET /api/alertes/actives', () => {

  it('doit retourner les alertes actives', async () => {
    pool.query.mockResolvedValue({
      rows: [
        { alerte_id: 1, statut: 'ACTIVE', type_alerte: 'CRUE', zone_nom: 'Aït Melloul' }
      ]
    });

    const res = await request(app)
      .get('/api/alertes/actives')
      .set('Authorization', `Bearer ${tokenLecteur}`);

    expect(res.status).toBe(200);
    expect(res.body[0].statut).toBe('ACTIVE');
  });

  it('QA : temps de réponse doit être < 1 seconde', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const start = Date.now();
    await request(app)
      .get('/api/alertes/actives')
      .set('Authorization', `Bearer ${tokenLecteur}`);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(1000); // spec : < 1 seconde
  });

});

describe('PATCH /api/alertes/:id/resolve', () => {

  it('doit résoudre une alerte (admin)', async () => {
    pool.query.mockResolvedValue({
      rows: [{ alerte_id: 1, statut: 'RESOLUE' }]
    });

    const res = await request(app)
      .patch('/api/alertes/1/resolve')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body.alerte.statut).toBe('RESOLUE');
  });

  it('doit retourner 404 si alerte introuvable', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const res = await request(app)
      .patch('/api/alertes/999/resolve')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(404);
  });

  it('doit retourner 403 si lecteur tente de résoudre', async () => {
    const res = await request(app)
      .patch('/api/alertes/1/resolve')
      .set('Authorization', `Bearer ${tokenLecteur}`);

    expect(res.status).toBe(403);
  });

});