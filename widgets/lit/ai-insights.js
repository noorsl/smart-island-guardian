import { LitElement, html, css } from 'lit';
import { styleImports } from 'styles';
import { fetch } from 'fetch';

export default class DefaultWebComponent extends LitElement {

  /*
   * =========================================================
   * DEVICE CONFIGURATION
   * =========================================================
   */

  static DEVICE_IDS = {
    water: 'WATER_LEVEL_DEVICE_ID',
    soil: 'SOIL_MOISTURE_DEVICE_ID',
    mosquito: 'MOSQUITO_DEVICE_ID',
    rodent: 'ANIMAL_TRAP_DEVICE_ID'
  };

  /*
   * Auto refresh interval.
   */
  static REFRESH_INTERVAL = 30000;


  static properties = {
    waterLevel: { type: Number },
    soilMoisture: { type: Number },
    mosquitoActivity: { type: Number },
    rodentOccupied: { type: Boolean },
    rodentEventText: { type: String },
    lastUpdated: { type: String },
    loading: { type: Boolean },
    error: { type: String }
  };


  constructor() {
    super();
    this.waterLevel = null;
    this.soilMoisture = null;
    this.mosquitoActivity = null;
    this.rodentOccupied = false;
    this.rodentEventText = '';
    this.lastUpdated = '';
    this.loading = true;
    this.error = '';
    this.refreshTimer = null;
  }


  static styles = css`

    :host {
      display: block;
      box-sizing: border-box;
    }

    .sg-ai-container {
      box-sizing: border-box;
      width: 100%;
      background: #ffffff;
      border: 1px solid #dfe7ea;
      border-radius: 16px;
      padding: 22px;
      font-family: Arial, sans-serif;
      box-shadow: 0 3px 12px rgba(0,0,0,0.04);
    }

    /* HEADER */

    .sg-ai-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      padding-bottom: 18px;
      border-bottom: 1px solid #e3e9eb;
    }

    .sg-ai-title-group {
      display: flex;
      align-items: center;
      gap: 13px;
    }

    .sg-ai-icon {
      width: 46px;
      height: 46px;
      flex: 0 0 46px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #dff5f7;
      color: #126b75;
    }

    .sg-ai-icon svg {
      width: 23px;
      height: 23px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .sg-ai-title {
      font-size: 20px;
      line-height: 1.2;
      font-weight: 700;
      color: #124d57;
    }

    .sg-ai-subtitle {
      margin-top: 4px;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 1.6px;
      text-transform: uppercase;
      color: #71858a;
    }

    .sg-ai-update {
      text-align: right;
      font-size: 10px;
      color: #87969a;
      line-height: 1.4;
    }

    /* SYSTEM STATUS SUMMARY */

    .sg-summary {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
      padding: 18px 0;
    }

    .sg-summary-item {
      min-width: 0;
      padding: 12px;
      border-radius: 12px;
      background: #f7f9fa;
      border: 1px solid #edf1f2;
    }

    .sg-summary-label {
      font-size: 11px;
      color: #718187;
    }

    .sg-summary-value {
      margin-top: 5px;
      font-size: 18px;
      font-weight: 700;
      color: #174d56;
    }

    /* INSIGHT */

    .sg-insight {
      display: flex;
      gap: 14px;
      padding: 16px 0;
      border-top: 1px solid #e4eaec;
    }

    .sg-insight:first-of-type {
      border-top: none;
    }

    .sg-insight-icon {
      width: 42px;
      height: 42px;
      flex: 0 0 42px;
      display: grid;
      place-items: center;
      border-radius: 50%;
    }

    .sg-insight-icon svg {
      width: 21px;
      height: 21px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .sg-insight-title {
      font-size: 14px;
      font-weight: 700;
      line-height: 1.3;
    }

    .sg-insight-description {
      margin-top: 5px;
      font-size: 12px;
      line-height: 1.55;
      color: #65777c;
    }

    /* PRIORITIES */

    .sg-danger-icon { background: #fdeaea; color: #d94c4c; }
    .sg-danger-text { color: #d94c4c; }
    .sg-warning-icon { background: #fff1df; color: #d57a13; }
    .sg-warning-text { color: #b96910; }
    .sg-info-icon { background: #e4f4f8; color: #18809a; }
    .sg-info-text { color: #17687b; }
    .sg-good-icon { background: #e7f5ed; color: #17804b; }
    .sg-good-text { color: #17804b; }
    .sg-unknown-text { color: #87969a; }

    /* MESSAGE STATES */

    .sg-message {
      padding: 20px 0;
      font-size: 13px;
      color: #687a7f;
    }

    .sg-error {
      padding: 16px;
      border-radius: 10px;
      background: #fdeaea;
      color: #c84242;
      font-size: 13px;
    }

    /* RESPONSIVE */

    @media (max-width: 900px) {
      .sg-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    @media (max-width: 600px) {
      .sg-ai-header { flex-direction: column; }
      .sg-ai-update { text-align: left; }
      .sg-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .sg-ai-title { font-size: 18px; }
    }
  `;


