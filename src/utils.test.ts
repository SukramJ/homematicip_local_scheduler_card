import {
  weekdayBitsToNames,
  weekdayNamesToBits,
  weekdayBitsToBitwise,
  bitwiseToWeekdayBits,
  channelBitsToBitwise,
  bitwiseToChannelBits,
  formatTime,
  parseTime,
  isEventActive,
  eventToUI,
  scheduleToUIEvents,
  createEmptyEvent,
  convertToBackendFormat,
  convertFromBackendFormat,
  calculateDuration,
  formatDuration,
  formatLevel,
  formatAstroTime,
  validateEvent,
} from "./utils";
import {
  WeekdayBit,
  AstroType,
  ScheduleCondition,
  TimeBase,
  ScheduleEvent,
  ScheduleDict,
} from "./types";

describe("Utils", () => {
  describe("weekday conversion", () => {
    it("should convert weekday bits to names", () => {
      const bits = [WeekdayBit.MONDAY, WeekdayBit.WEDNESDAY, WeekdayBit.FRIDAY];
      const names = weekdayBitsToNames(bits);
      expect(names).toEqual(["MONDAY", "WEDNESDAY", "FRIDAY"]);
    });

    it("should convert weekday names to bits", () => {
      const names = ["MONDAY", "WEDNESDAY", "FRIDAY"] as const;
      const bits = weekdayNamesToBits([...names]);
      expect(bits).toEqual([WeekdayBit.MONDAY, WeekdayBit.WEDNESDAY, WeekdayBit.FRIDAY]);
    });

    it("should convert weekday bits to bitwise integer", () => {
      const allBits = [
        WeekdayBit.SUNDAY,
        WeekdayBit.MONDAY,
        WeekdayBit.TUESDAY,
        WeekdayBit.WEDNESDAY,
        WeekdayBit.THURSDAY,
        WeekdayBit.FRIDAY,
        WeekdayBit.SATURDAY,
      ];
      expect(weekdayBitsToBitwise(allBits)).toBe(127); // 1+2+4+8+16+32+64

      const mwf = [WeekdayBit.MONDAY, WeekdayBit.WEDNESDAY, WeekdayBit.FRIDAY];
      expect(weekdayBitsToBitwise(mwf)).toBe(42); // 2+8+32
    });

    it("should convert bitwise integer to weekday bits", () => {
      const bits = bitwiseToWeekdayBits(127);
      expect(bits).toEqual([
        WeekdayBit.SUNDAY,
        WeekdayBit.MONDAY,
        WeekdayBit.TUESDAY,
        WeekdayBit.WEDNESDAY,
        WeekdayBit.THURSDAY,
        WeekdayBit.FRIDAY,
        WeekdayBit.SATURDAY,
      ]);

      const mwfBits = bitwiseToWeekdayBits(42);
      expect(mwfBits).toEqual([WeekdayBit.MONDAY, WeekdayBit.WEDNESDAY, WeekdayBit.FRIDAY]);
    });

    it("should handle empty weekday bits", () => {
      expect(weekdayBitsToBitwise([])).toBe(0);
      expect(bitwiseToWeekdayBits(0)).toEqual([]);
    });
  });

  describe("channel conversion", () => {
    it("should convert channel bits to bitwise integer", () => {
      const channels = [1, 2, 4];
      expect(channelBitsToBitwise(channels)).toBe(7); // 1+2+4
    });

    it("should convert bitwise integer to channel bits", () => {
      const bits = bitwiseToChannelBits(7);
      expect(bits).toEqual([1, 2, 4]);
    });

    it("should handle empty channel bits", () => {
      expect(channelBitsToBitwise([])).toBe(0);
      expect(bitwiseToChannelBits(0)).toEqual([]);
    });
  });

  describe("time formatting", () => {
    it("should format time correctly", () => {
      expect(formatTime(0, 0)).toBe("00:00");
      expect(formatTime(9, 5)).toBe("09:05");
      expect(formatTime(12, 30)).toBe("12:30");
      expect(formatTime(23, 59)).toBe("23:59");
    });

    it("should parse time correctly", () => {
      expect(parseTime("00:00")).toEqual({ hour: 0, minute: 0 });
      expect(parseTime("09:05")).toEqual({ hour: 9, minute: 5 });
      expect(parseTime("12:30")).toEqual({ hour: 12, minute: 30 });
      expect(parseTime("23:59")).toEqual({ hour: 23, minute: 59 });
    });

    it("should throw on invalid time format", () => {
      expect(() => parseTime("invalid")).toThrow("Invalid time format");
      expect(() => parseTime("25:00")).toThrow("Invalid time values");
      expect(() => parseTime("12:60")).toThrow("Invalid time values");
    });
  });

  describe("isEventActive", () => {
    it("should return true for active events", () => {
      const event: ScheduleEvent = {
        WEEKDAY: [WeekdayBit.MONDAY],
        TARGET_CHANNELS: [1],
        FIXED_HOUR: 12,
        FIXED_MINUTE: 0,
        LEVEL: 1,
        CONDITION: ScheduleCondition.FIXED_TIME,
        ASTRO_TYPE: AstroType.SUNRISE,
        ASTRO_OFFSET: 0,
      };
      expect(isEventActive(event)).toBe(true);
    });

    it("should return false for events without weekdays", () => {
      const event: ScheduleEvent = {
        WEEKDAY: [],
        TARGET_CHANNELS: [1],
        FIXED_HOUR: 12,
        FIXED_MINUTE: 0,
        LEVEL: 1,
        CONDITION: ScheduleCondition.FIXED_TIME,
        ASTRO_TYPE: AstroType.SUNRISE,
        ASTRO_OFFSET: 0,
      };
      expect(isEventActive(event)).toBe(false);
    });

    it("should return false for events without target channels", () => {
      const event: ScheduleEvent = {
        WEEKDAY: [WeekdayBit.MONDAY],
        TARGET_CHANNELS: [],
        FIXED_HOUR: 12,
        FIXED_MINUTE: 0,
        LEVEL: 1,
        CONDITION: ScheduleCondition.FIXED_TIME,
        ASTRO_TYPE: AstroType.SUNRISE,
        ASTRO_OFFSET: 0,
      };
      expect(isEventActive(event)).toBe(false);
    });
  });

  describe("eventToUI", () => {
    it("should convert event to UI representation", () => {
      const event: ScheduleEvent = {
        WEEKDAY: [WeekdayBit.MONDAY, WeekdayBit.FRIDAY],
        TARGET_CHANNELS: [1, 2],
        FIXED_HOUR: 14,
        FIXED_MINUTE: 30,
        LEVEL: 1,
        CONDITION: ScheduleCondition.FIXED_TIME,
        ASTRO_TYPE: AstroType.SUNRISE,
        ASTRO_OFFSET: 0,
      };

      const uiEvent = eventToUI(1, event);

      expect(uiEvent.groupNo).toBe(1);
      expect(uiEvent.weekdayNames).toEqual(["MONDAY", "FRIDAY"]);
      expect(uiEvent.timeString).toBe("14:30");
      expect(uiEvent.isActive).toBe(true);
    });
  });

  describe("scheduleToUIEvents", () => {
    it("should convert schedule to sorted UI events", () => {
      const schedule: ScheduleDict = {
        "2": {
          WEEKDAY: [WeekdayBit.MONDAY],
          TARGET_CHANNELS: [1],
          FIXED_HOUR: 18,
          FIXED_MINUTE: 0,
          LEVEL: 0,
          CONDITION: ScheduleCondition.FIXED_TIME,
          ASTRO_TYPE: AstroType.SUNRISE,
          ASTRO_OFFSET: 0,
        },
        "1": {
          WEEKDAY: [WeekdayBit.MONDAY],
          TARGET_CHANNELS: [1],
          FIXED_HOUR: 6,
          FIXED_MINUTE: 30,
          LEVEL: 1,
          CONDITION: ScheduleCondition.FIXED_TIME,
          ASTRO_TYPE: AstroType.SUNRISE,
          ASTRO_OFFSET: 0,
        },
      };

      const uiEvents = scheduleToUIEvents(schedule);

      expect(uiEvents).toHaveLength(2);
      expect(uiEvents[0].groupNo).toBe(1); // Earlier time first
      expect(uiEvents[0].timeString).toBe("06:30");
      expect(uiEvents[1].groupNo).toBe(2);
      expect(uiEvents[1].timeString).toBe("18:00");
    });
  });

  describe("createEmptyEvent", () => {
    it("should create empty SWITCH event", () => {
      const event = createEmptyEvent("SWITCH");
      expect(event.LEVEL).toBe(0);
      expect(event.DURATION_BASE).toBe(TimeBase.MS_100);
      expect(event.DURATION_FACTOR).toBe(0);
    });

    it("should create empty LIGHT event", () => {
      const event = createEmptyEvent("LIGHT");
      expect(event.LEVEL).toBe(0.0);
      expect(event.DURATION_BASE).toBe(TimeBase.MS_100);
      expect(event.RAMP_TIME_BASE).toBe(TimeBase.MS_100);
    });

    it("should create empty COVER event", () => {
      const event = createEmptyEvent("COVER");
      expect(event.LEVEL).toBe(0.0);
      expect(event.LEVEL_2).toBe(0.0);
    });

    it("should create empty VALVE event", () => {
      const event = createEmptyEvent("VALVE");
      expect(event.LEVEL).toBe(0.0);
    });
  });

  describe("backend format conversion", () => {
    it("should convert to backend format", () => {
      const schedule: ScheduleDict = {
        "1": {
          WEEKDAY: [WeekdayBit.MONDAY],
          TARGET_CHANNELS: [1],
          FIXED_HOUR: 12,
          FIXED_MINUTE: 0,
          LEVEL: 1,
          CONDITION: ScheduleCondition.FIXED_TIME,
          ASTRO_TYPE: AstroType.SUNRISE,
          ASTRO_OFFSET: 0,
        },
      };

      const backend = convertToBackendFormat(schedule);
      expect(backend[1]).toBeDefined();
      expect(backend[1].LEVEL).toBe(1);
    });

    it("should convert from backend format", () => {
      const backend = {
        1: {
          WEEKDAY: [WeekdayBit.MONDAY],
          TARGET_CHANNELS: [1],
          FIXED_HOUR: 12,
          FIXED_MINUTE: 0,
          LEVEL: 1,
          CONDITION: ScheduleCondition.FIXED_TIME,
          ASTRO_TYPE: AstroType.SUNRISE,
          ASTRO_OFFSET: 0,
        },
      };

      const schedule = convertFromBackendFormat(backend);
      expect(schedule["1"]).toBeDefined();
      expect(schedule["1"].LEVEL).toBe(1);
    });
  });

  describe("duration calculations", () => {
    it("should calculate duration correctly", () => {
      expect(calculateDuration(TimeBase.MS_100, 10)).toBe(1000);
      expect(calculateDuration(TimeBase.SEC_1, 5)).toBe(5000);
      expect(calculateDuration(TimeBase.MIN_1, 2)).toBe(120000);
      expect(calculateDuration(TimeBase.HOUR_1, 1)).toBe(3600000);
    });

    it("should format duration correctly", () => {
      expect(formatDuration(TimeBase.MS_100, 5)).toBe("500ms");
      expect(formatDuration(TimeBase.SEC_1, 5)).toBe("5.0s");
      expect(formatDuration(TimeBase.MIN_1, 2)).toBe("2.0m");
      expect(formatDuration(TimeBase.HOUR_1, 1)).toBe("1.0h");
    });
  });

  describe("formatLevel", () => {
    it("should format SWITCH level as On/Off", () => {
      expect(formatLevel(0, "SWITCH")).toBe("Off");
      expect(formatLevel(1, "SWITCH")).toBe("On");
    });

    it("should format LIGHT level as percentage", () => {
      expect(formatLevel(0, "LIGHT")).toBe("0%");
      expect(formatLevel(0.5, "LIGHT")).toBe("50%");
      expect(formatLevel(1, "LIGHT")).toBe("100%");
    });
  });

  describe("formatAstroTime", () => {
    it("should format sunrise/sunset without offset", () => {
      expect(formatAstroTime(AstroType.SUNRISE, 0)).toBe("Sunrise");
      expect(formatAstroTime(AstroType.SUNSET, 0)).toBe("Sunset");
    });

    it("should format with positive offset", () => {
      expect(formatAstroTime(AstroType.SUNRISE, 30)).toBe("Sunrise +30m");
    });

    it("should format with negative offset", () => {
      expect(formatAstroTime(AstroType.SUNSET, -45)).toBe("Sunset -45m");
    });
  });

  describe("validateEvent", () => {
    it("should validate correct event", () => {
      const event: ScheduleEvent = {
        WEEKDAY: [WeekdayBit.MONDAY],
        TARGET_CHANNELS: [1],
        FIXED_HOUR: 12,
        FIXED_MINUTE: 30,
        LEVEL: 1,
        CONDITION: ScheduleCondition.FIXED_TIME,
        ASTRO_TYPE: AstroType.SUNRISE,
        ASTRO_OFFSET: 0,
      };

      const errors = validateEvent(event, "SWITCH");
      expect(errors).toHaveLength(0);
    });

    it("should detect invalid hour", () => {
      const event: ScheduleEvent = {
        WEEKDAY: [WeekdayBit.MONDAY],
        TARGET_CHANNELS: [1],
        FIXED_HOUR: 25,
        FIXED_MINUTE: 0,
        LEVEL: 1,
        CONDITION: ScheduleCondition.FIXED_TIME,
        ASTRO_TYPE: AstroType.SUNRISE,
        ASTRO_OFFSET: 0,
      };

      const errors = validateEvent(event);
      expect(errors.some((e) => e.field === "FIXED_HOUR")).toBe(true);
    });

    it("should detect missing weekdays", () => {
      const event: ScheduleEvent = {
        WEEKDAY: [],
        TARGET_CHANNELS: [1],
        FIXED_HOUR: 12,
        FIXED_MINUTE: 0,
        LEVEL: 1,
        CONDITION: ScheduleCondition.FIXED_TIME,
        ASTRO_TYPE: AstroType.SUNRISE,
        ASTRO_OFFSET: 0,
      };

      const errors = validateEvent(event);
      expect(errors.some((e) => e.field === "WEEKDAY")).toBe(true);
    });

    it("should detect invalid SWITCH level", () => {
      const event: ScheduleEvent = {
        WEEKDAY: [WeekdayBit.MONDAY],
        TARGET_CHANNELS: [1],
        FIXED_HOUR: 12,
        FIXED_MINUTE: 0,
        LEVEL: 0.5, // Invalid for SWITCH
        CONDITION: ScheduleCondition.FIXED_TIME,
        ASTRO_TYPE: AstroType.SUNRISE,
        ASTRO_OFFSET: 0,
      };

      const errors = validateEvent(event, "SWITCH");
      expect(errors.some((e) => e.field === "LEVEL")).toBe(true);
    });

    it("should detect invalid minute", () => {
      const event: ScheduleEvent = {
        WEEKDAY: [WeekdayBit.MONDAY],
        TARGET_CHANNELS: [1],
        FIXED_HOUR: 12,
        FIXED_MINUTE: 60, // Invalid
        LEVEL: 1,
        CONDITION: ScheduleCondition.FIXED_TIME,
        ASTRO_TYPE: AstroType.SUNRISE,
        ASTRO_OFFSET: 0,
      };

      const errors = validateEvent(event);
      expect(errors.some((e) => e.field === "FIXED_MINUTE")).toBe(true);
    });

    it("should detect invalid astro offset", () => {
      const event: ScheduleEvent = {
        WEEKDAY: [WeekdayBit.MONDAY],
        TARGET_CHANNELS: [1],
        FIXED_HOUR: 12,
        FIXED_MINUTE: 0,
        LEVEL: 1,
        CONDITION: ScheduleCondition.ASTRO,
        ASTRO_TYPE: AstroType.SUNRISE,
        ASTRO_OFFSET: 150, // Invalid: > 120
      };

      const errors = validateEvent(event);
      expect(errors.some((e) => e.field === "ASTRO_OFFSET")).toBe(true);
    });

    it("should detect invalid LIGHT level", () => {
      const event: ScheduleEvent = {
        WEEKDAY: [WeekdayBit.MONDAY],
        TARGET_CHANNELS: [1],
        FIXED_HOUR: 12,
        FIXED_MINUTE: 0,
        LEVEL: 1.5, // Invalid: > 1.0
        CONDITION: ScheduleCondition.FIXED_TIME,
        ASTRO_TYPE: AstroType.SUNRISE,
        ASTRO_OFFSET: 0,
      };

      const errors = validateEvent(event, "LIGHT");
      expect(errors.some((e) => e.field === "LEVEL")).toBe(true);
    });

    it("should detect invalid COVER LEVEL_2", () => {
      const event: ScheduleEvent = {
        WEEKDAY: [WeekdayBit.MONDAY],
        TARGET_CHANNELS: [1],
        FIXED_HOUR: 12,
        FIXED_MINUTE: 0,
        LEVEL: 0.5,
        LEVEL_2: 1.5, // Invalid: > 1.0
        CONDITION: ScheduleCondition.FIXED_TIME,
        ASTRO_TYPE: AstroType.SUNRISE,
        ASTRO_OFFSET: 0,
      };

      const errors = validateEvent(event, "COVER");
      expect(errors.some((e) => e.field === "LEVEL_2")).toBe(true);
    });

    it("should detect missing target channels", () => {
      const event: ScheduleEvent = {
        WEEKDAY: [WeekdayBit.MONDAY],
        TARGET_CHANNELS: [], // Empty
        FIXED_HOUR: 12,
        FIXED_MINUTE: 0,
        LEVEL: 1,
        CONDITION: ScheduleCondition.FIXED_TIME,
        ASTRO_TYPE: AstroType.SUNRISE,
        ASTRO_OFFSET: 0,
      };

      const errors = validateEvent(event);
      expect(errors.some((e) => e.field === "TARGET_CHANNELS")).toBe(true);
    });
  });
});
