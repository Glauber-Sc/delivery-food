const jwt = require('jsonwebtoken');
const db = require('../utils/db');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_aqui';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    // Verify user still exists
    const userExists = db.findById('users', user.id);
    if (!userExists) {
      return res.status(403).json({ error: 'Usuário não encontrado' });
    }

    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user.papel !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
  JWT_SECRET
};