const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../utils/db');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, senha } = req.body;

    // Find user
    const users = db.findAll('users');
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // For demo purposes, accept plain password "admin123"
    const isValidPassword = senha === 'admin123' || await bcrypt.compare(senha, user.senha);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, papel: user.papel },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        papel: user.papel
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get current user
router.get('/me', require('../middleware/auth').authenticateToken, (req, res) => {
  const user = db.findById('users', req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  res.json({
    id: user.id,
    email: user.email,
    nome: user.nome,
    papel: user.papel
  });
});

module.exports = router;