import React, {createContext, useContext, useEffect, useState} from 'react';
import axiosInstance, {configureAxiosHeader} from '../utility/axiosInstance';
// import {logout} from '../store/reducer/authReducer';
import store from '../store';
import {logout, setUser} from '../store/reducer/authReducer';
import {connectSocket} from '../utility/socketManager';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {connectSocket} from '../utility/socketManager';

// Create a Context
const MainContext = createContext();

// Create a Provider Component
export const MainProvider = ({children}) => {
  // const [user, setUser] = useState(null); // Example state
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  // const testAsyncStorage = async () => {
  //   try {
  //     await AsyncStorage.setItem('test_key', 'test_value');
  //     const value = await AsyncStorage.getItem('test_key');
  //     console.log(value); // Should log 'test_value'
  //   } catch (e) {
  //     console.error('Error with AsyncStorage', e);
  //   }
  // };

  const handleVerify = async shouldLoad => {
    try {
      await configureAxiosHeader();
      if (shouldLoad) {
        setIsLoading(true);
      }
      axiosInstance
        .post('/user/verify', {})
        .then(async res => {
          console.log(
            'res.data.enrollments main context',
            JSON.stringify(res.data.enrollments, null, 1),
          );
          if (res.data.success) {
            store.dispatch(setUser(res.data.user));
            await connectSocket();
          }
        })
        .catch(err => {
          console.log('Error from app.js', err);
          // console.log(err);
          setIsLoading(false);
          store.dispatch(logout());
        });
    } catch (error) {
      console.log('second');
      console.log({error});
      // Error retrieving data
    }
  };
  useEffect(() => {
    handleVerify();
  }, []);

  const value = {
    handleVerify,
    isLoading,
    allMessages,
    setAllMessages,
  };

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export const useMainContext = () => {
  return useContext(MainContext);
};
