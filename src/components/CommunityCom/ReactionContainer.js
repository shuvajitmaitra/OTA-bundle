import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Popover from 'react-native-popover-view'; // Change to react-native-popover-view
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {giveReaction} from '../../actions/chat-noti';
import {useTheme} from '../../context/ThemeContext';

const ReactionContainer = ({
  touchPosition,
  popoverRect,
  showPopover,
  setShowPopover,
  postId,
  myReaction,
}) => {
  let emojis = ['👍', '😍', '❤️', '😂', '🥰', '😯'];
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <Popover
      placement={'top'}
      arrowSize={{width: 0, height: 0}}
      from={{
        x: touchPosition.x,
        y: touchPosition.y - 20,
        width: popoverRect.width,
        height: popoverRect.height,
      }}
      isVisible={showPopover}
      popoverStyle={styles.content}
      onRequestClose={() => setShowPopover(false)}>
      <View style={styles.container}>
        {emojis.map((emoji, index) => (
          <TouchableOpacity
            onPress={() => {
              giveReaction(postId, {symbol: emoji}, {popup: true});
            }}
            style={[
              styles.emojiContainer,
              emoji === myReaction && {
                backgroundColor: Colors.CyanOpacity,
                paddingHorizontal: 10,
                borderRadius: 100,
              },
            ]}
            key={index}>
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Popover>

    // <Popover
    //   // mode="tooltip"
    //   offset={10} // Adjust this value if needed
    //   isVisible={popoverVisible} // Update from `visible` to `isVisible`
    //   onRequestClose={closePopover} // Update from `onClose` to `onRequestClose`
    //   arrowStyle={styles.arrow}
    //
    //   placement={PopoverPlacement.BOTTOM} // Ensure the popover places itself at the bottom of the button
    //   backgroundStyle={styles.background}
    //   from={buttonRef.current} // Ensure popover is anchored to the button
    // >
    // </Popover>
  );
};

export default ReactionContainer;

const getStyles = Colors =>
  StyleSheet.create({
    background: {
      // backgroundColor: 'yellow',
    },
    container: {
      backgroundColor: Colors.White,
      flexDirection: 'row',
      width: responsiveScreenWidth(80),
      justifyContent: 'center',
      borderRadius: 100,
      gap: 10,
    },
    emoji: {
      fontSize: responsiveScreenFontSize(4),
    },
    arrow: {borderTopColor: Colors.PureGray},
    emojiContainer: {
      paddingVertical: responsiveScreenHeight(0.5),
    },
    content: {
      backgroundColor: 'transparent',
    },
  });
