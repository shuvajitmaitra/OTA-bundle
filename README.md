# Project Name

## Bootcampshub

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [Yarn](https://yarnpkg.com/) or `npm`
- [CocoaPods](https://cocoapods.org/) (for iOS development)
- [EAS CLI](https://expo.dev/eas) (for building the app)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development)

### Installation and Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-name>
   ```

2. Install dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```

3. Install iOS dependencies:

   ```bash
   cd ios
   pod install
   cd ..
   ```

4. Start the development server:

   ```bash
   yarn start
   ```

5. Run the app:
   - For iOS:
     - Press `i` in the terminal to run on the iOS simulator.
   - For Android:
     - Press `a` in the terminal to run on an Android emulator.
   - For android real device
     - Open mobile developer mode
     - Under the developer more enable USB debugging mode
     - Connect mobile to your device
     - Press `a` to run in the device

---

## Build Instructions

### Build with EAS

1. Build for Android:
   ```bash
   eas build -p android --profile preview
   ```

---

### Manual Builds

#### Android

1. Create an `.aab` file:

   ```bash
   npx react-native build-android --mode=release
   ```

   or

   ```bash
   cd android
   ./gradlew bundleRelease
   ```

2. Create an `.apk` file:
   ```bash
   cd android
   ./gradlew assembleRelease
   cd ..
   ```
   or
   ```bash
   yarn android --mode release
   ```

#### iOS

1. Open the project in Xcode:
   ```bash
   xed -b ios
   ```

---

### Notes

- Make sure to configure your environment for React Native following the [official setup guide](https://reactnative.dev/docs/environment-setup).
- Use the appropriate profiles and signing configurations for production builds.

---

Replace `<repository-url>` and `<project-name>` with the actual values for your project.
