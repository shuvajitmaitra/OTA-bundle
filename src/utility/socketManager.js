import {io} from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import environment from '../constants/environment';
import setupSocketListeners from './socketHandler';
import {loadChats} from '../actions/chat-noti';
import store from '../store';
import {setSocketStatus} from '../store/reducer/chatReducer';

let socketUrl = environment.production
  ? 'https://api.bootcampshub.ai'
  : 'https://staging-api.bootcampshub.ai';
//  let socketUrl =  'http://192.168.242.219:5000'

export let socket;

let cleanUpListeners;

export const connectSocket = async () => {
  const value = await AsyncStorage.getItem('user_token');

  if (!socket) {
    const options = {
      rememberUpgrade: true,
      transports: ['websocket'],
      secure: true,
      rejectUnauthorized: false,
      query: {token: value},
    };
    socket = io(socketUrl, options);
  }

  socket.on('connect', data => {
    console.log('connected');
    if (!socket?.connected) {
      console.log('Socket not Connected');
      store.dispatch(setSocketStatus(false));
    } else {
      // console.log('Socket connected');
      store.dispatch(setSocketStatus(true));
      loadChats();
      cleanUpListeners = setupSocketListeners(socket);
    }
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    if (cleanUpListeners && typeof cleanUpListeners === 'function') {
      console.log('Cleaning up socket listeners');

      cleanUpListeners();
    }
    socket.disconnect();
    socket = null;
  }
};
