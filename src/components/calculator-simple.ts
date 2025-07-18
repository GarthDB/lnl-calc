import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/card/sp-card.js';

@customElement('lnl-calculator-simple')
export class LnLCalculatorSimple extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 600px;
      margin: 0 auto;
    }

    .calculator {
      padding: 20px;
    }

    .coordinate-input {
      margin-bottom: 15px;
    }

    .coordinate-input label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    .coordinate-input sp-textfield {
      width: 100%;
    }

    .buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 15px;
    }

    sp-button {
      height: 40px;
    }

    .results {
      margin-top: 20px;
      padding: 15px;
      background-color: var(--spectrum-gray-100);
      border-radius: 8px;
    }
  `;

  @state()
  private coord1 = '';

  @state()
  private coord2 = '';

  @state()
  private results = {
    distance: '',
    bearing: '',
    midpoint: ''
  };

  private handleCoord1Change(event: Event) {
    const target = event.target as HTMLInputElement;
    this.coord1 = target.value;
  }

  private handleCoord2Change(event: Event) {
    const target = event.target as HTMLInputElement;
    this.coord2 = target.value;
  }

  private calculate() {
    if (this.coord1 && this.coord2) {
      this.results = {
        distance: 'Calculation functionality coming soon!',
        bearing: 'Ready for coordinate parsing',
        midpoint: 'Enhanced features loading...'
      };
    } else {
      this.results = {
        distance: 'Please enter both coordinates',
        bearing: '',
        midpoint: ''
      };
    }
  }

  private clear() {
    this.coord1 = '';
    this.coord2 = '';
    this.results = {
      distance: '',
      bearing: '',
      midpoint: ''
    };
  }

  render() {
    return html`
      <sp-card>
        <div class="calculator">
          <h2>Coordinate Input Test</h2>
          
          <div class="coordinate-input">
            <label>Point 1 Coordinates</label>
            <sp-textfield 
              placeholder="Enter coordinates (any format)"
              value="${this.coord1}"
              @input="${this.handleCoord1Change}">
            </sp-textfield>
          </div>

          <div class="coordinate-input">
            <label>Point 2 Coordinates</label>
            <sp-textfield 
              placeholder="Enter coordinates (any format)"
              value="${this.coord2}"
              @input="${this.handleCoord2Change}">
            </sp-textfield>
          </div>

          <div class="buttons">
            <sp-button variant="accent" @click="${this.calculate}">
              Calculate
            </sp-button>
            <sp-button variant="secondary" @click="${this.clear}">
              Clear
            </sp-button>
          </div>

          ${this.results.distance ? html`
            <div class="results">
              <h3>Results</h3>
              <p><strong>Status:</strong> ${this.results.distance}</p>
              ${this.results.bearing ? html`<p><strong>Info:</strong> ${this.results.bearing}</p>` : ''}
              ${this.results.midpoint ? html`<p><strong>Note:</strong> ${this.results.midpoint}</p>` : ''}
            </div>
          ` : ''}
        </div>
      </sp-card>
    `;
  }
} 