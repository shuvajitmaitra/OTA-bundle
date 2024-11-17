// src/navigation/DrawerNavigator.js
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import CustomDrawerContent from './CustomDrawerContent'; // Import the custom drawer

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />} // Use custom drawer content
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
