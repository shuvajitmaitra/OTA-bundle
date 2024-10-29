import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  localMessages: [],
  crowdMembers: [],
  pinnedMessages: [],
};

const chatSlice = createSlice({
  name: 'chatSlice',
  initialState,
  reducers: {
    setLocalMessages: (state, action) => {
      state.localMessages = action.payload;
    },
    appendLocalMessage: (state, action) => {
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
    // updateMyChat: ({localMessages}, action) => {
    //   const {_id, field, value} = action.payload;

    //   console.log('_id', JSON.stringify(_id, null, 1));
    //   console.log('field', JSON.stringify(field, null, 1));
    //   console.log('value', JSON.stringify(value, null, 1));
    //   console.log('localMessages', JSON.stringify(localMessages, null, 1));
    //   const chatIndex = localMessages.findIndex(x => x?._id === _id);
    //   console.log('chatIndex', JSON.stringify(chatIndex, null, 1));
    //   if (chatIndex !== -1) {
    //     localMessages[chatIndex].myData = {
    //       ...localMessages[chatIndex].myData,
    //       [field]: value,
    //     };
    //   } else {
    //     console.log('it is -1');
    //   }
    // },
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
  },
});

export const {
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
