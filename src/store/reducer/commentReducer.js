import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  comments: [],
  selectedComment: '',
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    setComments: (state, {payload}) => {
      state.comments = payload;
    },
    setSelectedComment: (state, {payload}) => {
      state.selectedComment = payload;
    },
  },
});

export const {setComments, setSelectedComment} = commentSlice.actions;

// Export the reducer
export default commentSlice.reducer;
