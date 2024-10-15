import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  programs: {},
  programActive: null,
  enrolled: '',
};

const programSlice = createSlice({
  name: 'program',
  initialState,
  reducers: {
    setPrograms: (state, action) => {
      state.programs = action.payload;
    },
    setProgramActive: (state, action) => {
      state.programActive = action.payload;
    },
    setEnrolled: (state, action) => {
      state.enrolled = action.payload;
    },
  },
});

export const {setPrograms, setProgramActive, setEnrolled} =
  programSlice.actions;

// Export the reducer
export default programSlice.reducer;
