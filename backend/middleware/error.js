function errorHandler(err, req, res, next) {
  console.error('❌ Erro:', err);

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: err.details
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido'
    });
  }

  // Default error
  res.status(500).json({
    error: 'Erro interno do servidor'
  });
}

module.exports = errorHandler;