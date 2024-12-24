// index.js

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

// Register the background message handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(
    'remoteMessage from background',
    JSON.stringify(remoteMessage, null, 2),
  );
  // handleNotification(remoteMessage);
});

// Register the main application component
function HeadlessCheck({isHeadless}) {
  console.log('Is headless:', isHeadless);
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  // Render the app component on foreground launch
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);

// Define the background message handler
const handleNotification = async remoteMessage => {
  console.log(
    'Received background message:',
    JSON.stringify(remoteMessage, null, 2),
  );
  try {
    if (remoteMessage.notification) {
      // Display the notification using Notifee
      await notifee.displayNotification({
        title: remoteMessage.notification.title || 'Default Title',
        body: remoteMessage.notification.body || 'Default Body',
        android: {
          channelId: 'default',
        },
        ios: {
          sound: 'default',
          badge: 1,
        },
      });

      // Set up foreground event listener (Note: Consider moving this outside the handler)
      notifee.onBackgroundEvent(({type, detail}) => {
        switch (type) {
          case EventType.DISMISSED:
            console.log('User dismissed notification');
            console.log(
              'Notification Details:',
              JSON.stringify(detail.notification, null, 2),
            );
            break;
          case EventType.PRESS:
            console.log('User pressed notification');
            if (remoteMessage.data?.path) {
              navigate('MessageScreen2'); // Use navigate from NavigationService

              // Dispatch Redux action
              const chatId = remoteMessage.data.chatId;
              const chat = store.getState().chat.chatsObj[chatId];
              if (chat) {
                store.dispatch(setSingleChat(chat));
              } else {
                console.warn('Chat not found for ID:', chatId);
              }
            }
            break;
          default:
            break;
        }
      });
    } else {
      console.log('No notification content found in the remote message');
    }
  } catch (err) {
    console.error('Error displaying notification:', err);
    // Handle error appropriately
  }
};
