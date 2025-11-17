# HomematicIP Local Scheduler Card - Project Documentation for Claude

## Project Overview

This is a **custom Lovelace card** for Home Assistant that displays and edits Homematic(IP) Local schedules for switches, lights, covers, valves, and locks. The card is built with **Lit (Web Components)** and TypeScript, and is designed to be HACS-compatible.

### Key Information

- **Framework**: Lit 3.0 (Web Components)
- **Language**: TypeScript 5.3+
- **Build System**: Rollup
- **Testing**: Jest with ts-jest
- **Linting**: ESLint 9 with TypeScript ESLint
- **Code Quality**: Prettier, Husky, lint-staged

### Repository

- **GitHub**: https://github.com/SukramJ/homematicip_local_scheduler_card
- **License**: MIT
- **Current Version**: 0.1.0
- **Status**: Work in Progress

## Architecture

### Project Structure

```
├── src/
│   ├── homematicip-local-scheduler-card.ts  # Main Lit component
│   ├── types.ts                              # TypeScript type definitions
│   ├── utils.ts                              # Utility functions (bitwise, validation, formatting)
│   ├── localization.ts                       # i18n translations (EN, DE)
│   └── *.test.ts                             # Jest test files
├── rollup.config.mjs                         # Build configuration
├── package.json                              # Dependencies and scripts
├── tsconfig.json                             # TypeScript configuration
└── eslint.config.mjs                         # ESLint configuration
```

### Main Component

The card is implemented as a single Lit web component: `homematicip-local-scheduler-card`

**File**: `src/homematicip-local-scheduler-card.ts`

Key responsibilities:

- Renders schedule events in a table view
- Provides editing UI for schedule events
- Communicates with Home Assistant via `hass.callService()`
- Manages entity selection (single or multiple entities via dropdown)
- Handles language switching (EN/DE)

### Type System

**File**: `src/types.ts`

Core types:

- `ScheduleEvent`: Represents a single schedule event with timing, action, and condition
- `ScheduleDict`: Map of event groups (string keys: "1", "2", ...)
- `DatapointCategory`: Device type ("SWITCH" | "LOCK" | "LIGHT" | "COVER" | "VALVE")
- `HomematicScheduleCardConfig`: Card configuration
- `HomeAssistant`: Home Assistant API interface

### Utilities

**File**: `src/utils.ts`

Key utility categories:

1. **Bitwise Operations**: Convert between bitwise flags and arrays
2. **Validation**: Validate event data
3. **Formatting**: Format levels, durations, times
4. **Conversion**: Convert between UI and backend formats

## Key Concepts

### 1. Event-Based Scheduling

Unlike traditional time-slot schedules, this card uses **event-based scheduling**. Each event defines:

- **When**: Time (fixed or astronomical) + weekdays
- **What**: Target channels + action (level, duration, ramp)
- **How**: Trigger condition (fixed time vs. sunrise/sunset)

### 2. Bitwise Flags

The Homematic API uses **bitwise flags** for weekdays and channels.

**Weekday Bits**:

```typescript
SUNDAY = 1; // 0b0000001
MONDAY = 2; // 0b0000010
TUESDAY = 4; // 0b0000100
WEDNESDAY = 8; // 0b0001000
THURSDAY = 16; // 0b0010000
FRIDAY = 32; // 0b0100000
SATURDAY = 64; // 0b1000000
```

**Example**: Monday + Wednesday + Friday = `[2, 4, 32]`

**Channel Bits**: Similar concept for target channels (1, 2, 4, 8, ...)

**Important Functions**:

- `weekdayBitsToBitwise(bits: number[]): number` - Converts [2,4,32] to 38
- `bitwiseToWeekdayBits(bitwise: number): number[]` - Converts 38 to [2,4,32]
- `weekdayBitsToNames(bits: number[]): Weekday[]` - Converts [2,4,32] to ["MONDAY","TUESDAY","FRIDAY"]

### 3. Schedule Event Structure

Each `ScheduleEvent` has these fields:

```typescript
interface ScheduleEvent {
  // Timing
  FIXED_HOUR: number; // 0-23
  FIXED_MINUTE: number; // 0-59
  WEEKDAY: WeekdayBit[]; // e.g., [2, 4, 32]

  // Target
  TARGET_CHANNELS: number[]; // e.g., [1] or [1, 2]

  // Action
  LEVEL: number; // 0/1 for SWITCH/LOCK, 0.0-1.0 for others
  LEVEL_2?: number; // Optional, only for COVER (slat position)

  // Trigger Condition
  CONDITION: ScheduleCondition; // 0=FIXED_TIME, 1=ASTRO
  ASTRO_TYPE: AstroType; // 0=SUNRISE, 1=SUNSET
  ASTRO_OFFSET: number; // Offset in minutes (-120 to +120)

  // Duration (SWITCH/LIGHT only)
  DURATION_BASE?: TimeBase; // 0-7 (see TimeBase enum)
  DURATION_FACTOR?: number; // Multiplier

  // Ramp Time (LIGHT only)
  RAMP_TIME_BASE?: TimeBase;
  RAMP_TIME_FACTOR?: number;
}
```

### 4. Device Categories

The card adapts its UI based on `datapoint_category`:

- **SWITCH**: On/Off, optional duration
- **LOCK**: Locked/Unlocked
- **LIGHT**: Dimming (0.0-1.0), duration, ramp time
- **COVER**: Position (LEVEL) + slat angle (LEVEL_2)
- **VALVE**: Valve position (0.0-1.0)

### 5. Time Base System

Duration and ramp times use a **base + factor** system:

