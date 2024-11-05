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
import CustomeFonts from '../../constants/CustomeFonts';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import UserNameImageSection from './UserNameImageSection';
import {setMessageOptionData} from '../../store/reducer/ModalReducer';
import {RegularFonts} from '../../constants/Fonts';
import {useNavigation} from '@react-navigation/native';
import DeleteMessageContainer from './DeleteMessageContainer';
import MessageFileContainer from './MessageFileContainer';
import EmojiContainer from './EmojiContainer';

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
        />
      )}
      <TouchableOpacity
        onLongPress={() => dispatch(setMessageOptionData({...item, my}))}
        style={styles.messagesContainer}>
        {item.files.length > 0 && <MessageFileContainer files={item.files} />}
        <Markdown style={styles.markdownStyle}>
          {autoLinkify(
            transFormDate(
              removeHtmlTags(item?.text?.trim() || item?.text || ''),
            ),
          )}
        </Markdown>
        {!item?.parentMessage && (
          <EmojiContainer reacts={item.emoji} messageId={item._id} />
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
      fontFamily: CustomeFonts.REGULAR,
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
      padding: 3,
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
    },
    markdownStyle: {
      whiteSpace: 'pre',
      body: {
        fontFamily: CustomeFonts.REGULAR,
        fontSize: 16,
        color: my ? Colors.PureWhite : Colors.BodyText,
        lineHeight: 20,
      },
      paragraph: {
        marginTop: 0, // Remove top margin from paragraphs
        marginBottom: 0, // Remove bottom margin from paragraphs
        padding: 0, // Remove padding from paragraphs
      },
      heading1: {
        fontFamily: CustomeFonts.SEMI_BOLD,
      },
      heading2: {
        fontFamily: CustomeFonts.SEMI_BOLD,
      },
      heading3: {
        fontFamily: CustomeFonts.SEMI_BOLD,
      },
      heading4: {
        fontFamily: CustomeFonts.SEMI_BOLD,
      },
      heading5: {
        fontFamily: CustomeFonts.SEMI_BOLD,
      },
      heading6: {
        fontFamily: CustomeFonts.SEMI_BOLD,
      },
      strong: {fontFamily: CustomeFonts.SEMI_BOLD},
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
        fontFamily: CustomeFonts.SEMI_BOLD,
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
    // markdownStyle: {
    //   whiteSpace: 'pre',
    //   body: {
    //     fontFamily: CustomeFonts.REGULAR,
    //     fontSize: 16,
    //     color: Colors.BodyText,
    //     lineHeight: 20,
    //     // marginBottom: 100,
    //   },
    //   heading1: {
    //     // fontWeight: "bold",
    //     fontFamily: CustomeFonts.SEMI_BOLD,
    //   },
    //   heading2: {
    //     // fontWeight: "bold",
    //     fontFamily: CustomeFonts.SEMI_BOLD,
    //   },
    //   heading3: {
    //     // fontWeight: "bold",
    //     fontFamily: CustomeFonts.SEMI_BOLD,
    //   },
    //   heading4: {
    //     // fontWeight: "bold",
    //     fontFamily: CustomeFonts.SEMI_BOLD,
    //   },
    //   heading5: {
    //     // fontWeight: "bold",
    //     fontFamily: CustomeFonts.SEMI_BOLD,
    //   },
    //   heading6: {
    //     // fontWeight: "bold",
    //     fontFamily: CustomeFonts.SEMI_BOLD,
    //   },
    //   strong: {fontFamily: CustomeFonts.SEMI_BOLD},
    //   code_inline: {
    //     color: Colors.BodyText,
    //     backgroundColor: Colors.White,
    //   },
    //   hr: {
    //     backgroundColor: Colors.BodyText,
    //   },
    //   fence: {color: Colors.BodyText},
    //   code_block: {
    //     color: Colors.BodyText,
    //     backgroundColor: Colors.White,
    //     borderWidth: 0,
    //   },
    //   blockquote: {color: Colors.BodyText},
    //   table: {
    //     borderColor: Colors.BorderColor,
    //   },
    //   thead: {
    //     borderColor: Colors.BorderColor,
    //   },
    //   tbody: {
    //     borderColor: Colors.BorderColor,
    //   },
    //   th: {
    //     borderColor: Colors.BorderColor,
    //   },
    //   tr: {
    //     borderColor: Colors.BorderColor,
    //   },
    //   td: {
    //     borderColor: Colors.BorderColor,
    //   },
    //   link: {
    //     // backgroundColor:  Colors.LightGreen,
    //     color: Colors.Primary,
    //     // fontWeight: "bold",
    //     fontFamily: CustomeFonts.SEMI_BOLD,
    //   },
    //   bullet_list: {
    //     marginVertical: 10,
    //   },
    //   ordered_list: {
    //     marginVertical: 10,
    //   },
    //   list_item: {
    //     marginVertical: 10,
    //   },
    // },
  });
