// src/navigation/DrawerNavigator.js
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import CustomDrawerContent from './CustomDrawerContent'; // Import the custom drawer
import {DrawerContent} from '../screens/DrawerContent';
import MessageScreen2 from '../screens/Chat/MessageScreen2';
import ThreadScreen from '../screens/Chat/ThreadScreen';
import CreateNewUser from '../components/ChatCom/CreateNewUser';
import ChatProfile from '../screens/Chat/ChatProfile';

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
      <Drawer.Screen
        name="MessageScreen2"
        component={MessageScreen2}
        options={{drawerLabel: 'Home'}} // Optional: Customize drawer label
      />
      <Drawer.Screen
        name="ThreadScreen"
        component={ThreadScreen}
        options={({route, navigation}) => ({
          headerShown: false,
        })}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
