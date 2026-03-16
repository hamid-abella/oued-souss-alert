// =============================================================
// Projet : Oued-Souss Alert
// Fichier : tests/integration/mesures.routes.test.js
// Description : Tests d'intégration des routes mesures
// Tâche QA : Scénarios capteur défaillant + données aberrantes
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
const tokenLecteur = jwt.sign(
  { id: 3, role: 'lecteur', nom: 'Lecteur' },
  process.env.JWT_SECRET || 'test_secret'
);

describe('POST /api/mesures/niveau', () => {

  it('doit insérer une mesure valide', async () => {
    pool.query.mockResolvedValue({
      rows: [{ mesure_id: 1, capteur_id: 1, niveau_eau: 2.5 }]
    });

    const res = await request(app)
      .post('/api/mesures/niveau')
      .set('Authorization', `Bearer ${tokenOperateur}`)
      .send({ capteur_id: 1, niveau_eau: 2.5 });

    expect(res.status).toBe(201);
    expect(res.body.niveau_eau).toBe(2.5);
  });

  it('QA : doit rejeter une valeur négative (-50m)', async () => {
    const res = await request(app)
      .post('/api/mesures/niveau')
      .set('Authorization', `Bearer ${tokenOperateur}`)
      .send({ capteur_id: 1, niveau_eau: -50 });

    // express-validator bloque avant même d'atteindre PostgreSQL
    expect(res.status).toBe(400);
  });

  it('QA : doit rejeter une valeur > 20m', async () => {
    const res = await request(app)
      .post('/api/mesures/niveau')
      .set('Authorization', `Bearer ${tokenOperateur}`)
      .send({ capteur_id: 1, niveau_eau: 25 });

    expect(res.status).toBe(400);
  });

  it('doit retourner 403 si rôle lecteur tente d\'insérer', async () => {
    const res = await request(app)
      .post('/api/mesures/niveau')
      .set('Authorization', `Bearer ${tokenLecteur}`)
      .send({ capteur_id: 1, niveau_eau: 2.5 });

    expect(res.status).toBe(403);
  });

});

describe('POST /api/mesures/pluie', () => {

  it('doit insérer une mesure de pluie valide', async () => {
    pool.query.mockResolvedValue({
      rows: [{ mesure_id: 1, capteur_id: 2, pluie_mm: 45.0 }]
    });

    const res = await request(app)
      .post('/api/mesures/pluie')
      .set('Authorization', `Bearer ${tokenOperateur}`)
      .send({ capteur_id: 2, pluie_mm: 45.0 });

    expect(res.status).toBe(201);
  });

  it('QA : doit rejeter une pluie négative', async () => {
    const res = await request(app)
      .post('/api/mesures/pluie')
      .set('Authorization', `Bearer ${tokenOperateur}`)
      .send({ capteur_id: 2, pluie_mm: -10 });

    expect(res.status).toBe(400);
  });

});