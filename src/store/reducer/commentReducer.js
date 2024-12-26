import {createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../../utility/axiosInstance';

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
    deleteComment: (state, {payload}) => {
      if (payload.parentId) {
        const commentIndex = state.comments.findIndex(
          comment => comment._id === payload.parentId,
        );
        console.log(commentIndex);
        state.comments[commentIndex].replies = state.comments[
          commentIndex
        ].replies.filter(reply => reply._id !== payload._id);
      } else {
        state.comments = state.comments.filter(
          comment => comment._id !== payload._id,
        );
      }
      console.log('state.com ments', JSON.stringify(state.comments, null, 2));
    },
  },
});

export const {
  setComments,
  setSelectedComment,
  setCommentId,
  updateComment,
  deleteComment,
} = commentSlice.actions;

// Export the reducer
export default commentSlice.reducer;
