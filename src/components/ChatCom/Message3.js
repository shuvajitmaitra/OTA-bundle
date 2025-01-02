import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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

      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={() => dispatch(setMessageOptionData({...item, my}))}
        style={styles.messagesContainer}>
        <TouchableOpacity
          onPress={() => dispatch(setMessageOptionData({...item, my}))}
          style={styles.threeDotContainer}>
          <ThreedotIcon color={my ? Colors.PureWhite : Colors.BodyText} />
        </TouchableOpacity>
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
  );
};

export default Message3;

const getStyles = (Colors, my) =>
  StyleSheet.create({
    readMoreText: {
      color: Colors.ThemeAnotherButtonColor,
      fontSize: responsiveScreenFontSize(2),
      fontWeight: '600',
      height: 20,
      // backgroundColor: 'green',
      width: 100,
    },
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
      backgroundColor: Colors.Primary,
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
        backgroundColor: my ? Colors.Primary : Colors.Background_color,
      },
      hr: {
        backgroundColor: Colors.BodyText,
      },
      fence: {
        color: my ? Colors.PureWhite : Colors.BodyText,
        backgroundColor: my ? Colors.Primary : Colors.Background_color,
        marginBottom: 10,
      },
      code_block: {
        color: my ? Colors.PureWhite : Colors.BodyText,
        borderWidth: 0,
        backgroundColor: my ? Colors.Primary : Colors.Background_color,
      },
      blockquote: {
        color: my ? Colors.PureWhite : Colors.BodyText,
        backgroundColor: my ? Colors.Primary : Colors.Background_color,
      },
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
        color: '#0D22EA',
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
