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
    addReplies: (state, {payload}) => {
      const commentIndex = state.comments.findIndex(
        comment => comment._id === payload.parentId,
      );
      state.comments[commentIndex].replies = [
        ...state.comments[commentIndex].replies,
        payload,
      ];
    },
    setSelectedComment: (state, {payload}) => {
      state.selectedComment = payload;
    },
    setCommentId: (state, {payload}) => {
      state.commentId = payload;
    },
    updateComment: (state, {payload}) => {
      const {commentId, data} = payload;
      if (data.parentId) {
        const commentIndex = state.comments.findIndex(
          comment => comment._id === data.parentId,
        );

        const repliesIndex = state.comments[commentIndex].replies.findIndex(
          reply => reply._id === data._id,
        );
        console.log('commentIndex', JSON.stringify(commentIndex, null, 2));
        console.log('repliesIndex', JSON.stringify(repliesIndex, null, 2));

        state.comments[commentIndex].replies[repliesIndex] = {
          ...state.comments[commentIndex].replies[repliesIndex],
          ...data,
        };
      } else {
        const commentIndex = state.comments.findIndex(
          comment => comment._id === commentId,
        );
        state.comments[commentIndex] = {
          ...state.comments[commentIndex],
          ...data,
        };
      }
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
    },
  },
});

export const {
  addReplies,
  setComments,
  setSelectedComment,
  setCommentId,
  updateComment,
  deleteComment,
} = commentSlice.actions;

// Export the reducer
export default commentSlice.reducer;
