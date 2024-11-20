import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  comments: [],
  selectedComment: '',
  commentId: '',
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
    setCommentId: (state, {payload}) => {
      state.commentId = payload;
    },
  },
});

export const {setComments, setSelectedComment, setCommentId} =
  commentSlice.actions;

// Export the reducer
export default commentSlice.reducer;