  /*
   * =========================================================
   * LIFECYCLE
   * =========================================================
   */

  firstUpdated() {
    this.loadAllData();
    this.refreshTimer = setInterval(
      () => this.loadAllData(),
      this.constructor.REFRESH_INTERVAL
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }


  /*
   * =========================================================
   * DATA LOADING
   * =========================================================
   * Each device loads on its own: if one sensor has no data,
   * the others still show instead of the whole widget failing.
   */

  async loadAllData() {
    try {
      this.error = '';

      const firstLoad =
        this.waterLevel === null &&
        this.soilMoisture === null &&
        this.mosquitoActivity === null;

      if (firstLoad) {
        this.loading = true;
      }

      const safe = (promise, fallback) => promise.catch(() => fallback);

      const [water, soil, mosquito, rodent] = await Promise.all([
        safe(this.loadLatestMeasurement(this.constructor.DEVICE_IDS.water, 'WaterLevel', 'waterLevel'), null),
        safe(this.loadLatestMeasurement(this.constructor.DEVICE_IDS.soil, 'soilMoisture', 'moisture'), null),
        safe(this.loadLatestMeasurement(this.constructor.DEVICE_IDS.mosquito, 'Mosquito', 'Activity'), null),
        safe(this.loadLatestRodentEvent(this.constructor.DEVICE_IDS.rodent), { occupied: false, text: '' })
      ]);

      this.waterLevel = water;
      this.soilMoisture = soil;
      this.mosquitoActivity = mosquito;
      this.rodentOccupied = rodent.occupied;
      this.rodentEventText = rodent.text;

      if (water === null && soil === null && mosquito === null) {
        this.error = 'Unable to refresh dashboard data: no sensor readings received yet.';
      }

      this.lastUpdated = new Date().toLocaleTimeString('en-US');

    } catch (error) {
      this.error =
        'Unable to refresh dashboard data: ' +
        (error?.message || 'Unknown error');
    } finally {
      this.loading = false;
    }
  }


  async loadLatestMeasurement(deviceId, fragment, series) {

    if (!deviceId || deviceId.startsWith('PUT_')) {
      throw new Error(`Device ID missing for ${fragment}`);
    }

    const response = await fetch(
      `/measurement/measurements` +
      `?source=${encodeURIComponent(deviceId)}` +
      `&pageSize=20` +
      `&revert=true`
    );

    if (!response.ok) {
      throw new Error(`${fragment} request failed (${response.status})`);
    }

    const data = await response.json();
    const measurements = data.measurements || [];

    for (const measurement of measurements) {
      const value = measurement?.[fragment]?.[series]?.value;
      if (value !== undefined && value !== null) {
        return Number(value);
      }
    }

    throw new Error(`${fragment}.${series} measurement not found`);
  }


  async loadLatestRodentEvent(deviceId) {

    if (!deviceId || deviceId.startsWith('PUT_')) {
      throw new Error('Animal control device ID missing');
    }

    const response = await fetch(
      `/event/events` +
      `?source=${encodeURIComponent(deviceId)}` +
      `&pageSize=1`
    );

    if (!response.ok) {
      throw new Error(`Animal control event request failed (${response.status})`);
    }

    const data = await response.json();
    const event = data.events?.[0];

    if (!event) {
      return { occupied: false, text: '' };
    }

    const text = event.text || '';
    const normalized = text.toLowerCase();

    /*
     * Current simulator event: "Rodent detected in trap"
     */
    const occupied = normalized.includes('rodent detected');

    return { occupied, text };
  }


  /*
   * =========================================================
   * STATUS RULES
   * =========================================================
   */

  getWaterStatus() {
    if (this.waterLevel === null) return { level: 'unknown', label: 'No data' };
    if (this.waterLevel < 30) return { level: 'danger', label: 'Critical' };
    if (this.waterLevel < 60) return { level: 'warning', label: 'Monitor' };
    return { level: 'good', label: 'Normal' };
  }

  getSoilStatus() {
    if (this.soilMoisture === null) return { level: 'unknown', label: 'No data' };
    if (this.soilMoisture < 30) return { level: 'danger', label: 'Low' };
    if (this.soilMoisture < 50) return { level: 'warning', label: 'Needs Water' };
    return { level: 'good', label: 'Good' };
  }

  getMosquitoStatus() {
    if (this.mosquitoActivity === null) return { level: 'unknown', label: 'No data' };
    /*
     * 0–4 = Normal, 5–7 = Moderate, 8+ = High
     */
    if (this.mosquitoActivity >= 8) return { level: 'danger', label: 'High' };
    if (this.mosquitoActivity >= 5) return { level: 'warning', label: 'Moderate' };
    return { level: 'good', label: 'Normal' };
  }


  /*
   * =========================================================
   * INSIGHT GENERATION
   * =========================================================
   */

  buildInsights() {

    const insights = [];
    const water = this.getWaterStatus();
    const soil = this.getSoilStatus();
    const mosquito = this.getMosquitoStatus();

    /* MOSQUITO */
    if (mosquito.level === 'danger') {
      insights.push({
        priority: 1, level: 'danger', icon: 'bug',
        title: 'Increase mosquito control',
        description:
          `Mosquito activity is high (${this.mosquitoActivity} detections). ` +
          `Inspect the affected area and consider targeted control measures.`
      });
    } else if (mosquito.level === 'warning') {
      insights.push({
        priority: 3, level: 'warning', icon: 'bug',
        title: 'Monitor mosquito activity',
        description:
          `Mosquito activity is moderate (${this.mosquitoActivity} detections). ` +
          `Continue monitoring for further increases.`
      });
    }

    /* ANIMAL CONTROL */
    if (this.rodentOccupied) {
      insights.push({
        priority: 1, level: 'danger', icon: 'activity',
        title: 'Animal control trap requires attention',
        description:
          'A capture event was received from the Smart Pest Trap. ' +
          'Inspect and service the trap.'
      });
    }

    /* SOIL */
    if (soil.level === 'danger') {
      insights.push({
        priority: 1, level: 'danger', icon: 'sprout',
        title: 'Soil moisture is low',
        description: `Soil moisture is ${this.soilMoisture}%. Irrigation is recommended.`
      });
    } else if (soil.level === 'warning') {
      insights.push({
        priority: 2, level: 'warning', icon: 'sprout',
        title: 'Soil moisture needs attention',
        description: `Soil moisture is ${this.soilMoisture}%. Monitor the area and consider irrigation.`
      });
    }

    /* WATER */
    if (water.level === 'danger') {
      insights.push({
        priority: 1, level: 'danger', icon: 'water',
        title: 'Water level is critically low',
        description:
          `Water level is ${this.waterLevel}%. ` +
          `Immediate review of water availability is recommended.`
      });
    } else if (water.level === 'warning') {
      insights.push({
        priority: 2, level: 'warning', icon: 'water',
        title: 'Water level requires monitoring',
        description:
          `Water level is ${this.waterLevel}%. ` +
          `Continue monitoring for further reduction.`
      });
    }

    /* POSITIVE / NORMAL STATUS */
    if (insights.length === 0) {
      insights.push({
        priority: 5, level: 'good', icon: 'check',
        title: 'Operations within normal range',
        description:
          'Water level, soil moisture, mosquito activity, and animal control trap status are currently within normal operating conditions.'
      });
    }

    if (water.level === 'good') {
      insights.push({
        priority: 5, level: 'good', icon: 'water',
        title: 'Water level stable',
        description:
          `Current water level is ${this.waterLevel}% and remains within the configured normal range.`
      });
    }

    return insights
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 5);
  }


