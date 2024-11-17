import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";

import GreenDotSvgComponent from "../assets/Icons/GreenDotSvgComponent";
import OrangeDotSvgComponent from "../assets/Icons/OrangeDotSvgComponent";
import RedDotSvgComponent from "../assets/Icons/RedDotSvgComponent";
import BlueDotSvgComponent from "../assets/Icons/BlueDotSvgComponent";
import GreenLightSvgComponent from "../assets/Icons/GreenLightSvgComponent";
import PurpleLightSvgComponent from "../assets/Icons/PurpleLightSvgComponent";
import { useTheme } from "../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { setFilterState, updateCalendar } from "../store/reducer/calendarReducer";
import moment from "moment";
import ColorDot from "./SharedComponent/ColorDot";
import CustomFonts from "../constants/CustomFonts";

const DotComponent = () => {
  const { events } = useSelector((state) => state.calendar);
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [status, setStatus] = useState("");

  const handleButtonPress = (status) => {
    dispatch(setFilterState(status));
    setStatus(status);
    const filteredEvents = events?.filter((item) => item.status === status);
    const formattedEvents = filteredEvents.map((e) => ({
      title: moment(e.start).format("YYYY-M-D"),
      data: { ...e },
    }));

    const groupedEvents = [
      ...formattedEvents
        .reduce((map, { title, data }) => {
          if (!map.has(title)) map.set(title, { title, data: [] });
          map.get(title).data.push(data);
          return map;
        }, new Map())
        .values(),
    ];

    dispatch(updateCalendar(groupedEvents));
  };

  return (
    <>
      <View style={styles.dotContainer}>
        <View
          // onPress={() => handleButtonPress("accepted")}
          style={styles.dot}
        >
          <ColorDot background={"#629dcc"} />
          <Text style={[styles.text]}>Show N Tell</Text>
        </View>
        <View
          // onPress={() => handleButtonPress("pending")}
          style={styles.dot}
        >
          <ColorDot background={"#f59f9f"} />
          <Text style={[styles.text]}>Mock Interview</Text>
        </View>
        <View
          // onPress={() => handleButtonPress("proposedNewTime")}
          style={styles.dot}
        >
          <ColorDot background={"#379793"} />
          <Text style={[styles.text]}>Orientation Meeting</Text>
        </View>
        <View
          // onPress={() => handleButtonPress("denied")}
          style={styles.dot}
        >
          <ColorDot background={"#ff6502"} />
          <Text style={[styles.text]}>Sync up call</Text>
        </View>
        <View
          // onPress={() => handleButtonPress("finished")}
          style={styles.dot}
        >
          <ColorDot background={"#f8a579"} />
          <Text style={[styles.text]}>Technical Interview</Text>
        </View>
        <View
          // onPress={() => handleButtonPress("finished")}
          style={styles.dot}
        >
          <ColorDot background={"#0091b9"} />
          <Text style={[styles.text]}>Behavioral Interview</Text>
        </View>
        <View
          // onPress={() => handleButtonPress("finished")}
          style={styles.dot}
        >
          <ColorDot background={"#7ccc84"} />
          <Text style={[styles.text]}>Review Meeting</Text>
        </View>
        <View
          // onPress={() => handleButtonPress("finished")}
          style={styles.dot}
        >
          <ColorDot background={Colors.OthersColor} />
          <Text style={[styles.text]}>Others</Text>
        </View>
      </View>
      {/* <View style={styles.dotCon}>
      </View> */}
    </>
  );
};

export default DotComponent;

const getStyles = (Colors) =>
  StyleSheet.create({
    text: {
      color: Colors.BodyText,
      // textDecorationLine: "underline",
      fontFamily: CustomFonts.REGULAR,
    },
    dotContainer: {
      flexDirection: "row",
      alignItems: "center",
      // justifyContent: "space-between",
      gap: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(1),
      flexWrap: "wrap",
      backgroundColor: Colors.White,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      paddingBottom: 10,
    },
    dotCon: {
      flexDirection: "row",
      alignItems: "center",
      gap: responsiveScreenWidth(11),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(1),
    },
    dot: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
  });
