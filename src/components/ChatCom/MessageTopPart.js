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
import Images from '../../constants/Images';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setLocalMessages} from '../../store/reducer/chatSlice';
import PinIcon from '../../assets/Icons/PinIcon';
import StarIcon from '../../assets/Icons/StartIcon';
import {handleChatFavorite} from '../../actions/apiCall';
import {useTheme} from '../../context/ThemeContext';

export default function MessageTopPart({
  setPinnedScreenVisible,
  pinnedCount,
  fetchPinned,
}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {singleChat: chat} = useSelector(state => state.chat);
  // console.log('chat', JSON.stringify(chat, null, 1));
  const {selectedMessageScreen: selectedChat} = useSelector(
    state => state.modal,
  );
  // console.log(
  //   'selectedChat.image',
  //   JSON.stringify(selectedChat.image, null, 1),
  // );
  const Colors = useTheme();
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
                selectedChat.image
                  ? {uri: selectedChat.image}
                  : Images.DEFAULT_IMAGE
              }
            />
          </View>
          <View style={styles.profileNameContainer}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
              {selectedChat.name && selectedChat.name}
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
        {/* PinnedCount Icon Placeholder */}

        {pinnedCount > 0 && (
          <TouchableOpacity
            onPress={() => {
              fetchPinned(chat._id);
              setPinnedScreenVisible(true);
            }}>
            <PinIcon size={25} />
          </TouchableOpacity>
        )}
        {chat.isChannel && (
          <TouchableOpacity
            onPress={() =>
              handleChatFavorite({
                isFavourite: !chat?.myData?.isFavourite,
                chat: chat?._id,
              })
            }>
            <StarIcon color={chat.myData.isFavourite ? 'gold' : 'gray'} />
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
      fontFamily: CustomeFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      // flexBasis: '10%',
      width: '100%',
    },
    avaliableContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avaliable: {
      color: Colors.Primary,
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
