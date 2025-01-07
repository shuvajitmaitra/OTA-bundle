import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Divider from '../SharedComponent/Divider';
import MyButton from '../AuthenticationCom/MyButton';
import {useNavigation} from '@react-navigation/native';
import Images from '../../constants/Images';
import {useGlobalAlert} from '../SharedComponent/GlobalAlertContext';

const CoursesCard = ({item}) => {
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {showAlert} = useGlobalAlert();

  return (
    <View style={styles.cardContainer}>
      <Image
        source={
          item?.course?.image
            ? {
                uri: item?.course?.image,
              }
            : Images.DEFAULT_IMAGE
        }
        resizeMode="contain"
        style={styles.cardImage}
      />
      {/* <View style={{borderRadius: 10, overflow: 'hidden'}}>
        <ImageBackground
          source={
            item?.course?.image
              ? {
                  uri: item?.course?.image,
                }
              : Images.DEFAULT_IMAGE
          }
          resizeMode="contain"
          style={styles.cardImage}>
          <View
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <Text style={styles.imageText}>{item?.course?.title}</Text>
          </View>
        </ImageBackground>
      </View> */}
      <Text style={styles.courseTitle}>{item?.course?.title}</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Status:</Text>
        <Text
          style={[
            styles.statusText,
            {
              color:
                item?.status === 'pending'
                  ? '#EF7817'
                  : item?.status === 'active'
                  ? Colors.Primary
                  : item?.status === 'reject'
                  ? Colors.Red
                  : Colors.Red,
            },
          ]}>
          {item?.status}
        </Text>
      </View>
      <View style={[styles.statusContainer, {gap: 20}]}>
        <View style={styles.subContainer}>
          <Text style={styles.statusTitle}>Total Fee:</Text>
          <Text style={styles.normalText}>${item?.amount}</Text>
        </View>
        <View style={styles.subContainer}>
          <Text style={styles.statusTitle}>Paid:</Text>
          <Text style={styles.normalText}>${item?.paid}</Text>
        </View>
      </View>
      <Divider />
      <View style={styles.btnArea}>
        <MyButton
          onPress={() =>
            navigation.navigate('HomeStack', {
              screen: 'MyPaymentScreen',
              params: {courseId: item?._id},
            })
          }
          title={'View Payment'}
          bg={
            !item.paid || item?.amount <= 0
              ? Colors.DisablePrimaryBackgroundColor
              : Colors.Primary
          }
          colour={
            !item.paid || item?.amount <= 0
              ? Colors.DisablePrimaryButtonTextColor
              : Colors.PureWhite
          }
          disable={!item.paid || item?.amount <= 0}
        />
        <MyButton
          onPress={() => {
            if (item?.status === 'pending') {
              showAlert({
                title: 'Access Denied',
                type: 'warning',
                message: 'You cannot access the course until it is active.',
              });
            } else {
              navigation.navigate('HomeStack', {
                screen: 'CourseDetails',
                params: {
                  slug: item?.course?.slug,
                },
              });
            }
          }}
          title={'Go to Course'}
          bg={'rgba(84, 106, 126, 1)'}
          colour={Colors.PureWhite}
        />
      </View>
    </View>
  );
};

export default CoursesCard;

const getStyles = (Colors, item) =>
  StyleSheet.create({
    btnArea: {
      flexDirection: 'row',
      //   paddingHorizontal: 100,
      //   backgroundColor: "red",
      //   paddingHorizontal: responsiveScreenWidth(0.5),
      gap: responsiveScreenWidth(4),
      //   paddingVertical: responsiveScreenHeight(2),
    },
    normalText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.8),
      textTransform: 'capitalize',
    },
    statusText: {
      fontFamily: CustomFonts.REGULAR,

      fontSize: responsiveScreenFontSize(1.8),
      textTransform: 'capitalize',
    },
    statusTitle: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.8),
    },

    subContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      //   marginTop: responsiveScreenHeight(0.5),
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: responsiveScreenHeight(0.5),
    },
    courseTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.2),
      marginTop: responsiveScreenHeight(1),
    },
    imageText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
      fontSize: responsiveScreenFontSize(2),
      width: '70%',
      textAlign: 'center',
    },

    cardImage: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      backgroundColor: Colors.PrimaryOpacityColor,
    },
    cardContainer: {
      backgroundColor: Colors.White,
      padding: responsiveScreenWidth(3),
      borderRadius: 10,
    },
  });
