import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import {
  ScheduleCardConfig,
  HomeAssistant,
  ScheduleEntityAttributes,
  ScheduleDict,
  ScheduleEventUI,
  ScheduleEvent,
  DatapointCategory,
  WEEKDAYS,
  Weekday,
  WeekdayBit,
  TimeBase,
} from "./types";
import {
  scheduleToUIEvents,
  formatLevel,
  formatDuration,
  createEmptyEvent,
  validateEvent,
  parseTime,
  convertToBackendFormat,
} from "./utils";
import { getTranslations, Translations } from "./localization";

@customElement("homematicip-local-schedule-card")
export class HomematicScheduleCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: ScheduleCardConfig;
  @state() private _scheduleData?: ScheduleDict;
  @state() private _activeEntityId?: string;
  @state() private _category?: DatapointCategory;
  @state() private _isLoading: boolean = false;
  @state() private _translations: Translations = getTranslations("en");
  @state() private _editingEvent?: ScheduleEvent;
  @state() private _editingGroupNo?: number;
  @state() private _showEditor: boolean = false;

  public setConfig(config: ScheduleCardConfig): void {
    const entityIds: string[] = [];
    const addEntity = (entityId?: string) => {
      if (!entityId) return;
      const trimmed = entityId.trim();
      if (!trimmed) return;
      if (!entityIds.includes(trimmed)) {
        entityIds.push(trimmed);
      }
    };

    addEntity(config.entity);
    if (Array.isArray(config.entities)) {
      config.entities.forEach((entityId) => addEntity(entityId));
    }

    if (entityIds.length === 0) {
      throw new Error("You need to define at least one entity");
    }

    entityIds.sort((a, b) => a.localeCompare(b));

    const previousEntity = this._activeEntityId;
    const fallbackEntity = entityIds[0];
    const nextActiveEntity =
      previousEntity && entityIds.includes(previousEntity) ? previousEntity : fallbackEntity;

    this._config = {
      editable: true,
      hour_format: "24",
      time_step_minutes: 15,
      ...config,
      entity: fallbackEntity,
      entities: [...entityIds],
    };

    this._activeEntityId = nextActiveEntity;
    this._editingEvent = undefined;
    this._editingGroupNo = undefined;
    this._showEditor = false;

    // Set language from config or detect from Home Assistant
    this._updateLanguage();
  }

  private _updateLanguage(): void {
    let language = "en"; // Default to English

    // Priority 1: Explicit language setting in card config
    if (this._config?.language) {
      language = this._config.language;
    }
    // Priority 2: Home Assistant language
    else if (this.hass?.language) {
      language = this.hass.language;
    }
    // Priority 3: Home Assistant locale
    else if (this.hass?.locale?.language) {
      language = this.hass.locale.language;
    }

    this._translations = getTranslations(language);
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has("hass")) {
      const oldHass = changedProps.get("hass") as HomeAssistant | undefined;
      if (this.hass && oldHass) {
        // Check if language changed
        if (
          this.hass.language !== oldHass.language ||
          this.hass.locale?.language !== oldHass.locale?.language
        ) {
          this._updateLanguage();
        }

        // Check if entity state changed
        if (this._activeEntityId) {
          const oldState = oldHass.states?.[this._activeEntityId];
          const newState = this.hass.states?.[this._activeEntityId];
          if (oldState !== newState) {
            this._updateScheduleData();
          }
        }
      } else if (this.hass && !oldHass) {
        this._updateScheduleData();
      }
    }

    if (changedProps.has("_activeEntityId")) {
      this._updateScheduleData();
    }

    return true;
  }

  private _updateScheduleData(): void {
    if (!this._activeEntityId || !this.hass?.states) {
      this._scheduleData = undefined;
      this._category = undefined;
      return;
    }

    const entity = this.hass.states[this._activeEntityId];
    if (!entity) {
      this._scheduleData = undefined;
      this._category = undefined;
      return;
    }

    const attributes = entity.attributes as unknown as ScheduleEntityAttributes;
    this._scheduleData = attributes.schedule_data;
    this._category = attributes.datapoint_category;
  }

  private _getEntityName(entityId: string): string {
    const entity = this.hass?.states?.[entityId];
    return entity?.attributes?.friendly_name || entityId;
  }

  private _handleEntityChange(e: Event): void {
    const select = e.target as HTMLSelectElement;
    this._activeEntityId = select.value;
    this._closeEditor();
  }

  private _handleAddEvent(): void {
    const newEvent = createEmptyEvent(this._category);
    // Find next available group number
    const existingGroupNos = this._scheduleData
      ? Object.keys(this._scheduleData).map((k) => parseInt(k, 10))
      : [];
    const maxGroupNo = existingGroupNos.length > 0 ? Math.max(...existingGroupNos) : 0;
    this._editingGroupNo = maxGroupNo + 1;
    this._editingEvent = { ...newEvent };
    this._showEditor = true;
  }

  private _handleEditEvent(event: ScheduleEventUI): void {
    this._editingGroupNo = event.groupNo;
    this._editingEvent = { ...event };
    this._showEditor = true;
  }

  private _handleDeleteEvent(event: ScheduleEventUI): void {
    if (!confirm(this._translations.ui.confirmDelete || "Delete this event?")) {
      return;
    }

    const updatedSchedule = { ...this._scheduleData };
    delete updatedSchedule[event.groupNo.toString()];
    this._saveSchedule(updatedSchedule);
  }

  private _closeEditor(): void {
    this._showEditor = false;
    this._editingEvent = undefined;
    this._editingGroupNo = undefined;
  }

  private _handleSaveEvent(): void {
    if (!this._editingEvent || this._editingGroupNo === undefined) {
      return;
    }

    const errors = validateEvent(this._editingEvent, this._category);
    if (errors.length > 0) {
      alert(`Validation errors:\n${errors.map((e) => `- ${e.field}: ${e.message}`).join("\n")}`);
      return;
    }

    const updatedSchedule = {
      ...this._scheduleData,
      [this._editingGroupNo.toString()]: this._editingEvent,
    };

    this._saveSchedule(updatedSchedule);
    this._closeEditor();
  }

  private async _saveSchedule(scheduleDict: ScheduleDict): Promise<void> {
    if (!this._activeEntityId || !this.hass) {
      return;
    }

    this._isLoading = true;

    try {
      const backendFormat = convertToBackendFormat(scheduleDict);

      await this.hass.callService("homematicip_local", "set_schedule", {
        entity_id: this._activeEntityId,
        schedule: backendFormat,
      });

      // Update local state optimistically
      this._scheduleData = scheduleDict;
    } catch (error) {
      alert(`Failed to save schedule: ${error}`);
    } finally {
      this._isLoading = false;
    }
  }

  private _updateEditingEvent(updates: Partial<ScheduleEvent>): void {
    if (!this._editingEvent) return;
    this._editingEvent = { ...this._editingEvent, ...updates };
    this.requestUpdate();
  }

  private _groupEventsByWeekday(): Map<Weekday, ScheduleEventUI[]> {
    const grouped = new Map<Weekday, ScheduleEventUI[]>();

    if (!this._scheduleData) {
      return grouped;
    }

    const uiEvents = scheduleToUIEvents(this._scheduleData);

    for (const event of uiEvents) {
      for (const weekday of event.weekdayNames) {
        if (!grouped.has(weekday)) {
          grouped.set(weekday, []);
        }
        grouped.get(weekday)!.push(event);
      }
    }

    return grouped;
  }

  private _renderEntitySelector() {
    if (!this._config?.entities || this._config.entities.length <= 1) {
      return html``;
    }

    return html`
      <div class="entity-selector">
        <select @change=${this._handleEntityChange} .value=${this._activeEntityId || ""}>
          ${this._config.entities.map(
            (entityId) => html`
              <option value=${entityId} ?selected=${entityId === this._activeEntityId}>
                ${this._getEntityName(entityId)}
              </option>
            `,
          )}
        </select>
      </div>
    `;
  }

  private _renderScheduleList() {
    if (!this._scheduleData) {
      return html`<div class="no-data">${this._translations.ui.loading}</div>`;
    }

    const groupedEvents = this._groupEventsByWeekday();

    if (groupedEvents.size === 0) {
      return html`
        <div class="no-data">
          <p>No schedule events configured</p>
          ${this._config?.editable
            ? html`<button @click=${this._handleAddEvent} class="add-button">
                ${this._translations.ui.addEvent || "Add Event"}
              </button>`
            : ""}
        </div>
      `;
    }

    return html`
      <div class="schedule-list">
        ${this._config?.editable
          ? html`<div class="toolbar">
              <button @click=${this._handleAddEvent} class="add-button">
                ${this._translations.ui.addEvent || "Add Event"}
              </button>
            </div>`
          : ""}
        ${WEEKDAYS.map((weekday) => {
          const events = groupedEvents.get(weekday) || [];
          if (events.length === 0) return html``;

          return html`
            <div class="weekday-section">
              <div class="weekday-header">
                ${this._translations.weekdays.long[
                  weekday.toLowerCase() as keyof typeof this._translations.weekdays.long
                ]}
              </div>
              <div class="events-table">
                <div class="events-header">
                  <div class="col-time">${this._translations.ui.time || "Time"}</div>
                  <div class="col-duration">${this._translations.ui.duration || "Duration"}</div>
                  <div class="col-level">${this._translations.ui.state || "State"}</div>
                  ${this._config?.editable ? html`<div class="col-actions"></div>` : ""}
                </div>
                ${repeat(
                  events,
                  (event) => event.groupNo,
                  (event) => this._renderEvent(event),
                )}
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  private _renderEvent(event: ScheduleEventUI) {
    const levelText = formatLevel(event.LEVEL, this._category);
    const durationText =
      event.DURATION_BASE !== undefined && event.DURATION_FACTOR !== undefined
        ? formatDuration(event.DURATION_BASE, event.DURATION_FACTOR)
        : "-";

    return html`
      <div class="event-row ${event.isActive ? "active" : "inactive"}">
        <div class="col-time">${event.timeString}</div>
        <div class="col-duration">${durationText}</div>
        <div class="col-level">
          ${levelText}
          ${event.LEVEL_2 !== undefined
            ? html`<span class="level-2"
                >, ${this._translations.ui.slat}: ${Math.round(event.LEVEL_2 * 100)}%</span
              >`
            : ""}
        </div>
        ${this._config?.editable
          ? html`<div class="col-actions">
              <button @click=${() => this._handleEditEvent(event)} class="icon-button" title="Edit">
                ✏️
              </button>
              <button
                @click=${() => this._handleDeleteEvent(event)}
                class="icon-button"
                title="Delete"
              >
                🗑️
              </button>
            </div>`
          : ""}
      </div>
    `;
  }

  private _renderEditor() {
    if (!this._showEditor || !this._editingEvent) {
      return html``;
    }

    const isNewEvent = !this._scheduleData?.[this._editingGroupNo?.toString() || ""];

    return html`
      <div class="editor-overlay" @click=${this._closeEditor}>
        <div class="editor-dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="editor-header">
            <h3>
              ${isNewEvent ? this._translations.ui.addEvent : this._translations.ui.editEvent}
            </h3>
            <button @click=${this._closeEditor} class="close-button">✕</button>
          </div>
          <div class="editor-content">
            ${this._renderTimeFields()} ${this._renderWeekdayFields()} ${this._renderLevelFields()}
            ${this._renderDurationFields()} ${this._renderChannelFields()}
          </div>
          <div class="editor-footer">
            <button @click=${this._closeEditor} class="button-secondary">
              ${this._translations.ui.cancel || "Cancel"}
            </button>
            <button @click=${this._handleSaveEvent} class="button-primary">
              ${this._translations.ui.save || "Save"}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderTimeFields() {
    if (!this._editingEvent) return html``;

    const timeString = `${String(this._editingEvent.FIXED_HOUR).padStart(2, "0")}:${String(this._editingEvent.FIXED_MINUTE).padStart(2, "0")}`;

    return html`
      <div class="form-group">
        <label>${this._translations.ui.time || "Time"}</label>
        <input
          type="time"
          .value=${timeString}
          @change=${(e: Event) => {
            const target = e.target as HTMLInputElement;
            const parsed = parseTime(target.value);
            this._updateEditingEvent({
              FIXED_HOUR: parsed.hour,
              FIXED_MINUTE: parsed.minute,
            });
          }}
        />
      </div>
    `;
  }

  private _renderWeekdayFields() {
    if (!this._editingEvent) return html``;

    return html`
      <div class="form-group">
        <label>${this._translations.ui.weekdays || "Weekdays"}</label>
        <div class="weekday-checkboxes">
          ${WEEKDAYS.map((weekday) => {
            const bit = WeekdayBit[weekday];
            const isChecked = this._editingEvent!.WEEKDAY.includes(bit);
            return html`
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  .checked=${isChecked}
                  @change=${(e: Event) => {
                    const checked = (e.target as HTMLInputElement).checked;
                    const currentWeekdays = [...this._editingEvent!.WEEKDAY];
                    if (checked && !currentWeekdays.includes(bit)) {
                      currentWeekdays.push(bit);
                    } else if (!checked) {
                      const index = currentWeekdays.indexOf(bit);
                      if (index > -1) currentWeekdays.splice(index, 1);
                    }
                    this._updateEditingEvent({ WEEKDAY: currentWeekdays });
                  }}
                />
                ${this._translations.weekdays.short[
                  weekday.toLowerCase() as keyof typeof this._translations.weekdays.short
                ]}
              </label>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _renderLevelFields() {
    if (!this._editingEvent) return html``;

    const isSwitch = this._category === "SWITCH" || this._category === "LOCK";

    return html`
      <div class="form-group">
        <label>${this._translations.ui.state || "State"}</label>
        ${isSwitch
          ? html`
              <select
                .value=${String(this._editingEvent.LEVEL)}
                @change=${(e: Event) => {
                  const value = parseInt((e.target as HTMLSelectElement).value, 10);
                  this._updateEditingEvent({ LEVEL: value });
                }}
              >
                <option value="0">Off</option>
                <option value="1">On</option>
              </select>
            `
          : html`
              <input
                type="range"
                min="0"
                max="100"
                .value=${String(Math.round(this._editingEvent.LEVEL * 100))}
                @input=${(e: Event) => {
                  const value = parseInt((e.target as HTMLInputElement).value, 10) / 100;
                  this._updateEditingEvent({ LEVEL: value });
                }}
              />
              <span>${Math.round(this._editingEvent.LEVEL * 100)}%</span>
            `}
      </div>
      ${this._category === "COVER"
        ? html`
            <div class="form-group">
              <label>${this._translations.ui.slat || "Slat Position"}</label>
              <input
                type="range"
                min="0"
                max="100"
                .value=${String(Math.round((this._editingEvent.LEVEL_2 || 0) * 100))}
                @input=${(e: Event) => {
                  const value = parseInt((e.target as HTMLInputElement).value, 10) / 100;
                  this._updateEditingEvent({ LEVEL_2: value });
                }}
              />
              <span>${Math.round((this._editingEvent.LEVEL_2 || 0) * 100)}%</span>
            </div>
          `
        : ""}
    `;
  }

  private _renderDurationFields() {
    if (!this._editingEvent) return html``;
    if (this._category !== "SWITCH" && this._category !== "LIGHT") return html``;

    return html`
      <div class="form-group">
        <label>${this._translations.ui.duration || "Duration"}</label>
        <input
          type="number"
          min="0"
          .value=${String(this._editingEvent.DURATION_FACTOR || 0)}
          @input=${(e: Event) => {
            const value = parseInt((e.target as HTMLInputElement).value, 10);
            this._updateEditingEvent({ DURATION_FACTOR: value });
          }}
        />
        <select
          .value=${String(this._editingEvent.DURATION_BASE || TimeBase.MS_100)}
          @change=${(e: Event) => {
            const value = parseInt((e.target as HTMLSelectElement).value, 10);
            this._updateEditingEvent({ DURATION_BASE: value as TimeBase });
          }}
        >
          <option value=${TimeBase.MS_100}>× 100ms</option>
          <option value=${TimeBase.SEC_1}>× 1s</option>
          <option value=${TimeBase.SEC_5}>× 5s</option>
          <option value=${TimeBase.SEC_10}>× 10s</option>
          <option value=${TimeBase.MIN_1}>× 1m</option>
          <option value=${TimeBase.MIN_5}>× 5m</option>
          <option value=${TimeBase.MIN_10}>× 10m</option>
          <option value=${TimeBase.HOUR_1}>× 1h</option>
        </select>
      </div>
    `;
  }

  private _renderChannelFields() {
    if (!this._editingEvent) return html``;

    return html`
      <div class="form-group">
        <label>${this._translations.ui.channels || "Target Channels"}</label>
        <input
          type="text"
          .value=${this._editingEvent.TARGET_CHANNELS.join(", ")}
          @input=${(e: Event) => {
            const value = (e.target as HTMLInputElement).value;
            const channels = value
              .split(",")
              .map((s) => parseInt(s.trim(), 10))
              .filter((n) => !isNaN(n));
            this._updateEditingEvent({ TARGET_CHANNELS: channels });
          }}
          placeholder="1, 2, 4, 8"
        />
      </div>
    `;
  }

  protected render() {
    if (!this._config) {
      return html``;
    }

    const cardTitle = this._config.name || this._getEntityName(this._activeEntityId || "");

    return html`
      <ha-card>
        <div class="card-header">
          <div class="card-title">${cardTitle}</div>
        </div>
        <div class="card-content">
          ${this._renderEntitySelector()} ${this._renderScheduleList()}
        </div>
      </ha-card>
      ${this._renderEditor()}
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      ha-card {
        padding: 16px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .card-title {
        font-size: 24px;
        font-weight: 500;
      }

      .entity-selector {
        margin-bottom: 16px;
      }

      .entity-selector select {
        width: 100%;
        padding: 8px;
        font-size: 14px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
      }

      .no-data {
        text-align: center;
        padding: 32px;
        color: var(--secondary-text-color);
      }

      .toolbar {
        margin-bottom: 16px;
        display: flex;
        justify-content: flex-end;
      }

      .add-button {
        padding: 8px 16px;
        background: var(--primary-color);
        color: var(--text-primary-color);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      }

      .add-button:hover {
        opacity: 0.9;
      }

      .schedule-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .weekday-section {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        overflow: hidden;
      }

      .weekday-header {
        background: var(--primary-color);
        color: var(--text-primary-color);
        padding: 8px 16px;
        font-weight: 500;
      }

      .events-table {
        display: flex;
        flex-direction: column;
      }

      .events-header {
        display: grid;
        grid-template-columns: 80px 100px 1fr 80px;
        gap: 12px;
        padding: 8px 16px;
        background: var(--secondary-background-color);
        font-weight: 500;
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .events-header.no-actions {
        grid-template-columns: 80px 100px 1fr;
      }

      .event-row {
        display: grid;
        grid-template-columns: 80px 100px 1fr 80px;
        gap: 12px;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid var(--divider-color);
      }

      .event-row.no-actions {
        grid-template-columns: 80px 100px 1fr;
      }

      .event-row:last-child {
        border-bottom: none;
      }

      .event-row.inactive {
        opacity: 0.5;
      }

      .col-time {
        font-weight: 500;
      }

      .col-duration {
        color: var(--secondary-text-color);
      }

      .col-level .level-2 {
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }

      .col-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      .icon-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        font-size: 16px;
        opacity: 0.7;
      }

      .icon-button:hover {
        opacity: 1;
      }

      /* Editor Overlay */
      .editor-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .editor-dialog {
        background: var(--card-background-color);
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow: auto;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid var(--divider-color);
      }

      .editor-header h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
      }

      .close-button {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--secondary-text-color);
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .close-button:hover {
        color: var(--primary-text-color);
      }

      .editor-content {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .form-group label {
        font-weight: 500;
        font-size: 14px;
      }

      .form-group input[type="time"],
      .form-group input[type="text"],
      .form-group input[type="number"],
      .form-group select {
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
      }

      .form-group input[type="range"] {
        width: 100%;
      }

      .weekday-checkboxes {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        font-size: 14px;
      }

      .checkbox-label input[type="checkbox"] {
        cursor: pointer;
      }

      .editor-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px;
        border-top: 1px solid var(--divider-color);
      }

      .button-primary,
      .button-secondary {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      }

      .button-primary {
        background: var(--primary-color);
        color: var(--text-primary-color);
      }

      .button-primary:hover {
        opacity: 0.9;
      }

      .button-secondary {
        background: transparent;
        color: var(--primary-text-color);
        border: 1px solid var(--divider-color);
      }

      .button-secondary:hover {
        background: var(--secondary-background-color);
      }
    `;
  }

  public getCardSize(): number {
    return 4;
  }

  static getConfigElement() {
    return document.createElement("homematicip-local-schedule-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "",
      editable: true,
      hour_format: "24",
    };
  }
}

// Extend window object for custom card registration
declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
    }>;
  }
}

// Register custom card
window.customCards = window.customCards || [];
window.customCards.push({
  type: "homematicip-local-schedule-card",
  name: "HomematicIP Local Schedule Card",
  description:
    "A custom card for Homematic(IP) Local schedules (switch, valve, cover, light, lock)",
});
