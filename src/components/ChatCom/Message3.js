import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Markdown from 'react-native-markdown-display';
import {
  autoLinkify,
  generateActivityText,
  removeHtmlTags,
  sliceText,
  transFormDate,
} from './MessageHelper';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {useDispatch, useSelector} from 'react-redux';
import UserNameImageSection from './UserNameImageSection';
import {setMessageOptionData} from '../../store/reducer/ModalReducer';
import {useNavigation} from '@react-navigation/native';
import DeleteMessageContainer from './DeleteMessageContainer';
import MessageFileContainer from './MessageFileContainer';
import EmojiContainer from './EmojiContainer';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import ThreedotIcon from '../../assets/Icons/ThreedotIcon';
import axiosInstance from '../../utility/axiosInstance';
import {setSingleChat} from '../../store/reducer/chatReducer';
import MessageBottomContainer from './MessageBottomContainer';
import {setCurrentRoute} from '../../store/reducer/authReducer';
import MessageDateContainer from './MessageDateContainer';
import UserNameDateContainer from './UserNameDateContainer';
import Images from '../../constants/Images';
import {RegularFonts} from '../../constants/Fonts';

const Message3 = ({item, index, nextSender, setViewImage}) => {
  console.log('item', JSON.stringify(item, null, 2));

  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const [readMoreClicked, setreadMoreClicked] = useState(false);
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
        dispatch(setCurrentRoute('MessageScreen2'));
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
      {!item?.isSameDate && <MessageDateContainer time={item?.createdAt} />}

      <View style={styles.subContainer}>
        <TouchableOpacity onPress={handleCreateChat}>
          <Image
            onPress={handleCreateChat}
            resizeMode="contain"
            source={
              item?.sender?.profilePicture
                ? {
                    uri: item?.sender?.profilePicture,
                  }
                : Images.DEFAULT_IMAGE
            }
            style={styles.userImg}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onLongPress={() => dispatch(setMessageOptionData({...item, my}))}
          style={styles.messagesContainer}>
          <TouchableOpacity
            onPress={() => dispatch(setMessageOptionData({...item, my}))}
            style={styles.threeDotContainer}>
            <ThreedotIcon color={Colors.BodyText} />
          </TouchableOpacity>
          <UserNameDateContainer
            name={item?.sender?.fullName || 'N/A'}
            date={item?.createdAt}
          />

          {item?.files?.length > 0 && (
            <MessageFileContainer
              files={item.files}
              setViewImage={setViewImage}
              my={my}
            />
          )}
          <Markdown style={styles.markdownStyle}>
            {sliceText(
              autoLinkify(
                transFormDate(
                  removeHtmlTags(item?.text?.trim() || item?.text || ''),
                ),
              ),
              readMoreClicked,
            )}
          </Markdown>
          {!readMoreClicked && item?.text?.length > 300 && (
            <TouchableOpacity onPress={() => setreadMoreClicked(true)}>
              <Text style={styles.readMoreText}>Read more</Text>
            </TouchableOpacity>
          )}
          {!item?.parentMessage && (
            <EmojiContainer my={my} reacts={item.emoji} messageId={item._id} />
          )}
          <MessageBottomContainer item={item} navigation={navigation} my={my} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Message3;

const getStyles = (Colors, my) =>
  StyleSheet.create({
    subContainer: {
      flexDirection: 'row',
      //   backgroundColor: 'red',
      //   width: '99%',
    },
    userImg: {
      height: 35,
      width: 35,
      borderRadius: 10,
      // backgroundColor: Colors.LightGreen,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      resizeMode: 'cover',
      position: 'relative',
      marginHorizontal: 10,
    },
    readMoreText: {
      color: Colors.ThemeAnotherButtonColor,
      fontSize: RegularFonts.BS,
      fontWeight: '600',
      height: 20,
      // backgroundColor: 'green',
      width: 100,
    },
    threeDotContainer: {
      position: 'absolute',
      right: -10,
      top: 0,
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

    mainContainer: {
      // backgroundColor: 'red',
      flex: 1,
    },
    messagesContainer: {
      //   backgroundColor: Colors.Primary,
      position: 'relative',
      marginRight: 10,
      flex: 1,
    },

    markdownStyle: {
      whiteSpace: 'pre',
      body: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: RegularFonts.BR,
        color: Colors.BodyText,
      },
      heading1: {
        fontFamily: CustomFonts.SEMI_BOLD,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
      },
      heading2: {
        fontFamily: CustomFonts.SEMI_BOLD,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
      },
      heading3: {
        fontFamily: CustomFonts.SEMI_BOLD,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
      },
      heading4: {
        fontFamily: CustomFonts.SEMI_BOLD,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
      },
      heading5: {
        fontFamily: CustomFonts.SEMI_BOLD,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
      },
      heading6: {
        fontFamily: CustomFonts.SEMI_BOLD,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
      },
      hr: {
        backgroundColor: Colors.BodyText,
        marginVertical: 8,
        height: 1,
      },
      strong: {
        fontFamily: CustomFonts.SEMI_BOLD,
        fontSize: RegularFonts.BR,
      },
      em: {
        fontFamily: CustomFonts.REGULAR,
        fontStyle: 'italic',
        fontSize: RegularFonts.BR,
      },
      s: {
        textDecorationLine: 'line-through',
      },
      blockquote: {
        color: my ? Colors.PureWhite : Colors.BodyText,
        backgroundColor: my ? Colors.Primary : Colors.Background_color,
        padding: 8,
        borderRadius: 6,
        marginVertical: 4,
        borderLeftWidth: 4,
        borderLeftColor: Colors.ThemeAnotherButtonColor,
      },
      bullet_list: {
        marginVertical: 4,
      },
      ordered_list: {
        marginVertical: 4,
      },
      list_item: {
        marginVertical: 2,
      },
      ordered_list_icon: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: RegularFonts.BR,
        color: Colors.BodyText,
        marginRight: 8,
      },
      ordered_list_content: {
        flex: 1,
      },
      bullet_list_icon: {
        marginRight: 8,
      },
      bullet_list_content: {
        flex: 1,
      },
      code_inline: {
        color: Colors.BodyText,
        backgroundColor: my ? Colors.Primary : Colors.Background_color,
        fontFamily: CustomFonts.REGULAR,
        fontSize: RegularFonts.BS,
        padding: 4,
        borderRadius: 4,
      },
      code_block: {
        color: my ? Colors.PureWhite : Colors.BodyText,
        borderWidth: 0,
        backgroundColor: my ? Colors.Primary : Colors.Background_color,
        padding: 8,
        borderRadius: 6,
        fontFamily: CustomFonts.REGULAR,
        fontSize: RegularFonts.BS,
      },
      fence: {
        color: my ? Colors.PureWhite : Colors.BodyText,
        backgroundColor: my ? Colors.Primary : Colors.Background_color,
        marginBottom: 10,
        padding: 8,
        borderRadius: 6,
        fontFamily: CustomFonts.REGULAR,
        fontSize: RegularFonts.BS,
      },
      table: {
        borderColor: Colors.BorderColor,
        marginVertical: 8,
      },
      thead: {
        borderColor: Colors.BorderColor,
        backgroundColor: Colors.Background_color,
      },
      tbody: {
        borderColor: Colors.BorderColor,
      },
      th: {
        borderColor: Colors.BorderColor,
        padding: 6,
        fontFamily: CustomFonts.SEMI_BOLD,
      },
      tr: {
        borderColor: Colors.BorderColor,
      },
      td: {
        borderColor: Colors.BorderColor,
        padding: 6,
      },
      link: {
        color: Colors.ThemeAnotherButtonColor,
        fontFamily: CustomFonts.SEMI_BOLD,
        fontSize: RegularFonts.BR,
      },
      blocklink: {
        color: Colors.ThemeAnotherButtonColor,
        fontFamily: CustomFonts.SEMI_BOLD,
        fontSize: RegularFonts.BR,
      },
      image: {
        marginVertical: 8,
        borderRadius: 6,
      },
      text: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: RegularFonts.BR,
        color: Colors.BodyText,
      },
      textgroup: {
        color: Colors.BodyText,
      },
      paragraph: {
        marginTop: 0,
        marginBottom: 0,
        padding: 0,
      },
      hardbreak: {
        marginVertical: 8,
      },
      softbreak: {
        marginVertical: 4,
      },
      pre: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: RegularFonts.BS,
        color: Colors.BodyText,
      },
      inline: {
        color: Colors.BodyText,
      },
      span: {
        color: Colors.BodyText,
      },
    },
  });
