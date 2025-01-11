import {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {Platform} from 'react-native';
import axiosInstance from '../utility/axiosInstance';

import store from '../store';
import {setSingleChat} from '../store/reducer/chatReducer';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {setCurrentRoute} from '../store/reducer/authReducer';

const usePushNotifications = () => {
  const [error, setError] = useState('');
  const [isTokenSent, setIsTokenSent] = useState(false);
  const {chatsObj} = useSelector(state => state.chat);

  const navigation = useNavigation();
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        await requestNotificationPermission();

        await registerAppWithFCM();

        if (Platform.OS === 'ios') {
          const apnsToken = await messaging().getAPNSToken();
          if (apnsToken) {
            messaging().apnsToken = apnsToken;
          }
        }

        const token = await messaging().getToken();
        console.log('Device FCM token:', token);
        // Alert.alert(token);

        if (token && !isTokenSent) {
          sendTokenToBackend(token);
          setIsTokenSent(true);
        }
        await createNotificationChannel();

        messaging().onMessage(handleNotification);
        messaging().onNotificationOpenedApp(handleNotification);

        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification) {
          handleNotification(initialNotification);
        } else {
          console.log('No initial notification found');
        }

        messaging().onTokenRefresh(newToken => {
          console.log('FCM Token refreshed:', newToken);
          if (newToken) {
            sendTokenToBackend(newToken);
          }
        });
      } catch (err) {
        setError(err.message);
        console.error('Error during setup:', err.message);
      }
    };

    setupNotifications();

    return () => {
      console.log('Cleanup for notifications');
    };
  }, []);

  async function registerAppWithFCM() {
    console.log(
      'registerAppWithFCM status',
      messaging().isDeviceRegisteredForRemoteMessages,
    );
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging()
        .registerDeviceForRemoteMessages()
        .then(status => {
          console.log('registerDeviceForRemoteMessages status', status);
        })
        .catch(err => {
          console.log('registerDeviceForRemoteMessages error ', err);
        });
    }
  }

  const requestNotificationPermission = async () => {
    await notifee.requestPermission({
      sound: false,
      announcement: true,
      inAppNotificationSettings: false,
    });
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      setError('Notification permission denied on iOS');
      console.log('iOS permission denied');
    }
  };

  const createNotificationChannel = async () => {
    if (Platform.OS === 'android') {
      const channelId = 'default';
      const channelExists = await notifee.getChannels();

      if (!channelExists.find(channel => channel.id === channelId)) {
        await notifee.createChannel({
          id: channelId,
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });
      }
    }
  };

  const handleNotification = async remoteMessage => {
    console.log('remoteMessage', JSON.stringify(remoteMessage, null, 1));
    try {
      if (remoteMessage.notification) {
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
        notifee.onForegroundEvent(({type, detail}) => {
          switch (type) {
            case EventType.DISMISSED:
              console.log('User dismissed notification');
              console.log(
                'detail.notification',
                JSON.stringify(detail.notification, null, 1),
              );
              break;
            case EventType.PRESS:
              console.log('User pressed notification');
              if (remoteMessage.data.path) {
                store.dispatch(setCurrentRoute('MessageScreen2'));

                navigation.navigate('MessageScreen2');

                store.dispatch(
                  setSingleChat(chatsObj[remoteMessage.data.chatId]),
                );
              }
              //   if (remoteMessage.data.path === 'thread') {
              //     navigation.navigate('ThreadScreen', {
              //       chatMessage: {
              //         _id: remoteMessage.data.chatId,
              //         type: 'message',
              //         status: 'seen',
              //         sender: {
              //           profilePicture: remoteMessage.data.image,
              //           fullName: remoteMessage.data.name,
              //         },
              //         text: 'Eeee',
              //         chat: remoteMessage.data.image,
              //         files: [],
              //         organization: '64fcb2e60d2f877aaccb3b26',
              //         emoji: [],
              //         createdAt: '2024-12-05T10:29:31.366Z',
              //         updatedAt: '2024-12-05T10:47:00.424Z',
              //         __v: 0,
              //         replyCount: 3,
              //         reactionsCount: 0,
              //         myReaction: null,
              //         reactions: {},
              //       },
              //     });
              //   }
              break;
          }
        });
      } else {
        console.log('No notification content found in the remote message');
      }
    } catch (err) {
      console.error('Error displaying notification:', err);
      setError('Error displaying notification');
    }
  };

  const sendTokenToBackend = async token => {
    try {
      const response = await axiosInstance.post('/user/save-device-token/v2', {
        token,
      });
      console.log(
        'Device token sent to backend successfully! success:',
        response.data.success,
      );
    } catch (err) {
      console.error('Error sending token to backend:', err);
      setError('Network error while sending token');
    }
  };

  return {error, isTokenSent};
};

