import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import CustomHeader from "./CustomHeader";
import color from "../constants/color";
import Colors from "../constants/Colors";
import MockInterview from "../screens/MockInterview/MockInterview";
const MockInterviewStack = createStackNavigator();

const MockInterviewStackScreen = ({ navigation }) => (
  <MockInterviewStack.Navigator
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
    {/* <MockInterviewStack.Screen
      name="MockInterview"
      component={MockInterview}
      options={{
        headerTitle: (props) => (
          <CustomHeader navigation={navigation} {...props} />
        ),
      }}
    /> */}
    {/* <MockInterviewStack.Screen
      name="InterviewQuestion"
      component={InterviewQuestionsScreen}
      options={{
        title: "Interview Questions",
        headerLeft: () => (
          <Icon.Button
            name="chevron-back-outline"
            size={25}
            backgroundColor={color.primary}
            onPress={() => navigation.pop()}
          ></Icon.Button>
        ),
      }}
    />
    <MockInterviewStack.Screen
      name="InterviewShare"
      component={InterviewShareScreen}
      options={{
        title: "Interview Share",
        headerLeft: () => (
          <Icon.Button
            name="chevron-back-outline"
            size={25}
            backgroundColor={color.primary}
            onPress={() => navigation.pop()}
          ></Icon.Button>
        ),
      }}
    /> */}
  </MockInterviewStack.Navigator>
);

export default MockInterviewStackScreen;
