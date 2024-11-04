import OneSignal from 'react-native-onesignal';

export const initializeOneSignal = () => {
  // Replace 'YOUR_ONESIGNAL_APP_ID' with your actual app ID from the OneSignal dashboard
  OneSignal.setAppId('3ce99978-ed60-4726-bdac-f7ff23c88503');

  // Prompt the user for push notification permissions (optional)
  OneSignal.promptForPushNotificationsWithUserResponse(response => {
    console.log('Prompt response:', response);
  });

  // Notification handlers
  OneSignal.setNotificationWillShowInForegroundHandler(
    notificationReceivedEvent => {
      console.log(
        'Notification received in foreground:',
        notificationReceivedEvent,
      );
      // Complete with options (e.g., display notification)
      const notification = notificationReceivedEvent.getNotification();
      notificationReceivedEvent.complete(notification);
    },
  );

  OneSignal.setNotificationOpenedHandler(notification => {
    console.log('Notification opened:', notification);
  });
};
