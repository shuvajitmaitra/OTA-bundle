import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import {useTheme} from '../../context/ThemeContext';
import {RegularFonts} from '../../constants/Fonts';
import MCicons from 'react-native-vector-icons/MaterialCommunityIcons';
import CircleLoader from '../SharedComponent/CircleLoader';
import CustomFonts from '../../constants/CustomFonts';

const MessageBottomContainer = ({item, navigation, my}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors, my);
  return (
    <View style={styles.messageBottomContainer}>
      {item.replyCount > 0 && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ThreadScreen', {
              parentMessage: item?._id,
              chat: item?.chat,
            })
          }>
          <Text style={styles.replyCountText}>{`${item.replyCount} ${
            item?.replyCount === 1 ? 'reply' : 'replies'
          }`}</Text>
        </TouchableOpacity>
      )}
      <View style={{flexGrow: 1}}></View>

      <View style={{flexDirection: 'row'}}>
        {item.editedAt && <Text style={styles.editedText}>(Edited)</Text>}
        <Text style={styles.timeText}>
          {moment(item.editedAt || item?.createdAt).format(' h:mm A')}
        </Text>
      </View>
      {my && !item.parentMessage && (
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
              color={Colors.BodyText}
              name="check"
            />
          ) : item?.status === 'delivered' ? (
            <MCicons
              style={styles.iconStyle}
              color={Colors.BodyText}
              size={20}
              name="check-all"
            />
          ) : item?.status === 'sending' ? (
            <CircleLoader />
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
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: RegularFonts.BS,
      color: Colors.Red,
    },
    messageBottomContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      width: '100%',
    },
    timeText: {
      color: Colors.BodyText,
      alignSelf: 'flex-end',
    },
  });
