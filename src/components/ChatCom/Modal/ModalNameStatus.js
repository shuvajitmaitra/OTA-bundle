import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import CustomFonts from '../../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../../context/ThemeContext';
import {useSelector} from 'react-redux';

export default function ModalNameStatus() {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {singleChat: chat} = useSelector(state => state.chat);

  return (
    <View style={styles.modalProfileNameContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.profileName}>
          {chat.isChannel
            ? chat?.name || 'Unavailable'
            : chat?.otherUser?.fullName || 'Unavailable'}
        </Text>
      </View>
      {/* <View style={styles.activeStatusContainer}>
        <View
          style={[
            styles.activeDot,
            {
              backgroundColor: onlineUsers?.find(
                x => x?._id === chat?.otherUser?._id,
              )
                ? '#BDBDBD'
                : '#62cc7b',
            },
          ]}></View>
        <Text
          style={{
            color: Colors.BodyText,
            fontFamily: CustomFonts.REGULAR,
          }}>
          {onlineUsers?.find(x => x?._id === chat?.otherUser?._id)
            ? 'Offline'
            : 'Online'}
        </Text>
      </View> */}
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    modalProfileNameContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: responsiveScreenHeight(1.7),
    },

    profileName: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
      maxWidth: responsiveScreenWidth(60),
    },
    activeStatusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      marginTop: responsiveScreenHeight(0.5),
    },
    activeDot: {
      width: responsiveScreenWidth(3),
      height: responsiveScreenWidth(3),
      borderRadius: responsiveScreenWidth(100),
      color: 'rgba(0, 0, 0, 0.6)',
    },
  });
