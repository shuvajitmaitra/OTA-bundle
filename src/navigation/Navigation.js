import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import AuthStackScreen from './AuthStackScreen';
import RootStackNavigator from './RootStackNavigator';

const Navigation = () => {
  const {isAuthenticated, user} = useSelector(state => state.auth);
  // if (loading) {
  //   return <SplashScreen />;
  // }
  return (
    <NavigationContainer>
      {user._id ? <RootStackNavigator /> : <AuthStackScreen />}
    </NavigationContainer>
  );
};

export default Navigation;
