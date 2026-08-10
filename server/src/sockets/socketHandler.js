const { Server } = require('socket.io');

// Track online users: Map socket.id -> { username, socketId }
const onlineUsers = new Map();

const initializeSocket = (server, clientUrl) => {
  const io = new Server(server, {
    cors: {
      origin: clientUrl || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('user:join', (username) => {
      if (!username || !username.trim()) return;

      const trimmedName = username.trim();
      onlineUsers.set(socket.id, { username: trimmedName, socketId: socket.id });

      const usersList = Array.from(onlineUsers.values()).map(u => u.username);
      io.emit('user:online', usersList);
    });

    socket.on('typing:start', () => {
      const user = onlineUsers.get(socket.id);
      if (user) {
        socket.broadcast.emit('typing:start', { username: user.username });
      }
    });

    socket.on('typing:stop', () => {
      const user = onlineUsers.get(socket.id);
      if (user) {
        socket.broadcast.emit('typing:stop', { username: user.username });
      }
    });

    socket.on('disconnect', () => {
      const user = onlineUsers.get(socket.id);
      if (user) {
        onlineUsers.delete(socket.id);

        const usersList = Array.from(onlineUsers.values()).map(u => u.username);
        io.emit('user:online', usersList);
        socket.broadcast.emit('user:offline', user.username);
      }
    });
  });

  return io;
};

module.exports = initializeSocket;
