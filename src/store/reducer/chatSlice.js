import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  localMessages: [],
  crowdMembers: [],
  pinnedMessages: [],
  threadMessages: [],
};

const chatSlice = createSlice({
  name: 'chatSlice',
  initialState,
  reducers: {
    setLocalMessages: (state, action) => {
      state.localMessages = action.payload;
    },
    appendLocalMessage: (state, action) => {
      if (action.payload.chat !== state.localMessages[0].chat) {
        return;
      }
      state.localMessages = [action.payload, ...state.localMessages];
    },
    setCrowdMembers: (state, action) => {
      state.crowdMembers = action.payload;
    },
    setPinnedMessages: (state, action) => {
      state.pinnedMessages = action.payload;
    },
    updatePinnedMessage: ({localMessages}, {payload}) => {
      const messageIndex = localMessages.findIndex(
        item => item._id === payload._id,
      );
      console.log('messageIndex', JSON.stringify(messageIndex, null, 1));

      if (messageIndex !== -1) {
        localMessages[messageIndex] = {
          ...localMessages[messageIndex],
          ...payload,
        };
      }
    },
    updateDeletedMessage: ({localMessages}, {payload}) => {
      const messageIndex = localMessages.findIndex(
        item => item._id === payload._id,
      );
      console.log('messageIndex', JSON.stringify(messageIndex, null, 1));

      if (messageIndex !== -1) {
        localMessages[messageIndex] = {
          ...localMessages[messageIndex],
          ...payload,
        };
      }
    },
    updateMessage: ({localMessages}, {payload}) => {
      const messageIndex = localMessages.findIndex(
        item => item._id === payload._id,
      );
      if (messageIndex !== 1) {
        localMessages[messageIndex] = {
          ...localMessages[messageIndex],
          ...payload,
        };
      }
    },
    setThreadMessages: (state, {payload}) => {
      state.threadMessages = payload;
    },
    addThreadMessages: (state, {payload}) => {
      if (payload.chat !== state.threadMessages[0].chat) {
        return;
      }
      state.threadMessages = [payload, ...state.threadMessages];
    },
  },
});

export const {
  setThreadMessages,
  addThreadMessages,
  // updateMyChat,
  updateMessage,
  updateDeletedMessage,
  setLocalMessages,
  appendLocalMessage,
  setCrowdMembers,
  setPinnedMessages,
  updatePinnedMessage,
} = chatSlice.actions;

// Export the reducer
export default chatSlice.reducer;