  /*
   * =========================================================
   * ICONS
   * =========================================================
   */

  renderIcon(type) {

    if (type === 'water') {
      return html`
        <svg viewBox="0 0 24 24">
          <path d="M12 22a7 7 0 0 0 7-7c0-4-7-13-7-13S5 11 5 15a7 7 0 0 0 7 7Z"></path>
        </svg>
      `;
    }

    if (type === 'sprout') {
      return html`
        <svg viewBox="0 0 24 24">
          <path d="M7 20h10"></path>
          <path d="M10 20c5.5-2.5.8-6.4 3-10"></path>
          <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8Z"></path>
          <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2Z"></path>
        </svg>
      `;
    }

    if (type === 'bug') {
      return html`
        <svg viewBox="0 0 24 24">
          <path d="M12 20a8 8 0 0 0 8-8v-2a8 8 0 1 0-16 0v2a8 8 0 0 0 8 8Z"></path>
          <path d="M8 6 6.5 4.5"></path>
          <path d="M16 6l1.5-1.5"></path>
          <path d="M4 11H1.5"></path>
          <path d="M22.5 11H20"></path>
          <path d="M12 12v8"></path>
        </svg>
      `;
    }

    if (type === 'activity') {
      return html`
        <svg viewBox="0 0 24 24">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
      `;
    }

    return html`
      <svg viewBox="0 0 24 24">
        <path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.7 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.5 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1Z"></path>
        <path d="m9 12 2 2 4-4"></path>
      </svg>
    `;
  }


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  renderInsight(insight) {
    return html`
      <div class="sg-insight">
        <div class="sg-insight-icon sg-${insight.level}-icon">
          ${this.renderIcon(insight.icon)}
        </div>
        <div>
          <div class="sg-insight-title sg-${insight.level}-text">
            ${insight.title}
          </div>
          <div class="sg-insight-description">
            ${insight.description}
          </div>
        </div>
      </div>
    `;
  }

