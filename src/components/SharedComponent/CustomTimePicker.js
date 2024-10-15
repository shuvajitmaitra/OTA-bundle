import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ReactNativeModal from "react-native-modal";
import { useTheme } from "../../context/ThemeContext";
import { Calendar } from "react-native-calendars";
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from "react-native-responsive-dimensions";
import CustomeFonts from "../../constants/CustomeFonts";
import UpArrowIcon from "../../assets/Icons/UpArrowIcon";
import DownArrowIcon from "../../assets/Icons/DownArrowIcon";
import ModalBackAndCrossButton from "../ChatCom/Modal/ModalBackAndCrossButton";
import moment from "moment";

const CustomTimePicker = ({
  mode = "date",
  setDate = () => {},
  setTime = () => {},
  time = moment().format("hh:mm A"),
  setIsPickerVisible,
  isPickerVisible,
  showPreviousDate = false,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const formattedTime = moment(time, ["h:mm A"]).format("hh:mm A");

  const initialHour = moment(formattedTime, "hh:mm A").format("h");
  const initialMinute =
    (Math.ceil(moment(formattedTime, "hh:mm A").minute() / 15) * 15) % 60;
  const initialPeriod = moment(formattedTime, "hh:mm A").format("A");

  const [selectedDate, setSelectedDate] = useState("");
  const [hourIndex, setHourIndex] = useState(parseInt(initialHour, 10) - 1);
  const [minuteIndex, setMinuteIndex] = useState(initialMinute / 15);
  const [periodIndex, setPeriodIndex] = useState(
    initialPeriod === "AM" ? 0 : 1
  );

  const today = new Date().toISOString().split("T")[0];
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = ["00", "15", "30", "45"];
  const periods = ["AM", "PM"];

  const incrementIndex = useCallback(
    (index, length) => (index + 1) % length,
    []
  );
  const decrementIndex = useCallback(
    (index, length) => (index - 1 + length) % length,
    []
  );

  const handleHourUp = useCallback(() => {
    setHourIndex((prevIndex) => incrementIndex(prevIndex, hours?.length));
  }, [incrementIndex, hours?.length]);

  const handleHourDown = useCallback(() => {
    setHourIndex((prevIndex) => decrementIndex(prevIndex, hours?.length));
  }, [decrementIndex, hours?.length]);

  const handleMinuteUp = useCallback(() => {
    setMinuteIndex((prevIndex) => incrementIndex(prevIndex, minutes?.length));
  }, [incrementIndex, minutes?.length]);

  const handleMinuteDown = useCallback(() => {
    setMinuteIndex((prevIndex) => decrementIndex(prevIndex, minutes?.length));
  }, [decrementIndex, minutes?.length]);

  const handlePeriodUp = useCallback(() => {
    setPeriodIndex((prevIndex) => incrementIndex(prevIndex, periods?.length));
  }, [incrementIndex, periods?.length]);

  const handlePeriodDown = useCallback(() => {
    setPeriodIndex((prevIndex) => decrementIndex(prevIndex, periods?.length));
  }, [decrementIndex, periods?.length]);

  // useEffect(() => {
  //   const formattedTime = moment(time, ["h:mm A"]).format("hh:mm A");
  //   const initialHour = moment(formattedTime, "hh:mm A").format("h");
  //   const initialMinute =
  //     (Math.ceil(moment(formattedTime, "hh:mm A").minute() / 15) * 15) % 60;
  //   const initialPeriod = moment(formattedTime, "hh:mm A").format("A");

  //   setHourIndex(parseInt(initialHour, 10) - 1);
  //   setMinuteIndex(initialMinute / 15);
  //   setPeriodIndex(initialPeriod === "AM" ? 0 : 1);
  // }, [time]);

  useEffect(() => {
    const formattedTime = moment(time, ["h:mm A"]).format("hh:mm A");
    const initialHour = moment(formattedTime, "hh:mm A").format("h");
    const initialMinute =
      (Math.ceil(moment(formattedTime, "hh:mm A").minute() / 15) * 15) % 60;
    const initialPeriod = moment(formattedTime, "hh:mm A").format("A");

    setHourIndex(parseInt(initialHour, 10) - 1);
    setMinuteIndex(initialMinute / 15);
    setPeriodIndex(initialPeriod === "AM" ? 0 : 1);
  }, [time, isPickerVisible]); // Add isPickerVisible to the dependency array

  return (
    <ReactNativeModal isVisible={isPickerVisible}>
      <View style={styles.modalContainer}>
        <ModalBackAndCrossButton
          toggleModal={() => {
            setIsPickerVisible(false);
            setHourIndex(0);
            setMinuteIndex(0);
            setPeriodIndex(0);
          }}
        />
        {mode !== "time" && (
          <Calendar
            theme={{
              calendarBackground: Colors.Background_color,
              selectedDayBackgroundColor: Colors.Primary,
              selectedDayTextColor: Colors.PureWhite,
              todayTextColor: Colors.Primary,
              dayTextColor: Colors.Heading,
              textDisabledColor: Colors.datePickerDisableTextColor,
              arrowColor: Colors.Primary,
              monthTextColor: Colors.Heading,
              textSectionTitleColor: Colors.Heading,
              textDayFontWeight: "500",
              textMonthFontWeight: "600",
            }}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              if (setDate) setDate(day.dateString);
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: "orange",
              },
            }}
            minDate={showPreviousDate ? null : today}
          />
        )}
        {mode !== "date" && (
          <View
            style={[
              styles.timePickerContainer,
              { marginTop: mode !== "date" && responsiveScreenHeight(2) },
            ]}
          >
            <View style={styles.hourContainer}>
              <TouchableOpacity
                onPress={handleHourUp}
                style={styles.arrowButton}
              >
                <UpArrowIcon size={13} />
              </TouchableOpacity>
              <Text style={styles.time}>{hours[hourIndex]}</Text>
              <TouchableOpacity
                onPress={handleHourDown}
                style={styles.arrowButton}
              >
                <DownArrowIcon size={20} color={Colors.BodyText} />
              </TouchableOpacity>
            </View>
            <View style={styles.hourContainer}>
              <TouchableOpacity
                onPress={handleMinuteUp}
                style={styles.arrowButton}
              >
                <UpArrowIcon size={13} />
              </TouchableOpacity>
              <Text style={styles.time}>{minutes[minuteIndex]}</Text>
              <TouchableOpacity
                onPress={handleMinuteDown}
                style={styles.arrowButton}
              >
                <DownArrowIcon size={20} color={Colors.BodyText} />
              </TouchableOpacity>
            </View>
            <View style={styles.hourContainer}>
              <TouchableOpacity
                onPress={handlePeriodUp}
                style={styles.arrowButton}
              >
                <UpArrowIcon size={13} />
              </TouchableOpacity>
              <Text style={styles.time}>{periods[periodIndex]}</Text>
              <TouchableOpacity
                onPress={handlePeriodDown}
                style={styles.arrowButton}
              >
                <DownArrowIcon size={20} color={Colors.BodyText} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.buttonTopContainer}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => setIsPickerVisible(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonContainer,
              { backgroundColor: Colors.Primary },
            ]}
            onPress={() => {
              setIsPickerVisible(false);
              if (setDate && mode !== "time") setDate(selectedDate);
              if (setTime && mode !== "date")
                setTime(
                  `${hours[hourIndex]}:${minutes[minuteIndex]} ${periods[periodIndex]}`
                );
              setHourIndex(0);
              setMinuteIndex(0);
              setPeriodIndex(0);
            }}
          >
            <Text style={[styles.buttonText, { color: Colors.PureWhite }]}>
              Ok
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ReactNativeModal>
  );
};
const getStyles = (Colors) =>
  StyleSheet.create({
    time: {
      color: Colors.Primary,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomeFonts.MEDIUM,
      margin: 10,
      textAlign: "center",
    },
    timePickerContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      marginTop: 10,
      borderRadius: 7,
      backgroundColor: Colors.Background_color,
      paddingVertical: responsiveScreenHeight(1),
    },
    buttonTopContainer: {
      flexDirection: "row",
      gap: 10,
      marginTop: 15,
    },
    arrowButton: {
      padding: 10,
      backgroundColor: Colors.White,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      color: Colors.Primary,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomeFonts.MEDIUM,
    },
    buttonContainer: {
      backgroundColor: Colors.PrimaryOpacityColor,
      width: "50%",
      alignItems: "center",
      paddingVertical: responsiveScreenHeight(1.3),
      borderRadius: 7,
    },
    timeText: {
      color: Colors.BodyText,
      textAlign: "justify",
    },
    hourContainer: {
      backgroundColor: Colors.ModalBoxColor,
      maxHeight: responsiveScreenHeight(38),
      borderRadius: 7,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    modalContainer: {
      backgroundColor: Colors.White,
      borderRadius: 10,
      padding: 20,
    },
  });

export default CustomTimePicker;
