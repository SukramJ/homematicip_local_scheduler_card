/**
 * Utility functions for Homematic(IP) Local Schedule Card
 * Based on aiohomematic DefaultWeekProfile implementation
 */

import {
  ScheduleEvent,
  ScheduleDict,
  BackendScheduleDict,
  ScheduleEventUI,
  WeekdayBit,
  Weekday,
  WEEKDAYS,
  WEEKDAY_TO_BIT,
  AstroType,
  ScheduleCondition,
  TimeBase,
  DatapointCategory,
} from "./types";

/**
 * Convert list of weekday bits to weekday names
 * Example: [2, 4, 32] -> ["MONDAY", "TUESDAY", "FRIDAY"]
 */
export function weekdayBitsToNames(bits: WeekdayBit[]): Weekday[] {
  const names: Weekday[] = [];
  for (const weekday of WEEKDAYS) {
    const bit = WEEKDAY_TO_BIT[weekday];
    if (bits.includes(bit)) {
      names.push(weekday);
    }
  }
  return names;
}

/**
 * Convert weekday names to list of bits
 * Example: ["MONDAY", "TUESDAY", "FRIDAY"] -> [2, 4, 32]
 */
export function weekdayNamesToBits(names: Weekday[]): WeekdayBit[] {
  return names.map((name) => WEEKDAY_TO_BIT[name]);
}

/**
 * Convert weekday bit array to bitwise integer
 * Example: [1, 2, 4, 8, 16, 32, 64] -> 127 (all days)
 * Example: [2, 8, 32] -> 42 (Monday, Wednesday, Friday)
 */
export function weekdayBitsToBitwise(bits: WeekdayBit[]): number {
  if (!bits || bits.length === 0) {
    return 0;
  }
  return bits.reduce((result, bit) => result | bit, 0);
}

/**
 * Convert bitwise integer to weekday bit array
 * Example: 127 -> [1, 2, 4, 8, 16, 32, 64] (all days)
 * Example: 42 -> [2, 8, 32] (Monday, Wednesday, Friday)
 */
export function bitwiseToWeekdayBits(value: number): WeekdayBit[] {
  if (value === 0) {
    return [];
  }

  const bits: WeekdayBit[] = [];
  const allBits = [
    WeekdayBit.SUNDAY,
    WeekdayBit.MONDAY,
    WeekdayBit.TUESDAY,
    WeekdayBit.WEDNESDAY,
    WeekdayBit.THURSDAY,
    WeekdayBit.FRIDAY,
    WeekdayBit.SATURDAY,
  ];

  for (const bit of allBits) {
    if (value & bit) {
      bits.push(bit);
    }
  }

  return bits;
}

/**
 * Convert channel bits to bitwise integer (same logic as weekday)
 */
export function channelBitsToBitwise(bits: number[]): number {
  if (!bits || bits.length === 0) {
    return 0;
  }
  return bits.reduce((result, bit) => result | bit, 0);
}

/**
 * Convert bitwise integer to channel bit array
 */
export function bitwiseToChannelBits(value: number): number[] {
  if (value === 0) {
    return [];
  }

  const bits: number[] = [];
  // Check all possible channel bits (1, 2, 4, 8, 16, 32, 64, 128, 256, ...)
  for (let i = 0; i < 20; i++) {
    const bit = 1 << i; // 2^i
    if (value & bit) {
      bits.push(bit);
    }
  }

  return bits;
}

/**
 * Format time from hour/minute to string (HH:MM)
 */
export function formatTime(hour: number, minute: number): string {
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

/**
 * Parse time string (HH:MM) to hour and minute
 */
export function parseTime(timeStr: string): { hour: number; minute: number } {
  const parts = timeStr.split(":");
  if (parts.length !== 2) {
    throw new Error(`Invalid time format: ${timeStr}`);
  }
  const hour = parseInt(parts[0], 10);
  const minute = parseInt(parts[1], 10);

  if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error(`Invalid time values: ${timeStr}`);
  }

  return { hour, minute };
}

/**
 * Check if a schedule event is active (has weekdays and target channels)
 */
export function isEventActive(event: ScheduleEvent): boolean {
  return Boolean(
    event.WEEKDAY &&
      event.WEEKDAY.length > 0 &&
      event.TARGET_CHANNELS &&
      event.TARGET_CHANNELS.length > 0,
  );
}

