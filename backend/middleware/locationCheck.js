// server/middleware/locationCheck.js
const geolib = require('geolib');

module.exports = function(req, res, next) {
  // Get location from request body
  const { latitude, longitude } = req.body;
  
  if (!latitude || !longitude) {
    return res.status(400).json({ msg: 'Location data is required' });
  }

  // Office location (from .env file)
  const officeLocation = {
    latitude: parseFloat(process.env.OFFICE_LATITUDE),
    longitude: parseFloat(process.env.OFFICE_LONGITUDE)
  };

  // Current user location
  const userLocation = {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude)
  };

  // Calculate distance in meters
  const distance = geolib.getDistance(userLocation, officeLocation);

  // Check if user is within allowed distance
  if (distance > parseFloat(process.env.MAX_DISTANCE_METERS)) {
    return res.status(403).json({ 
      msg: 'Login denied. You are not near the office location.',
      distance: distance,
      maxAllowed: parseFloat(process.env.MAX_DISTANCE_METERS)
    });
  }

  next();
};
