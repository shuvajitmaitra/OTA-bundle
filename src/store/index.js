import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './reducer/combineReducer';
import {persistStore, persistReducer} from 'redux-persist';
// import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['modal'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

let persistor = persistStore(store);
export default store;
export {persistor};

//  ,
//  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
