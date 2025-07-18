import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/dropdown/sp-dropdown.js';
import '@spectrum-web-components/menu/sp-menu.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import { 
  CoordinateFormat, 
  parseCoordinates, 
  convertToDecimalDegrees,
  convertToDegreesDecimalMinutes,
  convertToDegreesMinutesSeconds,
  type ParsedCoordinate,
  type CoordinateConversions,
  type CoordinateFormatType
} from '../utils/coordinates.js';

/**
 * Latitude and Longitude Calculator Component
 * Provides geographic coordinate calculations including:
 * - Coordinate format conversions
 * - Distance calculations between points
 * - Bearing calculations
 * - Coordinate validation
 */
@customElement('lnl-calculator')
export class LnLCalculator extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 600px;
      margin: 0 auto;
    }

    .calculator {
      padding: 20px;
    }

    .format-section {
      margin-bottom: 20px;
      padding: 15px;
      background-color: var(--spectrum-gray-50);
      border-radius: 8px;
    }

    .format-selector {
      margin-bottom: 15px;
    }

    .format-examples {
      font-size: 12px;
      color: var(--spectrum-gray-700);
      line-height: 1.4;
    }

    .format-examples ul {
      margin: 5px 0;
      padding-left: 20px;
    }

    .input-section {
      margin-bottom: 20px;
    }

    .coordinate-input {
      margin-bottom: 15px;
    }

    .coordinate-input label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: var(--spectrum-gray-800);
    }

    .coordinate-input sp-textfield {
      width: 100%;
    }

    .error-message {
      color: var(--spectrum-red-600);
      font-size: 12px;
      margin-top: 5px;
    }

    .conversion-section {
      margin-bottom: 20px;
      padding: 15px;
      background-color: var(--spectrum-blue-50);
      border-radius: 8px;
    }

    .conversion-results {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .conversion-item {
      padding: 10px;
      background-color: white;
      border-radius: 4px;
      border: 1px solid var(--spectrum-gray-200);
    }

    .conversion-label {
      font-weight: bold;
      font-size: 12px;
      color: var(--spectrum-gray-600);
      margin-bottom: 5px;
    }

    .conversion-value {
      font-family: monospace;
      font-size: 14px;
      color: var(--spectrum-gray-800);
    }

    .buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 15px;
    }

    .results {
      margin-top: 20px;
      padding: 15px;
      background-color: var(--spectrum-gray-100);
      border-radius: 8px;
    }

    sp-button {
      height: 40px;
    }

    .calculate-button {
      --spectrum-button-background-color-default: var(--spectrum-blue-600);
      --spectrum-button-background-color-hover: var(--spectrum-blue-700);
    }

    .clear-button {
      --spectrum-button-background-color-default: var(--spectrum-gray-600);
      --spectrum-button-background-color-hover: var(--spectrum-gray-700);
    }
  `;

  @state()
  private inputFormat: CoordinateFormatType = CoordinateFormat.DECIMAL_DEGREES;

  @state()
  private coordinate1Input = '';

  @state()
  private coordinate2Input = '';

  @state()
  private coordinate1Parsed: ParsedCoordinate | null = null;

  @state()
  private coordinate2Parsed: ParsedCoordinate | null = null;

  @state()
  private results = {
    distance: '',
    bearing: '',
    midpoint: ''
  };

  @state()
  private showConversions = false;

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Convert radians to degrees
   */
  private toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Calculate bearing between two coordinates
   */
  private calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const dLng = this.toRadians(lng2 - lng1);
    const lat1Rad = this.toRadians(lat1);
    const lat2Rad = this.toRadians(lat2);
    
    const y = Math.sin(dLng) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
    
    const bearing = this.toDegrees(Math.atan2(y, x));
    return (bearing + 360) % 360;
  }

  /**
   * Calculate midpoint between two coordinates
   */
  private calculateMidpoint(lat1: number, lng1: number, lat2: number, lng2: number): {lat: number, lng: number} {
    const lat1Rad = this.toRadians(lat1);
    const lat2Rad = this.toRadians(lat2);
    const dLng = this.toRadians(lng2 - lng1);

    const bx = Math.cos(lat2Rad) * Math.cos(dLng);
    const by = Math.cos(lat2Rad) * Math.sin(dLng);

    const lat3 = Math.atan2(Math.sin(lat1Rad) + Math.sin(lat2Rad),
                           Math.sqrt((Math.cos(lat1Rad) + bx) * (Math.cos(lat1Rad) + bx) + by * by));
    const lng3 = this.toRadians(lng1) + Math.atan2(by, Math.cos(lat1Rad) + bx);

    return {
      lat: this.toDegrees(lat3),
      lng: this.toDegrees(lng3)
    };
  }



  /**
   * Parse coordinate input and update parsed coordinates
   */
  private parseCoordinateInput(input: string, coordinateNumber: 1 | 2) {
    const parsed = parseCoordinates(input);
    
    if (coordinateNumber === 1) {
      this.coordinate1Parsed = parsed;
    } else {
      this.coordinate2Parsed = parsed;
    }
    
    // Auto-enable conversions if we have a valid coordinate
    if (parsed.isValid) {
      this.showConversions = true;
    }
  }

  /**
   * Handle coordinate input changes
   */
  private handleCoordinateInput(event: Event, coordinateNumber: 1 | 2) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    
    if (coordinateNumber === 1) {
      this.coordinate1Input = value;
    } else {
      this.coordinate2Input = value;
    }
    
    // Parse the input
    this.parseCoordinateInput(value, coordinateNumber);
  }

  /**
   * Handle format selection change
   */
  private handleFormatChange(event: Event) {
    const target = event.target as any;
    this.inputFormat = target.value;
  }

  /**
   * Perform all calculations
   */
  private performCalculations() {
    if (!this.coordinate1Parsed?.isValid || !this.coordinate2Parsed?.isValid) {
      this.results = {
        distance: 'Please enter valid coordinates for both points',
        bearing: '',
        midpoint: ''
      };
      return;
    }

    const { latitude: lat1, longitude: lng1 } = this.coordinate1Parsed;
    const { latitude: lat2, longitude: lng2 } = this.coordinate2Parsed;

    const distance = this.calculateDistance(lat1, lng1, lat2, lng2);
    const bearing = this.calculateBearing(lat1, lng1, lat2, lng2);
    const midpoint = this.calculateMidpoint(lat1, lng1, lat2, lng2);

    this.results = {
      distance: `${distance.toFixed(2)} km (${(distance * 0.621371).toFixed(2)} miles)`,
      bearing: `${bearing.toFixed(2)}°`,
      midpoint: `${midpoint.lat.toFixed(6)}, ${midpoint.lng.toFixed(6)}`
    };
  }

  /**
   * Clear all inputs and results
   */
  private clearAll() {
    this.coordinate1Input = '';
    this.coordinate2Input = '';
    this.coordinate1Parsed = null;
    this.coordinate2Parsed = null;
    this.showConversions = false;
    this.results = {
      distance: '',
      bearing: '',
      midpoint: ''
    };
  }

  /**
   * Get coordinate conversions for display
   */
  private getCoordinateConversions(parsed: ParsedCoordinate): CoordinateConversions | null {
    if (!parsed.isValid) return null;
    
    const { latitude, longitude } = parsed;
    
    return {
      dd: convertToDecimalDegrees(latitude, longitude),
      ddm: convertToDegreesDecimalMinutes(latitude, longitude), 
      dms: convertToDegreesMinutesSeconds(latitude, longitude)
    };
  }

  /**
   * Get format examples for current selection
   */
  private getFormatExamples(): string[] {
    switch (this.inputFormat) {
      case 'DD':
        return [
          '32.30642° N 122.61458° W',
          '+32.30642, -122.61458',
          '32.30642 -122.61458'
        ];
      case 'DDM':
        return [
          '32° 18.385\' N 122° 36.875\' W',
          '32° 18.385\' 122° 36.875\''
        ];
      case 'DMS':
        return [
          '32° 18\' 23.1" N 122° 36\' 52.5" W',
          '32° 18\' 23.1" 122° 36\' 52.5"'
        ];
      default:
        return [];
    }
  }

  render() {
    const examples = this.getFormatExamples();
    
    return html`
      <sp-card>
        <div class="calculator">
          <!-- Format Selection Section -->
          <div class="format-section">
            <h3>Coordinate Format</h3>
            <div class="format-selector">
              <sp-dropdown @change="${this.handleFormatChange}">
                <sp-menu slot="options" selects="single" value="${this.inputFormat}">
                  <sp-menu-item value="${CoordinateFormat.DECIMAL_DEGREES}">
                    Decimal Degrees (DD)
                  </sp-menu-item>
                  <sp-menu-item value="${CoordinateFormat.DEGREES_DECIMAL_MINUTES}">
                    Degrees Decimal Minutes (DDM)
                  </sp-menu-item>
                  <sp-menu-item value="${CoordinateFormat.DEGREES_MINUTES_SECONDS}">
                    Degrees Minutes Seconds (DMS)
                  </sp-menu-item>
                </sp-menu>
              </sp-dropdown>
            </div>
            
            <div class="format-examples">
              <strong>Examples:</strong>
              <ul>
                ${examples.map(example => html`<li>${example}</li>`)}
              </ul>
            </div>
          </div>

          <!-- Coordinate Input Section -->
          <div class="input-section">
            <div class="coordinate-input">
              <label>Point 1 Coordinates</label>
              <sp-textfield 
                placeholder="Enter coordinates in the selected format"
                value="${this.coordinate1Input}"
                @input="${(e: Event) => this.handleCoordinateInput(e, 1)}">
              </sp-textfield>
              ${this.coordinate1Parsed && !this.coordinate1Parsed.isValid ? html`
                <div class="error-message">${this.coordinate1Parsed.error}</div>
              ` : ''}
            </div>

            <div class="coordinate-input">
              <label>Point 2 Coordinates</label>
              <sp-textfield 
                placeholder="Enter coordinates in the selected format"
                value="${this.coordinate2Input}"
                @input="${(e: Event) => this.handleCoordinateInput(e, 2)}">
              </sp-textfield>
              ${this.coordinate2Parsed && !this.coordinate2Parsed.isValid ? html`
                <div class="error-message">${this.coordinate2Parsed.error}</div>
              ` : ''}
            </div>
          </div>

          <!-- Coordinate Conversions -->
          ${this.showConversions && this.coordinate1Parsed?.isValid ? html`
            <div class="conversion-section">
              <h3>Point 1 Conversions</h3>
              <div class="conversion-results">
                ${this.renderConversions(this.coordinate1Parsed)}
              </div>
            </div>
          ` : ''}

          ${this.showConversions && this.coordinate2Parsed?.isValid ? html`
            <div class="conversion-section">
              <h3>Point 2 Conversions</h3>
              <div class="conversion-results">
                ${this.renderConversions(this.coordinate2Parsed)}
              </div>
            </div>
          ` : ''}
          
          <!-- Action Buttons -->
          <div class="buttons">
            <sp-button 
              class="calculate-button"
              variant="accent" 
              @click="${this.performCalculations}"
              ?disabled="${!this.coordinate1Parsed?.isValid || !this.coordinate2Parsed?.isValid}">
              Calculate Distance & Bearing
            </sp-button>
            <sp-button 
              class="clear-button"
              variant="secondary" 
              @click="${this.clearAll}">
              Clear All
            </sp-button>
          </div>

          <!-- Results Section -->
          ${this.results.distance && this.results.distance !== 'Please enter valid coordinates for both points' ? html`
            <div class="results">
              <h3>Calculation Results</h3>
              <p><strong>Distance:</strong> ${this.results.distance}</p>
              ${this.results.bearing ? html`<p><strong>Bearing:</strong> ${this.results.bearing}</p>` : ''}
              ${this.results.midpoint ? html`<p><strong>Midpoint:</strong> ${this.results.midpoint}</p>` : ''}
            </div>
          ` : this.results.distance ? html`
            <div class="results">
              <p style="color: var(--spectrum-red-600);">${this.results.distance}</p>
            </div>
          ` : ''}
        </div>
      </sp-card>
    `;
  }

  /**
   * Render coordinate conversions for a parsed coordinate
   */
  private renderConversions(parsed: ParsedCoordinate) {
    const conversions = this.getCoordinateConversions(parsed);
    if (!conversions) return '';

    return html`
      <div class="conversion-item">
        <div class="conversion-label">Decimal Degrees (DD)</div>
        <div class="conversion-value">${conversions.dd}</div>
      </div>
      <div class="conversion-item">
        <div class="conversion-label">Degrees Decimal Minutes (DDM)</div>
        <div class="conversion-value">${conversions.ddm}</div>
      </div>
      <div class="conversion-item">
        <div class="conversion-label">Degrees Minutes Seconds (DMS)</div>
        <div class="conversion-value">${conversions.dms}</div>
      </div>
    `;
  }
} 