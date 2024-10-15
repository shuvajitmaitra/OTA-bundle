import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import AuthStackScreen from './AuthStackScreen';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {useSelector} from 'react-redux';
import CloseIcon from '../assets/Icons/CloseIcon';
import {useMainContext} from '../context/MainContext';
import ChatStackScreen from './ChatStack';
import store from '../store';
import {logout} from '../store/reducer/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const signOut = async () => {
  await AsyncStorage.removeItem('user_token');
  store.dispatch(logout());
};

const Router = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {handleVerify} = useMainContext();
  const {user} = useSelector(state => state.auth);
  useEffect(() => {
    if (user._id) {
      // console.log('..........................');
      setIsAuthenticated(true);
      handleVerify();
    } else {
      setIsAuthenticated(false);
    }
  }, [handleVerify, user._id]);

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
function DrawerScreen() {
  return (
    <Drawer.Navigator
      screenOptions={{drawerPosition: 'left', headerShown: false}}
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: '#fff',
        width: 240,
      }}>
      {/* <Drawer.Screen name="NewChatScreen" component={NewChatScreen} /> */}
      <Drawer.Screen
        name="ChatStackScreen"
        component={ChatStackScreen}
        headerShown={false}
      />
      {/* <Drawer.Screen name="HomeScreen" component={HomeScreen} /> */}
    </Drawer.Navigator>
  );
}
// Custom Drawer Content
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        icon={({color, size}) => <CloseIcon />}
        label="Toggle Drawer"
        onPress={() => props.navigation.toggleDrawer()}
      />
      <DrawerItem
        // icon={({color, size}) => }
        label="Logout"
        onPress={() => signOut()}
      />
      {/* Add more custom drawer items here */}
    </DrawerContentScrollView>
  );
}
