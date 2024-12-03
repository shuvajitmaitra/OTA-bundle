import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStackScreen from './AuthStackScreen';
import RootStackNavigator from './RootStackNavigator';
import {storage} from '../utility/mmkvInstance';

const Navigation = () => {
  const value = storage.getString('user_token');
  return (
    <NavigationContainer>
      {value ? <RootStackNavigator /> : <AuthStackScreen />}
    </NavigationContainer>
  );
};

export default Navigation;
