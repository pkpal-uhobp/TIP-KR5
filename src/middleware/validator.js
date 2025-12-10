/**
 * Custom middleware for validating timer requests
 */
function validateTimerData(req, res, next) {
  if (req.method === 'POST' || req.method === 'PUT') {
    const { name, duration } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ 
        error: 'Timer name is required and must be a non-empty string' 
      });
    }
    
    if (!duration || typeof duration !== 'number' || duration <= 0) {
      return res.status(400).json({ 
        error: 'Duration is required and must be a positive number' 
      });
    }
  }
  
  next();
}

module.exports = validateTimerData;
