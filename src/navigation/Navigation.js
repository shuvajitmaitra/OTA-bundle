import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import AuthStackScreen from './AuthStackScreen';
import RootStackNavigator from './RootStackNavigator';

const Navigation = () => {
  const {isAuthenticated, user} = useSelector(state => state.auth);
  console.log('isAuthenticated', JSON.stringify(user, null, 1));
  // if (loading) {
  //   return <SplashScreen />;
  // }
  return (
    <NavigationContainer>
      {true ? <RootStackNavigator /> : <AuthStackScreen />}
    </NavigationContainer>
  );
};

export default Navigation;
