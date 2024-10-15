import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  showNTell: [],
};

const showNTellSlice = createSlice({
  name: 'showNTell',
  initialState,
  reducers: {
    setShowNTell: (state, action) => {
      state.showNTell = action.payload;
    },

    setUpdateShowNTell: (state, action) => {
      state.showNTell = [action.payload, ...state.showNTell] || [];
    },
  },
});

export const {setShowNTell, setUpdateShowNTell} = showNTellSlice.actions;

// Export the reducer
export default showNTellSlice.reducer;
