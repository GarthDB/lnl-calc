// Simple inline calculator without complex imports
console.log('🚀 Simple calculator loading...');

// Inline coordinate parsing functions
function parseDecimalDegrees(input) {
  try {
    const cleaned = input.trim().replace(/\s+/g, ' ');
    
    // Pattern 1: "32.30642° N 122.61458° W"
    const dmsPattern = /^(-?\d+\.?\d*)°?\s*([NSEW])?\s+(-?\d+\.?\d*)°?\s*([NSEW])?$/i;
    const dmsMatch = cleaned.match(dmsPattern);
    
    if (dmsMatch) {
      let [, lat, latDir, lng, lngDir] = dmsMatch;
      let latitude = parseFloat(lat);
      let longitude = parseFloat(lng);
      
      if (latDir && latDir.toUpperCase() === 'S') latitude = -Math.abs(latitude);
      if (lngDir && lngDir.toUpperCase() === 'W') longitude = -Math.abs(longitude);
      
      return validateCoordinates(latitude, longitude);
    }
    
    // Pattern 2: "+32.30642, -122.61458"
    const commaPattern = /^([+-]?\d+\.?\d*),?\s*([+-]?\d+\.?\d*)$/;
    const commaMatch = cleaned.match(commaPattern);
    
    if (commaMatch) {
      const latitude = parseFloat(commaMatch[1]);
      const longitude = parseFloat(commaMatch[2]);
      return validateCoordinates(latitude, longitude);
    }
    
    return { isValid: false, error: 'Invalid decimal degrees format' };
  } catch (error) {
    return { isValid: false, error: 'Parse error: ' + error.message };
  }
}

function parseDegreesDecimalMinutes(input) {
  try {
    const cleaned = input.trim().replace(/\s+/g, ' ');
    const ddmPattern = /^(\d+)°?\s*(\d+\.?\d*)'?\s*([NSEW])?\s+(\d+)°?\s*(\d+\.?\d*)'?\s*([NSEW])?$/i;
    const match = cleaned.match(ddmPattern);
    
    if (!match) {
      return { isValid: false, error: 'Invalid DDM format' };
    }
    
    const [, latDeg, latMin, latDir, lngDeg, lngMin, lngDir] = match;
    
    let latitude = parseInt(latDeg) + parseFloat(latMin) / 60;
    let longitude = parseInt(lngDeg) + parseFloat(lngMin) / 60;
    
    if (latDir && latDir.toUpperCase() === 'S') latitude = -latitude;
    if (lngDir && lngDir.toUpperCase() === 'W') longitude = -longitude;
    
    return validateCoordinates(latitude, longitude);
  } catch (error) {
    return { isValid: false, error: 'Parse error: ' + error.message };
  }
}

function parseDegreesMinutesSeconds(input) {
  try {
    const cleaned = input.trim().replace(/\s+/g, ' ');
    const dmsPattern = /^(\d+)°?\s*(\d+)'?\s*(\d+\.?\d*)"?\s*([NSEW])?\s+(\d+)°?\s*(\d+)'?\s*(\d+\.?\d*)"?\s*([NSEW])?$/i;
    const match = cleaned.match(dmsPattern);
    
    if (!match) {
      return { isValid: false, error: 'Invalid DMS format' };
    }
    
    const [, latDeg, latMin, latSec, latDir, lngDeg, lngMin, lngSec, lngDir] = match;
    
    let latitude = parseInt(latDeg) + parseInt(latMin) / 60 + parseFloat(latSec) / 3600;
    let longitude = parseInt(lngDeg) + parseInt(lngMin) / 60 + parseFloat(lngSec) / 3600;
    
    if (latDir && latDir.toUpperCase() === 'S') latitude = -latitude;
    if (lngDir && lngDir.toUpperCase() === 'W') longitude = -longitude;
    
    return validateCoordinates(latitude, longitude);
  } catch (error) {
    return { isValid: false, error: 'Parse error: ' + error.message };
  }
}

