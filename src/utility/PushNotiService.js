import {Platform} from 'react-native';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {messaging} from '@react-native-firebase/messaging';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import axiosInstance from './axiosInstance';

const PushNotiService = () => {
  const [isTokenSent, setIsTokenSent] = useState(false);
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
        // console.log('Device FCM token:', token);
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
        console.error('Error during setup:', err.message);
      }
    };

    setupNotifications();

    return () => {
      console.log('Cleanup for notifications');
    };
  }, [isTokenSent]);

  async function registerAppWithFCM() {
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
    if (Platform.OS === 'android') {
      const {status} = await checkNotifications();
      if (status !== 'granted') {
        const permissionResult = await requestNotifications(['alert', 'sound']);
        if (permissionResult.status !== 'granted') {
          console.log('Android permission denied');
        }
      }
    } else if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('iOS permission denied');
      }
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
              navigation.navigate('MessageScreen2');
              // store.dispatch(setSingleChat(chatsObj[detail.notification.chatId]))
              break;
          }
        });
      } else {
        console.log('No notification content found in the remote message');
      }
    } catch (err) {
      console.error('Error displaying notification:', err);
    }
  };

  const sendTokenToBackend = async token => {
    try {
      const response = await axiosInstance.post('/user/save-device-token/v2', {
        token,
      });
      console.log('Device token sent to backend successfully:', response.data);
    } catch (err) {
      console.error('Error sending token to backend:', err);
      ('Network error while sending token');
    }
  };
  return null;
};

export default PushNotiService;
