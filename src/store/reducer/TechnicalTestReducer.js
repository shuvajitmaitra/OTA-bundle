import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  assignments: [],
};

const technicalTestSlice = createSlice({
  name: 'technicalTest',
  initialState,
  reducers: {
    setTechnicalTest: (state, action) => {
      state.assignments = action.payload;
    },
    submitAssignments: (state, action) => {
      const {answer, questionNumber} = action.payload;
      state.assignments[questionNumber].submission = answer;
    },
  },
});

export const {setTechnicalTest, submitAssignments} = technicalTestSlice.actions;

// Export the reducer
export default technicalTestSlice.reducer;
