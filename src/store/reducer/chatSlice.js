import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  localMessages: [],
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
  },
});

export const {setLocalMessages, appendLocalMessage} = chatSlice.actions;

// Export the reducer
export default chatSlice.reducer;