  show(value, unit = '') {
    return value === null || value === undefined ? '–' : value + unit;
  }

  render() {

    const water = this.getWaterStatus();
    const soil = this.getSoilStatus();
    const mosquito = this.getMosquitoStatus();
    const insights = this.buildInsights();

    return html`

      <style>
        ${styleImports}
      </style>

      <div class="sg-ai-container">

        <!-- HEADER -->
        <div class="sg-ai-header">
          <div class="sg-ai-title-group">
            <div class="sg-ai-icon">
              <svg viewBox="0 0 24 24">
                <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"></path>
                <path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7Z"></path>
              </svg>
            </div>
            <div>
              <div class="sg-ai-title">AI Insights & Recommendations</div>
              <div class="sg-ai-subtitle">Live operational prioritization</div>
            </div>
          </div>
          <div class="sg-ai-update">
            Auto refresh: 30 sec
            <br>
            ${this.lastUpdated ? `Updated ${this.lastUpdated}` : ''}
          </div>
        </div>

        ${
          this.loading
            ? html`<div class="sg-message">Loading live IoT data...</div>`
            : this.error
              ? html`<div class="sg-error">${this.error}</div>`
              : html`

                  <!-- LIVE STATUS SUMMARY -->
                  <div class="sg-summary">

                    <div class="sg-summary-item">
                      <div class="sg-summary-label">Water Level</div>
                      <div class="sg-summary-value">${this.show(this.waterLevel, '%')}</div>
                      <div class="sg-${water.level}-text">${water.label}</div>
                    </div>

                    <div class="sg-summary-item">
                      <div class="sg-summary-label">Soil Moisture</div>
                      <div class="sg-summary-value">${this.show(this.soilMoisture, '%')}</div>
                      <div class="sg-${soil.level}-text">${soil.label}</div>
                    </div>

                    <div class="sg-summary-item">
                      <div class="sg-summary-label">Mosquito Activity</div>
                      <div class="sg-summary-value">${this.show(this.mosquitoActivity)}</div>
                      <div class="sg-${mosquito.level}-text">${mosquito.label}</div>
                    </div>

                    <div class="sg-summary-item">
                      <div class="sg-summary-label">Animal Control</div>
                      <div class="sg-summary-value">${this.rodentOccupied ? 'Occupied' : 'Empty'}</div>
                      <div class="${this.rodentOccupied ? 'sg-danger-text' : 'sg-good-text'}">
                        ${this.rodentOccupied ? 'Action required' : 'Normal'}
                      </div>
                    </div>

                  </div>

                  <!-- GENERATED INSIGHTS -->
                  ${insights.map((insight) => this.renderInsight(insight))}
                `
        }

      </div>
    `;
  }
}
