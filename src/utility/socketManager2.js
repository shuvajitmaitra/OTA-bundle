// src/utility/socketManager.js

import {io} from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../store'; // Assuming you're using Redux or any state management
import {setSocketStatus} from '../store/reducer/chatReducer'; // Action to set socket status

// Define the socket URL based on environment
const socketUrl = __DEV__
  ? 'https://staging-api.bootcampshub.ai' // Staging URL
  : 'https://production-api.bootcampshub.ai'; // Production URL

let socket = null;

// Function to connect to the socket
export const connectSocket = async () => {
  try {
    console.log('[SocketManager] Attempting to connect to socket...');

    // Retrieve token from AsyncStorage
    const token = await AsyncStorage.getItem('user_token');

    if (!token) {
      console.log('[SocketManager] No user token found. Connection aborted.');
      return;
    }

    console.log('[SocketManager] Token retrieved. Establishing connection...');

    // Configure socket connection options
    const options = {
      transports: ['websocket'], // Use WebSocket transport
      secure: true, // Ensure the connection is secure
      auth: {token}, // Pass the token using auth
      // Conditionally set rejectUnauthorized based on environment
      ...(process.env.NODE_ENV !== 'production' && {rejectUnauthorized: false}),
    };

    // Initialize socket connection if not already connected
    if (!socket) {
      socket = io(socketUrl, options);
      console.log('[SocketManager] Socket instance created:', socket);
    }

    // Handle socket connection event
    socket.on('connect', () => {
      console.log('[SocketManager] Socket connected');
      store.dispatch(setSocketStatus(true)); // Update Redux store
    });

    // Handle socket disconnection event
    socket.on('disconnect', reason => {
      console.log(`[SocketManager] Socket disconnected: ${reason}`);
      store.dispatch(setSocketStatus(false)); // Update Redux store
    });

    // Handle socket connection errors
    socket.on('connect_error', error => {
      console.error('[SocketManager] Connection Error:', error.message);
      store.dispatch(setSocketStatus(false)); // Update Redux store
    });

    // Handle custom events like receiving messages
    socket.on('new_message', message => {
      console.log('[SocketManager] New message received:', message);
      // You can dispatch actions or handle the message as needed
      // Example: store.dispatch(addNewMessage(message));
    });
  } catch (error) {
    console.error('[SocketManager] Error connecting to the socket:', error);
  }
};

// Function to disconnect the socket
export const disconnectSocket = () => {
  if (socket) {
    console.log('[SocketManager] Disconnecting socket...');

    // Remove all event listeners
    socket.off('connect');
    socket.off('disconnect');
    socket.off('connect_error');
    socket.off('new_message');

    // Disconnect the socket
    socket.disconnect();
    socket = null; // Reset the socket instance

    console.log('[SocketManager] Socket disconnected and listeners removed.');
  } else {
    console.log('[SocketManager] No active socket connection to disconnect.');
  }
};

// Optional: Function to emit events
export const emitEvent = (event, data, callback) => {
  if (socket && socket.connected) {
    socket.emit(event, data, callback);
    console.log(`[SocketManager] Emitted event '${event}' with data:`, data);
  } else {
    console.warn(
      `[SocketManager] Cannot emit event '${event}'. Socket is not connected.`,
    );
  }
};
