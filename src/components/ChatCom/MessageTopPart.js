import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React from 'react';

import {
  responsiveScreenFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import CustomFonts from '../../constants/CustomFonts';
import Images from '../../constants/Images';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setLocalMessages} from '../../store/reducer/chatSlice';
import PinIcon from '../../assets/Icons/PinIcon';
import StarIcon from '../../assets/Icons/StartIcon';
import {handleChatFavorite} from '../../actions/apiCall';
import {useTheme} from '../../context/ThemeContext';
import moment from 'moment';
import {useMMKVObject} from 'react-native-mmkv';

import botIcon from '../../assets/Images/bot.png';
import CrowdIcon from '../../assets/Icons/CrowedIcon';
import AiBotIcon from '../../assets/Icons/AiBotIcon';
import MembersIcon from '../../assets/Icons/MembersIcon';
import UserIcon from '../../assets/Icons/UserIcon';
import {setCurrentRoute} from '../../store/reducer/authReducer';
import {RegularFonts} from '../../constants/Fonts';

export default function MessageTopPart({setPinnedScreenVisible, fetchPinned}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {singleChat: chat, onlineUsers} = useSelector(state => state.chat);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [pinnedCount = {}] = useMMKVObject('pinCount');

  // console.log('chat', JSON.stringify(chat, null, 2));
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity
          onPress={() => {
            dispatch(setLocalMessages([]));
            dispatch(setCurrentRoute(null));
            navigation.goBack();
            // navigation.navigate('NewChatScreen');
          }}
          style={styles.backButtonContainer}>
          <ArrowLeft />
        </TouchableOpacity>
        <Pressable
          onPress={() => navigation.navigate('ChatProfile')}
          style={styles.profileDetailsContainer}>
          <View style={styles.avaterContainer}>
            {chat?.isChannel && chat?.avatar ? (
              <Image
                style={styles.profileImage}
                size={35}
                source={{uri: chat.avatar}}
              />
            ) : chat?.isChannel && !chat?.avatar ? (
              <View style={styles.profileImage}>
                <CrowdIcon color={Colors.BodyTextOpacity} size={30} />
              </View>
            ) : chat?.otherUser?.type === 'bot' ? (
              <View style={styles.profileImage}>
                <AiBotIcon color={Colors.BodyTextOpacity} />
              </View>
            ) : !chat.isChannel && chat?.otherUser?.profilePicture ? (
              <Image
                style={styles.profileImage}
                size={35}
                source={
                  chat?.otherUser?.profilePicture
                    ? {uri: chat.otherUser.profilePicture}
                    : require('../../assets/Images/user.png')
                }
              />
            ) : (
              <View style={styles.profileImage}>
                <UserIcon color={Colors.BodyTextOpacity} size={30} />
              </View>
            )}
          </View>
          <View style={styles.profileNameContainer}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
              {chat?.isChannel
                ? chat?.name || 'Bootcampshub User'
                : chat?.otherUser?.fullName || 'Bootcampshub User'}
            </Text>
            <View>
              {chat?.typingData?.isTyping ? (
                <Text style={{color: 'green'}}>
                  {chat?.typingData?.user?.firstName} is typing...
                </Text>
              ) : chat?.isChannel ? (
                <Text style={styles.avaliable}>{`${
                  chat?.membersCount || ''
                } members`}</Text>
              ) : onlineUsers?.find(x => x?._id === chat?.otherUser?._id) ? (
                <View style={styles.avaliableContainer}>
                  <Text style={styles.avaliable}>Available</Text>
                  <View style={styles.onlineStatus}></View>
                </View>
              ) : (
                <Text style={styles.avaliable}>
                  {moment(chat?.otherUser?.lastActive).fromNow()}
                </Text>
              )}
            </View>
          </View>
        </Pressable>
      </View>
      <View style={styles.rightSection}>
        {pinnedCount[chat?._id] > 0 && (
          <TouchableOpacity
            onPress={() => {
              fetchPinned(chat._id);
              setPinnedScreenVisible(true);
            }}>
            <PinIcon size={25} />
          </TouchableOpacity>
        )}
        {chat?.isChannel && (
          <TouchableOpacity
            onPress={() =>
              handleChatFavorite({
                isFavourite: !chat?.myData?.isFavourite,
                chat: chat?._id,
              })
            }>
            <StarIcon color={chat?.myData?.isFavourite ? 'gold' : 'gray'} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 100,
      backgroundColor: Colors.PrimaryOpacityColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: Colors.White,
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
      height: 80,
      // flex: 1,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      // backgroundColor: 'yellow',
      flex: 0.8,
      overflow: 'hidden',
    },
    backButtonContainer: {
      width: 50,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: 'red',
      height: 70,
    },
    profileDetailsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // backgroundColor: 'red',
    },
    avaterContainer: {
      flexDirection: 'row',
      position: 'relative',
    },
    profileNameContainer: {
      marginLeft: 10,
      // flexBasis: '55%',
      // backgroundColor: 'red',
    },
    name: {
      color: Colors.Heading,
      fontFamily: CustomFonts.LATO_BOLD,
      fontSize: RegularFonts.BL,
      // flexBasis: '10%',
      width: '100%',
    },
    avaliableContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avaliable: {
      color: Colors.Primary,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
    },
    onlineStatus: {
      width: 8,
      height: 8,
      borderRadius: 8,
      backgroundColor: Colors.Primary,
      marginLeft: responsiveScreenWidth(1.5),
      marginTop: 2,
    },
    rightSection: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2.5),
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: 20,
      // backgroundColor: 'blue',
      // width: '100%',
      flex: 0.2,
    },
    iconContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
    },
    popupContent: {
      backgroundColor: Colors.White,
      borderRadius: 8,
      width: responsiveScreenWidth(51),
      paddingVertical: 16,
    },
    popupArrow: {
      borderTopColor: Colors.White,
    },
    popupText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      marginBottom: 2,
    },
    line: {
      width: responsiveScreenWidth(51),
      height: 1,
      backgroundColor: Colors.LineColor,
      marginVertical: responsiveScreenWidth(2),
    },
    popoverItem: {
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
      paddingHorizontal: 7,
    },
  });
