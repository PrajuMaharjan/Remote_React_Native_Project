# Remote

A React Native + Expo app for discovering and controlling Samsung TVs on the same local network.

Remote turns your phone or tablet into a streamlined smart-TV remote. It automatically discovers nearby Samsung TVs, supports manual setup when needed, and provides a polished remote-control experience for everyday use.

## Features

- Automatic Samsung TV discovery using SSDP multicast scanning
- Manual IP entry fallback for devices that do not advertise properly
- Saved and persisted device connections for quick reconnection
- Secure WebSocket-based communication with Samsung TV endpoints
- Remote control interface with D-pad navigation, volume, source, channel, and power controls
- Media controls for playback and shortcut actions
- Keyboard mode for text entry and search on supported TVs

## Tech Stack

- React Native
- Expo SDK 58
- TypeScript
- React Navigation
- AsyncStorage
- Samsung TV WebSocket remote protocol
- UDP multicast discovery

## Project Structure

```text
src/
├── components/     # Reusable UI components and remote controls
├── config/        # App configuration values
├── constants/     # Network and app constants
├── context/       # Shared Samsung TV state/provider
├── hooks/         # Discovery and connection hooks
├── navigation/    # App navigation setup
├── screens/       # Screen views
├── services/      # TV WebSocket and command services
├── utils/         # Helper utilities
├── ...
├── app.json       # Expo app configuration
``` 

## Prerequisites

Before running the app, make sure you have:

- Node.js 20+ recommended
- npm or yarn
- Android Studio / Android emulator, or a physical Android device
- iOS simulator if developing on macOS
- A Samsung TV connected to the same Wi‑Fi network as your phone

## Installation

```bash
npm install
```

## Running the App

Start the Expo development server:

```bash
npx expo start
```

## How It Works

1. The app scans the local network for Samsung TVs using SSDP discovery.
2. It filters discovered responses to identify compatible Samsung devices.
3. It probes the device IPs to confirm a valid Samsung TV WebSocket endpoint.
4. Once connected, the TV can be controlled from the app.
5. Previously paired devices are stored locally for quick access later.

## Usage

- Open the app and choose "Connect to TV".
- Let the app scan for nearby Samsung devices.
- Select a discovered TV or add one manually.
- Connect and start using the remote controls.

## Notes

- This app is designed for Samsung TVs on the same local network.
- Some Samsung TVs may require a valid connection token or pairing flow depending on model and firmware.
- For the best results, keep both the TV and the mobile device on the same Wi‑Fi network.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome. If you want to improve device discovery, add more controls, or refine the interface, feel free to open a pull request.
