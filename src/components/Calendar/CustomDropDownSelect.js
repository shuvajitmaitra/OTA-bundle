import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import DownArrowIcon from "../../assets/Icons/DownArrowIcon";
import UpArrowIcon from "../../assets/Icons/UpArrowIcon";
import { useTheme } from "../../context/ThemeContext";
import { StyleSheet } from "react-native";
import CustomFonts from "../../constants/CustomFonts";

const CustomDropDownSelect = ({ options }) => {
  const [clicked, setClicked] = useState(false);
  const [item, setItem] = useState("");
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.design, { borderBottomLeftRadius: clicked ? 0 : 10 }, { borderBottomRightRadius: clicked ? 0 : 10 }]}
        onPress={() => {
          setClicked(!clicked);
        }}
      >
        <Text
          style={{
            paddingVertical: responsiveScreenHeight(0.5),
            color: "rgba(84, 106, 126, 1)",
          }}
        >
          {item == "" ? "Select time" : item}
        </Text>
        {clicked ? <UpArrowIcon /> : <DownArrowIcon />}
      </TouchableOpacity>
      {clicked ? (
        <View
          style={{
            backgroundColor: "rgba(248, 248, 248, 1)",
            borderWidth: 1,
            borderColor: "rgba(0, 0, 0, 0.1)",
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            position: "absolute",
            width: "100%",
            top: responsiveScreenHeight(5.3),
            zIndex: 1,
          }}
        >
          {options.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setItem(item.type);
                setClicked(!clicked);
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: responsiveScreenFontSize(1.5),
                  color: "rgba(0, 0, 0, 0.5)",
                  paddingHorizontal: responsiveScreenWidth(4),
                  paddingVertical: responsiveScreenHeight(1),
                }}
              >
                {item.type}
              </Text>
              <View
                style={{
                  borderBottomWidth: options?.length == index + 1 ? 0 : 0.5,
                  borderBottomColor: "rgba(0, 0, 0, 0.3)",
                }}
              ></View>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const getStyles = (Colors) =>
  StyleSheet.create({
    container: {
      width: responsiveScreenWidth(76),
      paddingVertical: responsiveScreenHeight(1),
    },
    design: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "rgba(0, 0, 0, 0.1)",
      //   borderColor: Colors.borderColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      fontFamily: CustomFonts.Inter_Regular,
      paddingVertical: responsiveScreenHeight(1),
      position: "relative",
    },
  });
export default CustomDropDownSelect;