/**
 * Convert ScheduleEvent to UI representation
 */
export function eventToUI(groupNo: number, event: ScheduleEvent): ScheduleEventUI {
  return {
    ...event,
    groupNo,
    weekdayNames: weekdayBitsToNames(event.WEEKDAY),
    timeString: formatTime(event.FIXED_HOUR, event.FIXED_MINUTE),
    isActive: isEventActive(event),
  };
}

/**
 * Convert ScheduleDict to list of UI events
 */
export function scheduleToUIEvents(schedule: ScheduleDict): ScheduleEventUI[] {
  const events: ScheduleEventUI[] = [];

  for (const [groupNoStr, event] of Object.entries(schedule)) {
    const groupNo = parseInt(groupNoStr, 10);
    if (!isNaN(groupNo)) {
      events.push(eventToUI(groupNo, event));
    }
  }

  // Sort by time
  events.sort((a, b) => {
    const timeA = a.FIXED_HOUR * 60 + a.FIXED_MINUTE;
    const timeB = b.FIXED_HOUR * 60 + b.FIXED_MINUTE;
    return timeA - timeB;
  });

  return events;
}

/**
 * Create an empty/default schedule event
 * Based on aiohomematic create_empty_schedule_group
 */
export function createEmptyEvent(category?: DatapointCategory): ScheduleEvent {
  const baseEvent: ScheduleEvent = {
    ASTRO_OFFSET: 0,
    ASTRO_TYPE: AstroType.SUNRISE,
    CONDITION: ScheduleCondition.FIXED_TIME,
    FIXED_HOUR: 0,
    FIXED_MINUTE: 0,
    TARGET_CHANNELS: [],
    WEEKDAY: [],
    LEVEL: 0,
  };

  // Add category-specific fields based on DataPointCategory
  if (category === "COVER") {
    baseEvent.LEVEL = 0.0;
    baseEvent.LEVEL_2 = 0.0;
  } else if (category === "SWITCH") {
    baseEvent.DURATION_BASE = TimeBase.MS_100;
    baseEvent.DURATION_FACTOR = 0;
    baseEvent.LEVEL = 0; // Binary level (0 or 1)
  } else if (category === "LIGHT") {
    baseEvent.DURATION_BASE = TimeBase.MS_100;
    baseEvent.DURATION_FACTOR = 0;
    baseEvent.RAMP_TIME_BASE = TimeBase.MS_100;
    baseEvent.RAMP_TIME_FACTOR = 0;
    baseEvent.LEVEL = 0.0; // Float level (0.0 - 1.0)
  } else if (category === "VALVE") {
    baseEvent.LEVEL = 0.0; // Float level (0.0 - 1.0)
  } else if (category === "LOCK") {
    baseEvent.LEVEL = 0; // Binary level (0 or 1)
  }

  return baseEvent;
}

/**
 * Convert ScheduleDict to backend format with integer keys
 */
export function convertToBackendFormat(scheduleDict: ScheduleDict): BackendScheduleDict {
  const backendDict: BackendScheduleDict = {};

  for (const [groupNoStr, event] of Object.entries(scheduleDict)) {
    const groupNo = parseInt(groupNoStr, 10);
    if (!isNaN(groupNo)) {
      backendDict[groupNo] = event;
    }
  }

  return backendDict;
}

/**
 * Convert backend format to ScheduleDict with string keys
 */
export function convertFromBackendFormat(backendDict: BackendScheduleDict): ScheduleDict {
  const scheduleDict: ScheduleDict = {};

  for (const [groupNo, event] of Object.entries(backendDict)) {
    scheduleDict[groupNo.toString()] = event;
  }

  return scheduleDict;
}

/**
 * Calculate duration in milliseconds from base and factor
 */
export function calculateDuration(base: TimeBase, factor: number): number {
  const baseValues: Record<TimeBase, number> = {
    [TimeBase.MS_100]: 100,
    [TimeBase.SEC_1]: 1000,
    [TimeBase.SEC_5]: 5000,
    [TimeBase.SEC_10]: 10000,
    [TimeBase.MIN_1]: 60000,
    [TimeBase.MIN_5]: 300000,
    [TimeBase.MIN_10]: 600000,
    [TimeBase.HOUR_1]: 3600000,
  };

  return baseValues[base] * factor;
}

