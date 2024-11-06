// src/utils/OneSignalService.js

import {Alert} from 'react-native';
import OneSignal from 'react-native-onesignal';

const ONESIGNAL_APP_ID = '3ce99978-ed60-4726-bdac-f7ff23c88503';

const initializeOneSignal = () => {
  if (!OneSignal) {
    console.error('OneSignal is undefined. Check installation.');
    return;
  }

  OneSignal.setAppId(ONESIGNAL_APP_ID);

  OneSignal.promptForPushNotificationsWithUserResponse(response => {
    console.log('Prompt response:', response);
  });

  OneSignal.setNotificationOpenedHandler(notification => {
    console.log('Notification opened:', notification);
    Alert.alert('Notification Opened', JSON.stringify(notification));
  });

  OneSignal.setNotificationWillShowInForegroundHandler(
    notificationReceivedEvent => {
      console.log(
        'Notification received in foreground:',
        notificationReceivedEvent,
      );
      let notification = notificationReceivedEvent.getNotification();
      notificationReceivedEvent.complete(notification);
    },
  );
};

export default initializeOneSignal;
