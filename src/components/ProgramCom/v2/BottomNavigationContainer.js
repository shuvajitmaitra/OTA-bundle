import { Alert, StyleSheet, Text, View } from "react-native";
import React from "react";
import MyButton from "../../AuthenticationCom/MyButton";
import { useTheme } from "../../../context/ThemeContext";
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";

const BottomNavigationContainer = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        {/* <MyButton
          onPress={() => Alert.alert("Coming soon...")}
          // onPress={toggleStartTestModal}
          title={"Quiz"}
          fontSize={responsiveScreenFontSize(1.8)}
          height={responsiveScreenHeight(5)}
          bg={Colors.Primary}
          colour={Colors.PureWhite}
          flex={0.2}
        />
        <MyButton
          onPress={() => Alert.alert("Coming soon...")}
          // onPress={toggleStartTestModal}
          title={"Quiz Result"}
          fontSize={responsiveScreenFontSize(1.8)}
          height={responsiveScreenHeight(5)}
          bg={Colors.Primary}
          colour={Colors.PureWhite}
          flex={0.4}
        /> */}
        <MyButton
          onPress={() =>
            navigation.navigate("ProgramStack", {
              screen: "TechnicalTestScreen",
            })
          }
          title={"Technical Test"}
          fontSize={responsiveScreenFontSize(1.8)}
          height={responsiveScreenHeight(4)}
          bg={Colors.Primary}
          colour={Colors.PureWhite}
          flex={0.4}
        />
        <MyButton
          onPress={() =>
            navigation.navigate("ProgramStack", { screen: "MockInterview" })
          }
          // onPress={toggleStartTestModal}
          title={"Mock Interview"}
          fontSize={responsiveScreenFontSize(1.8)}
          height={responsiveScreenHeight(4)}
          bg={Colors.Primary}
          colour={Colors.PureWhite}
          flex={0.4}
        />
      </View>
      {/* <MyButton
        onPress={() =>
          navigation.navigate("HomeStack", { screen: "MockInterview" })
        }
        // onPress={toggleStartTestModal}
        title={"Mock Interview"}
        fontSize={responsiveScreenFontSize(1.8)}
        height={responsiveScreenHeight(5)}
        bg={Colors.Primary}
        colour={Colors.PureWhite}
      /> */}
    </View>
  );
};

export default BottomNavigationContainer;

const getStyles = (Colors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: responsiveScreenWidth(2),
      marginBottom: responsiveScreenHeight(1),
    },
    mainContainer: {
      marginHorizontal: responsiveScreenWidth(2),
      alignItems: "center",
    },
  });
