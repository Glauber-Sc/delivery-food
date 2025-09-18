const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../utils/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { generateCategoryId } = require('../utils/id');

const router = express.Router();

// Get all categories
router.get('/', (req, res) => {
  try {
    const categories = db.findAll('categories')
      .filter(cat => cat.ativa)
      .sort((a, b) => a.ordem - b.ordem);
    
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// Get category by ID
router.get('/:id', (req, res) => {
  try {
    const category = db.findById('categories', req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Erro ao buscar categoria' });
  }
});

// Create category (admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('ordem').isInt({ min: 1 }).withMessage('Ordem deve ser um número positivo')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, ordem } = req.body;
    
    const newCategory = {
      id: generateCategoryId(),
      nome,
      ordem,
      ativa: true
    };

    db.create('categories', newCategory);
    res.status(201).json(newCategory);

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
});

// Update category (admin only)
router.put('/:id', authenticateToken, requireAdmin, [
  body('nome').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('ordem').optional().isInt({ min: 1 }).withMessage('Ordem deve ser um número positivo'),
  body('ativa').optional().isBoolean().withMessage('Ativa deve ser boolean')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedCategory = db.update('categories', req.params.id, req.body);
    
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    res.json(updatedCategory);

  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
});

// Delete category (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const success = db.delete('categories', req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    res.json({ message: 'Categoria removida com sucesso' });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Erro ao remover categoria' });
  }
});

module.exports = router;