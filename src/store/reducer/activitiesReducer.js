import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  activities: [],
  activitiesCount: 0,
};

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    initialActivities: (state, {payload}) => {
      const {data, page} = payload;
      if (page == 1) {
        state.activities = data;
      } else {
        state.activities = [...state.activities, ...data];
      }
    },
    setActivitiesCount: (state, {payload}) => {
      state.activitiesCount = payload;
    },
  },
});

export const {initialActivities, setActivitiesCount} = activitiesSlice.actions;

// Export the reducer
export default activitiesSlice.reducer;
