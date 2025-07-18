// Simple test to see if modules are loading
console.log('🚀 Main.js loading...');

// Import Spectrum components
import '@spectrum-web-components/bundle/elements.js';
import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/card/sp-card.js';

// Import our coordinate utilities
import { 
  parseCoordinates, 
  convertToDecimalDegrees,
  convertToDegreesDecimalMinutes,
  convertToDegreesMinutesSeconds
} from './utils/coordinates.js';

console.log('✅ Spectrum components and coordinate utilities loaded');

// Simple test component
class SimpleCalculator extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <sp-card>
        <div style="padding: 20px;">
          <h2 style="margin-top: 0;">🧮 Latitude & Longitude Calculator</h2>
          <p>Enter coordinates in any format: DD, DDM, or DMS. Auto-detection included!</p>
          
          <div style="background: #f0f8ff; padding: 10px; border-radius: 4px; margin: 15px 0; font-size: 12px;">
            <strong>Supported Formats:</strong><br>
            • <strong>DD:</strong> 37.7749° N 122.4194° W or +37.7749, -122.4194<br>
            • <strong>DDM:</strong> 37° 46.494' N 122° 25.164' W<br>
            • <strong>DMS:</strong> 37° 46' 29.64" N 122° 25' 9.84" W
          </div>
          
          <div style="margin: 20px 0;">
            <sp-textfield 
              id="coord1" 
              label="Point 1 Coordinates"
              placeholder="Enter coordinates (any format)"
              style="width: 100%;">
            </sp-textfield>
          </div>
          
          <div style="margin: 20px 0;">
            <sp-textfield 
              id="coord2" 
              label="Point 2 Coordinates"
              placeholder="Enter coordinates (any format)"
              style="width: 100%;">
            </sp-textfield>
          </div>
          
          <div style="margin: 20px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <sp-button id="calc-btn" variant="accent">
              Calculate Distance & Convert Formats
            </sp-button>
            <sp-button id="clear-btn" variant="secondary">
              Clear
            </sp-button>
          </div>
          
                     <div id="results" style="margin-top: 20px; display: none;">
             <sp-card style="margin-top: 10px;">
               <div id="result-content" style="padding: 15px;"></div>
             </sp-card>
           </div>
        </div>
      </sp-card>
    `;
  }
  
  connectedCallback() {
    // Set up event listeners after component is added to DOM
    this.querySelector('#calc-btn').addEventListener('click', () => this.calculate());
    this.querySelector('#clear-btn').addEventListener('click', () => this.clear());
    
    // Add real-time validation
    const coord1Field = this.querySelector('#coord1');
    const coord2Field = this.querySelector('#coord2');
    
    coord1Field.addEventListener('input', () => this.validateCoordinate(coord1Field, 'coord1'));
    coord2Field.addEventListener('input', () => this.validateCoordinate(coord2Field, 'coord2'));
    
    // Add validation on blur for better UX
    coord1Field.addEventListener('blur', () => this.validateCoordinate(coord1Field, 'coord1', true));
    coord2Field.addEventListener('blur', () => this.validateCoordinate(coord2Field, 'coord2', true));
    
    console.log('✅ Event listeners and validation attached');
  }
  
  validateCoordinate(field, fieldName, showError = false) {
    const value = field.value.trim();
    
    if (!value) {
      // Empty field - remove validation
      field.invalid = false;
      field.validationMessage = '';
      return { isValid: true, isEmpty: true };
    }
    
    // Parse the coordinate
    const parsed = parseCoordinates(value);
    
    if (parsed.isValid) {
      // Valid coordinate
      field.invalid = false;
      field.validationMessage = '';
      
      // Show format detection hint
      const formatType = this.detectFormat(value);
      const hint = `✅ ${formatType} format detected`;
      field.helpText = hint;
      
      return { isValid: true, parsed };
    } else {
      // Invalid coordinate
      if (showError || value.length > 5) { // Only show error after user has typed enough
        field.invalid = true;
        field.validationMessage = parsed.error || 'Invalid coordinate format';
      }
      field.helpText = '';
      return { isValid: false, error: parsed.error };
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
    console.log('🧮 Calculate button clicked!');
    const coord1Field = this.querySelector('#coord1');
    const coord2Field = this.querySelector('#coord2');
    const results = this.querySelector('#results');
    const content = this.querySelector('#result-content');
    
    // Validate both coordinates with error display
    const validation1 = this.validateCoordinate(coord1Field, 'coord1', true);
    const validation2 = this.validateCoordinate(coord2Field, 'coord2', true);
    
    console.log('Validation1:', validation1, 'Validation2:', validation2);
    
    if (validation1.isEmpty || validation2.isEmpty) {
      content.innerHTML = '<p style="color: #d73502;">⚠️ Please enter both coordinates</p>';
      results.style.display = 'block';
      return;
    }
    
              if (validation1.isValid && validation2.isValid) {
       const parsed1 = validation1.parsed;
       const parsed2 = validation2.parsed;
       
       // Calculate distance and bearing
       const distance = this.calculateDistance(parsed1.latitude, parsed1.longitude, parsed2.latitude, parsed2.longitude);
       const bearing = this.calculateBearing(parsed1.latitude, parsed1.longitude, parsed2.latitude, parsed2.longitude);
       const midpoint = this.calculateMidpoint(parsed1.latitude, parsed1.longitude, parsed2.latitude, parsed2.longitude);
       
       // Get format conversions
       const conv1 = this.getConversions(parsed1.latitude, parsed1.longitude);
       const conv2 = this.getConversions(parsed2.latitude, parsed2.longitude);
       
       content.innerHTML = `
         <div style="margin-bottom: 20px;">
           <h4>📍 Point 1 Formats:</h4>
           <div style="font-family: monospace; font-size: 12px; background: white; padding: 10px; border-radius: 4px; margin: 5px 0;">
             <div><strong>DD:</strong> ${conv1.dd}</div>
             <div><strong>DDM:</strong> ${conv1.ddm}</div>
             <div><strong>DMS:</strong> ${conv1.dms}</div>
           </div>
         </div>
         
         <div style="margin-bottom: 20px;">
           <h4>📍 Point 2 Formats:</h4>
           <div style="font-family: monospace; font-size: 12px; background: white; padding: 10px; border-radius: 4px; margin: 5px 0;">
             <div><strong>DD:</strong> ${conv2.dd}</div>
             <div><strong>DDM:</strong> ${conv2.ddm}</div>
             <div><strong>DMS:</strong> ${conv2.dms}</div>
           </div>
         </div>
         
         <div style="background: #e8f4fd; padding: 15px; border-radius: 4px;">
           <h4>📏 Calculations:</h4>
           <p><strong>Distance:</strong> ${distance.toFixed(2)} km (${(distance * 0.621371).toFixed(2)} miles)</p>
           <p><strong>Bearing:</strong> ${bearing.toFixed(2)}°</p>
           <p><strong>Midpoint:</strong> ${midpoint.lat.toFixed(6)}, ${midpoint.lng.toFixed(6)}</p>
         </div>
       `;
       results.style.display = 'block';
     } else {
       const errors = [];
       if (!validation1.isValid) errors.push(`Point 1: ${validation1.error}`);
       if (!validation2.isValid) errors.push(`Point 2: ${validation2.error}`);
       
       content.innerHTML = `
         <div style="color: #d73502;">
           <h4>❌ Coordinate Parsing Errors:</h4>
           ${errors.map(err => `<p>• ${err}</p>`).join('')}
         </div>
       `;
       results.style.display = 'block';
     }
  }
  
  // Convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  // Convert radians to degrees
  toDegrees(radians) {
    return radians * (180 / Math.PI);
  }
  
  // Calculate distance using Haversine formula
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  
  // Calculate bearing between two points
  calculateBearing(lat1, lng1, lat2, lng2) {
    const dLng = this.toRadians(lng2 - lng1);
    const lat1Rad = this.toRadians(lat1);
    const lat2Rad = this.toRadians(lat2);
    
    const y = Math.sin(dLng) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
    
    let bearing = this.toDegrees(Math.atan2(y, x));
    return (bearing + 360) % 360;
  }
  
  // Calculate midpoint between two coordinates
  calculateMidpoint(lat1, lng1, lat2, lng2) {
    const lat1Rad = this.toRadians(lat1);
    const lat2Rad = this.toRadians(lat2);
    const dLng = this.toRadians(lng2 - lng1);
    
    const Bx = Math.cos(lat2Rad) * Math.cos(dLng);
    const By = Math.cos(lat2Rad) * Math.sin(dLng);
    
    const midLat = Math.atan2(Math.sin(lat1Rad) + Math.sin(lat2Rad),
                             Math.sqrt((Math.cos(lat1Rad) + Bx) * (Math.cos(lat1Rad) + Bx) + By * By));
    const midLng = this.toRadians(lng1) + Math.atan2(By, Math.cos(lat1Rad) + Bx);
    
    return {
      lat: this.toDegrees(midLat),
      lng: this.toDegrees(midLng)
    };
  }
  
  // Get coordinate format conversions
  getConversions(latitude, longitude) {
    return {
      dd: convertToDecimalDegrees(latitude, longitude),
      ddm: convertToDegreesDecimalMinutes(latitude, longitude),
      dms: convertToDegreesMinutesSeconds(latitude, longitude)
    };
  }
  
  clear() {
    console.log('🧹 Clear button clicked!');
    const coord1Field = this.querySelector('#coord1');
    const coord2Field = this.querySelector('#coord2');
    
    // Clear values
    coord1Field.value = '';
    coord2Field.value = '';
    
    // Reset validation states
    coord1Field.invalid = false;
    coord1Field.validationMessage = '';
    coord1Field.helpText = '';
    coord2Field.invalid = false;
    coord2Field.validationMessage = '';
    coord2Field.helpText = '';
    
    // Hide results
    this.querySelector('#results').style.display = 'none';
  }
}

// Register the component
customElements.define('simple-calculator', SimpleCalculator);

console.log('✅ Simple calculator component registered'); 