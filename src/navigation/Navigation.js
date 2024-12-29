import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStackScreen from './AuthStackScreen';
import RootStackNavigator from './RootStackNavigator';
import {storage} from '../utility/mmkvInstance';
import {navigationRef} from './NavigationService';

const Navigation = () => {
  const value = storage.getString('user_token');
  return (
    <NavigationContainer ref={navigationRef}>
      {value ? <RootStackNavigator /> : <AuthStackScreen />}
    </NavigationContainer>
  );
};

export default Navigation;
