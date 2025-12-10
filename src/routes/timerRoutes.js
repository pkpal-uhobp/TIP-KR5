/**
 * Timer Routes
 * Defines all API endpoints for timer management
 */

const express = require('express');
const router = express.Router();
const timerController = require('../controllers/timerController');
const validateTimerData = require('../middleware/validator');

// GET /api/timers - Get all timers (supports ?active=true/false query parameter)
router.get('/', timerController.getAllTimers);

// GET /api/timers/:id - Get a specific timer by ID
router.get('/:id', timerController.getTimerById);

// POST /api/timers - Create a new timer
router.post('/', validateTimerData, timerController.createTimer);

// PUT /api/timers/:id - Update a timer
router.put('/:id', validateTimerData, timerController.updateTimer);

// DELETE /api/timers/:id - Delete a specific timer
router.delete('/:id', timerController.deleteTimer);

// DELETE /api/timers - Delete all timers
router.delete('/', timerController.deleteAllTimers);

module.exports = router;
