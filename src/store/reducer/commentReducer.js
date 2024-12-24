import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  comments: [],
  selectedComment: null,
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
    updateComment: (state, {payload}) => {
      const {commentId, data} = payload;
      const commentIndex = state.comments.findIndex(
        comment => comment._id === commentId,
      );

      state.comments[commentIndex] = {...state.comments[commentIndex], ...data};
    },
  },
});

export const {setComments, setSelectedComment, setCommentId, updateComment} =
  commentSlice.actions;

// Export the reducer
export default commentSlice.reducer;
