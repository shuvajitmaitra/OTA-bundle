import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MessageScreen2 from '../screens/Chat/MessageScreen2';
import ThreadScreen from '../screens/Chat/ThreadScreen';
import DrawerNavigator from './DrawerNavigator';
import ChatProfile from '../screens/Chat/ChatProfile';
import GlobalCommentModal from '../components/SharedComponent/GlobalCommentModal';
import {useSelector} from 'react-redux';
import NotificationEventDetails from '../components/Calendar/Modal/NotificationEventDetails';
import store from '../store';
import {setAppLoading} from '../store/reducer/authReducer';
import {
  loadCalendarEvent,
  loadChats,
  loadNotifications,
  loadProgramInfo,
} from '../actions/chat-noti';
import {
  connectSocket,
  disconnectSocket,
  socket,
} from '../utility/socketManager';
import {getOnlineUsers} from '../actions/apiCall';
import {setSinglePost} from '../store/reducer/communityReducer';
import axiosInstance, {configureAxiosHeader} from '../utility/axiosInstance';
import OrgSwitchModal from '../components/OrgSwitchModal';
import {storage} from '../utility/mmkvInstance';
import ProgramSwitchModal from '../components/SharedComponent/ProgramSwitchModal';
import usePushNotifications from '../hook/usePushNotifications';

const RootStack = createStackNavigator();

const RootStackNavigator = () => {
  const {notificationClicked} = useSelector(state => state.calendar);
  const {bottomSheetVisible} = useSelector(state => state.modal);

  const orgJSON = storage.getString('organization');
  const proJSON = storage.getString('active_enrolment');
  console.log(proJSON);
  // const keys = storage.getAllKeys();
  // console.log('keys', JSON.stringify(keys, null, 1));
  const {error} = usePushNotifications();
  useEffect(() => {
    const initialCalls = async () => {
      try {
        await configureAxiosHeader();
        store.dispatch(setAppLoading(true));
        const res = await axiosInstance.post('/user/verify', {});

        if (res.status === 200) {
          await Promise.all([
            loadNotifications(),
            loadCalendarEvent(),
            loadProgramInfo(),
            loadChats(),
            getOnlineUsers(),
          ]);

          if (!socket?.connected) {
            connectSocket();
          }

          console.log('handle from dashboard..............');
        }
      } catch (err) {
        console.error('Error during the verification process:', err);
      } finally {
        store.dispatch(setAppLoading(false));
      }
    };

    initialCalls();

    return () => {
      disconnectSocket();
      store.dispatch(setSinglePost(null));
      console.log(
        '.........................................................................................................',
      );
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
      {bottomSheetVisible && <GlobalCommentModal />}
      {notificationClicked && <NotificationEventDetails />}
      {!orgJSON && <OrgSwitchModal isVisible={!orgJSON} />}
      {/* {selectProgramModalVisible && (
        <ProgramSwitchModal
          onCancelPress={() => setSelectProgramModalVisible(false)}
          modalOpen={selectProgramModalVisible}
        />
      )} */}
      {!proJSON && (
        <ProgramSwitchModal onCancelPress={() => {}} modalOpen={true} />
      )}
    </>
  );
};

export default RootStackNavigator;
