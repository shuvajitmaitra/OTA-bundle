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
        // Request notification permission
        await requestNotificationPermission();

        // Register the app with FCM and APNS (for iOS)
        await registerAppWithFCM();

        // Get APNS token (iOS only)
        if (Platform.OS === 'ios') {
          const apnsToken = await messaging().getAPNSToken();
          console.log('APNS Token:', apnsToken);
          if (apnsToken) {
            // Set APNS token in Firebase for iOS
            messaging().apnsToken = apnsToken;
          }
        }

        // Get FCM token (both iOS and Android)
        const token = await messaging().getToken();
        console.log('Device FCM token:', token);
        Alert.alert(token);

        // Send the token to the backend if not sent already
        if (token && !isTokenSent) {
          sendTokenToBackend(token);
          setIsTokenSent(true);
        }

        // Set up notification channel for Android
        await createNotificationChannel();

        // Notification handlers
        messaging().onMessage(handleNotification);
        messaging().onNotificationOpenedApp(handleNotification);

        // Handle initial notification if app is opened via a notification
        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification) {
          handleNotification(initialNotification);
        } else {
          console.log('No initial notification found');
        }

        // Handle token refresh (if token is updated, e.g., on app reinstall)
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

  // Register app for remote notifications (iOS and Android)
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
        .catch(error => {
          console.log('registerDeviceForRemoteMessages error ', error);
        });
    }
  }

  // Request notification permissions based on platform
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

  // Create notification channel for Android
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

  // Handle displaying notifications when received
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

  // Send FCM token to backend
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
