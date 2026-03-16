// =============================================================
// Projet : Oued-Souss Alert
// Fichier : tests/integration/zones.routes.test.js
// Description : Tests d'intégration des routes zones
// =============================================================

const request = require('supertest');
const app     = require('../../src/app');
const pool    = require('../../src/config/db');
const jwt     = require('jsonwebtoken');

jest.mock('../../src/config/db');

// Générer des tokens de test pour chaque rôle
const tokenAdmin    = jwt.sign({ id: 1, role: 'admin',    nom: 'Admin'    }, process.env.JWT_SECRET || 'test_secret');
const tokenLecteur  = jwt.sign({ id: 3, role: 'lecteur',  nom: 'Lecteur'  }, process.env.JWT_SECRET || 'test_secret');
const tokenOperateur= jwt.sign({ id: 2, role: 'operateur',nom: 'Oper'     }, process.env.JWT_SECRET || 'test_secret');

describe('GET /api/zones', () => {

  it('doit retourner 401 sans token', async () => {
    const res = await request(app).get('/api/zones');
    expect(res.status).toBe(401);
  });

  it('doit retourner 200 avec token valide (lecteur)', async () => {
    pool.query.mockResolvedValue({ rows: [
      { zone_id: 1, nom: 'Zone Aït Melloul', niveau_risque: 'FAIBLE' }
    ]});

    const res = await request(app)
      .get('/api/zones')
      .set('Authorization', `Bearer ${tokenLecteur}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

});

describe('POST /api/zones', () => {

  const newZone = {
    nom:            'Nouvelle Zone',
    type_zone:      'agricole',
    superficie:     200,
    latitude:       30.44,
    longitude:      -9.59,
    seuil_critique: 3.5
  };

  it('doit retourner 403 si rôle lecteur tente de créer', async () => {
    const res = await request(app)
      .post('/api/zones')
      .set('Authorization', `Bearer ${tokenLecteur}`)
      .send(newZone);

    expect(res.status).toBe(403);
  });

  it('doit créer une zone si rôle admin', async () => {
    pool.query.mockResolvedValue({ rows: [{ zone_id: 6, ...newZone }] });

    const res = await request(app)
      .post('/api/zones')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send(newZone);

    expect(res.status).toBe(201);
    expect(res.body.nom).toBe('Nouvelle Zone');
  });

  it('doit retourner 400 si seuil_critique manquant', async () => {
    const res = await request(app)
      .post('/api/zones')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ nom: 'Zone Invalide', type_zone: 'agricole' });

    expect(res.status).toBe(400);
  });

});

describe('DELETE /api/zones/:id', () => {

  it('doit retourner 403 si rôle operateur tente de supprimer', async () => {
    const res = await request(app)
      .delete('/api/zones/1')
      .set('Authorization', `Bearer ${tokenOperateur}`);

    expect(res.status).toBe(403);
  });

  it('doit supprimer la zone si rôle admin', async () => {
    pool.query.mockResolvedValue({ rows: [{ zone_id: 1, nom: 'Zone Aït Melloul' }] });

    const res = await request(app)
      .delete('/api/zones/1')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
  });

  it('doit retourner 400 si ID invalide (tentative injection)', async () => {
    const res = await request(app)
      .delete('/api/zones/abc--injection')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(400);
  });

});