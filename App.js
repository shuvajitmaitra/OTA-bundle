// App.js
import React, {useEffect, useRef, createContext} from 'react';
import {
  StatusBar,
  LogBox,
  AppState,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import store, {persistor} from './src/store';
import {connectSocket, disconnectSocket} from './src/utility/socketManager';

import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import {AlertProvider} from './src/components/SharedComponent/GlobalAlertContext';
import {MainProvider} from './src/context/MainContext';
import Navigation from './src/navigation/Navigation';

import 'react-native-gesture-handler';

// Suppress specific warning logs
LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['fontFamily']);

// Override console.error to ignore specific warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  originalConsoleError(...args);
};

export const MainContext = createContext();

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <ThemeProvider>
          <AlertProvider>
            <GestureHandlerRootView style={{flex: 1}}>
              <MainProvider>
                <App />
              </MainProvider>
            </GestureHandlerRootView>
          </AlertProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

const App = () => {
  const Colors = useTheme();
  const appState = useRef(AppState.currentState);
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = React.useState(true);
  const [handleShowSwitchModal, setHandleShowSwitchModal] =
    React.useState(false);

  // Handle AppState changes to manage socket connections
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
      if (user?._id) {
        await connectSocket();
      } else {
        console.log('User not authenticated');
      }
    }

    appState.current = nextAppState;
  };

  // Check for active enrollment
  const getActive = async () => {
    try {
      const activeE = await AsyncStorage.getItem('active_enrolment');

      if (!activeE) {
        console.log('No active enrollment found');
        setHandleShowSwitchModal(true);
      }
    } catch (error) {
      console.error('Error fetching active enrollment:', error);
    }
  };

  // Verify user authentication
  // const handleVerify = async () => {
  //   try {
  //     await configureAxiosHeader();
  //     axiosInstance
  //       .post('/user/verify', {})
  //       .then(async res => {
  //         console.log('res.data', JSON.stringify(res.data, null, 1));
  //         if (res.status === 200 && res.data.success) {
  //           dispatch(setUser(res.data.user));
  //           dispatch(setMyEnrollments(res.data.enrollments));
  //           await userOrganizationInfo();
  //           await connectSocket();
  //           loadCalendarEvent();
  //           loadNotifications();
  //           loadProgramInfo();
  //           await getActive();
  //           setIsLoading(false);
  //         } else {
  //           throw new Error('Verification failed');
  //         }
  //       })
  //       .catch(err => {
  //         console.log(
  //           'Error during verification:',
  //           err.response?.data || err.message,
  //         );
  //         dispatch(logout());
  //         setIsLoading(false);
  //       });
  //   } catch (error) {
  //     console.log('Unexpected error during verification:', error);
  //     dispatch(logout());
  //     setIsLoading(false);
  //   }
  // };

  // // Initial verification on app launch
  // useEffect(() => {
  //   handleVerify();
  //   return () => {
  //     disconnectSocket();
  //   };
  // }, []);

  if (!isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <BottomSheetModalProvider>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.White}
        barStyle={'dark-content'}
      />
      <Navigation />
    </BottomSheetModalProvider>
  );
};

const SplashScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  loadingText: {marginTop: 10, fontSize: 16, color: '#555'},
});

export default AppWrapper;
