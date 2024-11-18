import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ProgressBar, MD3Colors} from 'react-native-paper';

import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';

import axiosInstance from '../../../utility/axiosInstance';
import CustomFonts from '../../../constants/CustomFonts';
import {useTheme} from '../../../context/ThemeContext';
import Images from '../../../constants/Images';

export default function ProgramItem({myprogram, myProgressMetrics}) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();

  const handleCourseDetails = () => {
    navigation.navigate('ProgramDetails', {slug: myprogram?.program?.slug});
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleCourseDetails}>
          <Text style={styles.title}>{myprogram?.program?.title}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleCourseDetails} activeOpacity={0.8}>
        <View style={styles.sessionContainer}>
          <Text style={styles.sessionText}>Session:</Text>
          <Text style={styles.sessionDate}>
            {myprogram?.enrollment?.session?.name}
          </Text>
          {/* <Text style={styles.rating}>0.0</Text>
                    <AntDesign name="star" style={styles.starIcon} /> */}
          {/* <Text style={styles.sessionDate}>(0)</Text> */}
        </View>
        <View style={styles.sessionContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                myprogram?.program?.instructor?.image
                  ? {
                      uri: myprogram?.program?.instructor?.image,
                    }
                  : Images.DEFAULT_IMAGE
              }
              style={styles.image}
            />
          </View>
          <Text style={[styles.sessionDate, styles.instructor]}>
            Instructor:
          </Text>
          <Text style={styles.sessionText}>
            {myprogram?.program?.instructor?.name}
          </Text>
        </View>

        <Text style={[styles.sessionText, styles.overall]}>
          Overall Progress {myProgressMetrics.overallPercentageAllItems}%
        </Text>
        <ProgressBar
          progress={myProgressMetrics?.overallPercentageAllItems || 0}
          style={styles.progress}
          color={Colors.BodyText}
        />
      </TouchableOpacity>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.Background_color,
      width: responsiveScreenWidth(93),
      borderRadius: 5,
      paddingHorizontal: responsiveScreenWidth(5),
      paddingVertical: responsiveScreenHeight(2),
      marginTop: responsiveScreenHeight(2),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
      width: responsiveScreenWidth(75),
    },
    threeDot: {
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
    },
    sessionContainer: {
      flexDirection: 'row',
      marginTop: responsiveScreenHeight(1),
      alignItems: 'center',
    },
    sessionText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.9),
      color: Colors.Heading,
    },
    sessionDate: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.9),
      color: Colors.BodyText,
      marginLeft: 6,
    },
    rating: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.9),
      color: Colors.Heading,
      marginLeft: 10,
    },
    starIcon: {
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.StarColor,
      marginLeft: 6,
    },
    profileImageContainer: {
      width: responsiveScreenWidth(8),
      height: responsiveScreenWidth(8),
      borderRadius: responsiveScreenWidth(12),
    },
    image: {
      width: responsiveScreenWidth(8),
      height: responsiveScreenWidth(8),
      borderRadius: responsiveScreenWidth(12),
    },
    instructor: {
      marginRight: 8,
      marginLeft: 8,
    },
    overall: {
      marginTop: responsiveScreenHeight(2.5),
    },
    progress: {
      width: '100%',
      height: 10,
      borderRadius: 10,
      marginTop: responsiveScreenHeight(1),
      // backgroundColor: "red",
    },

    popupContent: {
      padding: 16,
      backgroundColor: Colors.White,
      borderRadius: 8,
      width: responsiveScreenWidth(40),
      height: responsiveScreenHeight(6.5),
      position: 'absolute',
      top: responsiveScreenHeight(-7),
    },
    popupArrow: {
      borderTopColor: Colors.White,
      marginTop: responsiveScreenHeight(-7),
    },
    unEnrollment: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      textAlign: 'center',
    },
  });
