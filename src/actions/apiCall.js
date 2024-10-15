import store from '../store';
import {
  initialActivities,
  setActivitiesCount,
} from '../store/reducer/activitiesReducer';
import {setCalendar, setMockInterview} from '../store/reducer/dashboardReducer';
import {
  setNotificationCount,
  setNotifications,
} from '../store/reducer/notificationReducer';
import axiosInstance from '../utility/axiosInstance';
import {handleError} from './chat-noti';

// handle read all notifications
export const handleReadAllNotification = () => {
  axiosInstance
    .patch('/notification/markreadall', {})
    .then(res => {
      // console.log("res.data", JSON.stringify(res.data, null, 1));
      axiosInstance
        .get('/notification/mynotifications')
        .then(res => {
          store.dispatch(setNotifications(res.data?.notifications));
          store.dispatch(
            setNotificationCount({
              totalCount: res.data.totalCount,
              totalUnread: res.data.totalUnread,
            }),
          );
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};

export const LoadCalenderInfo = () => {
  axiosInstance
    .post('/dashboard/portal', {calendar: {}})
    .then(res => {
      if (res.data.success) {
        store.dispatch(setCalendar(res.data.data.calendar.results));
      }
    })
    .catch(error => {
      handleError(error);
    });
};
export const LoadMockInterviewInfo = () => {
  axiosInstance
    .post('/dashboard/portal', {mockInterview: {}})
    .then(res => {
      if (res.data.success) {
        store.dispatch(setMockInterview(res.data.data.mockInterview.results));
      }
    })
    .catch(error => {
      handleError(error);
    });
};

export const LoadDayToDayActivities = (page, setIsLoading) => {
  setIsLoading(true);
  axiosInstance
    .get(`communication/myshout/day2day?page=${page}&limit=8`)
    .then(res => {
      if (res.data.success) {
        store.dispatch(initialActivities({data: res?.data?.posts, page}));
        store.dispatch(setActivitiesCount(res.data.count));
      }
      setIsLoading(false);
    })
    .catch(error => {
      handleError(error);
      setIsLoading(false);
    });
};
