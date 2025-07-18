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
    
    return { latitude: 0, longitude: 0, isValid: false, error: 'Invalid decimal degrees format' };
  } catch (e) {
    return { latitude: 0, longitude: 0, isValid: false, error: 'Parse error in decimal degrees' };
  }
}

function parseDegreesDecimalMinutes(input) {
  try {
    const cleaned = input.trim().replace(/\s+/g, ' ');
    const ddmPattern = /^(-?\d+)°\s*(\d+\.?\d*)'?\s*([NSEW])?\s+(-?\d+)°\s*(\d+\.?\d*)'?\s*([NSEW])?$/i;
    const match = cleaned.match(ddmPattern);
    
    if (match) {
      let [, latDeg, latMin, latDir, lngDeg, lngMin, lngDir] = match;
      
      let latitude = parseInt(latDeg) + parseFloat(latMin) / 60;
      let longitude = parseInt(lngDeg) + parseFloat(lngMin) / 60;
      
      if (latDir && latDir.toUpperCase() === 'S') latitude = -Math.abs(latitude);
      if (lngDir && lngDir.toUpperCase() === 'W') longitude = -Math.abs(longitude);
      
      return validateCoordinates(latitude, longitude);
    }
    
    return { latitude: 0, longitude: 0, isValid: false, error: 'Invalid degrees decimal minutes format' };
  } catch (e) {
    return { latitude: 0, longitude: 0, isValid: false, error: 'Parse error in degrees decimal minutes' };
  }
}

function parseDegreesMinutesSeconds(input) {
  try {
    const cleaned = input.trim().replace(/\s+/g, ' ');
    const dmsPattern = /^(-?\d+)°\s*(\d+)'?\s*(\d+\.?\d*)"?\s*([NSEW])?\s+(-?\d+)°\s*(\d+)'?\s*(\d+\.?\d*)"?\s*([NSEW])?$/i;
    const match = cleaned.match(dmsPattern);
    
    if (match) {
      let [, latDeg, latMin, latSec, latDir, lngDeg, lngMin, lngSec, lngDir] = match;
      
      let latitude = parseInt(latDeg) + parseInt(latMin) / 60 + parseFloat(latSec) / 3600;
      let longitude = parseInt(lngDeg) + parseInt(lngMin) / 60 + parseFloat(lngSec) / 3600;
      
      if (latDir && latDir.toUpperCase() === 'S') latitude = -Math.abs(latitude);
      if (lngDir && lngDir.toUpperCase() === 'W') longitude = -Math.abs(longitude);
      
      return validateCoordinates(latitude, longitude);
    }
    
    return { latitude: 0, longitude: 0, isValid: false, error: 'Invalid degrees minutes seconds format' };
  } catch (e) {
    return { latitude: 0, longitude: 0, isValid: false, error: 'Parse error in degrees minutes seconds' };
  }
}

function parseCoordinates(input) {
  if (!input || input.trim() === '') {
    return { latitude: 0, longitude: 0, isValid: false, error: 'Empty input' };
  }
  
  const cleaned = input.trim();
  
  if (cleaned.includes('"')) {
    return parseDegreesMinutesSeconds(cleaned);
  } else if (cleaned.includes("'") && cleaned.includes('°')) {
    return parseDegreesDecimalMinutes(cleaned);
  } else {
    return parseDecimalDegrees(cleaned);
  }
}

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

