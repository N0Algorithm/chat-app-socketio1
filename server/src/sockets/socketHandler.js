const { Server } = require('socket.io');

// Track online users: Map socket.id -> { username, socketId }
const onlineUsers = new Map();

const initializeSocket = (server, clientUrl) => {
  const cleanClientUrl = (clientUrl || 'http://localhost:3000').replace(/\/$/, "");
  const allowedOrigins = [
    cleanClientUrl,
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];

  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/$/, "");
        if (allowedOrigins.includes(cleanOrigin) || cleanOrigin.includes('onrender.com') || process.env.NODE_ENV === 'production') {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
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

    socket.on('message:read', async ({ messageId, username }) => {
      if (!messageId || !username) return;
      try {
        const Message = require('../models/Message');
        const updatedMsg = await Message.findByIdAndUpdate(
          messageId,
          { $addToSet: { readBy: username } },
          { new: true }
        );
        if (updatedMsg) {
          io.emit('message:read_update', { messageId: updatedMsg._id, readBy: updatedMsg.readBy });
        }
      } catch (err) {
        console.error('Error updating read status:', err.message);
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
