import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import AntIcons from 'react-native-vector-icons/AntDesign';
import FIcons from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {Popover, usePopover} from 'react-native-modal-popover';
import Modal, {ReactNativeModal} from 'react-native-modal';

import CustomeFonts from '../../constants/CustomeFonts';
import PhoneIcon from '../../assets/Icons/PhoneIcon';
import VideoIcon from '../../assets/Icons/VideoIcon';
import ThreedotIcon from '../../assets/Icons/ThreedotIcon';
import SearchIcon from '../../assets/Icons/SearchIcon';
import AddUsers from '../../assets/Icons/AddUser';
import EditIcon2 from '../../assets/Icons/EditIcon2';
import VolumeIcon from '../../assets/Icons/Volume';
import DeleteIcon from '../../assets/Icons/DeleteIcon';
import UserModal from './UserModal';
import GroupModal from './GroupModal';
import axiosInstance from '../../utility/axiosInstance';
import useChat from '../../hook/useChat';
import {useTheme} from '../../context/ThemeContext';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Images from '../../constants/Images';
import {useGlobalAlert} from '../SharedComponent/GlobalAlertContext';

export default function ChatScreenTopPart({
  setIsPinnedVisible,
  setStopAudio,
  setSelectedChat,
}) {
  const {
    openPopover,
    closePopover,
    popoverVisible,
    touchableRef,
    popoverAnchorRect,
  } = usePopover();
  const {
    // chat,
    image,
    name,
    toogleFavourite,
    isProfileModalVisible,
    setIsProfileModalVisible,
    isGroupModalVisible,
    setIsGroupModalVisible,
  } = useChat();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {pin} = useSelector(state => state.pin);
  const {showAlert} = useGlobalAlert();
  const {onlineUsers, pinned, chat} = useSelector(state => state.chat);

  // const newChat = chats?.find((item) => item?._id == chat?._id);
  // console.log("chat", JSON.stringify(chat, null, 1));
  const navigation = useNavigation();
  // console.log("navigation", JSON.stringify(navigation, null, 1));
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 0.65,
        }}>
        <Icon.Button
          color={Colors.Primary}
          name="chevron-back-outline"
          size={25}
          backgroundColor={Colors.White}
          onPress={() => {
            setSelectedChat(null);
            // navigation.navigate("NewChatScreen");
          }}></Icon.Button>
        <TouchableOpacity
          onPress={() => {
            chat?.isChannel
              ? setIsGroupModalVisible(true)
              : setIsProfileModalVisible(true);
            // setIsLoading(true);
          }}
          style={styles.profileDetailsContainer}>
          <View style={styles.avaterContainer}>
            <Avatar.Image
              size={35}
              source={
                chat?.isChannel
                  ? chat?.avatar
                    ? {uri: chat?.avatar}
                    : Images.DEFAULT_IMAGE
                  : image
                  ? {uri: image}
                  : Images.DEFAULT_IMAGE
              }
            />
          </View>
          <View style={styles.profileNameContainer}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
              {chat?.isChannel ? chat?.name : chat?.otherUser?.fullName}
            </Text>
            <View>
              {chat?.typingData?.isTyping ? (
                <Text style={{color: 'green'}}>
                  {chat?.typingData?.user?.firstName} is typing...
                </Text>
              ) : chat?.isChannel ? (
                <Text style={styles.avaliable}>{`${
                  chat?.membersCount || ''
                } members`}</Text>
              ) : onlineUsers?.find(x => x?._id === chat?.otherUser?._id) ? (
                <View style={styles.avaliableContainer}>
                  <Text style={styles.avaliable}>Available</Text>
                  <View style={styles.onlineStatus}></View>
                </View>
              ) : (
                <Text style={styles.avaliable}>
                  {moment(chat?.otherUser?.lastActive).fromNow()}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: responsiveScreenWidth(2.5),
          alignItems: 'center',
          flex: 0.35,
          justifyContent: 'flex-end',
        }}>
        {pinned?.length > 0 && (
          <AntIcons
            onPress={() => {
              setIsPinnedVisible(prev => !prev);
            }}
            color={pin ? Colors.Primary : Colors.BodyText}
            size={22}
            name="pushpino"
          />
        )}
        <TouchableOpacity
          onPress={() =>
            toogleFavourite({
              isFavourite: !chat?.myData?.isFavourite,
              chat: chat?._id,
            })
          }
          style={{
            marginRight: chat?.isChannel ? responsiveScreenWidth(10) : '',
          }}>
          {chat?.myData?.isFavourite ? (
            <FIcons color="gold" size={22} name="star" />
          ) : (
            <FIcons color={Colors.BodyText} size={22} name="star-o" />
          )}
        </TouchableOpacity>

        {chat && !chat?.isChannel && (
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={{
                paddingHorizontal: responsiveScreenWidth(1),
                paddingVertical: 5,
              }}
              onPress={() =>
                showAlert({
                  title: 'Coming Soon...',
                  type: 'warning',
                  message: 'This feature is coming soon.',
                })
              }>
              <PhoneIcon />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: responsiveScreenWidth(1),
                paddingVertical: 5,
                marginEnd: 3,
              }}
              onPress={() =>
                showAlert({
                  title: 'Coming Soon...',
                  type: 'warning',
                  message: 'This feature is coming soon.',
                })
              }>
              <VideoIcon />
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={{
                paddingHorizontal: responsiveScreenWidth(1.5),
                paddingVertical: 5,
              }}
              ref={touchableRef}
              onPress={() => openPopover()}
            >
              <ThreedotIcon />
            </TouchableOpacity> */}
          </View>
        )}
      </View>

      {isProfileModalVisible && (
        <ReactNativeModal
          backdropColor={Colors.BackDropColor}
          isVisible={isProfileModalVisible}>
          <UserModal />
        </ReactNativeModal>
      )}

      {/* {isGroupModalVisible && (
        <ReactNativeModal
          backdropColor={Colors.BackDropColor}
          isVisible={isGroupModalVisible}
        >
          <GroupModal />
        </ReactNativeModal>
      )} */}

      <Popover
        contentStyle={styles.popupContent}
        arrowStyle={styles.popupArrow}
        backgroundStyle={{backgroundColor: Colors.BackDropColor}}
        visible={popoverVisible}
        onClose={closePopover}
        fromRect={popoverAnchorRect}
        supportedOrientations={['portrait', 'landscape']}
        placement="auto">
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            showAlert({
              title: 'Coming Soon...',
              type: 'warning',
              message: 'This feature is coming soon.',
            });
            closePopover();
          }}
          style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
            paddingHorizontal: 7,
          }}>
          <VolumeIcon />
          <Text style={styles.popupText}>Mute Notification</Text>
        </TouchableOpacity>
        <View style={styles.line}></View>

        <TouchableOpacity
          onPress={async () => {
            showAlert({
              title: 'Coming Soon...',
              type: 'warning',
              message: 'This feature is coming soon.',
            });
            closePopover();
          }}
          style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
            paddingHorizontal: 7,
          }}>
          <SearchIcon />
          <Text style={styles.popupText}>Search</Text>
        </TouchableOpacity>
        <View style={styles.line}></View>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            showAlert({
              title: 'Coming Soon...',
              type: 'warning',
              message: 'This feature is coming soon.',
            });
            closePopover();
          }}
          style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
            paddingHorizontal: 7,
          }}>
          <AddUsers />
          <Text style={styles.popupText}>Share my contact</Text>
        </TouchableOpacity>
        <View style={styles.line}></View>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            showAlert({
              title: 'Coming Soon...',
              type: 'warning',
              message: 'This feature is coming soon.',
            });
            closePopover();
          }}
          style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
            paddingHorizontal: 7,
          }}>
          <EditIcon2 />
          <Text style={styles.popupText}>Clear History</Text>
        </TouchableOpacity>
        <View style={styles.line}></View>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            showAlert({
              title: 'Coming Soon...',
              type: 'warning',
              message: 'This feature is coming soon.',
            });
            closePopover();
          }}
          style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
            paddingHorizontal: 7,
          }}>
          <DeleteIcon />
          <Text style={styles.popupText}>Delete Chat</Text>
        </TouchableOpacity>
      </Popover>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      // marginLeft: responsiveScreenWidth(-4.5),
      width: responsiveScreenWidth(100),
      backgroundColor: Colors.White,
    },
    profileDetailsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // backgroundColor: "red",
      // width: responsiveScreenWidth(65),
    },
    avaterContainer: {
      flexDirection: 'row',
      position: 'relative',
    },
    activeStatus: {
      width: 8,
      height: 8,
      borderRadius: 8,
      backgroundColor: Colors.Primary,
      position: 'absolute',
      right: responsiveScreenWidth(0),
      bottom: responsiveScreenHeight(0.5),
    },
    profileNameContainer: {
      marginLeft: responsiveScreenWidth(2),
      // width: responsiveScreenWidth(52),
      flexBasis: '55%',
    },
    name: {
      color: Colors.Heading,
      fontFamily: CustomeFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      // backgroundColor: "red",
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
      position: 'relative',
      left: responsiveScreenWidth(-2),
      marginVertical: responsiveScreenWidth(2),
    },
  });
