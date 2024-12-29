// // backgroundHandler.js
// import messaging from '@react-native-firebase/messaging';
// import notifee from '@notifee/react-native';

// // Define the background message handler
// const backgroundMessageHandler = async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);

//   // Display the notification using Notifee
//   if (remoteMessage.notification) {
//     await notifee.displayNotification({
//       title: remoteMessage.notification.title,
//       body: remoteMessage.notification.body,
//       android: {
//         channelId: 'default',
//       },
//     });
//   }
// };

// // Register the background handler
// messaging().setBackgroundMessageHandler(backgroundMessageHandler);
