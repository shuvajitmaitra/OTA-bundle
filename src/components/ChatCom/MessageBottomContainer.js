import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import {useTheme} from '../../context/ThemeContext';
import {RegularFonts} from '../../constants/Fonts';
import MCicons from 'react-native-vector-icons/MaterialCommunityIcons';

const MessageBottomContainer = ({item, navigation, my}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors, my);
  return (
    <View style={styles.messageBottomContainer}>
      {item.replyCount > 0 && (
        <TouchableOpacity
          onPress={() =>
            navigation.push('ThreadScreen', {
              chatMessage: item,
            })
          }>
          <Text style={styles.replyCountText}>{`${item.replyCount} ${
            item?.replyCount === 1 ? 'reply' : 'replies'
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
      {my && (
        <>
          {item?.status === 'seen' ? (
            <MCicons
              style={styles.iconStyle}
              color={Colors.ThemeAnotherButtonColor}
              size={20}
              name="check-all"
            />
          ) : item?.status === 'sent' ? (
            <MCicons
              style={styles.iconStyle}
              size={20}
              color={Colors.PureWhite}
              name="check"
            />
          ) : item?.status === 'delivered' ? (
            <MCicons
              style={styles.iconStyle}
              color={Colors.PureWhite}
              size={20}
              name="check-all"
            />
          ) : item?.status === 'sending' ? (
            <MCicons
              style={styles.iconStyle}
              size={20}
              color={Colors.PureWhite}
              name="checkbox-blank-circle-outline"
            />
          ) : null}
        </>
      )}
    </View>
  );
};

export default MessageBottomContainer;

const getStyles = (Colors, my) =>
  StyleSheet.create({
    iconStyle: {
      alignSelf: 'flex-start',
    },
    editedText: {
      color: Colors.Red,
      textAlign: 'right',
    },
    replyCountText: {
      fontWeight: '600',
      fontSize: RegularFonts.HS,
      color: Colors.Red,
    },
    messageBottomContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      //   backgroundColor: 'red',
      width: '100%',
    },
    timeText: {
      color: my ? Colors.PureWhite : Colors.BodyText,
      // color: '#dfdfdf',
      alignSelf: 'flex-end',
    },
  });
