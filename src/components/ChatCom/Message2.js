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
import ThreedotIcon from '../../assets/Icons/ThreedotIcon';
import axiosInstance from '../../utility/axiosInstance';
import {setSingleChat} from '../../store/reducer/chatReducer';
import MessageBottomContainer from './MessageBottomContainer';
import {setCurrentRoute} from '../../store/reducer/authReducer';
import {RegularFonts} from '../../constants/Fonts';
import MessageDateContainer from './MessageDateContainer';

const Message2 = ({item, index, nextSender, setViewImage}) => {
  // console.log('item', JSON.stringify(item, null, 2));
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
        navigation.push('MessageScreen2', {from: 'crowd'});
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
      {!my && (nextSender || !item?.isSameDate) && (
        <UserNameImageSection
          name={item?.sender?.fullName}
          image={item?.sender?.profilePicture}
          handleCreateChat={handleCreateChat}
        />
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={() => dispatch(setMessageOptionData({...item, my}))}
        style={styles.messagesContainer}>
        <TouchableOpacity
          onPress={() => dispatch(setMessageOptionData({...item, my}))}
          style={styles.threeDotContainer}>
          <ThreedotIcon color={Colors.BodyText} />
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
        <MessageBottomContainer item={item} navigation={navigation} my={my} />
      </TouchableOpacity>
      {!item?.parentMessage && (
        <EmojiContainer
          my={my}
          reacts={Object.entries(item?.reactions).map(([symbol, count]) => ({
            symbol,
            count,
          }))}
          messageId={item._id}
          myReactions={item?.myReaction}
        />
      )}
    </View>
  );
};

export default Message2;

const getStyles = (Colors, my) =>
  StyleSheet.create({
    readMoreText: {
      color: Colors.ThemeAnotherButtonColor,
      fontSize: RegularFonts.BR,
      height: 20,
      width: 100,
      fontFamily: CustomFonts.MEDIUM,
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
      color: Colors.BodyText,
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
      fontFamily: CustomFonts.LATO_REGULAR,
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
      backgroundColor: my
        ? Colors.PrimaryOpacityColor
        : Colors.Background_color,
      padding: 10,
      paddingRight: 30,
      // paddingVertical: 10,
      marginHorizontal: 10,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginTop: 5,
      width: '90%',
      minWidth: '25%',
      alignSelf: my ? 'flex-end' : 'center',
      // alignSelf: 'center',
      minHeight: 30,
      //   gap: -1,
      position: 'relative',
    },

    markdownStyle: {
      whiteSpace: 'pre',
      body: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        color: Colors.BodyText,
      },
      paragraph: {
        marginTop: 0, // Remove top margin from paragraphs
        marginBottom: 0, // Remove bottom margin from paragraphs
        padding: 0, // Remove padding from paragraphs
      },
      heading1: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
      },
      heading2: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
      },
      heading3: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
      },
      heading4: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
      },
      heading5: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
      },
      heading6: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
      },
      strong: {
        fontFamily: CustomFonts.LATO_BOLD,
        fontSize: RegularFonts.BR,
        fontWeight: '500',
      },
      em: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontStyle: 'italic',
        fontSize: RegularFonts.BR,
      },
      s: {
        textDecorationLine: 'line-through',
      },
      code_inline: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BS,
        padding: 4,
        borderRadius: 4,
      },
      hr: {
        backgroundColor: Colors.BodyText,
        marginVertical: 8,
        height: 1,
      },
      fence: {
        marginBottom: 10,
        padding: 8,
        borderRadius: 6,
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BS,
      },
      code_block: {
        borderWidth: 0,
        padding: 8,
        borderRadius: 6,
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BS,
      },
      blockquote: {
        padding: 8,
        borderRadius: 6,
        marginVertical: 4,
        borderLeftWidth: 4,
        borderLeftColor: Colors.ThemeAnotherButtonColor,
      },
      thead: {
        borderColor: Colors.BorderColor,
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
      table: {
        borderColor: Colors.BorderColor,
        marginVertical: 8,
      },
      pre: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BS,
        color: Colors.BodyText,
      },
      inline: {
        color: Colors.BodyText,
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
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
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
      span: {},
      softbreak: {
        marginVertical: 4,
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
      // text: {
      //   fontFamily: CustomFonts.LATO_REGULAR,
      //   fontSize: RegularFonts.BR,
      //   color: Colors.BodyText,
      // },
      textgroup: {},
      hardbreak: {
        marginVertical: 8,
      },
    },
  });
