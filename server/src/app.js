const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
const cleanClientUrl = clientUrl.replace(/\/$/, "");

const allowedOrigins = [
  cleanClientUrl,
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, "");
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }
    // Fallback: if it's a render domain or we're on production, let's allow it to prevent blocking
    if (cleanOrigin.includes('onrender.com') || process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const messageRoutes = require('./routes/messageRoutes');

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/messages', messageRoutes);

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use(errorHandler);

module.exports = app;
