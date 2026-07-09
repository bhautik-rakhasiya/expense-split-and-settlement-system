const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const groupRoutes = require('./routes/group.routes');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middleware/error.middleware');
const notFound = require('./middleware/notFound.middleware');

const app = express();

// ── Core Middleware ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(cors());

// ── Health Check ─────────────────────────────────────────────────────────────
app.get(['/', '/health'], (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running successfully',
    });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes);

// ── Error Handling (must be last) ────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
