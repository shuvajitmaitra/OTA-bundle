// App.js
import React, {useEffect, useRef} from 'react';
import {
  StatusBar,
  LogBox,
  AppState,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {Provider, useSelector} from 'react-redux';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import store, {persistor} from './src/store';
import {
  connectSocket,
  disconnectSocket,
  socket,
} from './src/utility/socketManager';
import SplashScreen from 'react-native-splash-screen';
import CustomSplashScreen from '../Bootcampshub_Chat/src/screens/SplashScreen.js';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import {AlertProvider} from './src/components/SharedComponent/GlobalAlertContext';
import {MainProvider} from './src/context/MainContext';
import Navigation from './src/navigation/Navigation';

import 'react-native-gesture-handler';
import {setAppLoading} from './src/store/reducer/authReducer';
import {PopoverProvider} from './src/context/PopoverContext.js';
import Toast from 'react-native-toast-message';
import {toastConfig} from './src/constants/ToastConfig.js';

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['fontFamily']);

const originalConsoleError = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  originalConsoleError(...args);
};

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<ReduxLoading />} persistor={persistor}>
        <ThemeProvider>
          <PopoverProvider>
            <AlertProvider>
              <GestureHandlerRootView style={{flex: 1}}>
                <MainProvider>
                  <App />
                  <Toast config={toastConfig} />
                </MainProvider>
              </GestureHandlerRootView>
            </AlertProvider>
          </PopoverProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

const App = () => {
  const Colors = useTheme();
  const appState = useRef(AppState.currentState);
  const {user} = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = React.useState(true);

  // Handle AppState changes to manage socket connections
  useEffect(() => {
    SplashScreen.hide();
    // const subscription = AppState.addEventListener(
    //   'change',
    //   _handleAppStateChange,
    // );
    // store.dispatch(setAppLoading(true));
    // setIsLoading(true);
    return () => {
      disconnectSocket();
      // subscription.remove();
    };
  }, []);

  // const _handleAppStateChange = async nextAppState => {
  //   if (
  //     appState.current.match(/inactive|background/) &&
  //     nextAppState === 'active'
  //   ) {
  //     if (user?._id && !socket?.connected) {
  //       await connectSocket();
  //     } else {
  //       console.log('User not authenticated');
  //     }
  //   }

  //   appState.current = nextAppState;
  // };

  // if (!isLoading) {
  //   return <CustomSplashScreen />;
  // }

  return (
    <BottomSheetModalProvider>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.White}
        barStyle={'dark-content'}
      />
      <View style={{backgroundColor: Colors.White, flex: 1}}>
        <Navigation />
      </View>
    </BottomSheetModalProvider>
  );
};

const ReduxLoading = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    backgroundColor: 'red',
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

export default AppWrapper;
