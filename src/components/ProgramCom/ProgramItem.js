import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {ProgressBar} from 'react-native-paper';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import CustomFonts from '../../constants/CustomFonts';
import ProgressIcon from '../../assets/Icons/ProgressIcon';
import {useTheme} from '../../context/ThemeContext';
import {useSelector} from 'react-redux';
import Images from '../../constants/Images';

export default function ProgramItem({myprogram, myProgressMetrics}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);

  const handleCourseDetails = () => {
    navigation.navigate('ProgramDetails', {slug: myprogram?.program?.slug});
  };

  const handlePrograss = () => {
    navigation.navigate('Progress');
  };
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleCourseDetails}>
          <Text style={styles.title}>
            {myprogram?.program?.title || 'Bootcamps'}
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <View style={styles.sessionContainer}>
          <Text style={styles.sessionText}>Session:</Text>
          <Text style={styles.sessionDate}>
            {myprogram?.enrollment?.session?.name}
          </Text>
          <Text style={[styles.sessionText, {marginLeft: 20}]}>ID:</Text>
          <Text style={[styles.sessionDate, {marginLeft: 5}]}>
            {user.id || 0}
          </Text>
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
            {myprogram?.program?.instructor?.name || 'N/A'}
          </Text>
        </View>

        {/* -------------------------- */}
        {/* ----------- Rating Container ----------- */}
        {/* -------------------------- */}
        {/* <View style={styles.sessionContainer}>
          <Text style={styles.rating}>0.0</Text>
          <AntDesign name="star" style={styles.starIcon} />
          <Text style={styles.sessionDate}>(0)</Text>
        </View> */}
        <Text style={[styles.sessionText, styles.overall]}>
          Overall Progress {myProgressMetrics?.overallPercentageAllItems}%
        </Text>
        <ProgressBar
          progress={myProgressMetrics?.overallPercentageAllItems / 100 || 0}
          style={styles.progress}
          color={Colors.Primary}
        />
        <View style={styles.buttonContainer}>
          {/* -------------------------- */}
          {/* ----------- Progress Button ----------- */}
          {/* -------------------------- */}
          <TouchableOpacity
            onPress={handlePrograss}
            activeOpacity={0.8}
            style={styles.myPrograssBtn}>
            <ProgressIcon />
            <Text style={styles.progressText}>Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProgramStack', {
                screen: 'LeaderBoardScreen',
              })
            }
            activeOpacity={0.8}
            style={styles.myPrograssBtn}>
            <ProgressIcon />
            <Text style={styles.progressText}>Leaderboard</Text>
          </TouchableOpacity>
        </View>
        {/* -------------------------- */}
        {/* ----------- Go To Program ----------- */}
        {/* -------------------------- */}
        <TouchableOpacity
          onPress={handleCourseDetails}
          activeOpacity={0.8}
          style={[styles.myPrograssBtn, {backgroundColor: Colors.Primary}]}>
          <Text style={[styles.progressText, {color: Colors.PureWhite}]}>
            Go to Bootcamp
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.White,
      width: '100%',
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(5),
      paddingVertical: responsiveScreenHeight(2),
      marginTop: responsiveScreenHeight(2),
      borderWidth: 1,
      overflow: 'hidden',
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
      backgroundColor: Colors.LightGreen,
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
      backgroundColor: Colors.MediumGreen,
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
    buttonContainer: {
      flexDirection: 'row',
      minWidth: '100%',
      justifyContent: 'center',
      gap: responsiveScreenWidth(3),
      marginTop: responsiveScreenWidth(4),
      marginBottom: responsiveScreenHeight(1),
    },
    progressText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.PureWhite,
    },
    myPrograssBtn: {
      flex: 1,
      backgroundColor: Colors.GrayButtonColor,
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: responsiveScreenWidth(1),
      paddingVertical: responsiveScreenHeight(1.5),
      overflow: 'hidden',
    },

    progressIcon: {
      width: responsiveScreenWidth(5),
      height: responsiveScreenWidth(5),
      marginRight: responsiveScreenWidth(2),
    },
  });