/**
 * Format duration for display
 */
export function formatDuration(base: TimeBase, factor: number): string {
  const durationMs = calculateDuration(base, factor);

  if (durationMs < 1000) {
    return `${durationMs}ms`;
  } else if (durationMs < 60000) {
    return `${(durationMs / 1000).toFixed(1)}s`;
  } else if (durationMs < 3600000) {
    return `${(durationMs / 60000).toFixed(1)}m`;
  } else {
    return `${(durationMs / 3600000).toFixed(1)}h`;
  }
}

/**
 * Check if LEVEL should be interpreted as a boolean (0/1) rather than a percentage
 * Based on the datapoint category
 * - SWITCH and LOCK use boolean levels (0 = Off, 1 = On)
 * - LIGHT, COVER, and VALVE use float levels (0.0-1.0 as percentage)
 */
export function isLevelBoolean(level: number, category?: DatapointCategory): boolean {
  // Boolean categories: SWITCH and LOCK
  if (category === "SWITCH" || category === "LOCK") {
    return true;
  }

  // All other categories use percentage (float)
  return false;
}

/**
 * Format level for display based on category and value type
 * - If LEVEL is 0 (integer): Boolean → "On" / "Off"
 * - If LEVEL is 0.0 (float): Percentage → "0%" to "100%"
 */
export function formatLevel(level: number, category?: DatapointCategory): string {
  // Check if should be displayed as boolean
  if (isLevelBoolean(level, category)) {
    return level === 0 ? "Off" : "On";
  }

  // Convert 0.0-1.0 to 0-100%
  const percentage = level * 100;
  return `${Math.round(percentage)}%`;
}

/**
 * Get display label for astro event with offset
 */
export function formatAstroTime(astroType: AstroType, offset: number): string {
  const baseLabel = astroType === AstroType.SUNRISE ? "Sunrise" : "Sunset";

  if (offset === 0) {
    return baseLabel;
  } else if (offset > 0) {
    return `${baseLabel} +${offset}m`;
  } else {
    return `${baseLabel} ${offset}m`;
  }
}

/**
 * Validate schedule event
 */
export interface ValidationError {
  field: string;
  message: string;
}

export function validateEvent(
  event: ScheduleEvent,
  category?: DatapointCategory,
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate time
  if (event.FIXED_HOUR < 0 || event.FIXED_HOUR > 23) {
    errors.push({ field: "FIXED_HOUR", message: "Hour must be between 0 and 23" });
  }
  if (event.FIXED_MINUTE < 0 || event.FIXED_MINUTE > 59) {
    errors.push({ field: "FIXED_MINUTE", message: "Minute must be between 0 and 59" });
  }

  // Validate astro offset
  if (event.CONDITION === ScheduleCondition.ASTRO) {
    if (event.ASTRO_OFFSET < -120 || event.ASTRO_OFFSET > 120) {
      errors.push({
        field: "ASTRO_OFFSET",
        message: "Astro offset must be between -120 and 120 minutes",
      });
    }
  }

  // Validate level
  if (category === "SWITCH" || category === "LOCK") {
    if (event.LEVEL !== 0 && event.LEVEL !== 1) {
      errors.push({ field: "LEVEL", message: "Level must be 0 or 1 for switch/lock" });
    }
  } else {
    if (event.LEVEL < 0 || event.LEVEL > 1) {
      errors.push({ field: "LEVEL", message: "Level must be between 0.0 and 1.0" });
    }
  }

  // Validate LEVEL_2 for cover
  if (category === "COVER" && event.LEVEL_2 !== undefined) {
    if (event.LEVEL_2 < 0 || event.LEVEL_2 > 1) {
      errors.push({ field: "LEVEL_2", message: "Slat position must be between 0.0 and 1.0" });
    }
  }

  // Validate weekdays
  if (!event.WEEKDAY || event.WEEKDAY.length === 0) {
    errors.push({ field: "WEEKDAY", message: "At least one weekday must be selected" });
  }

  // Validate target channels
  if (!event.TARGET_CHANNELS || event.TARGET_CHANNELS.length === 0) {
    errors.push({
      field: "TARGET_CHANNELS",
      message: "At least one target channel must be selected",
    });
  }

  return errors;
}
