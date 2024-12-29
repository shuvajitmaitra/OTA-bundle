// index.js

import React from 'react';
import 'react-native-gesture-handler'; // Should be at the top
import messaging from '@react-native-firebase/messaging';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
import store from './src/store';
import {setSingleChat} from './src/store/reducer/chatReducer';
import {navigate} from './src/navigation/NavigationService';

// Import any other necessary modules

// Initialize Notifee (create channels, etc.)
async function initializeNotifee() {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: 4, // High importance
  });
  return channelId;
}

const channelIdPromise = initializeNotifee();

// Register the background message handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(
    'remoteMessage from background',
    JSON.stringify(remoteMessage, null, 2),
  );
  await handleNotification(remoteMessage);
});

messaging().getInitialNotification(async remoteMessage => {
  if (remoteMessage) {
    console.log(
      'remoteMessage from kill mode',
      JSON.stringify(remoteMessage, null, 2),
    );
    await handleNotification(remoteMessage);
  }
});

// Register the main application component
function AppWrapper({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  // Render the app component on foreground launch
  return <App />;
}

AppRegistry.registerComponent(appName, () => AppWrapper);

// Define the notification handler
const handleNotification = async remoteMessage => {
  console.log(
    'remoteMessage in handleNotification',
    JSON.stringify(remoteMessage, null, 2),
  );
  try {
    if (remoteMessage.data) {
      const channelId = await channelIdPromise;
      await notifee.displayNotification({
        title: remoteMessage.data.name || 'Default Title',
        body: remoteMessage.data.body || 'Default Body',
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
          badge: 1,
        },
      });
      notifee.onBackgroundEvent(async ({type, detail}) => {
        if (type === EventType.PRESS) {
          const {chatId} = remoteMessage.data;

          if (remoteMessage?.data?.path) {
            const chat = store.getState().chat.chatsObj[chatId];
            if (chat) {
              store.dispatch(setSingleChat(chat));
            } else {
              console.warn('Chat not found for ID:', chatId);
            }
            navigate('MessageScreen2');
          }
        }

        if (type === EventType.DISMISSED) {
          console.log('User dismissed notification');
          console.log(
            'Notification Details:',
            JSON.stringify(detail.notification, null, 2),
          );
        }
      });
    } else {
      console.log('No notification content found in the remote message');
    }
  } catch (err) {
    console.error('Error displaying notification:', err);
  }
};
