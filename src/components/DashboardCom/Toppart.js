import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenHeight,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import MessageNotificationContainer from '../MessageNotificationContainer';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import Images from '../../constants/Images';

export default function Toppart() {
  const {user} = useSelector(state => state.auth);
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const newName =
    user?.fullName?.length > 2
      ? user?.fullName.split(' ')[0] + ' ' + user?.fullName.split(' ')[1]
      : user?.fullName;
  const newEmail =
    user?.email?.length > 24
      ? user?.email.substring(0, 24) + '...'
      : user?.email;
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              user.profilePicture
                ? {
                    uri: user.profilePicture,
                  }
                : Images.DEFAULT_IMAGE
            }
            style={styles.image}
          />
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{newName}</Text>
          <Text style={styles.emailText}>{newEmail}</Text>
        </View>
      </View>
      <View style={styles.messageNotificationContainer}>
        <MessageNotificationContainer />
      </View>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    nameContainer: {
      // width: "70%",
      // backgroundColor: "lightblue",
    },
    emailText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.5),
      color: Colors.BodyText,
    },
    nameText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
    },
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 10,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // marginTop: responsiveScreenHeight(1),
      // backgroundColor: "red",
      maxWidth: '100%',
    },
    profileImageContainer: {
      width: responsiveScreenWidth(12),
      height: responsiveScreenWidth(12),
      borderRadius: responsiveScreenWidth(12),
    },
    image: {
      width: responsiveScreenWidth(12),
      height: responsiveScreenWidth(12),
      borderRadius: responsiveScreenWidth(12),
    },
    messageNotificationContainer: {
      // backgroundColor: "green",
      flexDirection: 'row',
    },
  });
