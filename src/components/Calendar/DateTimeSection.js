import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import CalendarIconSmall from "../../assets/Icons/CalendarIconSmall";
import moment from "moment";
import CheckIcon from "../../assets/Icons/CheckIcon";
import UnCheckIcon from "../../assets/Icons/UnCheckIcon";
import { useTheme } from "../../context/ThemeContext";
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import CustomFonts from "../../constants/CustomFonts";
import { useSelector } from "react-redux";

const DateTimeSection = ({ event, setEvent, setPickerState, setTimeMode, setIsPickerVisible }) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.dateTimeContainer}>
      <View style={styles.timeDateContainer}>
        <CalendarIconSmall />
        <Text style={styles.timeDateLabel}>Event Time & Date</Text>
      </View>
      <View style={styles.dateTimeRow}>
        <Text style={styles.dateTimeLabel}>Start Date:</Text>
        <TouchableOpacity
          onPress={() => {
            setPickerState("date");
            setTimeMode("startDate");
            setIsPickerVisible(true);
          }}
          style={styles.dateTimePicker}
        >
          <Text style={styles.timeDateText}>{moment(event?.start).format("MMM DD, YYYY")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setPickerState("time");
            setTimeMode("startTime");
            setIsPickerVisible(true);
          }}
          style={styles.dateTimePicker}
        >
          <Text style={styles.timeDateText}>{moment(event?.start).format("hh:mm A")}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dateTimeRow}>
        <Text style={styles.dateTimeLabel}>End Date:</Text>
        <TouchableOpacity
          onPress={() => {
            setPickerState("date");
            setTimeMode("endDate");
            setIsPickerVisible(true);
          }}
          style={styles.dateTimePicker}
        >
          <Text style={styles.timeDateText}>{moment(event?.end).format("MMM DD, YYYY")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setPickerState("time");
            setTimeMode("endTime");
            setIsPickerVisible(true);
          }}
          style={styles.dateTimePicker}
        >
          <Text style={styles.timeDateText}>{moment(event?.end).format("hh:mm A")}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setEvent((pre) => ({ ...pre, isAllDay: !event?.isAllDay }))} style={styles.allDayContainer}>
        {event?.isAllDay ? <CheckIcon /> : <UnCheckIcon />}
        <Text style={styles.allDayText}>All Day</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DateTimeSection;
const getStyles = (Colors) =>
  StyleSheet.create({
    dateTimeContainer: {
      backgroundColor: Colors.ModalBoxColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1.5),
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      gap: responsiveScreenHeight(2),
      marginBottom: responsiveScreenHeight(2),
      zIndex: 1,
    },
    timeDateContainer: {
      flexDirection: "row",
      gap: responsiveScreenWidth(1.5),
      paddingBottom: responsiveScreenHeight(1.5),
      alignItems: "center",
      borderBottomColor: Colors.BorderColor,
      borderBottomWidth: 1,
    },
    timeDateLabel: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
    },
    dateTimeRow: {
      flexDirection: "row",
      gap: responsiveScreenWidth(2),
      alignItems: "center",
    },
    dateTimeLabel: {
      color: Colors.BodyText,
      // fontWeight: "500",
      fontFamily: CustomFonts.REGULAR,
    },
    dateTimePicker: {
      backgroundColor: Colors.White,
      paddingVertical: 3,
      paddingHorizontal: 10,
      borderRadius: 4,
      borderColor: Colors.BorderColor,
      borderWidth: 1,
    },
    timeDateText: {
      color: "rgba(39, 172, 31, 1)",
      fontFamily: CustomFonts.REGULAR,
    },
    allDayContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: responsiveScreenWidth(2),
    },
    allDayText: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
    },
  });
