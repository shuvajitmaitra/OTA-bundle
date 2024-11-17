import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import { Feather } from "@expo/vector-icons";
import { Popover, usePopover } from "react-native-modal-popover";
import { RadioButton } from "react-native-paper";
import CrossIcon from "../../assets/Icons/CrossIcon";
import CustomFonts from "../../constants/CustomFonts";
import ThreeDotPopUp from "./ThreeDotPopUp";
import { useTheme } from "../../context/ThemeContext";
import GlobalRadioGroup from "../../components/SharedComponent/GlobalRadioButton";

export default function SearchAndFilter({ handleFilter }) {
  const handleRadioChange = (newValue) => {
    setValue(newValue);
    Alert.alert("Selected filter: " + newValue);
  };
  const { openPopover, closePopover, popoverVisible, touchableRef, popoverAnchorRect } = usePopover();
  const Colors = useTheme();
  const SearchAndFilterStyles = getStyles(Colors);

  const [value, setValue] = React.useState("Focused");
  const itemList = [
    { label: "Focused", value: "Focused" },
    { label: "Pinned", value: "Pinned" },
    { label: "Newly Uploaded", value: "Newly Uploaded" },
    { label: "Complete", value: "Complete" },
    { label: "Incomplete", value: "Incomplete" },
  ];

  return (
    <View style={SearchAndFilterStyles.topContainer}>
      <View style={SearchAndFilterStyles.inputField}>
        <TextInput
          keyboardAppearance={Colors.Background_color === "#F5F5F5" ? "light" : "dark"}
          style={SearchAndFilterStyles.textInput}
          placeholder="Search..."
          placeholderTextColor={Colors.BodyText}
          onChangeText={handleFilter}
        />
        <Feather style={SearchAndFilterStyles.inputFieldIcon} name="search" />
      </View>

      <TouchableOpacity ref={touchableRef} onPress={openPopover} activeOpacity={0.8} style={SearchAndFilterStyles.filterButton}>
        <Feather name="filter" size={24} color={Colors.PureWhite} style={SearchAndFilterStyles.filterButtonIcon} />
        <Text style={SearchAndFilterStyles.filterButtonText}>Filters</Text>
      </TouchableOpacity>

      <Popover
        contentStyle={SearchAndFilterStyles.popupContent}
        arrowStyle={SearchAndFilterStyles.popupArrow}
        backgroundStyle={{ backgroundColor: Colors.BackDropColor }}
        visible={popoverVisible}
        onClose={closePopover}
        fromRect={popoverAnchorRect}
        placement="bottom"
        supportedOrientations={["portrait", "landscape"]}
      >
        <View style={SearchAndFilterStyles.container}>
          {/* -------------------------- */}
          {/* ----------- Heading Text ----------- */}
          {/* -------------------------- */}
          <View style={SearchAndFilterStyles.headerContainer}>
            <Text style={SearchAndFilterStyles.headerText}>Filters</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={closePopover}>
              <View style={SearchAndFilterStyles.cancelButton}>
                <CrossIcon />
              </View>
            </TouchableOpacity>
          </View>
          {/* -------------------------- */}
          {/* ----------- Radio button ----------- */}
          {/* -------------------------- */}
          <GlobalRadioGroup options={itemList} onSelect={handleRadioChange} selectedValue={value} />
          {/* <RadioButton.Group
            onValueChange={(newValue) => {
              setValue(newValue);
              Alert.alert("Working on it...");
            }}
            value={value}
          >
            {itemList.map((item, index) => (
              <>
                <View style={[SearchAndFilterStyles.radioButton]}>
                  <RadioButton
                    value={item?.topic}
                    color="#27ac1f"
                    uncheckedColor="rgba(0, 0, 0, 0.2)"
                  />
                  <Text
                    style={[
                      SearchAndFilterStyles.radioText,
                      {
                        color:
                          value === `${item?.topic}`
                            ? "black"
                            : "rgba(0, 0, 0, 0.6)",
                        fontFamily: CustomFonts.REGULAR,
                      },
                    ]}
                  >
                    {item?.topic}
                  </Text>
                  {index == itemList?.length - 1 ? null : (
                    <View
                      style={{
                        marginVertical: responsiveScreenHeight(0.5),
                        width: responsiveScreenWidth(58),
                        height: 1,
                        backgroundColor: "rgba(0, 0, 0, 0.10)",
                        position: "absolute",
                        top: responsiveScreenHeight(3.5),
                        left: responsiveScreenWidth(-4),
                      }}
                    ></View>
                  )}
                </View>
              </>
            ))}
          </RadioButton.Group> */}
          {/* <GlobalRadioGroup value={value} onChange={handleRadioChange}>
            {itemList.map((item, index) => (
              <View key={index} style={SearchAndFilterStyles.radioButton}>
                <RadioButton
                  value={item.topic}
                  color="#27ac1f"
                  uncheckedColor="rgba(0, 0, 0, 0.2)"
                />
                <Text
                  style={[
                    SearchAndFilterStyles.radioText,
                    {
                      color: value === item.topic ? "black" : "rgba(0, 0, 0, 0.6)",
                      fontFamily: CustomFonts.REGULAR,
                    },
                  ]}
                >
                  {item.topic}
                </Text>
                {index < itemList.length - 1 && (
                  <View
                    style={{
                      marginVertical: responsiveScreenHeight(0.5),
                      width: responsiveScreenWidth(58),
                      height: 1,
                      backgroundColor: "rgba(0, 0, 0, 0.10)",
                      position: "absolute",
                      top: responsiveScreenHeight(3.5),
                      left: responsiveScreenWidth(-4),
                    }}
                  />
                )}
              </View>
            ))}
          </GlobalRadioGroup> */}
        </View>
      </Popover>
    </View>
  );
}

