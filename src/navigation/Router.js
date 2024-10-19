import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import AuthStackScreen from './AuthStackScreen';
import ChatStackScreen from './ChatStack';
import {logout} from '../store/reducer/authReducer';
import CloseIcon from '../assets/Icons/CloseIcon';
import SignOutIcon from '../assets/Icons/SignOutIcon';
import {useMainContext} from '../context/MainContext';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const CustomDrawerContent = ({navigation}) => {
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('user_token');
      dispatch(logout());
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <DrawerContentScrollView
      contentContainerStyle={{flex: 1, justifyContent: 'space-between'}}>
      <DrawerItem
        icon={({color, size}) => <CloseIcon color={color} size={size} />}
        label="Toggle Drawer"
        onPress={() => navigation.toggleDrawer()}
        labelStyle={{marginLeft: responsiveScreenWidth(-5)}}
      />
      <DrawerItem
        icon={({color, size}) => <SignOutIcon color={color} size={size} />}
        label="Logout"
        onPress={handleSignOut}
        labelStyle={{
          color: 'red',
          fontSize: 18,
          marginLeft: responsiveScreenWidth(-5),
        }}
      />
    </DrawerContentScrollView>
  );
};

const DrawerScreen = () => (
  <Drawer.Navigator
    screenOptions={{
      drawerPosition: 'left',
      headerShown: false,
      drawerStyle: {
        backgroundColor: '#fff',
        width: 240,
      },
    }}
    drawerContent={CustomDrawerContent}>
    <Drawer.Screen
      name="Chat"
      component={ChatStackScreen}
      options={{headerShown: false}}
    />
  </Drawer.Navigator>
);

const Router = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {handleVerify} = useMainContext();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (user && user._id) {
      setIsAuthenticated(true);
      handleVerify();
    } else {
      setIsAuthenticated(false);
    }
  }, [user._id]);

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <Stack.Screen
          name="App"
          component={DrawerScreen}
          options={{headerShown: false}}
        />
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthStackScreen}
          options={{headerShown: false}}
        />
      )}
    </Stack.Navigator>
  );
};

export default Router;
