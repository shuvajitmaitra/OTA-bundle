import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import CalendarScreen from "../screens/Calendar/CalendarScreen";
import Header from "../components/SharedComponent/Header";

const MyCalenderStack = createStackNavigator();

const MyCalenderStackScreen = ({ navigation }) => (
  <MyCalenderStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "white",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}
  >
    <MyCalenderStack.Screen
      name="CalendarScreen"
      component={CalendarScreen}
      options={({ route, navigation }) => ({
        headerTitle: "",
        headerShown: false,
        // header: () => <Header navigation={navigation} />,
      })}
    />
  </MyCalenderStack.Navigator>
);

export default MyCalenderStackScreen;
