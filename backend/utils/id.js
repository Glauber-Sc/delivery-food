const { v4: uuidv4 } = require('uuid');

function generateId(prefix = '') {
  const id = uuidv4().replace(/-/g, '').substring(0, 8);
  return prefix ? `${prefix}_${id}` : id;
}

function generateOrderId() {
  return generateId('ord');
}

function generateProductId() {
  return generateId('prod');
}

function generateCategoryId() {
  return generateId('cat');
}

function generateUserId() {
  return generateId('user');
}

module.exports = {
  generateId,
  generateOrderId,
  generateProductId,
  generateCategoryId,
  generateUserId
};