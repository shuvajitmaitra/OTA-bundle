import React, {useEffect, useRef} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MessageScreen2 from '../screens/Chat/MessageScreen2';
import ThreadScreen from '../screens/Chat/ThreadScreen';
import DrawerNavigator from './DrawerNavigator';
import ChatProfile from '../screens/Chat/ChatProfile';
import {useSelector} from 'react-redux';
import NotificationEventDetails from '../components/Calendar/Modal/NotificationEventDetails';
import store from '../store';
import {setAppLoading} from '../store/reducer/authReducer';
import {
  loadChats,
  loadNotifications,
  loadProgramInfo,
} from '../actions/chat-noti';
import {connectSocket, disconnectSocket} from '../utility/socketManager';
import {fetchOnlineUsers} from '../actions/apiCall';
import {setSinglePost} from '../store/reducer/communityReducer';
import axiosInstance, {configureAxiosHeader} from '../utility/axiosInstance';
import OrgSwitchModal from '../components/OrgSwitchModal';
import {storage} from '../utility/mmkvInstance';
import ProgramSwitchModal from '../components/SharedComponent/ProgramSwitchModal';
import usePushNotifications from '../hook/usePushNotifications';
import CommentScreen from '../screens/Comment/CommentScreen';

const RootStack = createStackNavigator();

const RootStackNavigator = () => {
  const {notificationClicked} = useSelector(state => state.calendar);
  const {myEnrollments, organizations} = useSelector(state => state.auth);
  const hasInitialized = useRef(false);
  const organization = storage.getString('organization');
  const activeEnrolment = storage.getString('active_enrolment');
  const {error} = usePushNotifications();

  useEffect(() => {
    const initialize = async () => {
      try {
        await configureAxiosHeader();
        store.dispatch(setAppLoading(true));

        const response = await axiosInstance.post('/user/verify', {});

        if (response && response.status === 200) {
          const promises = [
            loadChats(),
            connectSocket(),
            loadProgramInfo(),
            loadNotifications(),
            fetchOnlineUsers(),
          ];

          await Promise.all(promises);
          hasInitialized.current = true;
          store.dispatch(setAppLoading(false));
        } else {
          console.warn(
            'Verification failed with status:',
            response?.status || 'unknown',
          );
        }
      } catch (err) {
        console.error('Error verifying user:', err.response?.data);
      } finally {
        store.dispatch(setAppLoading(false));
      }
    };

    if (!hasInitialized.current) {
      initialize();
    }

    return () => {
      hasInitialized.current = false;
      disconnectSocket();
      store.dispatch(setSinglePost(null));
    };
  }, []);

  return (
    <>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="MessageScreen2"
          component={MessageScreen2}
          options={{
            headerShown: false,
            title: 'Messages',
          }}
        />
        <RootStack.Screen
          name="ThreadScreen"
          component={ThreadScreen}
          options={{
            headerShown: false,
            title: 'Thread',
          }}
        />
        <RootStack.Screen
          name="ChatProfile"
          component={ChatProfile}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="CommentScreen"
          component={CommentScreen}
          options={{
            headerShown: false,
          }}
        />
      </RootStack.Navigator>

      {notificationClicked && <NotificationEventDetails />}
      {!organization && organizations.length > 0 && (
        <OrgSwitchModal isVisible={!organization} />
      )}
      {!activeEnrolment && myEnrollments.length > 0 && (
        <ProgramSwitchModal onCancelPress={() => {}} modalOpen={true} />
      )}
    </>
  );
};

export default RootStackNavigator;
