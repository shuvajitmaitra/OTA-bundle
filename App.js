import React, {useEffect, useState, useRef, createContext} from 'react';
import {StatusBar, LogBox, AppState, Text} from 'react-native';
import {Provider} from 'react-redux';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

// import Route from './src/navigation/Route';
import {
  loadCalendarEvent,
  loadNotifications,
  loadProgramInfo,
} from './src/actions/chat-noti';
import {PersistGate} from 'redux-persist/integration/react';
// import {getMyNavigations} from './src/actions/generalActions';

import 'react-native-gesture-handler';
import axiosInstance, {configureAxiosHeader} from './src/utility/axiosInstance';
import {connectSocket, disconnectSocket} from './src/utility/socketManager';
import {
  logout,
  setMyEnrollments,
  setUser,
} from './src/store/reducer/authReducer';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import SplashScreen from './src/screens/SplashScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AlertProvider} from './src/components/SharedComponent/GlobalAlertContext';
import CustomeRightHeader from './src/components/ProgramCom/CustomeRightHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store, {persistor} from './src/store';
import {MainProvider} from './src/context/MainContext';
import Navigation from './src/navigation/Navigation';

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['fontFamily']);
const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};
export const MainContext = createContext();

const App = () => {
  const Colors = useTheme();
  const appState = useRef(AppState.currentState);
  const [isLoading, setIsLoading] = useState(false);
  const [handleShowSwitchModal, setHandleShowSwitchModal] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      _handleAppStateChange,
    );

    return () => {
      disconnectSocket();
      subscription.remove();
    };
  }, []);

  const _handleAppStateChange = async nextAppState => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (store.getState().auth.user?._id) {
        // handleVerify(false);
        await connectSocket();
      } else {
        console.log('not called');
      }
    }

    appState.current = nextAppState;
    //setAppStateVisible(appState.current);
    //console.log('AppState', appState.current);
  };

  const getActive = async () => {
    let activeE = await AsyncStorage.getItem('active_enrolment');

    if (!activeE) {
      console.log('Not active');
      setHandleShowSwitchModal(true);
    }
  };

  const handleVerify = async shouldLoad => {
    try {
      await configureAxiosHeader();
      if (shouldLoad) {
        setIsLoading(true);
      }
      axiosInstance
        .post('/user/verify', {})
        .then(async res => {
          // return  store.dispatch(logout())
          if (res.status === 200 && res.data.success) {
            store.dispatch(setUser(res.data.user));
            store.dispatch(setMyEnrollments(res.data.enrollments));
            setEnrollments(res.data.enrollments);
            await connectSocket();
            // loadChats();
            loadCalendarEvent();
            loadNotifications();
            // getMyNavigations();
            loadProgramInfo();
            //store.dispatch(getMyNavigations())
            //do some change state
            getActive();
            setIsLoading(false);
          }
        })
        .catch(err => {
          console.log('Error from app.js', err);
          console.log(err);
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
    return () => {
      disconnectSocket();
    };
  }, []);

  if (isLoading) {
    return (
      <Provider store={store}>
        <SplashScreen />
      </Provider>
    );
  }

  return (
    <MainProvider>
      <Provider store={store}>
        <PersistGate loading={<Text>Loading</Text>} persistor={persistor}>
          <ThemeProvider>
            <AlertProvider>
              <GestureHandlerRootView style={{flex: 1}}>
                <BottomSheetModalProvider>
                  <StatusBar
                    translucent={true}
                    backgroundColor={Colors.White}
                    barStyle={'dark-content'}
                  />
                  {/* <Route /> */}
                  <Navigation />
                  <CustomeRightHeader
                    setModalOutside={handleShowSwitchModal}
                    CustomButton={() => <></>}
                  />
                </BottomSheetModalProvider>
              </GestureHandlerRootView>
            </AlertProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </MainProvider>
  );
};

export default App;