```typescript
enum TimeBase {
  MS_100 = 0, // 100 milliseconds
  SEC_1 = 1, // 1 second
  SEC_5 = 2, // 5 seconds
  SEC_10 = 3, // 10 seconds
  MIN_1 = 4, // 1 minute
  MIN_5 = 5, // 5 minutes
  MIN_10 = 6, // 10 minutes
  HOUR_1 = 7, // 1 hour
}
```

**Example**: `DURATION_BASE=4` (1 minute) + `DURATION_FACTOR=5` = 5 minutes

### 6. Home Assistant Integration

The card reads data from the `schedule_data` attribute of Homematic entities:

```typescript
hass.states[entityId].attributes.schedule_data;
```

To update schedules, it calls the service:

```typescript
hass.callService("homematicip_local", "set_schedule", {
  entity_id: entityId,
  schedule_data: scheduleDict,
});
```

## Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (2 spaces, no semicolons optional, trailing commas)
- **Naming**:
  - Classes: PascalCase
  - Functions/variables: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Private class members: \_prefixed

### Testing

- **Framework**: Jest with ts-jest
- **Coverage**: Aim for >80% coverage
- **Test files**: Co-located with source (e.g., `utils.test.ts` next to `utils.ts`)

Run tests:

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Validation

Before committing, always run:

```bash
npm run validate      # Runs lint + type-check + test + build
```

Pre-commit hooks (via Husky) automatically run:

- ESLint auto-fix on `*.ts` files
- Prettier formatting on `*.{ts,js,json,md}`
- Jest tests on affected files

### Building

```bash
npm run build         # Production build
npm run watch         # Watch mode for development
```

Output: `dist/homematicip-local-scheduler-card.js` (bundled and minified)

## Common Tasks

### Adding a New Feature

1. Update types in `src/types.ts` if needed
2. Add utility functions in `src/utils.ts` with tests
3. Update the main component in `src/homematicip-local-scheduler-card.ts`
4. Add translations in `src/localization.ts` (EN + DE)
5. Write tests for all new functionality
6. Run `npm run validate` before committing

### Debugging

- Use `console.log()` sparingly (remove before commit)
- Check Home Assistant developer tools → States for entity attributes
- Use browser DevTools for Lit component inspection
- Test with different device categories (SWITCH, LIGHT, COVER, etc.)

### Working with Bitwise Operations

Always use the utility functions in `utils.ts`:

```typescript
// Converting weekday bits to names for UI
const weekdayNames = weekdayBitsToNames([2, 8, 32]);
// Result: ["MONDAY", "WEDNESDAY", "FRIDAY"]

// Converting user selections back to bits
const weekdayBits = weekdayNamesToBits(["MONDAY", "FRIDAY"]);
// Result: [2, 32]

// Converting to backend bitwise format
const bitwise = weekdayBitsToBitwise([2, 4, 32]);
// Result: 38
```

### Adding Translations

Edit `src/localization.ts` and add entries to both `en` and `de` objects:

```typescript
export const translations = {
  en: {
    your_new_key: "English text",
    // ...
  },
  de: {
    your_new_key: "Deutscher Text",
    // ...
  },
};
```

Access in component: `this._translations.your_new_key`

## Important Implementation Details

### State Management

The card uses Lit's reactive properties:

- `@property()`: Public props that trigger re-render (e.g., `hass`)
- `@state()`: Private state that triggers re-render (e.g., `_scheduleData`)

### Event Updates

When a schedule is modified:

1. User edits in the UI
2. Card validates the event (`validateEvent()`)
3. Card converts to backend format (`convertToBackendFormat()`)
4. Card calls `hass.callService("homematicip_local", "set_schedule", ...)`
5. Home Assistant updates the entity
6. Card re-renders with new data from `hass.states`

### Validation Rules

See `validateEvent()` in `utils.ts`:

- Hours: 0-23
- Minutes: 0-59
- Astro offset: -120 to +120
- LEVEL: 0/1 for SWITCH/LOCK, 0.0-1.0 for others
- LEVEL_2: 0.0-1.0 for COVER only
- At least one weekday must be selected
- At least one target channel must be selected

## Related Projects

- **HomematicIP Local Integration**: https://github.com/SukramJ/homematicip_local
- **HomematicIP Local Climate Scheduler Card**: https://github.com/SukramJ/homematicip_local_climate_scheduler_card (for thermostat schedules with ENDTIME-based API)
- **aiohomematic**: https://github.com/SukramJ/aiohomematic (Python library that implements the DefaultWeekProfile API)

## Troubleshooting

### Common Issues

1. **Entity not found**: Check that the entity_id exists in Home Assistant and has a `schedule_data` attribute
2. **Schedule not updating**: Verify the HomematicIP Local integration is running and connected
3. **Type errors**: Run `npm run type-check` to identify issues
4. **Build failures**: Clear `node_modules` and run `npm install` again

### Debugging Checklist

- [ ] Entity has `schedule_data` attribute?
- [ ] `datapoint_category` is one of: SWITCH, LOCK, LIGHT, COVER, VALVE?
- [ ] Schedule events have valid WEEKDAY and TARGET_CHANNELS arrays?
- [ ] LEVEL values are in correct range for the category?
- [ ] Home Assistant service call succeeds (check HA logs)?

## Notes for Claude

- This project is under active development (v0.1.0)
- Always run `npm run validate` before suggesting code changes
- Respect the existing code style (Prettier + ESLint)
- All user-facing strings must be translated (EN + DE)
- Test coverage is important - write tests for new features
- Bitwise operations are critical - use utility functions, don't reinvent
- The card must work with Home Assistant's custom element registration system
