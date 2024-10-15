import React from 'react';
import {StatusBar, StyleSheet, Text} from 'react-native';

import {Provider} from 'react-redux';

import {PersistGate} from 'redux-persist/integration/react';
import store, {persistor} from './src/store';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import {MainProvider} from './src/context/MainContext';
import Router from './src/navigation/Router';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  const Colors = useTheme();

  return (
    <GestureHandlerRootView style={styles.rootContainer}>
      <NavigationContainer>
        <Provider store={store}>
          <PersistGate loading={<Text>Loading</Text>} persistor={persistor}>
            <ThemeProvider>
              <MainProvider>
                <StatusBar
                  translucent={true}
                  backgroundColor={Colors.White}
                  barStyle={'dark-content'}
                />

                <Router />
                {/* <Text>Hello</Text>
                <CommentsIcon /> */}
              </MainProvider>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
});
