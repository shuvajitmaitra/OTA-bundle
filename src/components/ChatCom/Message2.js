import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Markdown from 'react-native-markdown-display';
import {
  autoLinkify,
  generateActivityText,
  removeHtmlTags,
  transFormDate,
} from './MessageHelper';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import UserNameImageSection from './UserNameImageSection';
import {setMessageOptionData} from '../../store/reducer/ModalReducer';
import {RegularFonts} from '../../constants/Fonts';
import {useNavigation} from '@react-navigation/native';
import DeleteMessageContainer from './DeleteMessageContainer';
import MessageFileContainer from './MessageFileContainer';
import EmojiContainer from './EmojiContainer';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import ThreedotIcon from '../../assets/Icons/ThreedotIcon';
import axiosInstance from '../../utility/axiosInstance';
import {setSingleChat} from '../../store/reducer/chatReducer';

const Message2 = ({item, index, nextSender}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const Colors = useTheme();
  const my = item.sender?._id === user?._id;
  const styles = getStyles(Colors, my);
  const navigation = useNavigation();
  const senderName =
    item?.sender?.profilePicture === user?.profilePicture
      ? 'You'
      : item?.sender?.firstName;

  const handleCreateChat = async () => {
    try {
      const res = await axiosInstance.post(
        `/chat/findorcreate/${item.sender._id}`,
      );
      if (res.data.success) {
        navigation.push('MessageScreen2');
      }
      dispatch(setSingleChat({...res.data.chat, otherUser: item.sender}));
    } catch (err) {
      console.error('Error creating chat:', err?.response?.data);
    } finally {
      // ÷(false);
    }
  };
  if (item.type === 'delete') {
    return <DeleteMessageContainer item={item} my={my} />;
  }
  if (item.type === 'activity') {
    return (
      <>
        <View style={styles.activityContainer}>
          <Text style={styles.activityText}>
            {generateActivityText(item, senderName)}
          </Text>
        </View>
      </>
    );
  }
  return (
    <View style={styles.mainContainer}>
      {!my && nextSender && (
        <UserNameImageSection
          name={item?.sender?.fullName}
          image={item?.sender?.profilePicture}
          handleCreateChat={handleCreateChat}
        />
      )}
      <TouchableOpacity
        onLongPress={() => dispatch(setMessageOptionData({...item, my}))}
        style={styles.messagesContainer}>
        <TouchableOpacity
          onPress={() => dispatch(setMessageOptionData({...item, my}))}
          style={styles.threeDotContainer}>
          <ThreedotIcon color={my ? Colors.PureWhite : Colors.BodyText} />
        </TouchableOpacity>
        {item.files.length > 0 && <MessageFileContainer files={item.files} />}
        <Markdown style={styles.markdownStyle}>
          {autoLinkify(
            transFormDate(
              removeHtmlTags(item?.text?.trim() || item?.text || ''),
            ),
          )}
        </Markdown>
        {!item?.parentMessage && (
          <EmojiContainer my={my} reacts={item.emoji} messageId={item._id} />
        )}
        <View style={styles.messageBottomContainer}>
          {item.replyCount > 0 && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ThreadScreen', {chatMessage: item})
              }>
              <Text style={styles.replyCountText}>{`${item.replyCount} ${
                item?.replyCount == 1 ? 'reply' : 'replies'
              }`}</Text>
            </TouchableOpacity>
          )}
          <View style={{flexGrow: 1}}></View>
          {/* 
          <TouchableOpacity
            onPress={() => {
              item.text && handleCopyText(item.text);
            }}
            style={styles.copyContainer}>
            <LinkIcon2 color={my ? Colors.PureWhite : Colors.BodyText} />
            <Text style={styles.copyText}>Copy</Text>
          </TouchableOpacity> */}

          <View>
            <Text style={styles.timeText}>
              {moment(item.editedAt ? item.editedAt : item?.createdAt).format(
                'MMM DD, 2024',
              )}
              {' at '}
              {moment(item.editedAt ? item.editedAt : item?.createdAt).format(
                'h:mm A',
              )}
            </Text>
            {item.editedAt && <Text style={styles.editedText}>(Edited)</Text>}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Message2;

const getStyles = (Colors, my) =>
  StyleSheet.create({
    threeDotContainer: {
      position: 'absolute',
      right: 0,
      top: 5,
      // backgroundColor: 'red',
      width: 30,
      height: 30,
      zIndex: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    copyText: {
      fontSize: 18,
      color: my ? Colors.PureWhite : Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
    },
    copyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // gap: ,
      paddingRight: 10,
    },
    editedText: {
      color: Colors.Red,
      textAlign: 'right',
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
    replyCountText: {
      fontWeight: '600',
      fontSize: RegularFonts.HS,
      color: Colors.Red,
    },
    messageBottomContainer: {
      // backgroundColor: 'red',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    timeText: {
      color: my ? Colors.PureWhite : Colors.BodyText,
      alignSelf: 'flex-end',
      //   position: 'absolute',
      //   bottom: 0,
      //   right: 0,
      //   height: 10
      //   marginTop: -5,
    },
    mainContainer: {
      // backgroundColor: 'red',
      flex: 1,
    },
    messagesContainer: {
      backgroundColor: my ? Colors.Primary : Colors.Background_color,
      padding: 10,
      paddingRight: 30,
      // paddingVertical: 10,
      marginHorizontal: 10,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginTop: my ? 10 : 5,
      width: '90%',
      minWidth: '25%',
      alignSelf: my ? 'flex-end' : 'flex-start',
      minHeight: 30,
      //   gap: -1,
      position: 'relative',
    },

    markdownStyle: {
      whiteSpace: 'pre',
      body: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: 18,
        color: my ? Colors.PureWhite : Colors.BodyText,
        lineHeight: 20,
      },
      paragraph: {
        marginTop: 0, // Remove top margin from paragraphs
        marginBottom: 0, // Remove bottom margin from paragraphs
        padding: 0, // Remove padding from paragraphs
      },
      heading1: {
        // fontSize: responsiveScreenFontSize(3),
        // marginTop: 20,

        fontFamily: CustomFonts.SEMI_BOLD,
        paddingTop: 10,
        fontSize: responsiveScreenFontSize(1.8),
        // lineHeight: responsiveScreenFontSize(),
      },
      heading2: {
        // fontWeight: "bold",
        fontSize: responsiveScreenFontSize(1.8),
        fontFamily: CustomFonts.SEMI_BOLD,
      },
      heading3: {
        // paddingTop: 10,
        fontSize: responsiveScreenFontSize(1.8),
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
      strong: {fontFamily: CustomFonts.SEMI_BOLD},
      code_inline: {
        color: Colors.BodyText,
        backgroundColor: Colors.LightGreen,
      },
      hr: {
        backgroundColor: Colors.BodyText,
      },
      fence: {color: Colors.BodyText},
      code_block: {
        color: Colors.BodyText,
        backgroundColor: Colors.LightGreen,
        borderWidth: 0,
      },
      blockquote: {color: Colors.BodyText},
      table: {
        borderColor: Colors.BorderColor,
      },
      thead: {
        borderColor: Colors.BorderColor,
      },
      tbody: {
        borderColor: Colors.BorderColor,
      },
      th: {
        borderColor: Colors.BorderColor,
      },
      tr: {
        borderColor: Colors.BorderColor,
      },
      td: {
        borderColor: Colors.BorderColor,
      },
      link: {
        color: Colors.ThemeSecondaryColor,
        fontFamily: CustomFonts.SEMI_BOLD,
        fontWeight: '700',
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
  });
