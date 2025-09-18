module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('🔌 Cliente conectado:', socket.id);

    // Join admin room for order updates
    socket.on('join:admin', () => {
      socket.join('admin');
      console.log('👨‍💼 Admin conectado:', socket.id);
    });

    // Join customer room for order tracking
    socket.on('join:order', (orderId) => {
      socket.join(`order:${orderId}`);
      console.log('📦 Cliente acompanhando pedido:', orderId);
    });

    // Leave rooms on disconnect
    socket.on('disconnect', () => {
      console.log('🔌 Cliente desconectado:', socket.id);
    });

    // Handle admin order status updates
    socket.on('order:status', (data) => {
      const { orderId, status } = data;
      
      // Broadcast to admin room
      socket.to('admin').emit('order:update', { orderId, status });
      
      // Broadcast to customer tracking this order
      socket.to(`order:${orderId}`).emit('order:status', { status });
      
      console.log(`📊 Status do pedido ${orderId} atualizado para: ${status}`);
    });
  });

  return io;
};