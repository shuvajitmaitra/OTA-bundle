import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {Popover} from 'react-native-modal-popover';
import {useTheme} from '../../../context/ThemeContext';
import {Image} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import axiosInstance from '../../../utility/axiosInstance';
import MessageIcon from '../../../assets/Icons/MessageIcon';
import CustomFonts from '../../../constants/CustomFonts';
import {useDispatch, useSelector} from 'react-redux';

import LoadingSmall from '../../SharedComponent/LoadingSmall';
import Images from '../../../constants/Images';
import {updateChats} from '../../../store/reducer/chatReducer';

const ProfileDetailsModal = ({
  closePopover,
  popoverAnchorRect,
  popoverVisible,
  message,
  navigation,
}) => {
  const Colors = useTheme();
  const styles = useMemo(() => getStyles(Colors), [Colors]);

  const [creating, setCreating] = useState(false);
  const [Loading, setLoading] = useState(false);
  const {chats} = useSelector(state => state.chat);
  const dispatch = useDispatch();

  const handleCreateChat = useCallback(
    async id => {
      if (creating) return;
      setCreating(true);
      try {
        setLoading(true);
        const res = await axiosInstance.post(`/chat/findorcreate/${id}`);
        if (res.data.success) {
          closePopover();
          // navigation.push("NewMessageScreen", {
          //   chatId: res.data.chat._id,
          //   name: message?.sender?.fullName,
          //   image: message?.sender?.profilePicture,
          // });

          const chatExists = chats.some(chat => chat._id === res.data.chat._id);
          setLoading(false);
          if (!chatExists) {
            dispatch(updateChats(res.data.chat));
          }
        }
      } catch (err) {
        setLoading(false);
        console.error('Error creating chat:', err?.response?.data?.error);
        alert('Failed to create chat: ' + err?.response?.data?.error);
      } finally {
        setLoading(false);
        setCreating(false);
      }
    },
    [creating, chats, closePopover, dispatch, message, navigation],
  );

  // console.log("rendering ProfileDetailsModal");

  return (
    <Popover
      contentStyle={styles.content}
      arrowStyle={styles.arrow}
      backgroundStyle={styles.background}
      visible={popoverVisible}
      onClose={closePopover}
      fromRect={popoverAnchorRect}
      supportedOrientations={['portrait', 'landscape']}>
      {Loading ? (
        <LoadingSmall />
      ) : (
        <Image
          resizeMode="contain"
          source={
            message.sender?.profilePicture
              ? {
                  uri: message.sender?.profilePicture,
                }
              : Images.DEFAULT_IMAGE
          }
          style={styles.userImg}
        />
      )}
      <Text style={styles.headingText}>{message?.sender?.fullName}</Text>
      <TouchableOpacity
        onPress={() => handleCreateChat(message?.sender?._id)}
        style={styles.buttonContainer}>
        <MessageIcon />
        <Text style={styles.text}>Send message</Text>
      </TouchableOpacity>
    </Popover>
  );
};

export default React.memo(ProfileDetailsModal);

const getStyles = Colors =>
  StyleSheet.create({
    headingText: {
      alignSelf: 'center',
      color: Colors.Heading,
      paddingVertical: 1,
      marginTop: responsiveScreenHeight(1),
      fontFamily: CustomFonts.MEDIUM,
    },
    text: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      marginTop: responsiveScreenHeight(1),
    },
    content: {
      padding: 16,
      backgroundColor: Colors.White,
      borderRadius: 8,
    },
    arrow: {
      borderTopColor: Colors.White,
      marginTop: responsiveScreenHeight(5),
    },
    background: {
      backgroundColor: Colors.BackDropColor,
    },
    userImg: {
      height: responsiveScreenFontSize(10),
      width: responsiveScreenFontSize(10),
      borderRadius: 45,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      resizeMode: 'cover',
      position: 'relative',
      alignSelf: 'center',
    },
  });
