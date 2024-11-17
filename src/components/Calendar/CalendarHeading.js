import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import PlusCircleIcon from "../../assets/Icons/PlusCircleIcon";
import AddNewEventModal from "./AddNewEventModal";
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import CustomFonts from "../../constants/CustomFonts";

export const CalendarHeading = () => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.title}>My Calendar</Text>
        {/* <TouchableOpacity onPress={() => toggleModal()}>
          <View style={styles.btn}>
            // <PlusCircleIcon />
            <Text style={styles.btnText}>New Event</Text>
          </View>
        </TouchableOpacity> */}
        {modalVisible && <AddNewEventModal toggleModal={toggleModal} modalVisible={modalVisible} setModalVisible={setModalVisible} />}
      </View>
    </View>
  );
};

const getStyles = (Colors) =>
  StyleSheet.create({
    header: {
      width: "100%",
      height: responsiveScreenHeight(12.6), // 50% of Screen height
    },
    headerContent: {
      // marginTop: responsiveScreenHeight(6),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,

      fontFamily: CustomFonts.MEDIUM,
      fontWeight: "500",
    },
    btn: {
      width: responsiveScreenWidth(30),
      height: responsiveScreenHeight(4),
      backgroundColor: "#27AC1F",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: responsiveScreenWidth(4),
      gap: 8,
      borderRadius: responsiveScreenWidth(2),
    },
    btnText: {
      color: "white",
    },
  });
