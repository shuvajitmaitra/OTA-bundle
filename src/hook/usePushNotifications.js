import {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import axios from 'axios';
import {Platform} from 'react-native';
import {
  request,
  PERMISSIONS,
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';

const usePushNotifications = () => {
  const [error, setError] = useState('');
  const [isTokenSent, setIsTokenSent] = useState(false);

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        await requestNotificationPermission();
        const token = await messaging().getToken();

        console.log('Device token:', token);

        if (!isTokenSent) {
          sendTokenToBackend(token);
          setIsTokenSent(true);
        }

        // Create notification channel (only Android)
        await createNotificationChannel();

        // Foreground notification listener
        messaging().onMessage(handleNotification);

        // App opened from background notification
        messaging().onNotificationOpenedApp(handleNotification);

        // App opened from a killed state (initial notification)
        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification) {
          console.log(
            'App opened with initial notification:',
            initialNotification,
          );
          handleNotification(initialNotification);
        } else {
          console.log('No initial notification found');
        }
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

  const requestNotificationPermission = async () => {
    console.log('Requesting notification permission...');
    if (Platform.OS === 'android') {
      await checkNotifications().then(({status}) => {
        console.log('Notification status on Android:', status);
        if (status !== 'granted') {
          requestNotifications(['alert', 'sound']).then(() => {
            console.log('Notification permissions requested for Android');
            askForPermission(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
          });
        }
      });
    }
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('iOS Notification permission granted:', authStatus);
      } else {
        console.log('iOS Notification permission denied');
        setError('Notification permission denied for iOS');
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
      } else {
        console.log('Notification channel already exists on Android');
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
            channelId: 'default', // Android-specific
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

  // Send device token to backend
  const sendTokenToBackend = async token => {
    try {
      const response = await axios.post(
        'https://backend-teal-one-64.vercel.app//v2/save-device-token',
        {
          token,
        },
      );
      console.log('Device token sent to backend successfully:', response);
    } catch (err) {
      console.error('Error sending token to backend:', err);
      setError('Network error while sending token');
    }
  };

  const askForPermission = permission => {
    request(permission).then(result => {
      console.log('Permission result:', JSON.stringify(result, null, 1));
    });
  };

  return {error, isTokenSent};
};

export default usePushNotifications;
