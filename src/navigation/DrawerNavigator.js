// src/navigation/DrawerNavigator.js
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import {DrawerContent} from '../screens/DrawerContent';
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />} // Use custom drawer content
      screenOptions={{
        headerShown: false,
        gestureEnabled: true, // Ensure gestures are enabled
      }}>
      <Drawer.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={{drawerLabel: 'Home'}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
