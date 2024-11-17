import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {setEnrolled} from './programReducer';

export const logout = createAsyncThunk('auth/logout', async (_, {dispatch}) => {
  dispatch(logoutSuccess());
  dispatch(setEnrolled(''));
  dispatch(setUser({}));
});

const initialState = {
  user: {},
  isAuthenticated: false,
  enrollment: null,
  myEnrollments: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateUser: (state, action) => {
      state.user = {...state.user, ...action.payload};
    },
    setEnrollment: (state, action) => {
      state.enrollment = action.payload;
    },
    setMyEnrollments: (state, action) => {
      state.myEnrollments = action.payload;
    },
    logoutSuccess: state => {
      state.user = {};
      state.isAuthenticated = false;
    },
  },
});

export const {
  setUser,
  updateUser,
  setEnrollment,
  setMyEnrollments,
  logoutSuccess,
} = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
