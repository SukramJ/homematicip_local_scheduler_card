# HomematicIP Local Schedule Card

A custom Lovelace card for Home Assistant to display and edit Homematic(IP) Local schedules for switches, lights, covers, valves, and locks.

## Features

- 📅 **Event-Based Scheduling**: Manage individual schedule events with precise control
- 🎯 **Multi-Device Support**: Works with switches, lights, covers, valves, and locks
- ⏰ **Flexible Timing**: Fixed time or astronomical events (sunrise/sunset)
- 🎨 **Category-Specific UI**: Adapted interface for different device types
- 🌍 **Integration Ready**: Seamlessly works with HomematicIP Local integration
- 🌐 **Bilingual**: English and German translations

## Installation via HACS

1. Open HACS in your Home Assistant instance
2. Go to "Frontend"
3. Click the three dots menu in the top right corner
4. Select "Custom repositories"
5. Add this repository URL and select "Lovelace" as category
6. Click "Install"
7. Restart Home Assistant

## Manual Installation

1. Download the `homematicip-local-schedule-card.js` file
2. Copy it to your `config/www` folder
3. Add the following to your Lovelace resources:

```yaml
resources:
  - url: /local/homematicip-local-schedule-card.js
    type: module
```

## Configuration

Add the card to your dashboard:

```yaml
type: custom:homematicip-local-schedule-card
entity: switch.living_room
name: Living Room Schedule
editable: true
hour_format: "24"
language: "en"
time_step_minutes: 15
```

### Options

| Name                | Type     | Default      | Description                          |
| ------------------- | -------- | ------------ | ------------------------------------ |
| `entity`            | string   | **Required** | Single entity ID                     |
| `entities`          | string[] | -            | List of entity IDs shown in dropdown |
| `name`              | string   | Entity name  | Card title                           |
| `editable`          | boolean  | `true`       | Allow schedule editing               |
| `hour_format`       | string   | `24`         | Time format (12 or 24)               |
| `language`          | string   | Auto         | Language (en or de)                  |
| `time_step_minutes` | number   | `15`         | Time picker step size in minutes     |

## Requirements

- Home Assistant 2023.1 or newer
- HomematicIP Local integration installed and configured
- Homematic device with schedule support (SWITCH, LIGHT, COVER, VALVE, LOCK)

## Supported Device Types

- **SWITCH**: On/Off devices
- **LOCK**: Door locks
- **LIGHT**: Lights with dimming and ramp time support
- **COVER**: Blinds/shutters with position and slat control
- **VALVE**: Heating valves

## Usage

### Viewing Schedules

The card displays schedule events with time, weekdays, and action (level/position/state).

### Editing Schedules

1. Click on an event to edit it
2. Modify time, weekdays, and action parameters
3. Add or remove schedule events
4. Click "Save" to apply changes to your device

## Support

For issues and feature requests, please visit: [GitHub Issues](https://github.com/SukramJ/homematicip_local_schedule_card/issues)

## License

MIT License - see LICENSE file for details
