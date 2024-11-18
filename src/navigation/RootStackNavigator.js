// src/navigation/RootStackNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MessageScreen2 from '../screens/Chat/MessageScreen2';
import ThreadScreen from '../screens/Chat/ThreadScreen';
import DrawerNavigator from './DrawerNavigator';
import ChatProfile from '../screens/Chat/ChatProfile';

const RootStack = createStackNavigator();

const RootStackNavigator = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={{headerShown: false}}
      />

      {/* Screens that should NOT show the Bottom Tab Navigator */}
      <RootStack.Screen
        name="MessageScreen2"
        component={MessageScreen2}
        options={{
          headerShown: false, // Show header
          title: 'Messages', // Customize title
        }}
      />
      <RootStack.Screen
        name="ThreadScreen"
        component={ThreadScreen}
        options={{
          headerShown: false,
          title: 'Thread',
        }}
      />

      <RootStack.Screen
        name="ChatProfile"
        component={ChatProfile}
        options={({route, navigation}) => ({
          headerShown: false,
        })}
      />
    </RootStack.Navigator>
  );
};

export default RootStackNavigator;
