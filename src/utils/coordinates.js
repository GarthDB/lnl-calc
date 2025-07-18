/**
 * Coordinate format utilities for parsing and converting between different formats
 */

export const CoordinateFormat = {
  DECIMAL_DEGREES: 'DD',
  DEGREES_DECIMAL_MINUTES: 'DDM', 
  DEGREES_MINUTES_SECONDS: 'DMS'
};

/**
 * Parse Decimal Degrees format
 * Examples: "32.30642° N 122.61458° W" or "+32.30642, -122.61458"
 */
export function parseDecimalDegrees(input) {
  try {
    // Remove extra spaces and normalize
    const cleaned = input.trim().replace(/\s+/g, ' ');
    
    // Pattern 1: "32.30642° N 122.61458° W"
    const dmsPattern = /^(-?\d+\.?\d*)°?\s*([NSEW])?\s+(-?\d+\.?\d*)°?\s*([NSEW])?$/i;
    const dmsMatch = cleaned.match(dmsPattern);
    
    if (dmsMatch) {
      let [, lat, latDir, lng, lngDir] = dmsMatch;
      let latitude = parseFloat(lat);
      let longitude = parseFloat(lng);
      
      // Apply direction modifiers
      if (latDir && latDir.toUpperCase() === 'S') latitude = -Math.abs(latitude);
      if (lngDir && lngDir.toUpperCase() === 'W') longitude = -Math.abs(longitude);
      
      return validateCoordinates(latitude, longitude);
    }
    
    // Pattern 2: "+32.30642, -122.61458" or "32.30642, -122.61458"
    const commaPattern = /^([+-]?\d+\.?\d*),?\s*([+-]?\d+\.?\d*)$/;
    const commaMatch = cleaned.match(commaPattern);
    
    if (commaMatch) {
      const latitude = parseFloat(commaMatch[1]);
      const longitude = parseFloat(commaMatch[2]);
      return validateCoordinates(latitude, longitude);
    }
    
    return { latitude: 0, longitude: 0, isValid: false, error: 'Invalid decimal degrees format' };
  } catch (e) {
    return { latitude: 0, longitude: 0, isValid: false, error: 'Parse error in decimal degrees' };
  }
}

/**
 * Parse Degrees and Decimal Minutes format
 * Example: "32° 18.385' N 122° 36.875' W"
 */
export function parseDegreesDecimalMinutes(input) {
  try {
    const cleaned = input.trim().replace(/\s+/g, ' ');
    
    // Pattern: "32° 18.385' N 122° 36.875' W"
    const ddmPattern = /^(-?\d+)°\s*(\d+\.?\d*)'?\s*([NSEW])?\s+(-?\d+)°\s*(\d+\.?\d*)'?\s*([NSEW])?$/i;
    const match = cleaned.match(ddmPattern);
    
    if (match) {
      let [, latDeg, latMin, latDir, lngDeg, lngMin, lngDir] = match;
      
      let latitude = parseInt(latDeg) + parseFloat(latMin) / 60;
      let longitude = parseInt(lngDeg) + parseFloat(lngMin) / 60;
      
      // Apply direction modifiers
      if (latDir && latDir.toUpperCase() === 'S') latitude = -Math.abs(latitude);
      if (lngDir && lngDir.toUpperCase() === 'W') longitude = -Math.abs(longitude);
      
      return validateCoordinates(latitude, longitude);
    }
    
    return { latitude: 0, longitude: 0, isValid: false, error: 'Invalid degrees decimal minutes format' };
  } catch (e) {
    return { latitude: 0, longitude: 0, isValid: false, error: 'Parse error in degrees decimal minutes' };
  }
}

/**
 * Parse Degrees, Minutes and Seconds format
 * Example: "32° 18' 23.1" N 122° 36' 52.5" W"
 */
