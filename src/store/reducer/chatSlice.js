import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  localMessages: [],
  crowdMembers: [],
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
  },
});

export const {setLocalMessages, appendLocalMessage, setCrowdMembers} =
  chatSlice.actions;

// Export the reducer
export default chatSlice.reducer;
