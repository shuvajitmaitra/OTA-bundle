import store from '../store';
import {
  initialActivities,
  setActivitiesCount,
} from '../store/reducer/activitiesReducer';
import {
  updateLatestMessage,
  updateMessage,
  updateMyData,
  updateSingleChat,
} from '../store/reducer/chatReducer';
import {updateDeletedMessage, updateEmoji} from '../store/reducer/chatSlice';
import {setCalendar, setMockInterview} from '../store/reducer/dashboardReducer';
import {
  setNotificationCount,
  setNotifications,
} from '../store/reducer/notificationReducer';
import axiosInstance from '../utility/axiosInstance';
import {handleError} from './chat-noti';

// handle read all notifications

export const handleChatFavorite = data => {
  axiosInstance
    .put('/chat/favourite', data)
    .then(res => {
      if (res.data.success) {
        store.dispatch(
          updateMyData({
            field: 'isFavourite',
            value: res.data.member.isFavourite,
            _id: data.chat,
          }),
        ),
          store.dispatch(
            updateSingleChat({
              isFavourite: res.data.member.isFavourite,
            }),
          );
      }
    })
    .catch(err => {
      console.log(err);
    });
};
export const onEmojiClick = (emoji, messageId) => {
  axiosInstance
    .put(`/chat/react/${messageId}`, {symbol: emoji})
    .then(res => {
      console.log('res.data', JSON.stringify(res.data, null, 1));
      // store.dispatch(updateEmoji({data: res.data.message, symbol: emoji}));
      // store.dispatch(
      //   updateLatestMessage({
      //     chatId: res.data.message.chat,
      //     latestMessage: res.data.message,
      //     counter: 1,
      //   }),
      // );
    })
    .catch(err => {
      console.log('error in chat reaction', err);
    });
};
export const handleDelete = id => {
  // setIsDeleting(true);

  axiosInstance
    .delete(`/chat/delete/message/${id}`)
    .then(res => {
      console.log('res.data', JSON.stringify(res.data, null, 1));
      if (res.data.success) {
        store.dispatch(updateDeletedMessage(res.data.message));
        store.dispatch(
          updateLatestMessage({
            chatId: res.data.message.chat,
            latestMessage: {text: ''},
            counter: 1,
          }),
        );
      }
      // handleUpdateMessage(res.data.message);
      // const isItPinned = pinnedMessages?.filter(
      //   (item) => item._id === message._id
      // );
      // if (isItPinned?.length) {
      //   axiosInstance
      //     .patch(`/chat/pin/${message?._id}`)
      //     .then((res) => {
      //       if (res.data.message) {
      //         handleUpdateMessage(res.data.message);
      //       }
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
      // }
      // dispatch(
      //   updateLatestMessage({
      //     chatId: chat?._id,
      //     latestMessage: { text: "" },
      //     counter: 1,
      //   })
      // );
      // setMessageToDelete(null);
    })
    .catch(err => {
      console.log(err);
      // Alert.alert(err?.response?.data?.error || "Error");
    });
};
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