export function parseDegreesMinutesSeconds(input) {
  try {
    const cleaned = input.trim().replace(/\s+/g, ' ');
    
    // Pattern: "32° 18' 23.1" N 122° 36' 52.5" W"
    const dmsPattern = /^(-?\d+)°\s*(\d+)'?\s*(\d+\.?\d*)"?\s*([NSEW])?\s+(-?\d+)°\s*(\d+)'?\s*(\d+\.?\d*)"?\s*([NSEW])?$/i;
    const match = cleaned.match(dmsPattern);
    
    if (match) {
      let [, latDeg, latMin, latSec, latDir, lngDeg, lngMin, lngSec, lngDir] = match;
      
      let latitude = parseInt(latDeg) + parseInt(latMin) / 60 + parseFloat(latSec) / 3600;
      let longitude = parseInt(lngDeg) + parseInt(lngMin) / 60 + parseFloat(lngSec) / 3600;
      
      // Apply direction modifiers
      if (latDir && latDir.toUpperCase() === 'S') latitude = -Math.abs(latitude);
      if (lngDir && lngDir.toUpperCase() === 'W') longitude = -Math.abs(longitude);
      
      return validateCoordinates(latitude, longitude);
    }
    
    return { latitude: 0, longitude: 0, isValid: false, error: 'Invalid degrees minutes seconds format' };
  } catch (e) {
    return { latitude: 0, longitude: 0, isValid: false, error: 'Parse error in degrees minutes seconds' };
  }
}

/**
 * Auto-detect coordinate format and parse accordingly
 */
export function parseCoordinates(input) {
  if (!input || input.trim() === '') {
    return { latitude: 0, longitude: 0, isValid: false, error: 'Empty input' };
  }
  
  const cleaned = input.trim();
  
  // Try to detect format based on content
  if (cleaned.includes('"')) {
    // Contains seconds indicator - likely DMS
    return parseDegreesMinutesSeconds(cleaned);
  } else if (cleaned.includes("'") && cleaned.includes('°')) {
    // Contains minutes and degrees but no seconds - likely DDM
    return parseDegreesDecimalMinutes(cleaned);
  } else {
    // Default to decimal degrees
    return parseDecimalDegrees(cleaned);
  }
}

/**
 * Convert decimal degrees to DMS format
 */
export function convertToDegreesMinutesSeconds(latitude, longitude) {
  const latComponents = decimalToDMS(Math.abs(latitude));
  const lngComponents = decimalToDMS(Math.abs(longitude));
  
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lngDir = longitude >= 0 ? 'E' : 'W';
  
  return `${latComponents.degrees}° ${latComponents.minutes}' ${latComponents.seconds.toFixed(1)}" ${latDir} ${lngComponents.degrees}° ${lngComponents.minutes}' ${lngComponents.seconds.toFixed(1)}" ${lngDir}`;
}

/**
 * Convert decimal degrees to DDM format
 */
export function convertToDegreesDecimalMinutes(latitude, longitude) {
  const latComponents = decimalToDDM(Math.abs(latitude));
  const lngComponents = decimalToDDM(Math.abs(longitude));
  
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lngDir = longitude >= 0 ? 'E' : 'W';
  
  return `${latComponents.degrees}° ${latComponents.minutes.toFixed(3)}' ${latDir} ${lngComponents.degrees}° ${lngComponents.minutes.toFixed(3)}' ${lngDir}`;
}

/**
 * Convert decimal degrees to DD format
 */
export function convertToDecimalDegrees(latitude, longitude) {
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lngDir = longitude >= 0 ? 'E' : 'W';
  
  return `${Math.abs(latitude).toFixed(5)}° ${latDir} ${Math.abs(longitude).toFixed(5)}° ${lngDir}`;
}

/**
 * Helper function to convert decimal degrees to DMS components
 */
function decimalToDMS(decimal) {
  const degrees = Math.floor(decimal);
  const minutesFloat = (decimal - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;
  
  return { degrees, minutes, seconds };
}

/**
 * Helper function to convert decimal degrees to DDM components  
 */
function decimalToDDM(decimal) {
  const degrees = Math.floor(decimal);
  const minutes = (decimal - degrees) * 60;
  
  return { degrees, minutes };
}

/**
 * Validate coordinate ranges
 */
function validateCoordinates(latitude, longitude) {
  if (isNaN(latitude) || isNaN(longitude)) {
    return { latitude: 0, longitude: 0, isValid: false, error: 'Invalid numeric values' };
  }
  
  if (latitude < -90 || latitude > 90) {
    return { latitude, longitude, isValid: false, error: 'Latitude must be between -90 and 90 degrees' };
  }
  
  if (longitude < -180 || longitude > 180) {
    return { latitude, longitude, isValid: false, error: 'Longitude must be between -180 and 180 degrees' };
  }
  
  return { latitude, longitude, isValid: true };
} 