// Simple calculator class
class BasicCalculator extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 2px solid #ccc; border-radius: 8px; background: white;">
        <h2 style="margin-top: 0; color: #333;">🧮 Latitude & Longitude Calculator</h2>
        <p style="color: #666;">Enter coordinates in any format: DD, DDM, or DMS. Auto-detection included!</p>
        
        <div style="background: #f0f8ff; padding: 10px; border-radius: 4px; margin: 15px 0; font-size: 12px;">
          <strong>Supported Formats:</strong><br>
          • <strong>DD:</strong> 37.7749° N 122.4194° W or +37.7749, -122.4194<br>
          • <strong>DDM:</strong> 37° 46.494' N 122° 25.164' W<br>
          • <strong>DMS:</strong> 37° 46' 29.64" N 122° 25' 9.84" W
        </div>
        
        <div style="margin: 20px 0;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">Point 1 Coordinates:</label>
          <input type="text" id="coord1" placeholder="Enter coordinates (any format)" 
                 style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
          <div id="coord1-status" style="margin-top: 5px; font-size: 12px;"></div>
        </div>
        
        <div style="margin: 20px 0;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">Point 2 Coordinates:</label>
          <input type="text" id="coord2" placeholder="Enter coordinates (any format)"
                 style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
          <div id="coord2-status" style="margin-top: 5px; font-size: 12px;"></div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
          <button id="calc-btn" style="padding: 12px; background: #1473e6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
            Calculate Distance & Convert Formats
          </button>
          <button id="clear-btn" style="padding: 12px; background: #6b6b6b; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
            Clear All
          </button>
        </div>
        
        <div id="results" style="margin-top: 20px; display: none; padding: 15px; background: #f9f9f9; border-radius: 4px;">
          <div id="result-content"></div>
        </div>
      </div>
    `;
  }
  
  connectedCallback() {
    this.querySelector('#calc-btn').addEventListener('click', () => this.calculate());
    this.querySelector('#clear-btn').addEventListener('click', () => this.clear());
    
    this.querySelector('#coord1').addEventListener('input', (e) => this.validateInput(e.target, 'coord1-status'));
    this.querySelector('#coord2').addEventListener('input', (e) => this.validateInput(e.target, 'coord2-status'));
    
    console.log('✅ Basic calculator loaded and ready!');
  }
  
  validateInput(input, statusId) {
    const status = this.querySelector(`#${statusId}`);
    const value = input.value.trim();
    
    if (!value) {
      input.style.borderColor = '#ccc';
      status.innerHTML = '';
      return;
    }
    
    const parsed = parseCoordinates(value);
    
    if (parsed.isValid) {
      input.style.borderColor = '#10b981';
      const format = this.detectFormat(value);
      status.innerHTML = `<span style="color: #10b981;">✅ ${format} format detected</span>`;
    } else {
      input.style.borderColor = '#ef4444';
      status.innerHTML = `<span style="color: #ef4444;">❌ ${parsed.error}</span>`;
    }
  }
  
  detectFormat(input) {
    if (input.includes('"')) {
      return 'DMS (Degrees Minutes Seconds)';
    } else if (input.includes("'") && input.includes('°')) {
      return 'DDM (Degrees Decimal Minutes)';
    } else {
      return 'DD (Decimal Degrees)';
    }
  }
  
  calculate() {
    const coord1 = this.querySelector('#coord1').value.trim();
    const coord2 = this.querySelector('#coord2').value.trim();
    const results = this.querySelector('#results');
    const content = this.querySelector('#result-content');
    
    if (!coord1 || !coord2) {
      content.innerHTML = '<p style="color: #ef4444;">⚠️ Please enter both coordinates</p>';
      results.style.display = 'block';
      return;
    }
    
    const parsed1 = parseCoordinates(coord1);
    const parsed2 = parseCoordinates(coord2);
    
    if (parsed1.isValid && parsed2.isValid) {
      const distance = this.calculateDistance(parsed1.latitude, parsed1.longitude, parsed2.latitude, parsed2.longitude);
      
      content.innerHTML = `
        <h3 style="margin-top: 0;">📍 Coordinates & Calculations</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
          <div>
            <h4>Point 1:</h4>
            <p><strong>Input:</strong> ${coord1}</p>
            <p><strong>Parsed:</strong> ${parsed1.latitude.toFixed(6)}, ${parsed1.longitude.toFixed(6)}</p>
          </div>
          <div>
            <h4>Point 2:</h4>
            <p><strong>Input:</strong> ${coord2}</p>
            <p><strong>Parsed:</strong> ${parsed2.latitude.toFixed(6)}, ${parsed2.longitude.toFixed(6)}</p>
          </div>
        </div>
        <div style="background: #e8f4fd; padding: 15px; border-radius: 4px;">
          <h4>📏 Distance Calculation:</h4>
          <p><strong>Distance:</strong> ${distance.toFixed(2)} km (${(distance * 0.621371).toFixed(2)} miles)</p>
          <p><em>Using Haversine formula for great circle distance</em></p>
        </div>
      `;
      results.style.display = 'block';
    } else {
      const errors = [];
      if (!parsed1.isValid) errors.push(`Point 1: ${parsed1.error}`);
      if (!parsed2.isValid) errors.push(`Point 2: ${parsed2.error}`);
      
      content.innerHTML = `
        <div style="color: #ef4444;">
          <h4>❌ Coordinate Parsing Errors:</h4>
          ${errors.map(err => `<p>• ${err}</p>`).join('')}
        </div>
      `;
      results.style.display = 'block';
    }
  }
  
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  
  clear() {
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