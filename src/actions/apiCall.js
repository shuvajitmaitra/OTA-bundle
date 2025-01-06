import {showToast} from '../components/HelperFunction';
import store from '../store';
import {
  initialActivities,
  setActivitiesCount,
} from '../store/reducer/activitiesReducer';
import {selectOrganizations, setNavigation} from '../store/reducer/authReducer';
import {
  updateChatsArchive,
  updateFavoriteSingleChat,
  updateLatestMessage,
  updateMyData,
  updateSingleChatArchive,
  updateSingleChatMemberCount,
} from '../store/reducer/chatReducer';
import {
  setCrowdMembers,
  setSelectedMembers,
  updateDeletedMessage,
  updateThreadMessage,
} from '../store/reducer/chatSlice';
import {setCalendar, setMockInterview} from '../store/reducer/dashboardReducer';
import {
  setNotificationCount,
  setNotifications,
} from '../store/reducer/notificationReducer';
import axiosInstance from '../utility/axiosInstance';
// import {setOrganization} from '../utility/mmkvHelpers';
import {handleError} from './chat-noti';

export const userOrganizationInfo = async () => {
  await axiosInstance
    .get('/organization/user-organizations')
    .then(res => {
      store.dispatch(selectOrganizations(res.data.organizations));
      // if (res.data.organizations.length === 1) {
      //   // setOrganization(res.data.organizations[0]);
      //   // store.dispatch(setSelectedOrganization(res.data.organizations[0]));
      // }
    })
    .catch(error => {
      console.log(
        'error to get organization data',
        JSON.stringify(error.response.data, null, 1),
      );
    });
};
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
            updateFavoriteSingleChat({
              isFavourite: res.data.member.isFavourite,
            }),
          );
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export const fetchMembers = chatId => {
  axiosInstance
    .post(`/chat/members/${chatId}`)
    .then(res => {
      store.dispatch(setCrowdMembers(res.data.results));
      // console.log(
      //   'res.data.results',
      //   JSON.stringify(res.data.results, null, 1),
      // );
    })
    .catch(error => {
      console.log(
        'getting error to fetch member',
        JSON.stringify(error, null, 1),
      );
    });
};

export const handleUpdateMember = actionData => {
  // {
  //   member: item?._id,
  //   chat: item?.chat,
  //   actionType: 'block',
  // }
  axiosInstance
    .post('/chat/member/update', actionData)
    .then(res => {
      if (res.data?.success) {
        showToast({message: 'action successfully...'});
        fetchMembers(actionData.chat);
        //   console.log("item", item);
        store.dispatch(setSelectedMembers({}));
      }
    })
    .catch(error => {
      console.log('error', JSON.stringify(error.response.data, null, 1));
    });
};

export const handleArchive = async data => {
  console.log('Data passed to handleArchive:', JSON.stringify(data, null, 1));
  await axiosInstance
    .patch(`/chat/channel/archive/${data.chatId}`, {
      isArchived: data.archived,
    })
    .then(res => {
      if (res.data.success) {
        store.dispatch(
          updateChatsArchive({
            _id: data.chatId,
            field: 'isArchived',
            value: data.archived,
          }),
        );
        store.dispatch(updateSingleChatArchive({isArchived: data.archived}));
      }
    })
    .catch(error => {
      console.log('Error archiving chat:', JSON.stringify(error, null, 1));
    });
};

export const handleRemoveUser = (chatId, memberId) => {
  axiosInstance
    .patch(`/chat/channel/remove-user/${chatId}`, {
      member: memberId,
    })
    .then(res => {
      if (res.data?.success) {
        fetchMembers(chatId);
        store.dispatch(setSelectedMembers({}));
        store.dispatch(updateSingleChatMemberCount('remove'));
        // dispatch(
        //   updateMembersCount({
        //     _id: chat._id,
        //     membersCount: chat.membersCount - 1,
        //   })
        // );
      }
    })
    .catch(error => {
      console.log('🚀 ~ handleRemoveUser ~ error', error.response.data);
    });
};
export const onEmojiClick = (emoji, messageId) => {
  axiosInstance
    .put(`/chat/react/${messageId}`, {symbol: emoji})
    .then(res => {
      // console.log('res.data', JSON.stringify(res.data, null, 1));
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
      if (res.data.success) {
        if (!res.data.message.parentMessage) {
          store.dispatch(updateDeletedMessage(res.data.message));
          store.dispatch(
            updateLatestMessage({
              chatId: res.data.message.chat,
              latestMessage: {text: ''},
              counter: 1,
            }),
          );
        } else {
          store.dispatch(updateThreadMessage(res.data.message));
        }
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
    .then(response => {
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
export const fetchOnlineUsers = async () => {
  try {
    const response = await axiosInstance.get('user/online');
    const {data} = response;
    if (!data || !data.users) {
      console.error('Error fetching online users: invalid response');
      return;
    }
    // store.dispatch(setOnlineUsers(data.users));
  } catch (error) {
    console.error('Error fetching online users:', error);
  }
};

export const getMyNavigation = () => {
  axiosInstance
    .get('/navigation/mynavigations')
    .then(res => {
      console.log('res.data', JSON.stringify(res.data, null, 2));
      store.dispatch(setNavigation(res.data.navigation?.navigations));
      // store.dispatch(setNavigation(res.data.navigation));
    })
    .catch(err => {
      console.log(err);
    });
};
