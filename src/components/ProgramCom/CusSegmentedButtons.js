// import { StyleSheet, Text, View } from "react-native";
// import React from "react";
// import { SegmentedButtons } from "react-native-paper";

// import {
//   responsiveScreenWidth,
//   responsiveScreenFontSize,
//   responsiveScreenHeight,
// } from "react-native-responsive-dimensions";

// import CustomFonts from "../../constants/CustomFonts";
// import { useTheme } from "../../context/ThemeContext";

// export default function CusSegmentedButtons({ value, setValue }) {
//   // --------------------------
//   // ----------- Import theme Colors -----------
//   // --------------------------
//   const Colors = useTheme();
//   const styles = getStyles(Colors);
//   return (
//     <SegmentedButtons
//       value={value}
//       onValueChange={setValue}
//       multiSelect={false}
//       buttons={[
//         {
//           value: "Module",
//           label: "Module",
//           checkedColor: Colors.White,
//           uncheckedColor: Colors.Primary,
//           labelStyle: {
//             fontSize: responsiveScreenFontSize(1.6),
//             fontFamily: CustomFonts.SEMI_BOLD,
//             position: "relative",
//             width: responsiveScreenWidth(15),
//           },
//           style: {
//             backgroundColor:
//               value === "Module" ? Colors.Primary : Colors.LightGreen,
//             borderWidth: 0,
//             borderTopRightRadius: 20,
//             borderBottomRightRadius: 20,
//             minWidth: "17%",
//           },
//         },
//         {
//           value: "Workshop",
//           label: "Workshop",
//           labelStyle: {
//             fontSize: responsiveScreenFontSize(1.6),
//             fontFamily: CustomFonts.SEMI_BOLD,
//             position: "relative",
//             width: responsiveScreenWidth(19),
//           },
//           checkedColor: Colors.White,
//           uncheckedColor: Colors.Primary,
//           style: {
//             backgroundColor:
//               value === "Workshop" ? Colors.Primary : Colors.LightGreen,
//             borderWidth: 0,
//             borderRadius: 20,
//             minWidth: "21%",
//           },
//         },
//         {
//           value: "Interview",
//           label: "Interview",
//           checkedColor: Colors.White,
//           uncheckedColor: Colors.Primary,
//           labelStyle: {
//             fontSize: responsiveScreenFontSize(1.6),
//             fontFamily: CustomFonts.SEMI_BOLD,
//             position: "relative",
//             width: responsiveScreenWidth(19),
//           },
//           style: {
//             backgroundColor:
//               value === "Interview" ? Colors.Primary : Colors.LightGreen,
//             borderWidth: 0,
//             borderRadius: 20,
//             minWidth: "20%",
//           },
//         },
//         {
//           value: "Lab",
//           label: "Lab & Show",
//           checkedColor: Colors.White,
//           uncheckedColor: Colors.Primary,
//           labelStyle: {
//             fontSize: responsiveScreenFontSize(1.6),
//             fontFamily: CustomFonts.SEMI_BOLD,
//             position: "relative",
//             width: responsiveScreenWidth(23),
//           },
//           style: {
//             backgroundColor:
//               value === "Lab" ? Colors.Primary : Colors.LightGreen,
//             borderWidth: 0,
//             borderTopRightRadius: 20,
//             borderBottomRightRadius: 20,
//             borderTopLeftRadius: 20,
//             borderBottomLeftRadius: 20,
//             minWidth: "26%",
//           },
//         },
//       ]}
//       style={styles.segmentedButton}
//     />
//   );
// }

// const getStyles = (Colors) =>
//   StyleSheet.create({
//     segmentedButton: {
//       width: responsiveScreenWidth(95),
//       alignSelf: "center",
//       marginTop: responsiveScreenHeight(2),
//       backgroundColor: Colors.LightGreen,
//       borderRadius: 20,
//     },
//   });
