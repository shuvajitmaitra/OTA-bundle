import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View, Image} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenWidth,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';

import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
export default function PopupProgramItem({enrollment, handleSwitch, active}) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{enrollment?.program?.title}</Text>
      </View>
      <View>
        <View style={styles.sessionContainer}>
          <Text style={styles.sessionText}>Session:</Text>
          <Text style={styles.sessionDate}>{enrollment?.session?.name}</Text>
          {/* <Text style={styles.rating}>5.0</Text> */}
          {/* <AntDesign name="star" style={styles.starIcon} />
                    <Text style={styles.sessionDate}>(30,765)</Text> */}
        </View>
        <View style={styles.sessionContainer}>
          <Text style={styles.sessionText}>Branch:</Text>
          <Text style={styles.sessionDate}>{enrollment?.branch?.name}</Text>
          {/* <Text style={styles.rating}>5.0</Text> */}
          {/* <AntDesign name="star" style={styles.starIcon} />
                    <Text style={styles.sessionDate}>(30,765)</Text> */}
        </View>
        {/* <View style={styles.sessionContainer}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={require("../../assets/ApplicationImage/MainPage/Profile.png")}
                            style={styles.image}
                        />
                    </View>
                    <Text style={[styles.sessionDate, styles.instructor]}>Instructor:</Text>
                    <Text style={styles.instructorText}>Shimul Ahmad</Text>
                </View> */}
        <View style={styles.sessionContainer}>
          <Text style={styles.instructorText}>Status:</Text>
          <Text
            style={[
              styles.approvedText,
              {
                color: enrollment?.status === 'approved' ? 'green' : 'red',
                textTransform: 'capitalize',
              },
            ]}>
            {enrollment?.status}
          </Text>
        </View>
        {/* <Text style={[styles.sessionText, styles.overall]}>Overall Progress 20%</Text>
                <ProgressBar progress={0.2} style={styles.progress} color={Colors.BodyText} /> */}

        {(enrollment?.status === 'approved' ||
          enrollment?.status === 'trial') && (
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={enrollment?._id === active?._id}
            onPress={() => handleSwitch(enrollment)}
            style={[
              styles.switchBtn,
              {
                backgroundColor:
                  active?._id === enrollment?._id ? 'grey' : Colors.Primary,
              },
            ]}>
            <Text style={styles.switchBtnText}>
              {enrollment?._id === active?._id ? 'Switched' : 'Switch'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.ModalBoxColor,
      width: responsiveScreenWidth(85),
      borderRadius: 5,
      paddingHorizontal: responsiveScreenWidth(5),
      paddingVertical: responsiveScreenHeight(2),
      marginTop: responsiveScreenHeight(1),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      alignSelf: 'center',
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.9),
      color: Colors.Heading,
      width: responsiveScreenWidth(75),
    },
    sessionContainer: {
      flexDirection: 'row',
      marginTop: responsiveScreenHeight(1),
      alignItems: 'center',
    },
    sessionText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
    },
    instructorText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
    },
    sessionDate: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      marginLeft: 6,
    },
    rating: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      marginLeft: 10,
    },
    starIcon: {
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.StarColor,
      marginLeft: 6,
    },
    profileImageContainer: {
      width: responsiveScreenWidth(7),
      height: responsiveScreenWidth(7),
      borderRadius: responsiveScreenWidth(12),
    },
    image: {
      width: responsiveScreenWidth(7),
      height: responsiveScreenWidth(7),
      borderRadius: responsiveScreenWidth(12),
    },
    instructor: {
      marginRight: 8,
      marginLeft: 8,
      fontSize: responsiveScreenFontSize(1.6),
    },
    overall: {
      marginTop: responsiveScreenHeight(1),
      fontSize: responsiveScreenFontSize(1.6),
    },
    progress: {
      width: '100%',
      height: 8,
      borderRadius: 10,
      marginTop: responsiveScreenHeight(1),
    },
    switchBtn: {
      width: responsiveScreenWidth(30),
      backgroundColor: Colors.Primary,
      height: responsiveScreenHeight(4),
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: responsiveScreenHeight(1),
      borderRadius: 7,
    },
    switchBtnText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.White,
    },
    approvedText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Primary,
      marginLeft: responsiveScreenWidth(1),
    },
  });
