import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MessageScreen2 from '../screens/Chat/MessageScreen2';
import ThreadScreen from '../screens/Chat/ThreadScreen';
import DrawerNavigator from './DrawerNavigator';
import ChatProfile from '../screens/Chat/ChatProfile';
import GlobalCommentModal from '../components/SharedComponent/GlobalCommentModal';
import {useSelector} from 'react-redux';
import NotificationEventDetails from '../components/Calendar/Modal/NotificationEventDetails';
import {useMainContext} from '../context/MainContext';
import store from '../store';
import {setAppLoading} from '../store/reducer/authReducer';
import {loadCalendarEvent, loadNotifications} from '../actions/chat-noti';
import {connectSocket, disconnectSocket} from '../utility/socketManager';
import {getOnlineUsers} from '../actions/apiCall';
import usePushNotifications from '../hook/usePushNotifications';

const RootStack = createStackNavigator();

const RootStackNavigator = () => {
  const {notificationClicked} = useSelector(state => state.calendar);
  const {handleVerify} = useMainContext();
  const {error} = usePushNotifications();

  useEffect(() => {
    store.dispatch(setAppLoading(true));
    handleVerify();
    loadNotifications();
    connectSocket();
    loadCalendarEvent();
    getOnlineUsers();
    console.log('handle from dashboard..............');
    store.dispatch(setAppLoading(false));
    return () => {
      disconnectSocket();
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
          options={({route, navigation}) => ({
            headerShown: false,
          })}
        />
      </RootStack.Navigator>
      <GlobalCommentModal />
      {notificationClicked && <NotificationEventDetails />}
    </>
  );
};

export default RootStackNavigator;
