import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  dashboardData: {},
  pieData: [],
  progressData: [],
  calendar: {},
  mockInterview: {},
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
    setPieData: (state, action) => {
      state.pieData = action.payload;
    },
    setProgressData: (state, action) => {
      state.progressData = action.payload;
    },
    setCalendar: (state, action) => {
      state.calendar = action.payload;
    },
    setMockInterview: (state, action) => {
      state.mockInterview = action.payload;
    },
  },
});

export const {
  setDashboardData,
  setPieData,
  setProgressData,
  setCalendar,
  setMockInterview,
} = dashboardSlice.actions;

// Export the reducer
export default dashboardSlice.reducer;