export default usePushNotifications;

// import {useEffect, useState} from 'react';
// import messaging from '@react-native-firebase/messaging';
// import notifee, {
//   AndroidImportance,
//   AuthorizationStatus,
//   EventType,
// } from '@notifee/react-native';
// import {AppRegistry, Platform} from 'react-native';
// import axiosInstance from '../utility/axiosInstance';
// // import {
// //   requestNotifications,
// //   checkNotifications,
// // } from 'react-native-permissions';
// import store from '../store';
// import {setSingleChat} from '../store/reducer/chatReducer';
// import {useSelector} from 'react-redux';
// import {useNavigation} from '@react-navigation/native';
// import {navigate} from '../navigation/NavigationService';

// const usePushNotifications = () => {
//   const [error, setError] = useState('');
//   const [isTokenSent, setIsTokenSent] = useState(false);
//   const {chatsObj} = useSelector(state => state.chat);

//   const navigation = useNavigation();
//   useEffect(() => {
//     const setupNotifications = async () => {
//       try {
//         await requestNotificationPermission();

//         await registerAppWithFCM();

//         if (Platform.OS === 'ios') {
//           const apnsToken = await messaging().getAPNSToken();
//           if (apnsToken) {
//             messaging().apnsToken = apnsToken;
//           }
//         }

//         const token = await messaging().getToken();
//         console.log('Device FCM token:', Platform.OS, token);
//         // Alert.alert(token);

//         if (token && !isTokenSent) {
//           sendTokenToBackend(token);
//           setIsTokenSent(true);
//         }
//         await createNotificationChannel();

//         messaging().onMessage(handleNotification);
//         messaging().setBackgroundMessageHandler(async remoteMessage => {
//           // console.log(
//           //   'remoteMessage background in usePushNotifications',
//           //   JSON.stringify(remoteMessage, null, 2),
//           // );
//           handleBackgroundNotification(remoteMessage);
//         });
//         AppRegistry.registerHeadlessTask(
//           'RNFirebaseBackgroundMessage',
//           () => async remoteMessage => {
//             console.log('Headless task called with message:', remoteMessage);
//             // You can handle the message or perform tasks here
//           },
//         );
//         messaging().onNotificationOpenedApp(handleNotification);

//         const initialNotification = await messaging().getInitialNotification();
//         if (initialNotification) {
//           handleNotification(initialNotification);
//         } else {
//           console.log('No initial notification found');
//         }

//         messaging().onTokenRefresh(newToken => {
//           console.log('FCM Token refreshed:', newToken);
//           if (newToken) {
//             sendTokenToBackend(newToken);
//           }
//         });
//       } catch (err) {
//         setError(err.message);
//         // console.log('Error during setup:', err.message);
//       }
//     };

//     setupNotifications();

//     return () => {
//       // console.log('Cleanup for notifications');
//     };
//   }, []);

//   async function registerAppWithFCM() {
//     // console.log(
//     //   'registerAppWithFCM status',
//     //   messaging().isDeviceRegisteredForRemoteMessages,
//     // );
//     if (!messaging().isDeviceRegisteredForRemoteMessages) {
//       await messaging()
//         .registerDeviceForRemoteMessages()
//         .then(status => {
//           console.log('registerDeviceForRemoteMessages status', status);
//         })
//         .catch(err => {
//           console.log('registerDeviceForRemoteMessages error ', err);
//         });
//     }
//   }

//   const requestNotificationPermission = async () => {
//     await notifee.requestPermission({
//       sound: false,
//       announcement: true,
//       inAppNotificationSettings: false,
//     });

//     await messaging().requestPermission();
//   };

//   const createNotificationChannel = async () => {
//     if (Platform.OS === 'android') {
//       const channelId = 'default';
//       const channelExists = await notifee.getChannels();

