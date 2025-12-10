/**
 * Express Server - Countdown Timer Application
 * Main entry point for the application
 */

const express = require('express');
const path = require('path');
const logger = require('./src/middleware/logger');
const timerRoutes = require('./src/routes/timerRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - Custom logger
app.use(logger);

// Middleware - Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files serving
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/timers', timerRoutes);

// Root route - API info
app.get('/api', (req, res) => {
  res.json({
    name: 'Countdown Timer API',
    version: '1.0.0',
    description: 'Express.js API for managing countdown timers',
    endpoints: {
      'GET /api/timers': 'Get all timers (supports ?active=true/false)',
      'GET /api/timers/:id': 'Get timer by ID',
      'POST /api/timers': 'Create new timer (requires name and duration)',
      'PUT /api/timers/:id': 'Update timer',
      'DELETE /api/timers/:id': 'Delete timer',
      'DELETE /api/timers': 'Delete all timers'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API documentation available at http://localhost:${PORT}/api`);
  console.log(`🌐 Web interface available at http://localhost:${PORT}`);
});

module.exports = app;
