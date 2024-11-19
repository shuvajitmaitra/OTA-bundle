// src/navigation/BottomTabNavigator.js
import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import HomeStackScreen from './HomeStack';
import CustomTabBar from './CustomTabBar';
import ProgramStackScreen from './ProgramStack';
import {useMainContext} from '../context/MainContext';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const navigations = useSelector(state => state.navigations);
  const {handleVerify} = useMainContext();
  useEffect(() => {
    handleVerify();
    console.log('handle from dashboard..............');
  }, []);

  return (
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
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
