const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const settingsRoutes = require('./routes/settings');

// Import middleware
const errorHandler = require('./middleware/error');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5174", "http://localhost:5175"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:5175"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for images
app.use('/imgs', express.static(path.join(__dirname, 'public/imgs')));

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize sockets
require('./sockets')(io);

// Error handling middleware
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 PWA: http://localhost:5175`);
  console.log(`⚡ Admin: http://localhost:5174`);
});

module.exports = app;