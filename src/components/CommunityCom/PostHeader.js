import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import moment from 'moment';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ThreeDotGrayIcon from '../../assets/Icons/ThreeDotGrayIcon';
import CustomFonts from '../../constants/CustomFonts';
import Images from '../../constants/Images';
import {setSinglePost} from '../../store/reducer/communityReducer';
import store from '../../store';

const PostHeader = ({post}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const n = post?.createdBy?.fullName || 'New User';
  let name = n.split(' ').slice(0, 2).join(' ');

  return (
    <>
      <View style={styles.postHeaderContainer}>
        <View style={styles.rightContainer}>
          <Image
            resizeMode="cover"
            source={
              post?.createdBy?.profilePicture
                ? {
                    uri: post?.createdBy?.profilePicture,
                  }
                : Images.DEFAULT_IMAGE
            }
            style={styles.userImg}
          />
          <View>
            <View style={styles.userNameContainer}>
              <Text style={styles.userName}>{name}</Text>
              <Text style={styles.fromTime}>
                {moment(post?.createdAt).fromNow()}
              </Text>
            </View>
            <Text style={styles.time}>
              {moment(post?.createdAt).format('llll')}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.threeDot}
          onPress={event =>
            store.dispatch(
              setSinglePost({
                ...post,
                x: event.nativeEvent.pageX,
                y: event.nativeEvent.pageY,
              }),
            )
          }>
          <ThreeDotGrayIcon />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default PostHeader;

const getStyles = Colors =>
  StyleSheet.create({
    postHeaderContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // backgroundColor: "green",
    },
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
    },
    userNameContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2),
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(0.5),
    },
    userImg: {
      height: 35,
      width: 35,
      borderRadius: 45,
      backgroundColor: Colors.LightGreen,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      resizeMode: 'cover',
    },
    userName: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
      // backgroundColor: "red",
    },
    fromTime: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      // backgroundColor: "blue",
      color: Colors.BodyText,
    },
    time: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      // backgroundColor: "blue",
      color: Colors.BodyText,
      marginTop: -5,
    },
    threeDot: {
      paddingHorizontal: 5,
    },
  });
