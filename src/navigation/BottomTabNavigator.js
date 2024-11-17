// src/navigation/BottomTabNavigator.js
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import HomeStackScreen from './HomeStack';
import CustomTabBar from './CustomTabBar';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const navigations = useSelector(state => state.navigations);

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStackScreen}
        options={{tabBarLabel: 'Home'}} // Optional: Customize tab label
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
