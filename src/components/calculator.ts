import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/card/sp-card.js';

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
      max-width: 400px;
      margin: 0 auto;
    }

    .calculator {
      padding: 20px;
    }

    .display {
      margin-bottom: 20px;
      font-size: 18px;
    }

    .input-section {
      margin-bottom: 20px;
    }

    .coordinate-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 15px;
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
      height: 60px;
      font-size: 18px;
    }

    .operator {
      --spectrum-button-background-color-default: var(--spectrum-blue-600);
      --spectrum-button-background-color-hover: var(--spectrum-blue-700);
    }

    .clear {
      --spectrum-button-background-color-default: var(--spectrum-red-600);
      --spectrum-button-background-color-hover: var(--spectrum-red-700);
    }

    .equals {
      grid-column: span 2;
      --spectrum-button-background-color-default: var(--spectrum-green-600);
      --spectrum-button-background-color-hover: var(--spectrum-green-700);
    }
  `;

  @state()
  private lat1 = '';

  @state()
  private lng1 = '';

  @state()
  private lat2 = '';

  @state()
  private lng2 = '';

  @state()
  private results = {
    distance: '',
    bearing: '',
    midpoint: ''
  };

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
   * Validate coordinate values
   */
  private isValidCoordinate(lat: number, lng: number): boolean {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  /**
   * Perform all calculations
   */
  private performCalculations() {
    const lat1 = parseFloat(this.lat1);
    const lng1 = parseFloat(this.lng1);
    const lat2 = parseFloat(this.lat2);
    const lng2 = parseFloat(this.lng2);

    if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) {
      this.results = {
        distance: 'Please enter valid coordinates',
        bearing: '',
        midpoint: ''
      };
      return;
    }

    if (!this.isValidCoordinate(lat1, lng1) || !this.isValidCoordinate(lat2, lng2)) {
      this.results = {
        distance: 'Invalid coordinates (lat: -90 to 90, lng: -180 to 180)',
        bearing: '',
        midpoint: ''
      };
      return;
    }

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
    this.lat1 = '';
    this.lng1 = '';
    this.lat2 = '';
    this.lng2 = '';
    this.results = {
      distance: '',
      bearing: '',
      midpoint: ''
    };
  }

  private handleInputChange(event: Event, field: string) {
    const target = event.target as HTMLInputElement;
    (this as any)[field] = target.value;
  }

  render() {
    return html`
      <sp-card>
        <div class="calculator">
          <div class="input-section">
            <h3>Point 1</h3>
            <div class="coordinate-inputs">
              <sp-textfield 
                placeholder="Latitude (-90 to 90)"
                value="${this.lat1}"
                @input="${(e: Event) => this.handleInputChange(e, 'lat1')}"
                type="number"
                step="any">
                <span slot="label">Latitude</span>
              </sp-textfield>
              <sp-textfield 
                placeholder="Longitude (-180 to 180)"
                value="${this.lng1}"
                @input="${(e: Event) => this.handleInputChange(e, 'lng1')}"
                type="number"
                step="any">
                <span slot="label">Longitude</span>
              </sp-textfield>
            </div>
          </div>

          <div class="input-section">
            <h3>Point 2</h3>
            <div class="coordinate-inputs">
              <sp-textfield 
                placeholder="Latitude (-90 to 90)"
                value="${this.lat2}"
                @input="${(e: Event) => this.handleInputChange(e, 'lat2')}"
                type="number"
                step="any">
                <span slot="label">Latitude</span>
              </sp-textfield>
              <sp-textfield 
                placeholder="Longitude (-180 to 180)"
                value="${this.lng2}"
                @input="${(e: Event) => this.handleInputChange(e, 'lng2')}"
                type="number"
                step="any">
                <span slot="label">Longitude</span>
              </sp-textfield>
            </div>
          </div>
          
          <div class="buttons">
            <sp-button 
              variant="accent" 
              @click="${this.performCalculations}">
              Calculate
            </sp-button>
            <sp-button 
              variant="secondary" 
              @click="${this.clearAll}">
              Clear All
            </sp-button>
          </div>

          ${this.results.distance ? html`
            <div class="results">
              <h3>Results</h3>
              <p><strong>Distance:</strong> ${this.results.distance}</p>
              ${this.results.bearing ? html`<p><strong>Bearing:</strong> ${this.results.bearing}</p>` : ''}
              ${this.results.midpoint ? html`<p><strong>Midpoint:</strong> ${this.results.midpoint}</p>` : ''}
            </div>
          ` : ''}
        </div>
      </sp-card>
    `;
  }
} 