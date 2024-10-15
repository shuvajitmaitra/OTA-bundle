import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  medias: [],
};

const mediaSlice = createSlice({
  name: 'medias',
  initialState,
  reducers: {
    setMedias: (state, action) => {
      state.medias = action.payload;
    },
  },
});

export const {setMedias} = mediaSlice.actions;

// Export the reducer
export default mediaSlice.reducer;
