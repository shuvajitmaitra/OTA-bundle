import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {setEnrolled} from './programReducer';
import {storage} from '../../utility/mmkvInstance';

export const logout = createAsyncThunk('auth/logout', async (_, {dispatch}) => {
  dispatch(logoutSuccess());
  dispatch(setEnrolled(''));
  dispatch(setUser({}));
  dispatch(setEnrollment(null));
  dispatch(setMyEnrollments([]));
  dispatch(selectOrganizations([]));
  dispatch(setSelectedOrganization(null));
  storage.clearAll();
});

const initialState = {
  user: {},
  isAuthenticated: false,
  enrollment: null,
  myEnrollments: [],
  organizations: [],
  selectedOrganization: null,
  appLoading: false,
  currentRoute: null,
  navigation: null,
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
    setCurrentRoute: (state, action) => {
      state.currentRoute = action.payload;
    },
    setNavigation: (state, action) => {
      state.navigation = action.payload;
    },
  },
});

export const {
  setNavigation,
  setCurrentRoute,
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
