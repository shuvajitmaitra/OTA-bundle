import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React from 'react';
import AntIcons from 'react-native-vector-icons/AntDesign';
import FIcons from 'react-native-vector-icons/FontAwesome';

import {
  responsiveScreenFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import CustomeFonts from '../../constants/CustomeFonts';
import PhoneIcon from '../../assets/Icons/PhoneIcon';
import VideoIcon from '../../assets/Icons/VideoIcon';
import Images from '../../constants/Images';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setLocalMessages} from '../../store/reducer/chatSlice';

export default function MessageTopPart() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {singleChat: chat} = useSelector(state => state.chat);
  //   console.log('singleChat', JSON.stringify(chat, null, 1));
  //   const chat = {
  //     isChannel: false,
  //     avatar: null,
  //     name: 'John Doe',
  //     otherUser: {
  //       fullName: 'John Doe',
  //       lastActive: moment().subtract(2, 'hours').toISOString(),
  //     },
  //     typingData: {
  //       isTyping: false,
  //       user: {firstName: 'Jane'},
  //     },
  //     membersCount: 10,
  //     myData: {
  //       isFavourite: true,
  //     },
  //   };

  const Colors = {
    Primary: '#6200EE',
    White: '#FFFFFF',
    BodyText: '#000000',
    Heading: '#333333',
    BackDropColor: 'rgba(0,0,0,0.5)',
    LineColor: '#E0E0E0',
  };

  const styles = getStyles(Colors);

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity
          onPress={() => {
            dispatch(setLocalMessages([]));
            navigation.goBack();
          }}
          style={styles.backButtonContainer}>
          <ArrowLeft />
        </TouchableOpacity>
        <Pressable
          onPress={() => navigation.navigate('ChatProfile')}
          style={styles.profileDetailsContainer}>
          <View style={styles.avaterContainer}>
            <Image
              style={styles.profileImage}
              size={35}
              source={
                chat.isChannel
                  ? chat.avatar
                    ? {uri: chat.avatar}
                    : Images.DEFAULT_IMAGE
                  : Images.DEFAULT_IMAGE
              }
            />
          </View>
          <View style={styles.profileNameContainer}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
              {chat.isChannel ? chat.name : chat.otherUser.fullName}
            </Text>
            <View>
              {chat?.typingData?.isTyping ? (
                <Text style={{color: 'green'}}>
                  {chat?.typingData?.user?.firstName} is typing...
                </Text>
              ) : chat?.isChannel ? (
                <Text
                  style={
                    styles.avaliable
                  }>{`${chat?.membersCount} members`}</Text>
              ) : (
                <View style={styles.avaliableContainer}>
                  <Text style={styles.avaliable}>Available</Text>
                  <View style={styles.onlineStatus}></View>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </View>
      <View style={styles.rightSection}>
        {/* Pinned Icon Placeholder */}
        <AntIcons color={Colors.Primary} size={22} name="pushpino" />
        {/* Favourite Icon */}
        {chat.myData.isFavourite ? (
          <FIcons color="gold" size={22} name="star" />
        ) : (
          <FIcons color={Colors.BodyText} size={22} name="star-o" />
        )}

        {/* Call Icons Placeholder */}
        <View style={styles.iconContainer}>
          <PhoneIcon />
          <VideoIcon />
        </View>
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
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      // backgroundColor: 'pink',
      borderBottomWidth: 1,
      borderBottomColor: Colors.LineColor,
      height: 80,
      // flex: 1,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
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
      marginLeft: responsiveScreenWidth(2),
      flexBasis: '55%',
    },
    name: {
      color: Colors.Heading,
      fontFamily: CustomeFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
    },
    avaliableContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avaliable: {
      color: Colors.BodyText,
      fontFamily: CustomeFonts.REGULAR,
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
      flex: 0.35,
      justifyContent: 'flex-end',
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
      fontFamily: CustomeFonts.REGULAR,
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
