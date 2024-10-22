import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './reducer/combineReducer';
import {persistStore, persistReducer} from 'redux-persist';
import mmkvStorage from '../utility/mmkvStorage';
const persistConfig = {
  key: 'root',
  storage: mmkvStorage,
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
