import {io} from 'socket.io-client';
import environment from '../constants/environment';
import setupSocketListeners from './socketHandler';
import {loadChats} from '../actions/chat-noti';
import store from '../store';
import {setSocketStatus} from '../store/reducer/chatReducer';
import {storage} from './mmkvInstance';

let socketUrl = environment.production
  ? 'https://api.bootcampshub.ai'
  : 'https://staging-api.bootcampshub.ai';
//  let socketUrl =  'http://192.168.242.219:5000'

export let socket;

let cleanUpListeners;

export const connectSocket = async () => {
  const value = storage.getString('user_token');
  const orgJSON = storage.getString('organization');
  let organization = JSON.parse(orgJSON)?._id;

  const proJSON = storage.getString('active_enrolment');
  let enrollment = JSON.parse(proJSON)?._id;

  if (!socket) {
    const options = {
      rememberUpgrade: true,
      transports: ['websocket'],
      secure: true,
      rejectUnauthorized: false,
      query: {
        token: value,
        enrollment,
        organization,
      },
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
