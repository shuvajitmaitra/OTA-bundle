import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Markdown from 'react-native-markdown-display';
import {autoLinkify, removeHtmlTags, transFormDate} from './MessageHelper';
import {useTheme} from '../../context/ThemeContext';
import CustomeFonts from '../../constants/CustomeFonts';
import {useSelector} from 'react-redux';
import moment from 'moment';

const Message2 = ({item}) => {
  const {user} = useSelector(state => state.auth);
  const Colors = useTheme();
  const my = item.sender?._id === user?._id;

  const styles = getStyles(Colors, my);
  return (
    <View style={styles.mainContainer}>
      <View style={styles.messagesContainer}>
        <Markdown style={styles.markdownStyle}>
          {autoLinkify(
            transFormDate(
              removeHtmlTags(item?.text?.trim() || item?.text || ''),
            ),
          )}
        </Markdown>
        <Text style={styles.timeText}>
          {moment(item.createdAt).format('h:m A')}
        </Text>
      </View>
    </View>
  );
};

export default Message2;

const getStyles = (Colors, my) =>
  StyleSheet.create({
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
      //   backgroundColor: 'red',
      flex: 1,
    },
    messagesContainer: {
      backgroundColor: my ? Colors.Primary : Colors.Background_color,
      padding: 3,
      // paddingVertical: 10,
      marginHorizontal: 10,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginTop: 10,
      width: '80%',
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
        color: Colors.Primary,
        fontFamily: CustomeFonts.SEMI_BOLD,
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
