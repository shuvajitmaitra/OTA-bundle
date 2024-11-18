// src/navigation/DrawerNavigator.js
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import CustomDrawerContent from './CustomDrawerContent'; // Import the custom drawer
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
        options={{drawerLabel: 'Home'}} // Optional: Customize drawer label
      />
      {/* Add more Drawer.Screen entries if needed */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
