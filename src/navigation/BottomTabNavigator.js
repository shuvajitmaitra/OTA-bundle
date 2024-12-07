// src/navigation/BottomTabNavigator.js
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStackScreen from './HomeStack';
import CustomTabBar from './CustomTabBar';
import ProgramStackScreen from './ProgramStack';
import MyCalenderStackScreen from './MyCalenderStack';

import CommunityStackScreen from './CommunityStack';
import PushNotiService from '../utility/PushNotiService';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <>
      <PushNotiService />
      <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen
          name="HomeStack"
          component={HomeStackScreen}
          options={{tabBarLabel: 'Home'}}
        />
        <Tab.Screen
          name="ProgramStack"
          component={ProgramStackScreen}
          options={{tabBarLabel: 'Program'}}
        />
        <Tab.Screen
          name="MyCalenderStack"
          component={MyCalenderStackScreen}
          options={{tabBarLabel: 'Program'}}
        />
        <Tab.Screen
          name="CommunityStack"
          component={CommunityStackScreen}
          options={{tabBarLabel: 'Program'}}
        />
      </Tab.Navigator>
    </>
  );
};

export default BottomTabNavigator;
