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
    const org = storage.getString('organization');
    const orgId = org ? {organization: JSON.parse(org)?._id} : {};
    console.log('orgId', JSON.stringify(orgId, null, 1));
    try {
      await configureAxiosHeader();
      if (shouldLoad) {
        setIsLoading(true);
      }
      axiosInstance
        .post('/user/verify', orgId)
        .then(async res => {
          if (res.data.success) {
            await userOrganizationInfo();
            await connectSocket();
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
          }
        })
        .catch(err => {
          console.log('Error from app.js', err);
          // console.log(err);
          setIsLoading(false);
          store.dispatch(logout());
        });
    } catch (error) {
      console.log(
        'error.response.data',
        JSON.stringify(error.response.data, null, 1),
      );
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
