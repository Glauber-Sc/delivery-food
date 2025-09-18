const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../utils/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get settings
router.get('/', (req, res) => {
  try {
    const settings = db.getSettings();
    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Erro ao buscar configurações' });
  }
});

// Update settings (admin only)
router.put('/', authenticateToken, requireAdmin, [
  body('nomeLoja').optional().notEmpty().withMessage('Nome da loja não pode estar vazio'),
  body('taxaEntregaPadrao').optional().isFloat({ min: 0 }).withMessage('Taxa de entrega deve ser um número positivo'),
  body('raioEntregaKm').optional().isFloat({ min: 0 }).withMessage('Raio de entrega deve ser um número positivo'),
  body('tempoMedioPreparoMin').optional().isInt({ min: 1 }).withMessage('Tempo de preparo deve ser um número positivo')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Convert numeric fields
    if (req.body.taxaEntregaPadrao) {
      req.body.taxaEntregaPadrao = parseFloat(req.body.taxaEntregaPadrao);
    }
    if (req.body.raioEntregaKm) {
      req.body.raioEntregaKm = parseFloat(req.body.raioEntregaKm);
    }
    if (req.body.tempoMedioPreparoMin) {
      req.body.tempoMedioPreparoMin = parseInt(req.body.tempoMedioPreparoMin);
    }

    const updatedSettings = db.updateSettings(req.body);
    res.json(updatedSettings);

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Erro ao atualizar configurações' });
  }
});

module.exports = router;