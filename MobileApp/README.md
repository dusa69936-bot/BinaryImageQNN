# Binary Image QNN Mobile App Setup

This Expo-based React Native application connects to your Django backend to classify handwritten digits using Quantum Neural Networks (QNN).

## 🚀 Step 1: Backend Connection Config
You **MUST** update the backend URL in `services/api.js` to match your computer's IP address.

1. Open a terminal on your computer and run `ipconfig`.
2. Look for `IPv4 Address` (e.g., `192.168.1.5`).
3. Open `MobileApp/services/api.js` and update:
   ```javascript
   const BASE_URL = 'http://YOUR_IP_ADDRESS:8000';
   ```

## 🛠️ Step 2: Running the Project

### Using a Physical Device (Recommended)
1. Install the **Expo Go** app from the Play Store or App Store.
2. In the `MobileApp` directory, run:
   ```bash
   npx expo start
   ```
3. Scan the QR code displayed in the terminal using the Expo Go app.

### Using an Android Emulator
1. Start your Android Emulator.
2. In the `MobileApp` directory, run:
   ```bash
   npx expo start --android
   ```

## 📦 Step 3: Building an APK
To build a standalone APK without deploying the frontend to a cloud service, you can use EAS Build with the local flag (this requires Android Studio/SDK) or Expo's standard build path.

1. Install EAS CLI: `npm install -g eas-cli`
2. Configure build: `eas build:configure`
3. Build for Android: `eas build -p android --profile preview`

## 📂 Project Structure
- `/screens`: Home, Preview, and Result UI.
- `/services/api.js`: Axios configuration and API calls.
- `App.js`: Main navigation stack.
