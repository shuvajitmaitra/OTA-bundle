import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  selectedMessageScreen: null,
  isThreadOpen: false,
  params: {},
  alert: {visible: false, data: {}},
  commentModalIndex: -1,
  bottomSheetVisible: false,
  messageOptionData: null,
};

const modalSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setSelectedMessageScreen: (state, action) => {
      // console.log('action.payload', JSON.stringify(action.payload, null, 1));
      state.selectedMessageScreen = action.payload;
    },
    setThreadOpen: (state, action) => {
      state.isThreadOpen = action.payload;
    },
    setParams: (state, action) => {
      state.params = action.payload;
    },
    setMessageOptionData: (state, action) => {
      state.messageOptionData = action.payload;
    },
  },
});

// Export actions generated by createSlice
export const {
  setSelectedMessageScreen,
  setThreadOpen,
  setParams,
  setMessageOptionData,
} = modalSlice.actions;

// Export the reducer
export default modalSlice.reducer;
