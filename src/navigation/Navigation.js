import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import SplashScreen from '../screens/SplashScreen';
import AuthStackScreen from './AuthStackScreen';
import DrawerNavigator from './DrawerNavigator';
import BottomTabNavigator from './BottomTabNavigator';

const Navigation = () => {
  const {isAuthenticated} = useSelector(state => state.auth);
  const user = useSelector(state => state.auth.user);

  const [hasToken, setHasToken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchToken() {
      if (user._id) {
        setHasToken(true);
      } else {
        setHasToken(false);
      }
      setLoading(false);
    }

    fetchToken();
  }, [isAuthenticated, user._id]);

  if (loading) {
    return <SplashScreen />;
  }
  return (
    <NavigationContainer>
      {isAuthenticated ? <DrawerNavigator /> : <AuthStackScreen />}
    </NavigationContainer>
  );
};

export default Navigation;
