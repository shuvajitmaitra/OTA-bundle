import {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {Alert, Platform} from 'react-native';
import axiosInstance from '../utility/axiosInstance';
import {
  requestNotifications,
  checkNotifications,
} from 'react-native-permissions';

const usePushNotifications = () => {
  const [error, setError] = useState('');
  const [isTokenSent, setIsTokenSent] = useState(false);

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
        Alert.alert(token);

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
  }, [isTokenSent]);

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
    console.log('Requesting notification permission...');
    if (Platform.OS === 'android') {
      const {status} = await checkNotifications();
      if (status !== 'granted') {
        const permissionResult = await requestNotifications(['alert', 'sound']);
        if (permissionResult.status !== 'granted') {
          setError('Notification permission denied on Android');
          console.log('Android permission denied');
        }
      }
    } else if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        setError('Notification permission denied on iOS');
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
      console.log('Device token sent to backend successfully:', response.data);
    } catch (err) {
      console.error('Error sending token to backend:', err);
      setError('Network error while sending token');
    }
  };

  return {error, isTokenSent};
};

export default usePushNotifications;
