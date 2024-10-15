import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  interviews: [],
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setInterviews: (state, action) => {
      state.interviews = action.payload;
    },
    updateInterviewAnswer: (state, {payload}) => {
      const {answer, interviewId} = payload;

      const interviewIndex = state.interviews.findIndex(
        item => item._id === interviewId,
      );
      if (interviewIndex !== -1) {
        state.interviews[interviewIndex].submission = [
          ...state.interviews[interviewIndex].submission,
          answer,
        ];
      }
    },
    updateInterviewComments: (state, {payload}) => {
      const {comments, interviewId} = payload;

      const interviewIndex = state.interviews.findIndex(
        item => item._id === interviewId,
      );
      if (interviewIndex !== -1) {
        state.interviews[interviewIndex].submission[0].comments = comments;
      }
    },
  },
});

export const {setInterviews, updateInterviewAnswer, updateInterviewComments} =
  interviewSlice.actions;

// Export the reducer
export default interviewSlice.reducer;
