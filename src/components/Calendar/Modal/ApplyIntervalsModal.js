import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import ReactNativeModal from "react-native-modal";
import { useTheme } from "../../../context/ThemeContext";
import { useSelector } from "react-redux";
import UnCheckIcon from "../../../assets/Icons/UnCheckIcon";
import { responsiveHeight, responsiveScreenFontSize, responsiveScreenHeight } from "react-native-responsive-dimensions";
import CheckIcon from "../../../assets/Icons/CheckIcon";
import CustomFonts from "../../../constants/CustomFonts";

const ApplyIntervalsModal = React.memo(({ applyIntervalsModal, toggleApplyIntervalsModal, handleApplyButton }) => {
  const { availabilities } = useSelector((state) => state.calendar);
  const Colors = useTheme();
  const [days, setDays] = useState([
    { day: "Sunday" },
    { day: "Monday" },
    { day: "Tuesday" },
    { day: "Wednesday" },
    { day: "Thursday" },
    { day: "Friday" },
    { day: "Saturday" },
  ]);
  const styles = getStyles(Colors);

  const handleCheckbox = (index) => {
    setDays(days.map((day, i) => (i == index ? { ...day, checked: !day.checked } : day)));
  };
  return (
    <ReactNativeModal onBackdropPress={toggleApplyIntervalsModal} isVisible={applyIntervalsModal}>
      <View style={styles.container}>
        {/* <Text></Text> */}
        {days?.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => handleCheckbox(index)}
              key={index}
              style={{
                flexDirection: "row",
                gap: 10,
                marginBottom: responsiveHeight(1),
              }}
            >
              {item.checked ? <CheckIcon /> : <UnCheckIcon />}
              <Text style={styles.dateText}>{item.day}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          onPress={() => {
            //   handleUpdateSpecificHours();
            handleApplyButton(days);
            setDays([
              { day: "Sunday" },
              { day: "Monday" },
              { day: "Tuesday" },
              { day: "Wednesday" },
              { day: "Thursday" },
              { day: "Friday" },
              { day: "Saturday" },
            ]);
          }}
          style={styles.buttonContainer}
        >
          <Text style={styles.ButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </ReactNativeModal>
  );
});

export default ApplyIntervalsModal;
const getStyles = (Colors) =>
  StyleSheet.create({
    dateText: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    buttonContainer: {
      width: "50%",
      backgroundColor: Colors.Primary,
      justifyContent: "center",
      alignSelf: "center",
      borderRadius: 7,
      paddingVertical: responsiveScreenHeight(1),
      marginTop: responsiveScreenHeight(1),
    },
    ButtonText: {
      textAlign: "center",
      color: Colors.PureWhite,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.MEDIUM,
    },
    container: {
      backgroundColor: Colors.White,
      borderRadius: 7,
      padding: 20,
    },
  });
