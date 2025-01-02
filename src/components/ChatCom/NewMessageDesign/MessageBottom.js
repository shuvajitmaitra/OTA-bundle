import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../../context/ThemeContext';
import {RegularFonts} from '../../../constants/Fonts';
import MCicons from 'react-native-vector-icons/MaterialCommunityIcons';
import CircleLoader from '../../SharedComponent/CircleLoader';
import CustomFonts from '../../../constants/CustomFonts';

const MessageBottom = ({item, navigation, my}) => {
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

      <View>
        {/* <Text style={styles.timeText}>
          {moment(item.editedAt || item?.createdAt).format(' h:mm A')}
        </Text> */}
        {item.editedAt && <Text style={styles.editedText}>(Edited)</Text>}
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
            <CircleLoader />
          ) : null}
        </>
      )}
    </View>
  );
};

export default MessageBottom;

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
      color: my ? Colors.PureWhite : Colors.BodyText,
      alignSelf: 'flex-end',
    },
  });
