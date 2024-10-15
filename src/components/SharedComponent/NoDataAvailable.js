import {View} from 'react-native';
import React from 'react';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import NoDataIcon from '../../assets/Icons/NotDataIcon';
// import {useTheme} from '../../context/ThemeContext';

const NoDataAvailable = ({height}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  // const Colors = useTheme();
  const containerHeight =
    responsiveScreenHeight(height) || responsiveScreenHeight(30);
  return (
    <View
      style={{
        minHeight: containerHeight,
        minWidth: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: Colors.LightGreen,
        borderRadius: 10,
        marginBottom: responsiveScreenHeight(2),
      }}>
      <NoDataIcon />
    </View>
  );
};

export default NoDataAvailable;
// import { View, Text, ImageBackground } from "react-native";
// import React from "react";
// import { responsiveScreenHeight } from "react-native-responsive-dimensions";
// import NoDataIcon from "../../assets/Icons/NotDataIcon";
// import { useTheme } from "../../context/ThemeContext";
// import Images from "../../constants/Images";

// const NoDataAvailable = ({
//   height,
//   text = "Go to the link of all the posts given in Ts4u group and like, comment and share.",
// }) => {
//   // --------------------------
//   // ----------- Import theme Colors -----------
//   // --------------------------
//   const Colors = useTheme();
//   const containerHeight =
//     responsiveScreenHeight(height) || responsiveScreenHeight(30);

//   return (
//     <View
//       style={{
//         minHeight: containerHeight,
//         minWidth: "100%",
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: Colors.LightGreen,
//         borderRadius: 10,
//         marginBottom: responsiveScreenHeight(2),
//       }}
//     >
//       <ImageBackground
//         style={{
//           width: 100,
//           height: 200,
//           // marginBottom: ,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//         source={Images.NO_DATA_BACKGROUND}
//         resizeMode="contain"
//       >
//         <Text
//           style={{
//             color: "white",
//             fontWeight: 600,
//             marginTop: -20,
//           }}
//         >
//           {text}
//         </Text>
//       </ImageBackground>
//       {/* <NoDataIcon />} */}
//     </View>
//   );
// };

// export default NoDataAvailable;
