/**
 * Timer Controller
 * Handles all business logic for countdown timers
 */

// In-memory storage for timers
let timers = [];
let nextId = 1;

/**
 * Get all timers
 */
const getAllTimers = (req, res) => {
  // Support query parameters for filtering
  const { active } = req.query;
  
  let result = timers;
  
  if (active !== undefined) {
    const isActive = active === 'true';
    const now = Date.now();
    result = timers.filter(timer => {
      const remaining = timer.endTime - now;
      return isActive ? remaining > 0 : remaining <= 0;
    });
  }
  
  res.json({
    success: true,
    count: result.length,
    data: result
  });
};

/**
 * Get a single timer by ID
 */
const getTimerById = (req, res) => {
  const { id } = req.params;
  const timer = timers.find(t => t.id === parseInt(id));
  
  if (!timer) {
    return res.status(404).json({
      success: false,
      error: `Timer with id ${id} not found`
    });
  }
  
  // Calculate remaining time
  const now = Date.now();
  const remaining = Math.max(0, timer.endTime - now);
  
  res.json({
    success: true,
    data: {
      ...timer,
      remainingTime: remaining,
      isActive: remaining > 0
    }
  });
};

/**
 * Create a new timer
 */
const createTimer = (req, res) => {
  const { name, duration } = req.body;
  
  const now = Date.now();
  const newTimer = {
    id: nextId++,
    name: name.trim(),
    duration: duration, // in seconds
    startTime: now,
    endTime: now + (duration * 1000),
    createdAt: new Date().toISOString()
  };
  
  timers.push(newTimer);
  
  res.status(201).json({
    success: true,
    message: 'Timer created successfully',
    data: newTimer
  });
};

/**
 * Update a timer
 */
const updateTimer = (req, res) => {
  const { id } = req.params;
  const { name, duration } = req.body;
  
  const timerIndex = timers.findIndex(t => t.id === parseInt(id));
  
  if (timerIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Timer with id ${id} not found`
    });
  }
  
  const now = Date.now();
  timers[timerIndex] = {
    ...timers[timerIndex],
    name: name.trim(),
    duration: duration,
    startTime: now,
    endTime: now + (duration * 1000),
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Timer updated successfully',
    data: timers[timerIndex]
  });
};

/**
 * Delete a timer
 */
const deleteTimer = (req, res) => {
  const { id } = req.params;
  const timerIndex = timers.findIndex(t => t.id === parseInt(id));
  
  if (timerIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Timer with id ${id} not found`
    });
  }
  
  const deletedTimer = timers.splice(timerIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Timer deleted successfully',
    data: deletedTimer
  });
};

/**
 * Delete all timers
 */
const deleteAllTimers = (req, res) => {
  const count = timers.length;
  timers = [];
  nextId = 1;
  
  res.json({
    success: true,
    message: `All ${count} timers deleted successfully`
  });
};

module.exports = {
  getAllTimers,
  getTimerById,
  createTimer,
  updateTimer,
  deleteTimer,
  deleteAllTimers
};
