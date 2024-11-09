import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import moment from 'moment';

import CustomFonts from '../../constants/CustomFonts';
import groupIcon from '../../assets/Images/group.png';
import userIcon from '../../assets/Images/user.png';
import botIcon from '../../assets/Images/bot.png';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {markRead, setSingleChat} from '../../store/reducer/chatReducer';
import {setSelectedMessageScreen} from '../../store/reducer/ModalReducer';

function formatTime(dateString) {
  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'days').startOf('day');
  const date = moment(dateString);

  if (date.isSame(today, 'd')) {
    return date.format('h:mm a'); // 12-hour format with AM/PM marker, no leading zero for hours
  } else if (date.isSame(yesterday, 'd')) {
    return 'Yesterday';
  } else {
    return date.format('D/M/YYYY'); // No leading zeros for days or months
  }
}

const generateActivityText = (message, senderName) => {
  let activity = message.activity;
  if (activity?.type === 'add') {
    return (
      <>
        {senderName} added {message.activity?.user?.fullName}{' '}
      </>
    );
  } else if (activity?.type === 'remove') {
    return (
      <>
        {senderName} removed {message.activity?.user?.fullName}{' '}
      </>
    );
  } else if (activity?.type === 'join') {
    return <>{message.activity?.user?.fullName} joined in this channel </>;
  } else if (activity?.type === 'leave') {
    return <>{message.activity?.user?.fullName} left this channel </>;
  } else {
    return <>N/A</>;
  }
};

function getText(str) {
  return str.replace(/<\/?[^>]+(>|$)/g, '');
}

function replaceMentionToName(str) {
  return str.replace(/@\[([^\]]+)\]\([^)]+\)/g, '@$1');
}

