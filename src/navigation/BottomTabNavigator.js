// src/navigation/BottomTabNavigator.js
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

import HomeStackScreen from './HomeStack';
import ProgramStackScreen from './ProgramStack';
import MyCalenderStackScreen from './MyCalenderStack';
import CommunityStackScreen from './CommunityStack';
import CustomTabBar from './CustomTabBar';

const Tab = createBottomTabNavigator({
  NewChatScreen: {
    screen: 'MessageScreen2',
    navigationOptions: () => {
      return {
        tabBarVisible: false,
      };
    },
  },
});

const getTabBarVisibility = (route, hiddenRoutes = []) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? '';
  return hiddenRoutes.includes(routeName) ? 'none' : 'flex';
};

const BottomTabNavigator = () => {
  return (
    <>
      {/* <PushNotiService /> */}
      <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen
          name="HomeStack"
          component={HomeStackScreen}
          options={({route}) => ({
            tabBarLabel: 'Home',
            tabBarStyle: {
              display: getTabBarVisibility(route, [
                'Details',
                'AnotherHiddenScreen',
              ]),
            },
          })}
        />
        <Tab.Screen
          name="ProgramStack"
          component={ProgramStackScreen}
          options={({route}) => ({
            tabBarLabel: 'Program',
            tabBarStyle: {
              display: getTabBarVisibility(route, ['ProgramDetails']),
            },
          })}
        />
        <Tab.Screen
          name="MyCalenderStack"
          component={MyCalenderStackScreen}
          options={({route}) => ({
            tabBarLabel: 'Calendar',
            tabBarStyle: {
              display: getTabBarVisibility(route, ['CalendarDetails']),
            },
          })}
        />
        <Tab.Screen
          name="CommunityStack"
          component={CommunityStackScreen}
          options={({route}) => ({
            tabBarLabel: 'Community',
            tabBarStyle: {
              display: getTabBarVisibility(route, ['CommunityDetails']),
            },
          })}
        />
      </Tab.Navigator>
    </>
  );
};

export default BottomTabNavigator;
