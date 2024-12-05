import {createSlice} from '@reduxjs/toolkit';
import {generateRandomHexId} from '../../components/HelperFunction';
import moment from 'moment';

const initialState = {
  calendarEvent: [],
  events: [],
  invitations: [],
  event: null,
  holidays: [],
  weekends: [],
  availabilities: [],
  availabilityData: {},
  specificHours: [],
  users: [],
  pickedDate: '',
  filterState: '',
  eventNotification: [],
  monthViewData: [],
  notificationClicked: null,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setNotificationClicked: (state, action) => {
      state.notificationClicked = action.payload;
    },
    setMonthViewData: (state, action) => {
      state.monthViewData = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    updateCalendar: (state, action) => {
      state.calendarEvent = action.payload;
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    setInvitations: (state, action) => {
      state.invitations = action.payload;
    },
    updateInvitations: (state, action) => {
      const {id} = action.payload;
      state.invitations = state.invitations?.filter(item => item._id !== id);
    },

    setSingleEvent: (state, action) => {
      state.event = action.payload;
    },
    setHolidays: (state, action) => {
      state.holidays = action.payload;
    },
    setWeekends: (state, action) => {
      state.weekends = action.payload;
    },
    setAvailabilityData: (state, action) => {
      state.availabilityData = action.payload;
    },
    setSpecificHoursData: (state, action) => {
      const wdayOrder = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      const sortedData = action?.payload
        ?.filter(item => item.type === 'date')
        .sort((a, b) => wdayOrder.indexOf(a.date) - wdayOrder.indexOf(b.date));

      state.specificHours = sortedData;
    },
    setAvailabilities: (state, action) => {
      const wdayOrder = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      const {data} = action.payload;
      const sortedData = data
        ?.filter(
          item => item.wday && wdayOrder.includes(item.wday.toLowerCase()),
        )
        .sort(
          (a, b) =>
            wdayOrder.indexOf(a.wday.toLowerCase()) -
            wdayOrder.indexOf(b.wday.toLowerCase()),
        );
      state.availabilities = sortedData;
    },

    toggleAvailabilitySwitch: (state, action) => {
      const {index} = action.payload;
      if (state.availabilities[index].intervals?.length == 0) {
        state.availabilities[index].intervals = [
          {_id: generateRandomHexId(24), from: '11:00', to: '12:00'},
        ];
      } else {
        state.availabilities[index].intervals = [];
      }
    },

    addIntervals: (state, action) => {
      const {index} = action.payload;
      if (state.availabilities[index].intervals?.length) {
        state.availabilities[index].intervals = [
          ...state.availabilities[index].intervals,
          {_id: generateRandomHexId(24), from: '11:00', to: '12:00'},
        ];
      } else {
        state.availabilities[index].intervals = [];
      }
    },
    updateBulkInterval: (state, action) => {
      const {days, index} = action.payload;
      const intervals = state.availabilities[index].intervals;

      // Create a map for quick lookup of days that are checked
      const checkedDaysMap = days.reduce((acc, item) => {
        if (item.checked) {
          acc[item.day.toLowerCase()] = true;
        }
        return acc;
      }, {});

      state.availabilities = state.availabilities.map(item => {
        // Check if the wday of the availability is in the checkedDaysMap
        if (checkedDaysMap[item.wday.toLowerCase()]) {
          return {...item, intervals};
        }
        return item;
      });
    },
    removeIntervals: (state, action) => {
      const {index, intervalIndex} = action.payload;
      if (state.availabilities[index].intervals?.length) {
        state.availabilities[index].intervals = state.availabilities[
          index
        ].intervals?.filter((_, index) => index !== intervalIndex);
      } else {
        state.availabilities[index].intervals = [];
      }
    },
    updateIntervalsTime: (state, action) => {
      const {index, intervalIndex, time, period} = action.payload;

      if (state?.availabilities[index]?.intervals[intervalIndex]) {
        if (period === 'from') {
          state.availabilities[index].intervals[intervalIndex].from = time;
        }
        if (period === 'to') {
          state.availabilities[index].intervals[intervalIndex].to = time;
        }
      }
    },
    removeSpecificDateAvailability: (state, action) => {
      const {index} = action.payload;

      if (state.specificHours?.length > 0) {
        state.specificHours = state.specificHours?.filter(
          (_, idx) => idx !== index,
        );
      }
    },
    addSpecificInterval: (state, action) => {
      const {data} = action.payload;
      state.specificHours = [...state.specificHours, data];
    },
    setDayViewPickedDate: (state, action) => {
      const {time} = action.payload;
      state.pickedDate = time;
    },
    updatePickedDate: (state, action) => {
      const {day, hour, from, minutes} = action.payload;

      if (!day || typeof hour !== 'number' || hour < 0 || hour > 23) {
        state.pickedDate = '';
      } else if (from == 'month') {
        try {
          const date = new Date(day);
          date.setDate(date.getDate());
          date.setUTCMinutes(minutes);
          date.setUTCHours(hour);
          const result = date.toISOString();
          state.pickedDate = result;
        } catch (error) {
          state.pickedDate = '';
        }
      } else {
        try {
          const date = new Date(day);
          date.setDate(date.getDate() + 1);
          date.setUTCHours(hour);
          const result = date.toISOString();
          const timeZone = new Date().getTimezoneOffset();
          const time = moment(result).add(parseInt(timeZone), 'minutes');
          state.pickedDate = time;
        } catch (error) {
          state.pickedDate = '';
        }
      }
    },
    setFilterState: (state, action) => {
      state.filterState = action.payload;
    },
    setNewEvent: (state, action) => {
      const {event, time} = action.payload;

      const newState = [...state.calendarEvent];
      const newData = event;
      const dataIndex = newState.findIndex(item => item.title === time);

      if (dataIndex !== -1) {
        const updatedDataArray = [...newState[dataIndex].data, newData];

        return {
          ...state,
          calendarEvent: newState.map((item, index) =>
            index === dataIndex ? {...item, data: updatedDataArray} : item,
          ),
        };
      } else {
        const newDateEntry = {
          title: time,
          data: [newData],
        };

        return {
          ...state,
          calendarEvent: [...newState, newDateEntry],
        };
      }
    },
    deleteEvent: (state, action) => {
      const {eventId, time} = action.payload;
      const newState = [...state.calendarEvent];
      const dataIndex = newState.findIndex(item => item.title === time);
      if (dataIndex !== -1) {
        const updatedDataArray = newState[dataIndex].data?.filter(
          item => item._id !== eventId,
        );
        state.calendarEvent[dataIndex].data = updatedDataArray;
      }

      return state;
    },
    setEventNotification: (state, action) => {
      state.eventNotification = action.payload;
    },
  },
});

export const {
  setMonthViewData,
  setEventNotification,
  deleteEvent,
  setNewEvent,
  setFilterState,
  setUsers,
  setInvitations,
  updateInvitations,
  updateCalendar,
  setEvents,
  setSingleEvent,
  setHolidays,
  setWeekends,
  setAvailabilities,
  toggleAvailabilitySwitch,
  addIntervals,
  removeIntervals,
  setAvailabilityData,
  updateIntervalsTime,
  setSpecificHoursData,
  removeSpecificDateAvailability,
  addSpecificInterval,
  updateBulkInterval,
  updatePickedDate,
  setDayViewPickedDate,
  setNotificationClicked,
} = calendarSlice.actions;

// Export the reducer
export default calendarSlice.reducer;
