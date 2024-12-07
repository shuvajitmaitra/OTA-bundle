import React, {createContext, useContext, useState} from 'react';
import axiosInstance, {configureAxiosHeader} from '../utility/axiosInstance';
import store from '../store';
import {
  logout,
  setAppLoading,
  setMyEnrollments,
  setUser,
} from '../store/reducer/authReducer';
import {userOrganizationInfo} from '../actions/apiCall';

const MainContext = createContext();

export const MainProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [allMessages, setAllMessages] = useState([]);

  const handleVerify = async shouldLoad => {
    try {
      await configureAxiosHeader();
      if (shouldLoad) {
        store.dispatch(setAppLoading(true));
        setIsLoading(true);
      }
      axiosInstance
        .post('/user/verify', {})
        .then(async res => {
          if (res.data.success) {
            store.dispatch(setUser(res.data.user));
            store.dispatch(setMyEnrollments(res.data.enrollments));
            await userOrganizationInfo();
          }
          store.dispatch(setAppLoading(false));
        })
        .catch(err => {
          console.log('Error from app.js', err);
          // console.log(err);
          setIsLoading(false);
          store.dispatch(logout());
          store.dispatch(setAppLoading(false));
        });
    } catch (error) {
      console.log(
        'error.response.data',
        JSON.stringify(error.response.data, null, 1),
      );
      store.dispatch(setAppLoading(false));
    }
  };

  const handleVerify2 = async () => {
    try {
      await configureAxiosHeader();
      await axiosInstance
        .post('/user/verify', {})
        .then(async res => {
          if (res.data.success) {
          }
        })
        .catch(err => {
          console.log('Error from app.js', err);
          store.dispatch(logout());
        });
    } catch (error) {
      console.log(
        'error.response.data',
        JSON.stringify(error.response.data, null, 1),
      );
    }
  };

  const value = {
    handleVerify2,
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
