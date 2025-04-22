// server/utils/geoUtils.js
const geolib = require('geolib');

// Convert DMS (Degrees, Minutes, Seconds) to decimal degrees
const dmsToDecimal = (dms) => {
  // Expected format: "19°12'52.2\"N"
  const parts = dms.match(/(\d+)°(\d+)'([\d.]+)"([NSEW])/);
  if (!parts) return null;
  
  const degrees = parseFloat(parts[1]);
  const minutes = parseFloat(parts[2]);
  const seconds = parseFloat(parts[3]);
  const direction = parts[4];
  
  let decimal = degrees + (minutes / 60) + (seconds / 3600);
  
  // If south or west, make the coordinate negative
  if (direction === 'S' || direction === 'W') {
    decimal = -decimal;
  }
  
  return decimal;
};

module.exports = {
  dmsToDecimal
};