const ChatItem = ({
  isChatClicked = false, // isChatClicked means it clicked or not if it was clicked its background will be white otherwise it will be gray
  chat,
  onlineUsers,
  setFocusedChat,
  setChecked,
  bottomSheetRef,
}) => {
  const dispatch = useDispatch();
  // console.log(JSON.stringify(chat?.latestMessage?.files, null, 1));
  const {user} = useSelector(state => state.auth);
  // console.log("🚀 ~ user:", user);
  // console.log(JSON.stringify(user, null, 1));
  const navigation = useNavigation();
  // const item = chat?.filter((item) => item._id);

  const senderName =
    chat?.latestMessage?.sender?.profilePicture === user?.profilePicture
      ? 'You'
      : chat?.latestMessage?.sender?.firstName?.split(' ')[0];
  const Colors = useTheme();
  const styles = getStyles(Colors);

  function removeMarkdown(text) {
    if (!text) {
      return '';
    }

    // Regular expressions for matching common Markdown syntax
    return (
      text
        .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold (e.g., **text** or __text__)
        .replace(/(\*|_)(.*?)\1/g, '$2') // Italics (e.g., *text* or _text_)
        .replace(/~~(.*?)~~/g, '$1') // Strikethrough (e.g., ~~text~~)
        .replace(/`(.*?)`/g, '$1') // Inline code (e.g., `code`)
        .replace(/!\[.*?\]\(.*?\)/g, '') // Images (e.g., ![alt text](url))
        // .replace(/\[.*?\]\(.*?\)/g, "$1") // Links (e.g., [text](url))
        .replace(/^\s*#{1,6}\s*/gm, '') // Headers (e.g., # Header)
        .replace(/>\s?/g, '') // Blockquotes (e.g., > text)
        .replace(/^-{3,}\s*$/gm, '') // Horizontal rules (e.g., ---)
        .replace(/(?:^|\n)\s*-\s+/g, '\n') // Lists (e.g., - item)
        .replace(/(?:^|\n)\s*\d+\.\s+/g, '\n') // Ordered lists (e.g., 1. item)
        .replace(/\n{2,}/g, '\n') // Collapse multiple newlines
        .trim()
    ); // Trim leading/trailing whitespace
  }
  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={() => {
        // setFocusedChat(chat?._id);
        // setChecked('chats');
        // dispatch(markRead({chatId: chat?._id}));
        dispatch(setSingleChat(chat));
        // console.log(JSON.stringify(chat, null, 1));
        dispatch(
          setSelectedMessageScreen({
            chatId: chat?._id,
            name: chat?.isChannel ? chat?.name : chat?.otherUser?.fullName,
            image: chat?.avatar || chat?.otherUser?.profilePicture || '',
            limit: chat?.unreadCount || 0,
          }),
        );
        // navigation.navigate('ChatStack', {
        //   screen: 'MessageScreen2',
        //   params: {
        //     chatId: chat?._id,
        //     name: chat?.isChannel ? chat?.name : chat?.otherUser?.fullName,
        //     image: chat?.avatar || chat?.otherUser?.profilePicture,
        //   },
        // });
        navigation.navigate('MessageScreen2', {animationEnabled: false});

        // navigation.navigate('MessageScreen2', {
        //   chatId: chat?._id,
        //   name: chat?.isChannel ? chat?.name : chat?.otherUser?.fullName,
        //   image: chat?.avatar || chat?.otherUser?.profilePicture,
        // });
      }}>
      {/* <View style={styles.subContainer}> */}
      <View style={styles.profileImageContainer}>
        <Image
          resizeMode="contain"
          style={styles.profileImage}
          source={
            chat?.isChannel
              ? chat?.avatar
                ? {uri: chat?.avatar}
                : groupIcon
              : chat?.otherUser?.type === 'bot'
              ? botIcon
              : chat?.otherUser?.profilePicture
              ? {uri: chat.otherUser.profilePicture}
              : require('../../assets/Images/user.png')
          }
        />

        <View
          style={[
            styles.activeDot,
            {
              backgroundColor: onlineUsers?.find(
                x => x?._id === chat?.otherUser?._id,
              )
                ? Colors.Primary
                : Colors.Gray2,
            },
          ]}></View>
      </View>

      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.profileName}>
            {chat?.isChannel
              ? chat?.name
              : chat?.otherUser?.fullName || 'Schools Hub User'}
          </Text>
          <Text style={styles.messageTime}>
            {formatTime(chat?.latestMessage?.createdAt)}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Text
            style={{
              fontFamily:
                chat?.unreadCount > 0 &&
                chat.myData.user != chat?.latestMessage?.sender?._id
                  ? CustomFonts.SEMI_BOLD
                  : CustomFonts.REGULAR,
              color:
                chat?.unreadCount > 0 &&
                chat.myData.user != chat?.latestMessage?.sender?._id
                  ? Colors.Heading
                  : Colors.Gray3,
              flexBasis: chat?.unreadCount > 0 ? '80%' : '100%',
            }}
            numberOfLines={1}
            ellipsizeMode="tail">
            {
              // chat?.latestMessage?.files?.length == 0 &&
              // chat?.latestMessage?.files?.length == 0 &&
              // chat?.latestMessage?.text == undefined ? (
              //   <Text>{`${chat.latestMessage.sender?.firstName}: deleted the message`}</Text>
              // ) :
              chat?.latestMessage?.files?.length > 0 ? (
                <Text style={{color: Colors.BodyText}}>
                  {`${
                    chat?.latestMessage?.sender?.profilePicture ===
                    user?.profilePicture
                      ? 'You'
                      : chat?.latestMessage?.sender?.firstName
                  }: ${
                    (chat?.latestMessage?.files[0].type?.startsWith('image/') &&
                      'Sent a photo') ||
                    (chat?.latestMessage?.files[0].type?.startsWith('audio/') &&
                      'Sent a voice message') ||
                    (chat?.latestMessage?.files[0].type?.startsWith('video/') &&
                      'Sent a video') ||
                    'Sent a attachment'
                  }`}
                </Text>
              ) : chat?.latestMessage?.emoji?.length > 0 ? (
                <Text
                  style={{
                    color: Colors.BodyText,
                  }}>{`${senderName}: Sent a ${chat?.latestMessage?.emoji[0].symbol} reaction`}</Text>
              ) : chat?.myData?.isBlocked ? (
                <Text style={{color: 'red'}}>Blocked</Text>
              ) : chat?.typingData?.isTyping ? (
                <Text style={{color: 'green'}}>
                  {chat?.typingData?.user?.firstName} is typing...
                </Text>
              ) : !chat?.latestMessage?._id ? (
                <Text style={{color: Colors.BodyText}}>New chat</Text>
              ) : chat?.latestMessage?.type === 'activity' ? (
                <Text style={{color: Colors.BodyText}}>
                  {generateActivityText(chat?.latestMessage, senderName)}
                </Text>
              ) : (
                <Text style={{color: Colors.BodyText}}>
                  {`${senderName}: ${getText(
                    replaceMentionToName(
                      removeMarkdown(chat?.latestMessage?.text) ||
                        'Deleted the message',
                    ),
                  )}`}
                </Text>
              )
            }
          </Text>
          <View style={styles.messageNumberContainer}>
            {chat?.unreadCount > 0 &&
              chat.myData.user != chat?.latestMessage?.sender?._id && (
                <Text style={styles.messageNumber}>{chat?.unreadCount}</Text>
              )}
          </View>
        </View>
      </View>
      {/* </View> */}
    </TouchableOpacity>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1.8),
      borderRadius: responsiveScreenWidth(2),
      // backgroundColor: 'blue',
    },
    subContainer: {
      backgroundColor: 'red',
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(4),
    },
    altOfProfileImage: {
      width: responsiveScreenWidth(10),
      height: responsiveScreenWidth(10),
      borderRadius: responsiveScreenWidth(100),
      position: 'relative',
      backgroundColor: Colors.DarkGreen,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sortName: {
      color: Colors.White,
      fontSize: responsiveScreenFontSize(1.8),
    },
    profileImage: {
      width: responsiveScreenWidth(10),
      height: responsiveScreenWidth(10),
      borderRadius: responsiveScreenWidth(100),
      resizeMode: 'cover',
      position: 'relative',
      backgroundColor: Colors.LightGreen,
    },
    activeDot: {
      width: responsiveScreenWidth(2.8),
      height: responsiveScreenWidth(2.8),
      borderRadius: responsiveScreenWidth(100),
      position: 'absolute',
      bottom: responsiveScreenWidth(0.9),
      right: -2,
      borderWidth: 1,
      borderColor: Colors.White,
    },
    profileName: {
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      width: responsiveScreenWidth(50),
    },
    messageTime: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.7),
      fontFamily: CustomFonts.REGULAR,
    },
    timeContainer: {
      flexDirection: 'row',
      gap: responsiveScreenHeight(1),
      alignItems: 'center',
      justifyContent: 'space-between',
      width: responsiveScreenWidth(79),
      // backgroundColor: "red",
    },
    messageNumberContainer: {
      alignItems: 'center',
      // backgroundColor: "red",

      backgroundColor: Colors.Red,
      borderRadius: 100,
    },
    messageNumber: {
      paddingHorizontal: responsiveScreenWidth(1.2),
      textAlign: 'center',
      color: Colors.PureWhite,
      borderRadius: responsiveScreenWidth(100),
      fontSize: responsiveScreenFontSize(1.3),
    },
  });

export default memo(ChatItem);
