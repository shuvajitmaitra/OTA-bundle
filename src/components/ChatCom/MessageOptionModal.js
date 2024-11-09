import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Modal, {ReactNativeModal} from 'react-native-modal';
import {useTheme} from '../../context/ThemeContext';
import MessageIcon from '../../assets/Icons/MessageIcon';
import NewPinIcon from '../../assets/Icons/NewPinIcon';
import CopyIcon from '../../assets/Icons/CopyIcon';
import {useDispatch, useSelector} from 'react-redux';
import EditIcon2 from '../../assets/Icons/EditIcon2';
import DeleteIcon from '../../assets/Icons/DeleteIcon';
import axiosInstance from '../../utility/axiosInstance';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import ForwardIcon from '../../assets/Icons/ForwardIcon';
import ForwardMember from './Modal/ForwardMessageModal';
import CloseIcon from '../../assets/Icons/CloseIcon';
import TrashIcon from '../../assets/Icons/TrashIcon';
import {useGlobalAlert} from '../SharedComponent/GlobalAlertContext';
import {setParams, setThreadOpen} from '../../store/reducer/ModalReducer';

const MessageOptionModal = ({
  messageToDelete,
  setMessageToDelete,
  message,
  setSelectedMessage,
  handlePin,
  copyToClipboard,
  handleSetEdit,
  handleSetDelete,
  navigation,
  chat,
  handleDelete,
  setSelectedChat,
}) => {
  const {user: profile} = useSelector(state => state.auth);
  const myMessage = message?.sender?._id === profile?._id;
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors, message);
  const {showAlert} = useGlobalAlert();
  const {onlineUsers, pinned} = useSelector(state => state.chat);
  const isPinned = pinned?.find(item => item?._id === message?._id);
  const [isDeleteMessageModalVisible, setIsDeleteMessageModalVisible] =
    useState(false);

  const onEmojiClick = emoji => {
    axiosInstance
      .put(`/chat/react/${message?._id}`, {symbol: emoji})
      .then(res => {
        // if (res.data.message) {
        //   handleUpdateMessage(res.data.message);
        // }

        setSelectedMessage(null);
      })
      .catch(err => {
        console.log('error in chat reaction', err);
        showAlert({
          title: 'Error',
          type: 'error',
          message: err?.response?.data?.error,
        });
      });
  };
  let emojies = [
    {
      name: 'like',
      symbol: '👍',
    },
    {
      name: 'lovely',
      symbol: '😍',
    },
    {
      name: 'love',
      symbol: '❤️',
    },
    {
      name: 'luffing',
      symbol: '😂',
    },
    {
      name: 'cute',
      symbol: '🥰',
    },
    {
      name: 'wow',
      symbol: '😯',
    },
  ];

  const [isForwardMessageModalVisible, setIsForwardMessageModalVisible] =
    useState(false);

  const toggleForwardMessageModal = useCallback(() => {
    setIsForwardMessageModalVisible(prevState => !prevState);
  }, [isForwardMessageModalVisible]);

  return (
    <ReactNativeModal
      animationInTiming={300}
      animationOutTiming={100}
      backdropOpacity={0.9}
      backdropColor={Colors.BackDropColor}
      isVisible={Boolean(message)}
      onBackdropPress={() => setSelectedMessage(null)}>
      <View style={[styles.popupContent, styles.background]}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            // setSelectedMessage(false);
            // setSelectedChat(null);
            // navigation.navigate("message-thread", {
            //   chat: chat,
            //   message: message,
            // });
            dispatch(setThreadOpen(true));
            dispatch(setParams({chat, message}));
          }}
          style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
            paddingHorizontal: 7,
          }}>
          <MessageIcon />
          <Text style={styles.popupText}>Reply in thread</Text>
        </TouchableOpacity>
        <View style={styles.line}></View>

        {/* <Pressable
          activeOpacity={0.5}
          onPress={() => {
            
            showAlert({
              title: "Coming Soon...",
              type: "warning",
              message:
                "This feature is coming soon.",
            });
            // console.log("button clicked forward");
            // dispatch(setSingleEvent(message));
            // toggleForwardMessageModal();
            // setSelectedForwardMessage({ message, state: true });

            // setSelectedMessage(false);
          }}
          style={{
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            paddingHorizontal: 7,
          }}
        >
          <ForwardIcon />
          <Text style={styles.popupText}>Forward</Text>
        </Pressable>

        <View style={styles.line}></View> */}

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            handlePin(message._id);
            setSelectedMessage(false);
          }}
          style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
            paddingHorizontal: 7,
          }}>
          <NewPinIcon />
          <Text style={styles.popupText}>
            {isPinned?.pinnedBy ? 'Unpin' : 'Pin'}
          </Text>
        </TouchableOpacity>

        {message?.text ? (
          <>
            <View style={styles.line}></View>
            <TouchableOpacity
              onPress={async () => {
                setSelectedMessage(false);
                copyToClipboard(message);
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
          </>
        ) : null}
        {myMessage ? <View style={styles.line}></View> : null}

        {myMessage &&
        ((message?.text && message?.files?.length) ||
          (message?.text && message?.files?.length === 0)) ? (
          <>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                setSelectedMessage(false);
                handleSetEdit(message);
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

        {/* {myMessage ? (
          <>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                handlePin(message?._id);
                setIsModalVisible(false);
              }}
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                paddingHorizontal: 7,
              }}
            >
              <AntDesign name="pushpino" size={22} color={Colors.BodyText} />
              <Text style={styles.popupText}>
                {message?.pinnedBy?._id ? "Unpin Message" : "Pin Message"}
              </Text>
            </TouchableOpacity>
            <View style={styles.line}></View>
          </>
        ) : null} */}

        {myMessage ? (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              setIsDeleteMessageModalVisible(true);
              handleSetDelete(message);
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
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: responsiveScreenHeight(2),
            overflow: 'hidden',
          }}>
          {emojies.map((item, index) => (
            <Text
              style={{fontSize: 20}}
              onPress={() => onEmojiClick(item.symbol)}
              key={index}>
              {item.symbol}
            </Text>
          ))}
        </View>

        <ForwardMember
          isForwardMemberModalVisible={isForwardMessageModalVisible}
          toggleForwardMemberModal={toggleForwardMessageModal}
          setSelectedMessage={setSelectedMessage}
        />

        {
          <Modal
            backdropColor={'#000000'}
            style={styles.modal}
            isVisible={isDeleteMessageModalVisible}>
            <View style={styles.modalStyle}>
              <TouchableOpacity
                style={styles.crossIconStyle}
                onPress={() => {
                  setIsDeleteMessageModalVisible(!isDeleteMessageModalVisible);
                  setMessageToDelete(false);
                }}>
                <CloseIcon />
              </TouchableOpacity>
              <View style={styles.textContainer}>
                <Text style={styles.modalText}>
                  Do you want to remove this message?
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setSelectedMessage(null);
                  handleDelete(messageToDelete);
                  setIsDeleteMessageModalVisible(!isDeleteMessageModalVisible);
                }}
                activeOpacity={0.5}
                style={styles.modalBottom}>
                <Text style={styles.btnText}>Remove for everyone</Text>
                <TrashIcon />
              </TouchableOpacity>
            </View>
          </Modal>
        }
      </View>
    </ReactNativeModal>
  );
};

