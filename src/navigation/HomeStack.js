// src/navigation/HomeStack.js
import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import DisplaySettingsScreen from '../screens/DisplaySettings/DisplaySettingsScreen';
import {useTheme} from '../context/ThemeContext';
import Dashboard from '../screens/Main/Dashboard';
import MyProfile from '../screens/Main/MyProfile';
import MyProfileEdit from '../screens/Main/MyProfileEdit';

const HomeStack = createStackNavigator();

const HomeStackScreen = () => {
  const Colors = useTheme(); // Assume this returns an object with color properties

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.White,
        },
        headerTintColor: Colors.BodyText, // Use appropriate color from theme
        headerTitleStyle: {
          fontWeight: 'bold',
          color: Colors.BodyText,
        },
      }}>
      <HomeStack.Screen
        name="Home"
        component={Dashboard}
        options={{
          headerShown: false, // Hide header for Dashboard2
        }}
      />
      <HomeStack.Screen
        name="DisplaySettingsScreen"
        component={DisplaySettingsScreen}
        options={{
          headerShown: false, // Show header for DisplaySettingsScreen
          title: 'Display Settings', // Customize header title
        }}
      />
      <HomeStack.Screen
        name="MyProfile"
        component={MyProfile}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="MyProfileEdit"
        component={MyProfileEdit}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackScreen;
