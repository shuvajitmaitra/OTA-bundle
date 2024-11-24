import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {setEnrolled} from './programReducer';

export const logout = createAsyncThunk('auth/logout', async (_, {dispatch}) => {
  dispatch(logoutSuccess());
  dispatch(setEnrolled(''));
  dispatch(setUser({}));
  dispatch(setEnrollment(null));
  dispatch(setMyEnrollments([]));
  dispatch(selectOrganizations([]));
  dispatch(setSelectedOrganization(null));
});

const initialState = {
  user: {},
  isAuthenticated: false,
  enrollment: null,
  myEnrollments: [],
  organizations: [],
  selectedOrganization: null,
  appLoading: false,
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
    setAppLoading: (state, action) => {
      state.appLoading = action.payload;
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
    selectOrganizations: (state, {payload}) => {
      state.organizations = payload;
    },
    setSelectedOrganization: (state, {payload}) => {
      state.selectedOrganization = payload;
    },
  },
});

export const {
  setAppLoading,
  setSelectedOrganization,
  selectOrganizations,
  setUser,
  updateUser,
  setEnrollment,
  setMyEnrollments,
  logoutSuccess,
} = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
