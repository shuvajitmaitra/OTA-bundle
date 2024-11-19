import React, {createContext, useContext, useEffect, useState} from 'react';
import axiosInstance, {configureAxiosHeader} from '../utility/axiosInstance';
import store from '../store';
import {
  logout,
  setEnrollment,
  setMyEnrollments,
  setUser,
} from '../store/reducer/authReducer';
import {connectSocket} from '../utility/socketManager';
import {userOrganizationInfo} from '../actions/apiCall';
import {loadNotifications} from '../actions/chat-noti';
import {storage} from '../utility/mmkvInstance';
import {activeProgram} from '../utility/mmkvHelpers';

const MainContext = createContext();

export const MainProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [allMessages, setAllMessages] = useState([]);

  const handleVerify = async shouldLoad => {
    try {
      await configureAxiosHeader();
      if (shouldLoad) {
        setIsLoading(true);
      }
      axiosInstance
        .post('/user/verify', {
          organization: JSON.parse(storage.getString('organization'))?._id,
        })
        .then(async res => {
          if (res.data.success) {
            store.dispatch(setUser(res.data.user));
            store.dispatch(setMyEnrollments(res.data.enrollments));
            if (res.data.enrollments.length === 1) {
              store.dispatch(setEnrollment(res.data.enrollments[0]));
              activeProgram({
                _id: res.data.enrollments[0]._id,
                programName: res.data.enrollments[0].program.title,
              });
            }
            loadNotifications();

            await connectSocket();
            await userOrganizationInfo();
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
    console.log('rerender handleVerify');
    handleVerify();
    return () => {
      store.dispatch(logout());
    };
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