const getStyles = (Colors) =>
  StyleSheet.create({
    // --------------------------
    // ----------- Radio Button -----------
    // --------------------------
    radioButton: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    buttonGroup: {
      marginHorizontal: responsiveScreenWidth(-1),
    },
    radioText: {
      fontSize: responsiveScreenFontSize(1.8),
    },
    // --------------------------
    // ----------- Header of the popup -----------
    // --------------------------
    headerText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Black,
    },
    cancelButton: {
      backgroundColor: "#D0D0D0",
      padding: responsiveScreenWidth(2),
      borderRadius: 100,
      justifyContent: "center",
      alignItems: "center",
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: responsiveScreenHeight(1),
    },
    topContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: responsiveScreenWidth(2.2),
      alignItems: "center",
    },

    filterButton: {
      flexDirection: "row",
      backgroundColor: "#27ac1f",
      alignItems: "center",
      gap: responsiveScreenWidth(2.6),
      paddingVertical: responsiveScreenWidth(2.6),
      paddingHorizontal: responsiveScreenWidth(4),
      borderRadius: responsiveScreenWidth(1.5),
    },
    inputField: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: Colors.ScreenBoxColor,
      padding: responsiveScreenWidth(1.5),
      paddingHorizontal: responsiveScreenWidth(3.3),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      flex: 1,
      borderRadius: responsiveScreenWidth(2),
    },
    inputFieldIcon: {
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.BodyText,
    },
    textInput: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.6),
      flex: 1,
    },
    filterButtonIcon: {
      fontSize: responsiveScreenFontSize(2),
      color: Colors.White,
    },
    filterButtonText: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.PureWhite,
    },
    threeDotIcon: {
      paddingHorizontal: responsiveScreenWidth(1),
    },
    buttonText: {
      fontSize: responsiveScreenFontSize(2),
      color: "#666",
    },
    iconAndTextContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: responsiveScreenWidth(3),
    },
    buttonContainer: {
      paddingVertical: responsiveScreenHeight(1.5),
      paddingHorizontal: responsiveScreenWidth(1.5),
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
    },
    // --------------------------
    // ----------- Popup Modal container -----------
    // --------------------------
    popupContent: {
      padding: 16,
      backgroundColor: Colors.White,
      borderRadius: 8,
      minWidth: responsiveScreenWidth(50),
      minHeight: responsiveScreenHeight(19),
      top: responsiveScreenHeight(-4),
    },
    popupArrow: {
      borderTopColor: Colors.White,
      marginTop: responsiveScreenHeight(-4),
    },
    container: {
      // paddingVertical: responsiveScreenHeight(2),
      // paddingHorizontal: responsiveScreenWidth(2),
      minWidth: responsiveScreenWidth(50),
    },
  });
