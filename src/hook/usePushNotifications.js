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
          await messaging().registerDeviceForRemoteMessages();
        }

        const token = await messaging().getToken();
        console.log('Device FCM token:', token);

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
        if (remoteMessage.data.path === 'thread') {
          navigation.navigate('ThreadScreen', {
            chatMessage: {
              _id: remoteMessage.data.chatId,
              type: 'message',
              status: 'seen',
              sender: {
                profilePicture: remoteMessage.data.image,
                fullName: remoteMessage.data.name,
              },
              text: 'Eeee',
              chat: remoteMessage.data.image,
              files: [],
              organization: '64fcb2e60d2f877aaccb3b26',
              emoji: [],
              createdAt: '2024-12-05T10:29:31.366Z',
              updatedAt: '2024-12-05T10:47:00.424Z',
              __v: 0,
              replyCount: 3,
              reactionsCount: 0,
              myReaction: null,
              reactions: {},
            },
          });
        } else {
          store.dispatch(setCurrentRoute('MessageScreen2'));
          navigation.navigate('MessageScreen2');
          store.dispatch(setSingleChat(chatsObj[remoteMessage.data.chatId]));
        }
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
