import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../context/ThemeContext';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowLeft from '../assets/Icons/ArrowLeft';
import {useSelector} from 'react-redux';
import MessageIconLive from '../assets/Icons/MessageIconLive';

const NotificationScreenHeader = ({navigation}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top} = useSafeAreaInsets();
  let {chats} = useSelector(state => state.chat);

  // const navigation = useNavigation();
  // console.log("navigation", JSON.stringify(navigation, null, 1));

  return (
    <>
      <View
        style={[
          styles.container,
          {
            paddingTop: top,
            paddingHorizontal: responsiveScreenWidth(2),
            paddingBottom: 10,
          },
        ]}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.White,
            padding: 10,
            borderRadius: 100,
          }}
          onPress={() => navigation.goBack()}>
          <ArrowLeft />
        </TouchableOpacity>

        <View style={styles.MessageNotificationContainer}>
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
        </View>
      </View>
    </>
  );
};

export default NotificationScreenHeader;

const getStyles = Colors =>
  StyleSheet.create({
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
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: Colors.Background_color,
      alignItems: 'center',
    },
    MessageNotificationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