function validateCoordinates(latitude, longitude) {
  if (latitude < -90 || latitude > 90) {
    return { isValid: false, error: 'Latitude must be between -90 and 90 degrees' };
  }
  if (longitude < -180 || longitude > 180) {
    return { isValid: false, error: 'Longitude must be between -180 and 180 degrees' };
  }
  return { isValid: true, latitude, longitude };
}

function parseCoordinates(input) {
  if (!input || input.trim() === '') {
    return { isValid: false, error: 'Empty input' };
  }

  // Try DMS first (most specific)
  if (input.includes('"') || (input.includes("'") && input.includes('°'))) {
    const result = parseDegreesMinutesSeconds(input);
    if (result.isValid) {
      result.format = 'DMS';
      return result;
    }
  }
  
  // Try DDM next
  if (input.includes("'") && input.includes('°')) {
    const result = parseDegreesDecimalMinutes(input);
    if (result.isValid) {
      result.format = 'DDM';
      return result;
    }
  }
  
  // Try DD last
  const result = parseDecimalDegrees(input);
  if (result.isValid) {
    result.format = 'DD';
    return result;
  }
  
  return { isValid: false, error: 'Unable to parse coordinates in any supported format' };
}

// Only define the web component if we're in a browser environment
if (typeof HTMLElement !== 'undefined') {
  // Web component class definition...
  class BasicCalculator extends HTMLElement {
    // ... rest of the component code remains the same
    constructor() {
      super();
      this.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p style="color: #666;">Enter coordinates in any format: DD, DDM, or DMS. Calculations appear automatically!</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
            <div>
              <label for="coord1" style="display: block; margin-bottom: 5px; font-weight: bold;">Coordinate 1:</label>
              <input type="text" id="coord1" placeholder="e.g., 37.7749° N 122.4194° W" 
                style="width: 100%; padding: 10px; border: 2px solid #ccc; border-radius: 4px; font-size: 14px; box-sizing: border-box;">
              <div id="coord1-status" style="margin-top: 5px; font-size: 12px; min-height: 16px;"></div>
            </div>
            
            <div>
              <label for="coord2" style="display: block; margin-bottom: 5px; font-weight: bold;">Coordinate 2:</label>
              <input type="text" id="coord2" placeholder="e.g., 40.7128° N 74.0060° W" 
                style="width: 100%; padding: 10px; border: 2px solid #ccc; border-radius: 4px; font-size: 14px; box-sizing: border-box;">
              <div id="coord2-status" style="margin-top: 5px; font-size: 12px; min-height: 16px;"></div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <button id="clear-btn" style="padding: 12px 24px; background: #6b6b6b; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
              Clear All
            </button>
          </div>
          
          <div id="results" style="display: none; margin-top: 20px; padding: 20px; background: #f9f9f9; border-radius: 4px; border-left: 4px solid #4CAF50;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Results</h3>
            <div id="calculation-results"></div>
          </div>
        </div>
      `;
    }

    connectedCallback() {
      const coord1Input = this.querySelector('#coord1');
      const coord2Input = this.querySelector('#coord2');
      const clearBtn = this.querySelector('#clear-btn');

      coord1Input.addEventListener('input', () => this.validateInput('coord1'));
      coord2Input.addEventListener('input', () => this.validateInput('coord2'));
      clearBtn.addEventListener('click', () => this.clearAll());
    }

    validateInput(coordId) {
      const input = this.querySelector(`#${coordId}`);
      const status = this.querySelector(`#${coordId}-status`);
      const value = input.value.trim();

      if (!value) {
        input.style.borderColor = '#ccc';
        status.innerHTML = '';
        this.querySelector('#results').style.display = 'none';
        return;
      }

      const result = parseCoordinates(value);
      
      if (result.isValid) {
        input.style.borderColor = '#4CAF50';
        status.innerHTML = `<span style="color: #4CAF50;">✅ ${result.format} format detected</span>`;
        this.checkAndAutoCalculate();
      } else {
        input.style.borderColor = '#f44336';
        status.innerHTML = `<span style="color: #f44336;">❌ ${result.error}</span>`;
        this.querySelector('#results').style.display = 'none';
      }
    }

    checkAndAutoCalculate() {
      const coord1Value = this.querySelector('#coord1').value.trim();
      const coord2Value = this.querySelector('#coord2').value.trim();

      if (coord1Value && coord2Value) {
        const coord1 = parseCoordinates(coord1Value);
        const coord2 = parseCoordinates(coord2Value);

        if (coord1.isValid && coord2.isValid) {
          this.performCalculation(coord1, coord2);
        }
      }
    }

    performCalculation(coord1, coord2) {
      const distance = this.calculateDistance(coord1.latitude, coord1.longitude, coord2.latitude, coord2.longitude);
      const bearing = this.calculateBearing(coord1.latitude, coord1.longitude, coord2.latitude, coord2.longitude);
      const midpoint = this.calculateMidpoint(coord1.latitude, coord1.longitude, coord2.latitude, coord2.longitude);

      const resultsDiv = this.querySelector('#calculation-results');
      resultsDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <div>
            <strong>Distance:</strong><br>
            ${distance.km.toFixed(2)} km<br>
            ${distance.miles.toFixed(2)} miles<br>
            ${distance.nautical.toFixed(2)} nautical miles
          </div>
          <div>
            <strong>Bearing:</strong><br>
            ${bearing.toFixed(1)}° (from point 1 to point 2)
          </div>
          <div>
            <strong>Midpoint:</strong><br>
            ${midpoint.latitude.toFixed(6)}°, ${midpoint.longitude.toFixed(6)}°
          </div>
        </div>
      `;

      this.querySelector('#results').style.display = 'block';
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Earth's radius in kilometers
      const dLat = this.toRadians(lat2 - lat1);
      const dLon = this.toRadians(lon2 - lon1);
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const km = R * c;
      
      return {
        km: km,
        miles: km * 0.621371,
        nautical: km * 0.539957
      };
    }

    calculateBearing(lat1, lon1, lat2, lon2) {
      const dLon = this.toRadians(lon2 - lon1);
      const lat1Rad = this.toRadians(lat1);
      const lat2Rad = this.toRadians(lat2);
      
      const y = Math.sin(dLon) * Math.cos(lat2Rad);
      const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
      
      let bearing = this.toDegrees(Math.atan2(y, x));
      return (bearing + 360) % 360;
    }

    calculateMidpoint(lat1, lon1, lat2, lon2) {
      const lat1Rad = this.toRadians(lat1);
      const lat2Rad = this.toRadians(lat2);
      const dLon = this.toRadians(lon2 - lon1);
      
      const Bx = Math.cos(lat2Rad) * Math.cos(dLon);
      const By = Math.cos(lat2Rad) * Math.sin(dLon);
      
      const lat3 = Math.atan2(Math.sin(lat1Rad) + Math.sin(lat2Rad),
                             Math.sqrt((Math.cos(lat1Rad) + Bx) * (Math.cos(lat1Rad) + Bx) + By * By));
      const lon3 = this.toRadians(lon1) + Math.atan2(By, Math.cos(lat1Rad) + Bx);
      
      return {
        latitude: this.toDegrees(lat3),
        longitude: this.toDegrees(lon3)
      };
    }

    toRadians(degrees) {
      return degrees * (Math.PI / 180);
    }

    toDegrees(radians) {
      return radians * (180 / Math.PI);
    }

    clearAll() {
      this.querySelector('#coord1').value = '';
      this.querySelector('#coord2').value = '';
      this.querySelector('#coord1').style.borderColor = '#ccc';
      this.querySelector('#coord2').style.borderColor = '#ccc';
      this.querySelector('#coord1-status').innerHTML = '';
      this.querySelector('#coord2-status').innerHTML = '';
      this.querySelector('#results').style.display = 'none';
    }
  }

  // Register the component
  customElements.define('basic-calculator', BasicCalculator);
  console.log('✅ Basic calculator component registered and ready!');
}

// Export functions for testing
export {
  parseDecimalDegrees,
  parseDegreesDecimalMinutes,
  parseDegreesMinutesSeconds,
  parseCoordinates,
  validateCoordinates
};

export const CoordinateFormat = {
  DECIMAL_DEGREES: 'DD',
  DEGREES_DECIMAL_MINUTES: 'DDM',
  DEGREES_MINUTES_SECONDS: 'DMS'
}; 