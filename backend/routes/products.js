const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../utils/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { generateProductId } = require('../utils/id');

const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  try {
    const { categoria, ativo } = req.query;
    let products = db.findAll('products');

    // Filter by category
    if (categoria) {
      products = products.filter(p => p.categoriaId === categoria);
    }

    // Filter by active status
    if (ativo !== undefined) {
      const isActive = ativo === 'true';
      products = products.filter(p => p.ativo === isActive);
    } else {
      // By default, only show active products for public endpoint
      if (!req.user) {
        products = products.filter(p => p.ativo);
      }
    }

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Get product by ID
router.get('/:id', (req, res) => {
  try {
    const product = db.findById('products', req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Only return active products for non-admin users
    if (!req.user && !product.ativo) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

// Create product (admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('descricao').notEmpty().withMessage('Descrição é obrigatória'),
  body('categoriaId').notEmpty().withMessage('Categoria é obrigatória'),
  body('precoBase').isFloat({ min: 0 }).withMessage('Preço deve ser um número positivo'),
  body('imagem').optional().isString()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, descricao, categoriaId, precoBase, imagem, perguntas } = req.body;
    
    // Verify category exists
    const category = db.findById('categories', categoriaId);
    if (!category) {
      return res.status(400).json({ error: 'Categoria não encontrada' });
    }

    const newProduct = {
      id: generateProductId(),
      nome,
      descricao,
      categoriaId,
      precoBase: parseFloat(precoBase),
      imagem: imagem || '/imgs/placeholder.jpg',
      ativo: true,
      perguntas: perguntas || []
    };

    db.create('products', newProduct);
    res.status(201).json(newProduct);

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// Update product (admin only)
router.put('/:id', authenticateToken, requireAdmin, [
  body('nome').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('descricao').optional().notEmpty().withMessage('Descrição não pode estar vazia'),
  body('precoBase').optional().isFloat({ min: 0 }).withMessage('Preço deve ser um número positivo'),
  body('ativo').optional().isBoolean().withMessage('Ativo deve ser boolean')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.body.precoBase) {
      req.body.precoBase = parseFloat(req.body.precoBase);
    }

    const updatedProduct = db.update('products', req.params.id, req.body);
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(updatedProduct);

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const success = db.delete('products', req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto removido com sucesso' });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Erro ao remover produto' });
  }
});

// Get product questions
router.get('/:id/questions', (req, res) => {
  try {
    const product = db.findById('products', req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(product.perguntas || []);
  } catch (error) {
    console.error('Get product questions error:', error);
    res.status(500).json({ error: 'Erro ao buscar perguntas do produto' });
  }
});

// Update product questions (admin only)
router.put('/:id/questions', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { perguntas } = req.body;
    
    if (!Array.isArray(perguntas)) {
      return res.status(400).json({ error: 'Perguntas deve ser um array' });
    }

    const updatedProduct = db.update('products', req.params.id, { perguntas });
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(updatedProduct.perguntas);

  } catch (error) {
    console.error('Update product questions error:', error);
    res.status(500).json({ error: 'Erro ao atualizar perguntas do produto' });
  }
});

module.exports = router;