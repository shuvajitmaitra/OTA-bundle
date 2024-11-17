import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import SplashScreen from '../screens/SplashScreen';
import AuthStackScreen from './AuthStackScreen';
import DrawerNavigator from './DrawerNavigator';

const Navigation = () => {
  const user = useSelector(state => state.auth.user);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  console.log('user', JSON.stringify(user, null, 1));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchToken() {
      if (user._id) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
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
