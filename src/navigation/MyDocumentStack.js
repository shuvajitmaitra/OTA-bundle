import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CustomHeader from "./CustomHeader";
import MyDocumentScreen from "../screens/MyDocumentScreen";
import DocumentDetailsScreen from "../screens/DocumentDetailsScreen";
import Icon from "react-native-vector-icons/Ionicons";
import color from "../constants/color";
import Colors from "../constants/Colors";
const MyDocumentStack = createStackNavigator();

const MyDocumentStackScreen = ({ navigation }) => (
  <MyDocumentStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: Colors.White,
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}
  >
    <MyDocumentStack.Screen
      name="MyDocument"
      component={MyDocumentScreen}
      options={{
        headerTitle: (props) => (
          <CustomHeader navigation={navigation} {...props} />
        ),
      }}
    />
    <MyDocumentStack.Screen
      name="DocumentDetails"
      component={DocumentDetailsScreen}
      options={{
        title: "Document Details",
        headerTitleStyle: { color: "black" },
        headerLeft: () => (
          <Icon.Button
            color={color.primary}
            name="chevron-back-outline"
            size={25}
            backgroundColor={Colors.White}
            onPress={() => navigation.pop()}
          ></Icon.Button>
        ),
      }}
    />
  </MyDocumentStack.Navigator>
);

export default MyDocumentStackScreen;
