# HomematicIP Local Schedule Card

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A custom Lovelace card for Home Assistant to display and edit Homematic(IP) Local schedules for switches, lights, covers, valves, and locks.

**⚠️ Work in Progress**: This project is under active development and based on the event-based schedule API of Homematic(IP) Local.

![Card Screenshot](images/screenshot.png)

_Example of the schedule card showing a weekly switch schedule_

## Features

- 📅 **Event-Based Scheduling**: Manage individual schedule events with precise control
- 🎯 **Multi-Device Support**: Works with switches, lights, covers, valves, and locks
- ⏰ **Flexible Timing**: Fixed time or astronomical events (sunrise/sunset)
- 🎨 **Category-Specific UI**: Adapted interface for different device types
- 🌍 **Integration Ready**: Seamlessly works with HomematicIP Local integration
- 🌐 **Bilingual**: English and German translations

## Supported Device Types

- **SWITCH**: On/Off devices
- **LOCK**: Door locks
- **LIGHT**: Lights with dimming and ramp time support
- **COVER**: Blinds/shutters with position and slat control (LEVEL + LEVEL_2)
- **VALVE**: Heating valves

![Device Types](images/device-types.png)

_Different device types with category-specific controls_

## API Structure

This card works with the `schedule_data` attribute provided by HomematicIP Local entities. Each schedule consists of event groups:

```yaml
schedule_data:
  "1": # Group number
    FIXED_HOUR: 6
    FIXED_MINUTE: 30
    WEEKDAY: [2, 4, 8, 16, 32] # Mon, Tue, Wed, Thu, Fri (bitwise)
    TARGET_CHANNELS: [1]
    LEVEL: 1 # On (for switches) or 0.0-1.0 (for dimmers)
    CONDITION: 0 # FIXED_TIME
    ASTRO_TYPE: 0 # SUNRISE
    ASTRO_OFFSET: 0
    DURATION_BASE: 0 # Optional (SWITCH/LIGHT)
    DURATION_FACTOR: 0 # Optional (SWITCH/LIGHT)
```

### Weekday Bits

Weekdays are represented as bitwise flags:

- SUNDAY = 1
- MONDAY = 2
- TUESDAY = 4
- WEDNESDAY = 8
- THURSDAY = 16
- FRIDAY = 32
- SATURDAY = 64

Example: `[2, 8, 32]` = Monday, Wednesday, Friday

## Installation

### Prerequisites

- Home Assistant 2023.1 or newer
- [HomematicIP Local](https://github.com/SukramJ/homematicip_local) integration installed and configured
- Homematic device with schedule support

### HACS (Recommended)

1. Make sure [HACS](https://hacs.xyz/) is installed
2. In HACS, go to "Frontend"
3. Click the three-dot menu and select "Custom repositories"
4. Add this repository URL: `https://github.com/SukramJ/homematicip_local_scheduler_card`
5. Select category "Lovelace"
6. Click "Install"
7. Restart Home Assistant

### Manual Installation

1. Download the `homematicip-local-schedule-card.js` file from the latest release
2. Copy it to your `config/www` folder
3. Add the resource to your Lovelace dashboard:
   - Go to Settings → Dashboards → Resources
   - Click "Add Resource"
   - URL: `/local/homematicip-local-schedule-card.js`
   - Resource type: JavaScript Module

## Configuration

### Basic Configuration

```yaml
type: custom:homematicip-local-schedule-card
entity: switch.your_device
```

### Multiple Entities

```yaml
type: custom:homematicip-local-schedule-card
entities:
  - switch.living_room
  - switch.bedroom
  - switch.office
```

### Full Configuration

```yaml
type: custom:homematicip-local-schedule-card
entity: switch.living_room
name: Living Room Schedule
editable: true
hour_format: "24"
language: "en"
time_step_minutes: 15
```

### Configuration Options

| Option              | Type     | Default     | Description                            |
| ------------------- | -------- | ----------- | -------------------------------------- |
| `entity`            | string   | —           | Single entity ID                       |
| `entities`          | string[] | —           | List of entity IDs shown in a dropdown |
| `name`              | string   | Entity name | Custom name for the card               |
| `editable`          | boolean  | `true`      | Enable/disable schedule editing        |
| `hour_format`       | string   | `24`        | Time format: `12` or `24` hour         |
| `language`          | string   | Auto        | Language: `en` or `de`                 |
| `time_step_minutes` | number   | `15`        | Time picker step size in minutes       |

## Development

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run watch
```

### Testing

```bash
npm test
npm run test:coverage
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Type Check

```bash
npm run type-check
```

### Validation

Run all checks (lint, type-check, tests, build):

```bash
npm run validate
```

## Project Structure

```
src/
├── types.ts           # TypeScript type definitions (ScheduleEvent, DatapointCategory, etc.)
├── types.test.ts      # Type tests
├── utils.ts           # Utility functions (bitwise ops, formatting, validation)
├── utils.test.ts      # Utils tests
├── localization.ts    # Translations (EN, DE)
├── localization.test.ts
└── homematicip-local-schedule-card.ts  # Main Lit element (TODO)
```

## Technical Details

### Event Structure

Each schedule event includes:

- **Timing**: `FIXED_HOUR`, `FIXED_MINUTE`, `WEEKDAY` bits
- **Trigger**: `CONDITION` (fixed time or astro), `ASTRO_TYPE`, `ASTRO_OFFSET`
- **Action**: `LEVEL` (and `LEVEL_2` for covers)
- **Target**: `TARGET_CHANNELS` (bitwise channel selection)
- **Duration** (optional for SWITCH/LIGHT): `DURATION_BASE`, `DURATION_FACTOR`
- **Ramp Time** (optional for LIGHT): `RAMP_TIME_BASE`, `RAMP_TIME_FACTOR`

### Bitwise Operations

The card includes comprehensive bitwise utility functions:

- `weekdayBitsToBitwise()` / `bitwiseToWeekdayBits()`
- `weekdayBitsToNames()` / `weekdayNamesToBits()`
- `channelBitsToBitwise()` / `bitwiseToChannelBits()`

### Validation

Events are validated with `validateEvent()` which checks:

- Time ranges (hour 0-23, minute 0-59)
- Astro offset (-120 to +120 minutes)
- Level ranges (0/1 for SWITCH/LOCK, 0.0-1.0 for others)
- Required fields (weekdays, target channels)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Lit](https://lit.dev/)
- Designed for [Home Assistant](https://www.home-assistant.io/)
- Compatible with [HomematicIP Local](https://github.com/SukramJ/homematicip_local) integration
- Based on [aiohomematic](https://github.com/SukramJ/aiohomematic) DefaultWeekProfile implementation

## Related Projects

- [HomematicIP Local Climate Scheduler Card](https://github.com/SukramJ/homematicip_local_climate_scheduler_card) - For thermostat schedules (ENDTIME-based API)

## Support

For issues and questions, please use the [GitHub Issues](https://github.com/SukramJ/homematicip_local_scheduler_card/issues) page.