//       if (!channelExists.find(channel => channel.id === channelId)) {
//         await notifee.createChannel({
//           id: channelId,
//           name: 'Default Channel',
//           importance: AndroidImportance.HIGH,
//         });
//       }
//     }
//   };

//   const handleNotification = async remoteMessage => {
//     console.log(
//       'handleNotification for foreground',
//       JSON.stringify(remoteMessage, null, 2),
//     );
//     try {
//       if (remoteMessage.data) {
//         await notifee.displayNotification({
//           title: remoteMessage.data.name || 'Default Title',
//           body: remoteMessage.data.body || 'Default Body',
//           android: {
//             channelId: 'default',
//             pressAction: {
//               id: 'default',
//             },
//           },
//           ios: {
//             sound: 'default',
//             badge: 1,
//           },
//         });
//         notifee.onForegroundEvent(async ({type, detail}) => {
//           if (type === EventType.PRESS) {
//             const {chatId} = remoteMessage.data;

//             if (remoteMessage?.data?.path) {
//               const chat = store.getState().chat.chatsObj[chatId];
//               if (chat) {
//                 store.dispatch(setSingleChat(chat));
//               } else {
//                 console.warn('Chat not found for ID:', chatId);
//               }
//               navigate('MessageScreen2');
//             }
//           }

//           if (type === EventType.DISMISSED) {
//             console.log('User dismissed notification');
//             console.log(
//               'Notification Details:',
//               JSON.stringify(detail.notification, null, 2),
//             );
//           }
//         });
//       } else {
//         console.log('No notification content found in the remote message');
//       }
//     } catch (err) {
//       console.error('Error displaying notification:', err);
//     }
//   };
//   const handleBackgroundNotification = async remoteMessage => {
//     console.log(
//       'handleBackgroundNotification',
//       JSON.stringify(remoteMessage, null, 1),
//     );
//     try {
//       if (remoteMessage.notification) {
//         // await notifee.displayNotification({
//         //   title: remoteMessage.notification.title || 'Default Title',
//         //   body: remoteMessage.notification.body || 'Default Body',
//         //   android: {
//         //     channelId: 'default',
//         //   },
//         //   ios: {
//         //     sound: 'default',
//         //     badge: 1,
//         //   },
//         // });
//         notifee.onBackgroundEvent(({type, detail}) => {
//           switch (type) {
//             case EventType.DISMISSED:
//               console.log('User dismissed notification');
//               console.log(
//                 'detail.notification',
//                 JSON.stringify(detail.notification, null, 1),
//               );
//               break;
//             case EventType.PRESS:
//               console.log('User pressed notification');
//               if (remoteMessage.data.path) {
//                 navigation.navigate('MessageScreen2');

//                 store.dispatch(
//                   setSingleChat(chatsObj[remoteMessage.data.chatId]),
//                 );
//               }
//               //   if (remoteMessage.data.path === 'thread') {
//               //     navigation.navigate('ThreadScreen', {
//               //       chatMessage: {
//               //         _id: remoteMessage.data.chatId,
//               //         type: 'message',
//               //         status: 'seen',
//               //         sender: {
//               //           profilePicture: remoteMessage.data.image,
//               //           fullName: remoteMessage.data.name,
//               //         },
//               //         text: 'Eeee',
//               //         chat: remoteMessage.data.image,
//               //         files: [],
//               //         organization: '64fcb2e60d2f877aaccb3b26',
//               //         emoji: [],
//               //         createdAt: '2024-12-05T10:29:31.366Z',
//               //         updatedAt: '2024-12-05T10:47:00.424Z',
//               //         __v: 0,
//               //         replyCount: 3,
//               //         reactionsCount: 0,
//               //         myReaction: null,
//               //         reactions: {},
//               //       },
//               //     });
//               //   }
//               break;
//           }
//         });
//       } else {
//         console.log('No notification content found in the remote message');
//       }
//     } catch (err) {
//       console.error('Error displaying notification:', err);
//       setError('Error displaying notification');
//     }
//   };

//   const sendTokenToBackend = async token => {
//     try {
//       const response = await axiosInstance.post('/user/save-device-token/v2', {
//         token,
//       });
//       console.log(
//         'Device token sent to backend successfully! success:',
//         response.data.success,
//       );
//     } catch (err) {
//       console.error('Error sending token to backend:', err);
//       setError('Network error while sending token');
//     }
//   };

//   return {error, isTokenSent};
// };

// export default usePushNotifications;
