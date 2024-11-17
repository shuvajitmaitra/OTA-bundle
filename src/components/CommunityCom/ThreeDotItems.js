import { Alert, StyleSheet, Text, View } from "react-native";
import React from "react";
import Popover from "react-native-modal-popover";
import { TouchableOpacity } from "react-native";
import { handleOpenLink, showToast } from "../HelperFunction";
import { handleCopyLink } from "../../utility/commonFunction";
import axiosInstance from "../../utility/axiosInstance";
import { handleError } from "../../actions/chat-noti";
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useTheme } from "../../context/ThemeContext";
import CustomFonts from "../../constants/CustomFonts";
import ConfirmationModal from "../SharedComponent/ConfirmationModal";

const ThreeDotItems = ({
  popoverVisible,
  closePopover,
  popoverAnchorRect,
  data,
  commentId,
  contentId,
  isConfirmationModalVisible,
  handleDeleteEvent,
  setIsConfirmationModalVisible,
  me,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors, me);

  return (
    <Popover
      contentStyle={styles.content}
      arrowStyle={styles.arrow}
      backgroundStyle={styles.background}
      visible={popoverVisible}
      onClose={closePopover}
      fromRect={popoverAnchorRect}
      placement="end"
      supportedOrientations={["portrait", "landscape"]}
    >
      {!isConfirmationModalVisible &&
        data?.map((item, index) => (
          <TouchableOpacity
            style={styles.itemContainer}
            key={index}
            onPress={() => {
              item.func({ commentId, contentId }) || null;
            }}
          >
            <Text
              style={[
                styles.item,
                {
                  color: item.label === "Delete" ? Colors.Red : Colors.BodyText,
                },
              ]}
            >
              {item?.label}
            </Text>
          </TouchableOpacity>
        ))}

      {/* Confirmation Modal for Deleting Comment */}
      <ConfirmationModal
        isVisible={isConfirmationModalVisible}
        title={"Delete"}
        description={"Do you want to delete the comment?"}
        okPress={handleDeleteEvent}
        cancelPress={() => {
          closePopover();
          setIsConfirmationModalVisible(!isConfirmationModalVisible);
        }}
      />
    </Popover>
  );
};

export default ThreeDotItems;

const getStyles = (Colors, me) =>
  StyleSheet.create({
    arrow: {
      borderTopColor: Colors.White,
      marginTop: me && responsiveScreenHeight(2),
    },
    content: {
      borderRadius: 5,
      gap: responsiveScreenHeight(1),
      backgroundColor: Colors.White,
    },
    itemContainer: {
      paddingVertical: responsiveScreenHeight(0.5),
      backgroundColor: Colors.Background_color,
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: responsiveFontSize(0.5),
    },
    item: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
  });
