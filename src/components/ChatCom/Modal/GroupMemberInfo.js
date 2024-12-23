import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import moment from 'moment';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import ThreeDotGrayIcon from '../../../assets/Icons/ThreeDotGrayIcon';
import CustomFonts from '../../../constants/CustomFonts';
import {useTheme} from '../../../context/ThemeContext';
import NewUserIcons from '../../../assets/Icons/NewUserIcons';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedMembers} from '../../../store/reducer/chatSlice';

export default function GroupMemberInfo({item, index}) {
  const dispatch = useDispatch();
  const {singleChat: chat} = useSelector(state => state.chat);
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const name =
    item.user.fullName && item.user.fullName.split(' ')?.length > 3
      ? `${item.user.fullName.split(' ')[0]}  ${
          item.user.fullName.split(' ')[1]
        }`
      : `${item.user.fullName}`;
  const roleValid =
    chat?.myData?.user !== item?.user?._id &&
    (chat?.myData?.role === 'admin' || chat?.myData?.role === 'owner')
      ? true
      : false;
  return (
    <View
      style={[
        styles.container,
        {borderTopColor: index ? Colors.BorderColor : Colors.White},
      ]}>
      <View style={styles.profileImageContainer}>
        <View style={styles.profileImage}>
          {item?.user?.profilePicture ? (
            <Image
              style={styles.profileImage}
              source={
                {uri: item?.user?.profilePicture}
                // : require("../../../assets/Images/user.png")
              }
            />
          ) : (
            <NewUserIcons />
          )}
        </View>
        <View>
          <Text style={[styles.profileName]}>
            {name}
            {item?.role === 'member' || (
              <Text style={styles.roleText}>{` (${item.role})`}</Text>
            )}
            {item?.isBlocked ? (
              <Text style={styles.blockText}> (Blocked)</Text>
            ) : null}
            {item?.mute?.isMuted ? (
              <Text style={styles.blockText}> (Muted)</Text>
            ) : null}
          </Text>
          <Text
            style={[
              styles.status,
              {
                color:
                  new Date(item?.user?.lastActive) > new Date()
                    ? '#06AC6D'
                    : Colors.BodyText,
              },
            ]}>
            {item?.user?.lastActive
              ? moment(item?.user?.lastActive).fromNow()
              : 'N/A'}
          </Text>
        </View>
      </View>

      {roleValid ? (
        <TouchableOpacity
          style={styles.threeDotIcon}
          onPress={() => {
            dispatch(setSelectedMembers(item));
          }}
          activeOpacity={0.5}>
          <View
            style={{
              paddingHorizontal: 1,
              borderRadius: 100,
            }}>
            <ThreeDotGrayIcon />
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    roleText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.5),
      textTransform: 'capitalize',
    },
    blockText: {
      color: Colors.PrimaryRed,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.5),
      textTransform: 'capitalize',
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: responsiveScreenHeight(1),
      borderTopWidth: 1,
      borderTopColor: Colors.BorderColor,
    },
    profileImageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(4),
    },
    profileImage: {
      width: responsiveScreenWidth(10),
      height: responsiveScreenWidth(10),
      borderRadius: responsiveScreenWidth(100),
      resizeMode: 'cover',
      position: 'relative',
      backgroundColor: Colors.BodyText,
    },
    profileName: {
      fontSize: responsiveScreenFontSize(1.8),
      width: responsiveScreenWidth(60),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
    },
    status: {
      color: 'rgba(11, 42, 70, 1)',
      fontSize: responsiveScreenFontSize(1.8),
      paddingVertical: responsiveScreenHeight(0.2),
      fontFamily: CustomFonts.REGULAR,
    },
    commentsTime: {
      color: 'rgba(111, 116, 124, 1)',
      fontSize: responsiveScreenFontSize(1.9),
    },
    // --------------------------
    // ----------- Popup modal -----------
    // --------------------------
    threeDotIcon: {
      paddingHorizontal: responsiveScreenWidth(1),
    },
    buttonText: {
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
    iconAndTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(3),
    },
    buttonContainer: {
      paddingVertical: responsiveScreenHeight(1.2),
      paddingHorizontal: responsiveScreenWidth(1.5),
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
    },

    content: {
      borderRadius: 8,
      minWidth: responsiveScreenWidth(50),
      backgroundColor: Colors.White,
    },
    arrow: {
      borderTopColor: Colors.White,
      marginTop: responsiveScreenHeight(9),
    },
  });
