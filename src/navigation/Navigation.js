import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import AuthStackScreen from './AuthStackScreen';
import RootStackNavigator from './RootStackNavigator';
import SplashScreen from '../screens/SplashScreen';

const Navigation = () => {
  const {user, appLoading} = useSelector(state => state.auth);

  // if (appLoading) {
  //   return <SplashScreen />;
  // }
  return (
    <NavigationContainer>
      {user._id ? <RootStackNavigator /> : <AuthStackScreen />}
    </NavigationContainer>
  );
};

export default Navigation;
