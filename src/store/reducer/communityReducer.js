import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  emptyPosts: false,
  isLoading: false,
  totalPost: null,
  singlePost: null,
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setCommunityPosts: (state, action) => {
      if (action.payload.length == 0) {
        state.posts = action.payload;
      } else {
        state.posts = [...(state.posts || []), ...action.payload];
      }
    },
    setEmptyPost: (state, action) => {
      state.emptyPosts = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setTotalPost: (state, action) => {
      state.totalPost = action.payload;
    },
    setReactions: (state, {payload}) => {
      const {_id: postId, reactionsCount, myReaction, reactions} = payload;

      const postIndex = state.posts.findIndex(post => post._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].reactionsCount = reactionsCount;
        state.posts[postIndex].reactions = reactions;

        state.posts[postIndex].myReaction = myReaction;
      }
    },
    setQueryPosts: (state, {payload}) => {
      state.posts = payload;
    },
    setReported: ({posts}, {payload}) => {
      const postIndex = posts.findIndex(post => post._id === payload.post);
      if (postIndex !== -1) {
        posts[postIndex].isReported = false;
      }
    },
    setCommentCount: ({posts}, {payload}) => {
      const {contentId, action} = payload;
      const postIndex = posts.findIndex(post => post._id === contentId);
      if (postIndex !== -1) {
        if (action === 'add') {
          posts[postIndex].commentsCount += 1;
        } else {
          posts[postIndex].commentsCount -= 1;
        }
      }
    },
    setSavePost: ({posts}, {payload}) => {
      const postIndex = posts.findIndex(post => post._id === payload._id);

      if (postIndex !== -1) {
        posts[postIndex].isSaved = !posts[postIndex].isSaved;
      }
    },
    setSinglePost: (state, {payload}) => {
      state.singlePost = payload;
    },
  },
});

export const {
  setSinglePost,
  setSavePost,
  setCommentCount,
  setCommunityPosts,
  setEmptyPost,
  setIsLoading,
  setTotalPost,
  setReactions,
  setQueryPosts,
  setReported,
} = communitySlice.actions;

// Export the reducer
export default communitySlice.reducer;
