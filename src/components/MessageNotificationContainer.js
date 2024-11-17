import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import MessageImg from '../assets/ApplicationImage/MainPage/message.png';
import NotificationImg from '../assets/ApplicationImage/MainPage/notification.png';
import {useTheme} from '../context/ThemeContext';
import MessageIcon from '../assets/Icons/MessageIcon';
import MessageIconLive from '../assets/Icons/MessageIconLive';
import NotificationIconLive from '../assets/Icons/NotificationIconLive';
import {setNotifications} from '../store/reducer/notificationReducer';
import * as Animatable from 'react-native-animatable';

export default function MessageNotificationContainer() {
  const navigation = useNavigation();
  let {chats} = useSelector(state => state.chat);
  let {notificationCount} = useSelector(state => state.notification);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('HomeStack', {screen: 'NewChatScreen'})
        }
        style={styles.messageContainer}>
        {chats &&
          chats?.filter(
            chat =>
              chat?.unreadCount > 0 &&
              chat?.myData.user !== chat?.latestMessage?.sender?._id,
          )?.length > 0 && (
            <Text style={[styles.badge, {backgroundColor: Colors.Red}]}>
              {chats &&
                chats?.filter(
                  chat =>
                    chat?.unreadCount > 0 &&
                    chat?.myData.user !== chat?.latestMessage?.sender?._id,
                )?.length}
            </Text>
          )}

        <MessageIconLive />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          dispatch(setNotifications([]));
          navigation.navigate('HomeStack', {screen: 'NotificationScreen'});
        }}
        style={styles.notificationContainer}>
        {/* {notificationCount?.totalUnread && ( */}
        {notificationCount?.totalUnread !== 0 && (
          <Text style={[styles.badge]}>{notificationCount?.totalUnread}</Text>
        )}

        <NotificationIconLive />
      </TouchableOpacity>
    </>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    messageContainer: {
      width: responsiveScreenWidth(12),
      height: responsiveScreenWidth(12),
      borderRadius: responsiveScreenWidth(12),
      backgroundColor: Colors.White,
      marginRight: responsiveScreenWidth(4),
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
    notificationContainer: {
      width: responsiveScreenWidth(12),
      height: responsiveScreenWidth(12),
      borderRadius: responsiveScreenWidth(12),
      backgroundColor: Colors.White,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
    messageIcon: {
      width: responsiveScreenWidth(7),
      height: responsiveScreenWidth(7),
    },
    badge: {
      backgroundColor: Colors.Red,
      color: Colors.PureWhite,
      position: 'absolute',
      zIndex: 10,
      top: 0,
      right: 0,
      padding: 1,
      paddingHorizontal: 5,
      borderRadius: 5,
      overflow: 'hidden',
      minWidth: 15,
      textAlign: 'center',
    },
  });
