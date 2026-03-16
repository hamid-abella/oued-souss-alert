// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/routes/zones.routes.js
// =============================================================

const router              = require('express').Router();
const zonesController     = require('../controllers/zones.controller');
const { authorizeRole }   = require('../middleware/auth');
const { body }            = require('express-validator');
const validate            = require('../middleware/validate');

// Validation des données d'entrée (anti-injection SQL)
const zoneValidation = [
  body('nom').isString().trim().notEmpty(),
  body('type_zone').isIn(['agricole', 'urbaine', 'mixte']),
  body('seuil_critique').isFloat({ min: 0.01 }),
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 }),
  validate
];

// GET /api/zones - Toutes les zones
router.get('/',
  authorizeRole('zones', 'read'),
  zonesController.getAll
);

// GET /api/zones/:id - Une zone
router.get('/:id',
  authorizeRole('zones', 'read'),
  zonesController.getById
);

// POST /api/zones - Créer une zone (admin seulement)
router.post('/',
  authorizeRole('zones', 'create'),
  zoneValidation,
  zonesController.create
);

// PUT /api/zones/:id - Modifier une zone (admin seulement)
router.put('/:id',
  authorizeRole('zones', 'update'),
  zoneValidation,
  zonesController.update
);

// DELETE /api/zones/:id - Supprimer une zone (admin seulement)
router.delete('/:id',
  authorizeRole('zones', 'delete'),
  zonesController.remove
);

module.exports = router;