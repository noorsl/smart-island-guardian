# Setup guide

## 1. Replace the placeholders

Search each widget for these values and replace them with the IDs from your Cumulocity tenant
(Device Management → device → the number at the end of the URL).

| Placeholder | What it is |
|---|---|
| `WATER_LEVEL_DEVICE_ID` | Water level sensor |
| `SOIL_MOISTURE_DEVICE_ID` | Soil moisture sensor |
| `MOSQUITO_DEVICE_ID` | Smart mosquito sensor |
| `ANIMAL_TRAP_DEVICE_ID` | Animal control trap |
| `PERMIT_AUTHORIZED_DEVICE_ID` | Permit reader – authorized |
| `PERMIT_UNAUTHORIZED_DEVICE_ID` | Permit reader – unauthorized |
| `DOOR_SENSOR_DEVICE_ID` | Door forced-open sensor |
| `CAMERA_DEVICE_ID` | Perimeter security camera |
| `TAMPER_SENSOR_DEVICE_ID` | Tamper sensor |
| `YOUR_GROUP_ID` | The Cockpit group that holds the dashboards |
| `ALARMS_DASHBOARD_ID`, `DATA_ANALYSIS_DASHBOARD_ID`, `GUARDIAN_MAP_DASHBOARD_ID`, `STAFF_DASHBOARD_ID`, `AI_HUB_DASHBOARD_ID`, `AI_AGENT_CONTROL_DASHBOARD_ID` | Dashboard IDs used by the banner buttons (last number in each dashboard URL) |

The IoT devices widget (`02-iot-devices.js`) finds devices **by name** — edit `DEVICE_NAMES` at the top if your names differ.

## 2. Measurement names

The widgets read these fragments/series. Keep the exact spelling (case-sensitive):

| Sensor | Fragment | Series | Limit |
|---|---|---|---|
| Water level | `WaterLevel` | `waterLevel` | below 30 % |
| Soil moisture | `soilMoisture` | `moisture` | below 30 % |
| Mosquito | `Mosquito` | `Activity` | 8 and above |

The trap widget treats an event whose text contains **“rodent detected”** as an occupied trap.

## 3. Simulator timing used in the demo

| Device | Interval |
|---|---|
| Mosquito sensor | ~5 min |
| Permit reader – authorized | ~5 min (events only) |
| Animal trap, water level | ~15 min |
| Permit reader – unauthorized | 1 h |
| Camera | 2 h |
| Door sensor | 3 h |
| Tamper sensor | 6 h |

Maximum *Sleep* per instruction is 3600 s — stack several sleeps for longer intervals.
Water level cycles 90 → 65 → 40 → 25 % and raises *Low water level detected* at 25 %.

## 4. Let the agent control devices

On each simulator (Device Management → Simulators → *Supported operations*) click **Add custom operation** and enter:

```
c8y_Command
```

Commands the agent sends after approval:

| Action | Device | Command |
|---|---|---|
| Schedule reservoir refill | Water level | `START_REFILL_PUMP` |
| Adjust irrigation | Soil moisture | `START_IRRIGATION 20` |
| Spraying work order | Mosquito | `ACTIVATE_MISTING NE` |
| Dispatch technician | Animal trap | `TRAP_SERVICE_MODE ON` |

## 5. Optional: email alerts (Smart Rule)

Cockpit → Configuration → Smart rules → **On alarm send email**
- Alarm type: e.g. `UnauthorizedAccessAlarm`
- Subject: `New #{severity} alarm from #{source.name}`
- Target: your Smart Guardian group only (important on shared tenants)

## Widget loader tips

- Paste code in the **Web Component** tab of the HTML widget (Advanced developer mode).
- If you see *“SyntaxError: '#' not followed by identifier”*, click **Cancel**, reopen the widget and paste again.
- The code avoids `$`, backslashes and `#` in JavaScript strings because the Cumulocity loader rewrites them.
