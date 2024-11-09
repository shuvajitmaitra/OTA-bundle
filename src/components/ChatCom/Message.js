import React, {useState, memo, useEffect, useCallback, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import {Caption, Subheading} from 'react-native-paper';
import MCicons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcons from 'react-native-vector-icons/AntDesign';
import mime from 'mime';
import ImageView from 'react-native-image-viewing';
import Feather from 'react-native-vector-icons/Feather';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
// import { Popover, usePopover } from "react-native-modal-popover";
import Markdown from 'react-native-markdown-display';
import Modal from 'react-native-modal';

import userIcon from '../../assets/Images/user.png';

import CustomFonts from '../../constants/CustomFonts';
import axiosInstance from '../../utility/axiosInstance';

import ThreeDotGrayIcon from '../../assets/Icons/ThreeDotGrayIcon';
import {useTheme} from '../../context/ThemeContext';
import {
  autoLinkify,
  bytesToSize,
  generateActivityText,
  removeHtmlTags,
  transFormDate,
} from './MessageHelper';
import CustomVideoPlayer from './CustomVideoPlayer';
import {VideoPlaybackProvider} from '../../context/VideoPlaybackContext';
import moment from 'moment';
import FileIcon from './ThreadCom/FileIcon';
import ProfileDetailsModal from './Modal/ProfileDetailsModal';
import Images from '../../constants/Images';
import {setParams, setThreadOpen} from '../../store/reducer/ModalReducer';
import AudioMessage from './AudioMessage';

const Message = ({
  message,
  handleLongPress,
  isThread,
  navigation,
  chat,
  lastSender,
  nextSender,
}) => {
  const {user: profile} = useSelector(state => state.auth);
  const {onlineUsers} = useSelector(state => state.chat);

  const dispatch = useDispatch();

  const [selectedImages, setSelectedImages] = useState([]);
  const myMessage = message.sender?._id === profile?._id;

  const Colors = useTheme();
  const styles = getStyles(Colors, message, myMessage, lastSender);

  const [readMoreClicked, setReadMoreClicked] = useState(false);

  const senderName =
    message?.sender?.profilePicture === profile?.profilePicture
      ? 'You'
      : chat?.latestMessage.sender?.firstName;

  const groupBy = (key, array) => {
    return array.reduce(function (r, a) {
      r[a.symbol] = r[a.symbol] || [];
      r[a.symbol].push(a);
      return r;
    }, Object.create(null));
  };
  const messageText =
    message?.text?.length > 500
      ? message?.text?.slice(0, 500) + '...'
      : message?.text;

  const messageTime = useMemo(
    () => message?.editedAt || message?.createdAt,
    [message?.editedAt, message?.createdAt],
  );

  if (message.type === 'delete') {
    return (
      <View style={[styles.messageItem, {justifyContent: 'flex-start'}]}>
        <View
          style={{
            flex: 1,
            // backgroundColor: "red",
            marginLeft: responsiveScreenWidth(12),
          }}>
          <View
            style={{
              ...styles.messageContainer,
              ...{
                backgroundColor: myMessage ? Colors.MediumGreen : Colors.White,
                alignSelf: myMessage ? 'flex-end' : 'flex-start',
                elevation: 1,
                width: responsiveScreenWidth(75),
              },
            }}>
            <Text style={styles.deleteMessageText}>
              This message has been deleted
            </Text>
            <Caption
              style={{
                whiteSpace: 'pre',
                color: myMessage ? Colors.Primary : Colors.BodyText,
                alignSelf: 'flex-end',
              }}>
              {myMessage
                ? moment(message?.createdAt).format('h:mm A')
                : moment(message?.createdAt).format('MMM DD, YYYY h:mm A')}
            </Caption>
          </View>
        </View>
      </View>
    );
  } else if (message.type === 'activity') {
    return (
      <>
        <View style={styles.activityContainer}>
          <Text style={styles.activityText}>
            {generateActivityText(message, senderName)}
          </Text>
        </View>
      </>
    );
  } else {
    return (
      <>
        <View style={styles.messageItem}>
          {myMessage ? null : (
            <View
              style={{
                justifyContent: 'flex-end',
              }}>
              <View
                style={[
                  styles.userImageWrapper,
                  {marginBottom: responsiveScreenHeight(1)},
                ]}>
                {!lastSender ? (
                  <TouchableOpacity
                    // onPress={() => {
                    //   chat?.isChannel ? openPopover() : null;
                    // }}
                    activeOpacity={chat?.isChannel ? 0 : 1}>
                    <Image
                      resizeMode="contain"
                      source={
                        message?.sender?.profilePicture
                          ? {
                              uri: message?.sender?.profilePicture,
                            }
                          : Images.DEFAULT_IMAGE
                      }
                      style={styles.userImg}
                      // ref={touchableRef}
                    />
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      width: responsiveScreenWidth(8),
                    }}></View>
                )}
                {!lastSender &&
                onlineUsers?.find(x => x?._id === message?.sender?._id) ? (
                  <View style={styles.activeStatus}></View>
                ) : null}
              </View>
            </View>
          )}
          <View
            style={{
              flex: 1,
            }}>
            {!nextSender && !myMessage && chat?.isChannel && (
              <Text
                style={{
                  alignSelf: 'flex-start',
                  color: Colors.Heading,
                  paddingVertical: 1,
                  // fontWeight: "500",
                  fontFamily: CustomFonts.MEDIUM,
                  marginBottom: responsiveScreenHeight(1),
                }}>
                {message?.sender?.fullName}
              </Text>
            )}

            <TouchableOpacity
              onLongPress={() => {
                handleLongPress(message);
              }}
              activeOpacity={0.5}
              style={{
                ...styles.messageContainer,
                ...{},
              }}>
              <TouchableOpacity
                onPress={() => {
                  handleLongPress(message);
                }}
                style={styles.threeDotButton}>
                <ThreeDotGrayIcon />
              </TouchableOpacity>
              {message.text ? (
                <Markdown style={styles.markdownStyle}>
                  {autoLinkify(
                    transFormDate(
                      removeHtmlTags(
                        readMoreClicked
                          ? message?.text.trim()
                          : messageText.trim(),
                      ),
                    ),
                  )}
                </Markdown>
              ) : null}
              {myMessage && message?.text?.length > 500 && (
                <TouchableOpacity
                  onPress={() => {
                    setReadMoreClicked(prev => !prev);
                  }}>
                  <Text
                    style={{
                      color: Colors.Red,
                      fontSize: responsiveScreenFontSize(1.65),
                      fontWeight: '600',
                    }}>
                    {readMoreClicked ? 'Read less' : 'Read more'}
                  </Text>
                </TouchableOpacity>
              )}

              {message?.files?.length > 0 && (
                <View style={styles.fileContainer}>
                  {message?.files.map((file, index) => (
                    <View key={index}>
                      {file?.file?.type?.startsWith('audio/') ||
                        (file?.type?.startsWith('audio/') &&
                          message?.files?.length === 1 && (
                            <View style={{position: 'relative'}}>
                              <Image
                                style={styles.senderPic}
                                source={
                                  message?.sender?.profilePicture
                                    ? {
                                        uri: message?.sender?.profilePicture,
                                      }
                                    : Images.DEFAULT_IMAGE
                                }
                              />
                              <View style={styles.micIcon}>
                                <Feather
                                  name="mic"
                                  size={12}
                                  color={Colors.BodyText}
                                />
                              </View>
                            </View>
                          ))}
                    </View>
                  ))}
                  {message?.files.map((file, i) => (
                    <View
                      style={{
                        width:
                          (file?.file?.type?.startsWith('audio/') ||
                            file?.type?.startsWith('audio/')) &&
                          message?.files?.length === 1
                            ? '80%'
                            : '95%',
                        backgroundColor: Colors.Background_color,
                        borderRadius: 10,
                      }}
                      key={i}>
                      {file?.file?.type?.startsWith('audio/') ||
                      file?.type?.startsWith('audio/') ? (
                        <AudioMessage audioUrl={file?.url} />
                      ) : file?.type?.startsWith('video/') ? (
                        <VideoPlaybackProvider>
                          {/* <CustomVideoPlayer
                            url={file?.url}
                            id={message?._id}
                            fullScreenRight={responsiveScreenWidth(5)}
                          /> */}
                        </VideoPlaybackProvider>
                      ) : (
                        <TouchableOpacity
                          activeOpacity={0.5}
                          style={{
                            borderRadius: 8,
                            maxWidth: '100%',
                            height: 'auto',
                            overflow: 'hidden',
                          }}>
                          {file?.type?.startsWith('image/') ? (
                            <TouchableOpacity
                              onPress={() =>
                                setSelectedImages([{uri: file.url}])
                              }
                              style={{overflow: 'hidden'}}>
                              <Image
                                width={
                                  myMessage
                                    ? responsiveScreenWidth(80)
                                    : responsiveScreenWidth(70)
                                }
                                source={{uri: file.url}}
                              />
                            </TouchableOpacity>
                          ) : (
                            <View
                              style={{
                                padding: 8,
                                flexDirection: 'row',
                                gap: 8,
                              }}>
                              <FileIcon file={file} />

                              <View
                                style={{
                                  flexDirection: 'row',
                                  gap: 10,
                                  alignItems: 'flex-start',
                                }}>
                                <Text numberOfLines={1} style={styles.fileName}>
                                  {file?.name || 'Photo'}
                                </Text>
                                <AntIcons
                                  style={{
                                    color: myMessage
                                      ? Colors.Primary
                                      : Colors.BodyText,
                                  }}
                                  size={16}
                                  name="download"
                                />
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    className="mime"
                                    style={{
                                      color: myMessage
                                        ? Colors.Primary
                                        : Colors.BodyText,
                                      fontFamily: CustomFonts.REGULAR,
                                    }}>
                                    {mime?.getExtension(file.type) || 'File'}
                                  </Text>
                                  <Text
                                    style={{
                                      color: myMessage
                                        ? Colors.Primary
                                        : Colors.BodyText,
                                      fontFamily: CustomFonts.REGULAR,
                                      fontSize: responsiveScreenFontSize(1.4),
                                    }}>
                                    ({bytesToSize(file.size || 0)})
                                  </Text>
                                </View>
                              </View>
                            </View>
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {
                <View style={styles.messageBottomContainer}>
                  {!myMessage && message?.text?.length > 500 && (
                    <TouchableOpacity
                      onPress={() => {
                        setReadMoreClicked(prev => !prev);
                      }}>
                      <Text
                        style={{
                          color: Colors.Red,
                          fontSize: responsiveScreenFontSize(1.65),
                          fontWeight: '600',
                        }}>
                        {readMoreClicked ? 'Read less' : 'Read more'}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {myMessage && (
                    <>
                      {message?.status === 'seen' ? (
                        <MCicons style={styles.iconStyle} name="check-all" />
                      ) : message?.status === 'sent' ? (
                        <MCicons style={styles.iconStyle} name="check" />
                      ) : message?.status === 'delivered' ? (
                        <MCicons style={styles.iconStyle} name="check-all" />
                      ) : message?.status === 'sending' ? (
                        <MCicons
                          style={styles.iconStyle}
                          name="checkbox-blank-circle-outline"
                        />
                      ) : null}
                      <Text style={styles.statusText}>{message?.status}</Text>
                    </>
                  )}
                  {(!isThread && message?.replies?.length) ||
                  (!isThread && message?.replyCount) ? (
                    <View style={styles.replyWrapper}>
                      <TouchableOpacity
                        onPress={() => {
                          // navigation.navigate("message-thread", {
                          //   chat: chat,
                          //   message,
                          // })
                          dispatch(setThreadOpen(true));
                          dispatch(setParams({chat, message}));
                        }}
                        activeOpacity={0.5}>
                        <Text style={styles.repliesText}>
                          {Math.max(
                            message?.replies?.length || 0,
                            message?.replyCount || 0,
                          )}{' '}
                          {(message?.replies?.length ?? 0) > 1 ||
                          (message?.replyCount ?? 0) > 1
                            ? 'replies'
                            : 'reply'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  <View style={{flexGrow: 1}}></View>
                  {message?.editedAt && (
                    <Text style={styles.messageTime}>Edited at</Text>
                  )}
                  <Text style={styles.messageTime}>
                    {myMessage
                      ? moment(messageTime).format('h:mm A')
                      : moment(messageTime).format('MMM DD, YYYY h:mm A')}
                  </Text>
                </View>
              }

              {message.emoji && message.emoji?.length > 0 && (
                <View style={styles.emojiContainer}>
                  {Object.keys(groupBy('symbil', message.emoji)).map(
                    (key, index) => (
                      <View style={styles.emojiSubContainer} key={index}>
                        <Text onPress={() => alert('Coming soon...')}>
                          {key}
                        </Text>
                        <Text
                          style={{
                            color: myMessage
                              ? Colors.BodyText
                              : Colors.BodyText,
                          }}>
                          {groupBy('symbil', message.emoji)[key]?.length}
                        </Text>
                      </View>
                    ),
                  )}
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* <ImageView
          images={selectedImages}
          imageIndex={0}
          visible={selectedImages?.length !== 0}
          onRequestClose={() => setSelectedImages([])}
        /> */}
        {/* {
          popoverVisible &&
          <ProfileDetailsModal
            navigation={navigation}
            message={message}
            closePopover={closePopover}
            popoverVisible={popoverVisible}
            popoverAnchorRect={popoverAnchorRect}
          />
        } */}
      </>
    );
  }
};

export default memo(Message);

const getStyles = (Colors, message, myMessage, lastSender) =>
  StyleSheet.create({
    fileContainer: {
      zIndex: -1,
      alignSelf: 'flex-start',
      overflow: 'hidden',
      flexDirection:
        message?.files?.length === 1
          ? myMessage
            ? 'row'
            : 'row-reverse'
          : 'column',
      alignItems: message?.files?.length === 1 ? 'center' : 'flex-start',
      gap: 10,
      paddingTop: responsiveScreenHeight(1.5),
    },
    micIcon: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      padding: 2,
      backgroundColor: Colors.BorderColor,
      borderRadius: 100,
    },
    senderPic: {
      width: responsiveScreenWidth(8),
      height: responsiveScreenWidth(8),
      backgroundColor: Colors.Background_color,
      borderRadius: 100,
    },
    emojiContainer: {
      flexDirection: 'row',
      gap: 5,
      position: 'absolute',
      left: 0,
      bottom: -10,
      // paddingBottom: responsiveScreenHeight(1)
    },
    emojiSubContainer: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 50,
      paddingHorizontal: 2,
      // marginBottom: 100,
      backgroundColor: myMessage ? Colors.MediumGreen : Colors.White,
      // marginBottom: responsiveScreenHeight(1)
    },
    fileName: {
      // fontWeight: "bold",
      flex: 1,
      flexBasis: '40%',
      color: myMessage ? Colors.Primary : Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
    },
    threeDotButton: {
      padding: 5,
      paddingLeft: 15,
      paddingTop: 10,
      position: 'absolute',
      // backgroundColor: "red",
      top: responsiveScreenHeight(0.5),
      right: responsiveScreenWidth(1),
      zIndex: 10,
    },
    markdownStyle: {
      whiteSpace: 'pre',
      body: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: 16,
        color: myMessage ? Colors.BodyText : Colors.BodyText,
        lineHeight: 20,
        // marginBottom: 100,
      },
      heading1: {
        // fontWeight: "bold",
        fontFamily: CustomFonts.SEMI_BOLD,
      },
      heading2: {
        // fontWeight: "bold",
        fontFamily: CustomFonts.SEMI_BOLD,
      },
      heading3: {
        // fontWeight: "bold",
        fontFamily: CustomFonts.SEMI_BOLD,
      },
      heading4: {
        // fontWeight: "bold",
        fontFamily: CustomFonts.SEMI_BOLD,
      },
      heading5: {
        // fontWeight: "bold",
        fontFamily: CustomFonts.SEMI_BOLD,
      },
      heading6: {
        // fontWeight: "bold",
        fontFamily: CustomFonts.SEMI_BOLD,
      },
      strong: {fontFamily: CustomFonts.SEMI_BOLD},
      code_inline: {
        color: myMessage ? Colors.BodyText : Colors.BodyText,
        backgroundColor: myMessage ? Colors.LightGreen : Colors.White,
      },
      hr: {
        backgroundColor: myMessage ? Colors.White : Colors.BodyText,
      },
      fence: {color: Colors.BodyText},
      code_block: {
        color: Colors.BodyText,
        backgroundColor: myMessage ? Colors.LightGreen : Colors.White,
        borderWidth: 0,
      },
      blockquote: {color: Colors.BodyText},
      table: {
        borderColor: myMessage ? Colors.White : Colors.BorderColor,
      },
      thead: {
        borderColor: myMessage ? Colors.White : Colors.BorderColor,
      },
      tbody: {
        borderColor: myMessage ? Colors.White : Colors.BorderColor,
      },
      th: {
        borderColor: myMessage ? Colors.White : Colors.BorderColor,
      },
      tr: {
        borderColor: myMessage ? Colors.White : Colors.BorderColor,
      },
      td: {
        borderColor: myMessage ? Colors.White : Colors.BorderColor,
      },
      link: {
        // backgroundColor: myMessage ? Colors.White : Colors.LightGreen,
        color: Colors.Primary,
        // fontWeight: "bold",
        fontFamily: CustomFonts.SEMI_BOLD,
      },
      bullet_list: {
        marginVertical: 10,
      },
      ordered_list: {
        marginVertical: 10,
      },
      list_item: {
        marginVertical: 10,
      },
    },
    statusText: {
      color: myMessage ? Colors.BodyText : Colors.BodyText,
      fontSize: 12,
      textTransform: 'capitalize',
      fontFamily: CustomFonts.REGULAR,
    },
    iconStyle: {
      color: myMessage ? Colors.Primary : Colors.Primary,
      marginRight: 3,
      marginTop: 2,
    },
    messageBottomContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      // backgroundColor: Colors.WhiteOpacityColor,
      marginTop: responsiveScreenHeight(0.5),
      marginBottom: responsiveScreenHeight(1),
    },
    container: {
      flex: 1,
      backgroundColor: Colors.White,
    },
    activityText: {
      backgroundColor: Colors.White,
      color: Colors.BodyText,
      paddingVertical: 3,
      paddingHorizontal: 5,
      borderRadius: 3,
      fontFamily: CustomFonts.REGULAR,
    },
    activityContainer: {
      justifyContent: 'center',
      flexDirection: 'row',
      marginVertical: 5,
    },
    messageItem: {
      flexDirection: 'row',
      marginVertical: responsiveScreenHeight(0.5),
      // backgroundColor: "green",
    },
    messageContainer: {
      maxWidth: '90%',
      borderRadius: 8,
      // paddingTop: 5,
      paddingBottom: 5,
      borderBottomLeftRadius: 25,
      paddingHorizontal: responsiveScreenWidth(4),
      backgroundColor: myMessage ? Colors.MediumGreen : Colors.White,
      alignSelf: myMessage ? 'flex-end' : 'flex-start',
      width: myMessage ? '85%' : '100%',
      position: 'relative',
      marginBottom:
        (message.emoji && message.emoji?.length > 0) || !lastSender
          ? responsiveScreenHeight(0.5)
          : null,
    },
    deleteMessageText: {
      whiteSpace: 'pre',
      color: myMessage ? Colors.Primary : Colors.BodyText,
      alignSelf: 'flex-start',
      paddingTop: responsiveScreenHeight(1.2),
      fontFamily: CustomFonts.REGULAR,
    },
    messageTime: {
      // backgroundColor: "red",
      paddingLeft: responsiveScreenWidth(1),
      fontSize: 12,
      color: myMessage ? Colors.BodyText : Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
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
      // backgroundColor: Colors.LightGreen,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      resizeMode: 'cover',
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
    repliesText: {
      // fontWeight: "bold",
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Red,
    },
    replyWrapper: {
      // borderLeftWidth: 2,
      paddingLeft: 5,
      marginLeft: 5,
      // marginBottom: 10,
      // borderLeftColor: myMessage ? Colors.Primary : Colors.BodyText,
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
      fontSize: responsiveScreenFontSize(1.7),
      marginBottom: 2,
    },
    line: {
      width: '100%',
      height: 1,
      backgroundColor: Colors.LineColor,
      position: 'relative',
      marginVertical: responsiveScreenWidth(2),
    },
  });
