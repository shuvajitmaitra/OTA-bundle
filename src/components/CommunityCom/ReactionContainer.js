import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Popover from "react-native-modal-popover";
import { responsiveScreenFontSize, responsiveScreenWidth } from "react-native-responsive-dimensions";
import { giveReaction } from "../../actions/chat-noti";
import { useTheme } from "../../context/ThemeContext";

const ReactionContainer = ({ popoverVisible, closePopover, popoverAnchorRect, postId, myReaction }) => {
  let emojis = ["👍", "😍", "❤️", "😂", "🥰", "😯"];
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <Popover
      contentStyle={styles.content}
      arrowStyle={styles.arrow}
      backgroundStyle={styles.background}
      visible={popoverVisible}
      onClose={closePopover}
      fromRect={popoverAnchorRect}
      placement="top"
      supportedOrientations={["portrait", "landscape"]}
    >
      {emojis.map((emoji, index) => (
        <TouchableOpacity
          onPress={() => {
            giveReaction(postId, { symbol: emoji }, { popup: true }), closePopover();
          }}
          style={[
            styles.emojiContainer,
            emoji == myReaction && { backgroundColor: Colors.CyanOpacity, paddingHorizontal: 10, borderRadius: 100 },
          ]}
          key={index}
        >
          <Text style={styles.emoji}>{emoji}</Text>
        </TouchableOpacity>
      ))}
    </Popover>
  );
};

export default ReactionContainer;

const getStyles = (Colors) =>
  StyleSheet.create({
    emoji: {
      fontSize: responsiveScreenFontSize(3),
    },
    arrow: { borderTopColor: Colors.PureGray },
    emojiContainer: {},
    content: {
      borderRadius: 100,
      flexDirection: "row",
      gap: responsiveScreenWidth(2),
      paddingHorizontal: responsiveScreenWidth(3),
      backgroundColor: Colors.PureGray,
    },
  });
