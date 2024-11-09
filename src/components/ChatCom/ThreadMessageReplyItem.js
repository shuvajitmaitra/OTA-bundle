import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {Popover, usePopover} from 'react-native-modal-popover';

import userIcon from '../../assets/Images/user.png';
import CustomFonts from '../../constants/CustomFonts';
import CopyIcon from '../../assets/Icons/CopyIcon';
import EditIcon2 from '../../assets/Icons/EditIcon2';
import DeleteIcon from '../../assets/Icons/DeleteIcon';
import Markdown from 'react-native-markdown-display';
import {useTheme} from '../../context/ThemeContext';
import ImageView from 'react-native-image-viewing';
import moment from 'moment';
import axiosInstance from '../../utility/axiosInstance';
import {
  updateLatestMessage,
  updateMessage,
  updateThreadMessage,
} from '../../store/reducer/chatReducer';
import ConfirmationModal from '../SharedComponent/ConfirmationModal';
import ThreadMessageContent from './ThreadCom/ThreadMessageContent';
import ThreedotIcon from '../../assets/Icons/ThreedotIcon';
import {useGlobalAlert} from '../SharedComponent/GlobalAlertContext';

export default function ThreadMessageReplyItem({
  message,
  copyToClipboard,
  handleSetEdit,
  chat,
}) {
  const [selectedImages, setSelectedImages] = useState([]);
  const {onlineUsers} = useSelector(state => state.chat);
  const dispatch = useDispatch();
  const {showAlert} = useGlobalAlert();
  const handleDelete = message => {
    axiosInstance
      .delete(`/chat/delete/message/${message?._id}`)
      .then(res => {
        if (res.data.success) {
          console.log('res.data', JSON.stringify(res.data, null, 1));
          dispatch(updateMessage({chat: chat?._id, message: res.data.message}));
          dispatch(
            updateLatestMessage({
              chatId: res?.data?.message?.chat,
              latestMessage: {text: ''},
              counter: 1,
            }),
          );
        }
      })
      .catch(err => {
        console.log(err);
        showAlert({
          title: 'Error',
          type: 'error',
          message: err?.response?.data?.error,
        });
      });
  };
  let emojies = ['👍', '😍', '❤️', '😂', '🥰', '😯'];
  const images = [
    'image/bmp',
    'image/cis-cod',
    'image/gif',
    'image/jpeg',
    'image/jpg',
    'image/pipeg',
    'image/x-xbitmap',
    'image/png',
  ];
  const {
    openPopover,
    closePopover,
    popoverVisible,
    touchableRef,
    popoverAnchorRect,
  } = usePopover();

  const downloadFile = file => {
    if (images.includes(file.type)) {
      setSelectedImages([{uri: file.url}]);
    } else {
      Linking.openURL(file.url);
    }
  };

  const Colors = useTheme();
  const styles = getStyles(Colors);

  const {width, height} = Dimensions.get('window');

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  return (
    <>
      <View style={styles.subContainer}>
        <View style={styles.profileImageContainer}>
          <View>
            <Image
              style={styles.profileImage}
              source={
                message.sender?.profilePicture
                  ? {uri: message.sender?.profilePicture}
                  : userIcon
              }
            />

            {onlineUsers?.find(x => x?._id === message?.sender?._id) ? (
              <View style={styles.activeStatus}></View>
            ) : null}
          </View>
          <View style={{flexDirection: 'row', gap: 10}}>
            <View style={styles.replyContainer}>
              <View
                style={
                  {
                    // flexDirection: "row",
                    // backgroundColor: "yellow",
                    // width: responsiveScreenWidth(85),
                    // justifyContent: "space-between",
                  }
                }>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[styles.profileName]}>
                  {message.sender?.fullName}
                </Text>
              </View>
              <ThreadMessageContent
                message={message}
                downloadFile={downloadFile}
                setSelectedImages={setSelectedImages}
              />
              {/* <Text style={styles.commentsTime}>
                {message?.editedAt
                  ? `Edited at ${moment(message?.editedAt).format(
                    "MMM DD, YYYY h:mm A"
                  )}`
                  : moment(message?.createdAt).format("MMM DD, YYYY h:mm A")}
              </Text> */}
              <Text style={styles.commentsTime}>
                {message?.type === 'delete'
                  ? moment(message?.createdAt).format('MMM DD, YYYY h:mm A') // Show only time if type is delete
                  : message?.editedAt
                  ? `Edited at ${moment(message?.editedAt).format(
                      'MMM DD, YYYY h:mm A',
                    )}` // Show Edited at time
                  : moment(message?.createdAt).format('MMM DD, YYYY h:mm A')}
              </Text>
            </View>

            {message.type !== 'delete' && (
              <TouchableOpacity
                ref={touchableRef} // Assigning the ref to TouchableOpacity
                disabled={message?.type == 'delete'}
                activeOpacity={message?.type === 'delete' ? 1 : 0.5}
                onPress={openPopover} // Add onPress to open the popover
                style={styles.threeDotContainer}>
                <ThreedotIcon />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <ImageView
        images={selectedImages}
        imageIndex={0}
        visible={selectedImages?.length !== 0}
        onRequestClose={() => setSelectedImages([])}
      />
      <Popover
        contentStyle={styles.popupContent}
        arrowStyle={styles.popupArrow}
        backgroundStyle={{backgroundColor: Colors.BackDropColor}}
        visible={popoverVisible}
        onClose={closePopover}
        fromRect={{x: width / 2, y: height / 2, width: 0, height: 0}}
        supportedOrientations={['portrait', 'landscape']}
        // placement="center"
      >
        {message?.text ? (
          <>
            <TouchableOpacity
              onPress={() => {
                copyToClipboard(message);
                closePopover();
              }}
              style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
                paddingHorizontal: 7,
              }}>
              <CopyIcon />
              <Text style={styles.popupText}>Copy</Text>
            </TouchableOpacity>
            <View style={styles.line}></View>
          </>
        ) : null}

        {message?.text ? (
          <>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                handleSetEdit(message);
                closePopover();
              }}
              style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
                paddingHorizontal: 7,
              }}>
              <EditIcon2 />
              <Text style={styles.popupText}>Edit your message</Text>
            </TouchableOpacity>
            <View style={styles.line}></View>
          </>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            setIsDeleteModalVisible(!isDeleteModalVisible);
          }}
          style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
            paddingHorizontal: 7,
          }}>
          <DeleteIcon />
          <Text style={styles.popupText}>Delete this message</Text>
        </TouchableOpacity>
        <ConfirmationModal
          isVisible={isDeleteModalVisible}
          tittle="Delete"
          description="Do you want to delete this message"
          okPress={() => {
            handleDelete(message);
            closePopover();
          }}
          cancelPress={() => {
            closePopover();
          }}
        />
      </Popover>
    </>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    subContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: responsiveScreenHeight(1),
      paddingHorizontal: responsiveScreenWidth(2),
      // backgroundColor: "red",
    },
    profileImageContainer: {
      // width: "100%",
      // flexDirection: "row",
      gap: responsiveScreenWidth(3),
      flexDirection: 'row',
      // backgroundColor: "blue",
      alignItems: 'flex-end',
    },
    replyContainer: {
      backgroundColor: Colors.White,
      borderRadius: responsiveScreenFontSize(1),
      borderBottomLeftRadius: responsiveScreenFontSize(3),
      padding: responsiveScreenFontSize(1.5),
      justifyContent: 'space-between',
      alignSelf: 'flex-end',
      // marginTop: responsiveScreenHeight(1),
      maxWidth: responsiveScreenWidth(70),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    threeDotContainer: {
      width: responsiveScreenWidth(5),
      alignSelf: 'flex-start',
      marginTop: responsiveScreenHeight(2),
      alignItems: 'center',
      height: responsiveScreenHeight(4),
      // backgroundColor: "red",
    },
    profileImage: {
      width: responsiveScreenWidth(10),
      height: responsiveScreenWidth(10),
      borderRadius: responsiveScreenWidth(100),
      resizeMode: 'cover',
      position: 'relative',
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    activeStatus: {
      width: 8,
      height: 8,
      borderRadius: 8,
      backgroundColor: Colors.Primary,
      position: 'absolute',
      right: responsiveScreenWidth(0),
      top: responsiveScreenHeight(3.2),
    },
    profileName: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Primary,
      // backgroundColor: "blue",
      // paddingLeft: responsiveScreenWidth(3),
    },
    comments: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      width: responsiveScreenWidth(60),
    },
    commentsTime: {
      color: Colors.BodyText,
      // backgroundColor: "pink",
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.5),
      // marginTop: 2,
      // textAlign: "right",
      paddingLeft: responsiveScreenWidth(3),
      flexDirection: 'column',
      alignSelf: 'flex-end',
    },

    popupContent: {
      backgroundColor: Colors.White,
      borderRadius: 8,
      width: responsiveScreenWidth(51),
      // paddingVertical: 16,
    },
    popupArrow: {
      borderTopColor: Colors.White,
    },
    popupText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
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