export default MessageOptionModal;

const getStyles = (Colors, message) =>
  StyleSheet.create({
    modalText: {
      fontSize: responsiveScreenFontSize(2),
      textAlign: 'center',
      fontFamily: CustomFonts.SEMI_BOLD,
      paddingHorizontal: responsiveScreenWidth(4),
      color: Colors.BodyText,
    },
    modalBottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: responsiveScreenWidth(80),
      height: responsiveScreenHeight(5),
      marginTop: responsiveScreenHeight(2),
      alignSelf: 'center',
      borderRadius: 8,
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(4),
      backgroundColor: Colors.LightRed,
    },

    btnText: {
      color: Colors.ThemeWarningColor,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
    },
    textContainer: {
      width: '100%',
    },
    crossIconStyle: {
      width: '100%',
      alignItems: 'flex-end',
      marginTop: responsiveScreenHeight(1),
    },
    modalStyle: {
      borderWidth: 1,
      borderRadius: 10,
      borderColor: Colors.BorderColor,
      backgroundColor: Colors.White,
      width: responsiveScreenWidth(90),
      height: responsiveScreenHeight(19),
      paddingHorizontal: responsiveScreenWidth(2),
      marginBottom: responsiveScreenHeight(8),
    },

    container: {
      flex: 1,
      backgroundColor: Colors.White,
    },
    messageItem: {
      flexDirection: 'row',
      marginVertical: responsiveScreenHeight(0.5),
      // backgroundColor: "green",
    },
    messageContainer: {
      maxWidth: '90%',
      borderRadius: 8,
      paddingTop: 10,
      paddingBottom: 5,
      borderBottomLeftRadius: 25,
      paddingHorizontal: responsiveScreenWidth(4),
    },
    messageTime: {
      alignSelf: 'flex-end',
      paddingLeft: responsiveScreenWidth(5),
      fontSize: 12,
    },
    userImageWrapper: {
      marginRight: 10,
      alignSelf: 'flex-start',
      // backgroundColor: "red",
      marginTop: responsiveScreenHeight(0.5),
    },
    userImg: {
      height: 35,
      width: 35,
      borderRadius: 45,
      backgroundColor: Colors.Background_color,
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
      bottom: responsiveScreenHeight(0.5),
    },
    modalWrapper: {
      backgroundColor: '#f0f0f0',
    },
    listItem: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderBottomColor: Colors.BorderColor,
      borderBottomWidth: 1,
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
    },
    replyWrapper: {
      borderLeftWidth: 2,
      paddingLeft: 5,
      marginLeft: 5,
      // marginBottom: 10,
    },
    deleted: {
      fontStyle: 'italic',
      color: '#bcc0c4',
    },
    popupContent: {
      backgroundColor: Colors.White,
      borderRadius: 8,
      width: responsiveScreenWidth(60),
      paddingVertical: 16,
      position: 'absolute',
      right: responsiveScreenWidth(16),
      // top: responsiveScreenHeight(45),
    },
    popupArrow: {
      borderTopColor: Colors.White,
    },
    popupText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      // marginBottom: 2,
      paddingVertical: responsiveScreenWidth(1.5),
    },
    line: {
      width: '100%',
      height: 1.5,
      backgroundColor: Colors.LineColor,
      position: 'relative',
      marginVertical: responsiveScreenWidth(2),
    },
  });
