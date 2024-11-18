import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import AuthStackScreen from './AuthStackScreen';
import DrawerNavigator from './DrawerNavigator';

const Navigation = () => {
  const {isAuthenticated, user} = useSelector(state => state.auth);
  console.log('isAuthenticated', JSON.stringify(isAuthenticated, null, 1));
  // if (loading) {
  //   return <SplashScreen />;
  // }
  return (
    <NavigationContainer>
      {isAuthenticated && user._id ? <DrawerNavigator /> : <AuthStackScreen />}
    </NavigationContainer>
  );
};

export default Navigation;
