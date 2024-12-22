// index.js

import 'react-native-gesture-handler'; // Should be at the top
import messaging from '@react-native-firebase/messaging';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Import the background message handler
// import './src/utility/backgroundHandler';
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(
    'remoteMessage background',
    JSON.stringify(remoteMessage, null, 2),
  );
});

// Optionally, register a headless task (if needed)
// AppRegistry.registerHeadlessTask(
//   'RNFirebaseBackgroundMessage',
//   () => async remoteMessage => {
//     console.log('Headless task called with message:', remoteMessage);
//     // You can handle the message or perform tasks here
//   },
// );

// Register the main application component
AppRegistry.registerComponent(appName, () => App);
