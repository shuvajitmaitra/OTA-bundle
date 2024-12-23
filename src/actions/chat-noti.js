import store from '../store';
import axiosInstance from '../utility/axiosInstance';
import {setNotificationCount} from '../store/reducer/notificationReducer';
import moment from 'moment';
import {
  setEventNotification,
  setEvents,
  setFilterState,
  setHolidays,
  setInvitations,
  setMonthViewData,
  setSingleEvent,
  setUsers,
  setWeekends,
  updateCalendar,
} from '../store/reducer/calendarReducer';
import {
  setCommentCount,
  setCommunityPosts,
  setIsLoading,
  setQueryPosts,
  setReactions,
  setTotalPost,
} from '../store/reducer/communityReducer';
import {setComments} from '../store/reducer/commentReducer';
import {setPrograms} from '../store/reducer/programReducer';
import {setChats, setGroupNameId} from '../store/reducer/chatReducer';

export const loadChats = async () => {
  console.log('loadChats called');

  await axiosInstance
    .get(
      '/chat/mychats',
      //   , {
      //   headers: {
      //     'Cache-Control': 'no-store, no-cache, must-revalidate',
      //     Pragma: 'no-cache',
      //     Expires: '0',
      //   },
      //   params: {
      //     channel: 'ws',
      //   },
      // }
    )
    .then(res => {
      store.dispatch(setChats(res.data.chats));
      // console.log('res.data.chats', JSON.stringify(res.data.chats, null, 1));
      store.dispatch(setGroupNameId(res.data.chats));
      let totalUnread = res.data.chats?.filter(
        chat =>
          !chat?.myData?.isRead &&
          chat?.myData?.user !== chat?.latestMessage?.sender?._id,
      )?.length;
      // await Notifications.setBadgeCountAsync(totalUnread || 0);
    })
    .catch(err => {
      // console.log(err);
      console.log('err to get initial get', JSON.stringify(err, null, 2));
    });
};

export const loadCalendarEvent = async () => {
  await axiosInstance
    .get('/calendar/event/myevents')
    .then(res => {
      store.dispatch(setEvents(res.data.events || []));
      store.dispatch(setFilterState(''));

      let temp = [...res.data.events];
      let array = temp.map(e => ({
        title: moment(e.start).format('YYYY-M-D'),
        data: {...e},
      }));

      var result = [
        ...array
          .reduce((c, {title, data}) => {
            if (!c.has(title)) c.set(title, {title, data: []});
            c.get(title).data.push(data);
            return c;
          }, new Map())
          .values(),
      ];

      const monthViewData = result.reduce((acc, item) => {
        acc[item.title] = item;
        return acc;
      }, {});
      store.dispatch(setMonthViewData(monthViewData));
      store.dispatch(updateCalendar(result));
    })
    .catch(err => {
      console.log(err);
    });
};
export const loadEventInvitation = () => {
  axiosInstance
    .get('/calendar/event/myevents')
    .then(res => {
      const invitation = res?.data?.events?.filter(
        item => item?.myParticipantData?.status == 'pending',
      );
      store.dispatch(setInvitations(invitation || []));
    })
    .catch(err => {
      console.log(err);
    });
};

export const loadHolidays = () => {
  axiosInstance
    .get('/calendar/config/type/holiday')
    .then(res => {
      // console.log("res.data", JSON.stringify(res.data, null, 1));
      store.dispatch(setHolidays(res.data.holidays));
    })
    .catch(err => {
      console.log(err);
    });
};
export const loadWeekends = () => {
  axiosInstance
    .get('/calendar/config/type/weekend')
    .then(res => {
      // console.log("res.data", JSON.stringify(res.data, null, 1));
      store.dispatch(setWeekends(res.data.holidays));
    })
    .catch(err => {
      console.log(err);
    });
};
export const loadNotifications = async () => {
  await axiosInstance
    .get(`/notification/mynotifications?limit=1&page=1`)
    .then(res => {
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
};
export const loadInitialNotifications = () => {
  axiosInstance
    .get(`/notification/mynotifications?limit=1&page=1`)
    .then(res => {
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
};
export const loadUsers = inputText => {
  axiosInstance
    .post('/user/filter', {
      query: inputText,
      global: true,
    })
    .then(res => {
      store.dispatch(setUsers(res.data.users));
    })
    .catch(err => {
      console.log('err', JSON.stringify(err, null, 1));
    });
};
export const getNotificationData = id => {
  axiosInstance
    .get(`/notification/job/getactive/${id}`)
    .then(res => {
      const notifications =
        res?.data?.notifications?.map(item => item?.notification) || [];
      store.dispatch(setEventNotification(notifications));
    })
    .catch(error => {
      console.log('Error fetching notification data:', error);
    });
};
export const getEventDetails = (eventId, setIsLoading = () => {}) => {
  // console.log(
  //   'function called.......................',
  //   JSON.stringify(eventId, null, 1),
  // );
  setIsLoading(true);
  axiosInstance
    .get(`/calendar/event/details/${eventId}`)
    .then(res => {
      if (res.data.success) {
        store.dispatch(setSingleEvent(res.data.event));
      }
      setIsLoading(false);
    })
    .catch(err => {
      console.log(
        'err you got from calendar/event/details',
        JSON.stringify(err, null, 1),
      );
      setIsLoading(false);
    });
};
export const loadCommunityPosts = (data, loading = () => {}) => {
  loading(true);
  if (data.page == 1) {
    store.dispatch(setIsLoading(true));
  }

  axiosInstance
    .post('/content/community/post/getall', data)
    .then(res => {
      if (res?.data?.success) {
        if (data.page > 1) {
          store?.dispatch(setCommunityPosts(res.data.posts));
        } else if (data.page == 1) {
          store?.dispatch(setQueryPosts(res.data.posts));
        } else {
          store?.dispatch(setCommunityPosts(res.data.posts));
        }
        store.dispatch(setTotalPost(res.data.count));
      }
      loading(false);
      store.dispatch(setIsLoading(true));
    })
    .catch(error => {
      handleError(error);
      store?.dispatch(setCommunityPosts([]));
      store.dispatch(setTotalPost(0));
      loading(false);
      store.dispatch(setIsLoading(true));
    });
};

export const giveReaction = (postId, symbol, popup) => {
  axiosInstance
    .put(`/content/community/post/react/${postId}`, symbol)
    .then(res => {
      if (res.data.success) {
        store.dispatch(setReactions(res.data.post));
        // console.log("res.data", JSON.stringify(res.data, null, 1));
      }
    })
    .catch(error => {
      if (error.response) {
        console.log(
          'Response error:',
          JSON.stringify(error.response.data, null, 1),
        );
        console.log('Status code:', error.response.status);
      } else if (error.request) {
        console.log('Request error:', JSON.stringify(error.request, null, 1));
      } else {
        console.log('Error:', error.message);
      }
      console.log('Full error object:', JSON.stringify(error, null, 1));
    });
};

export const handleError = error => {
  if (error.response) {
    console.log(
      'Response error:',
      JSON.stringify(error.response.data, null, 1),
    );
    console.log('Status code:', error.response.status);
  } else if (error.request) {
    console.log('Request error:', JSON.stringify(error.request, null, 1));
  } else {
    console.log('Error:', error.message);
  }
  console.log('Full error object:', JSON.stringify(error, null, 1));
};

export const getComments = postId => {
  axiosInstance
    .get(`/content/comment/get/${postId}`)
    .then(res => {
      const commentsCount = res.data.comments.reduce((accumulator, value) => {
        return accumulator + value.repliesCount;
      }, res.data.totalCount);
      if (res.data.success) {
        store.dispatch(setComments(res.data.comments));
        store.dispatch(setCommentCount({contentId: postId, commentsCount}));
      }
    })
    .catch(err => {
      console.log('err', JSON.stringify(err, null, 1));
      handleError(err);
    });
};
export const giveReply = data => {
  axiosInstance
    .post('/content/comment/create', data)
    .then(res => {
      if (res.data.success) {
        getComments(data.contentId);
      }
    })
    .catch(error => {
      handleError(error);
    });
};

// export const uploadDocument = async ({
//   setState,
//   setIsUploading,
//   closePopover = () => {},
//   sendMessage = () => {},
// }) => {
//   try {
//     const document = await DocumentPicker.getDocumentAsync({
//       type: [
//         'image/*',
//         'application/pdf',
//         'application/msword',
//         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//       ],
//       multiple: true,
//       copyToCacheDirectory: true,
//     });

//     if (!document.canceled) {
//       const selected = document.assets;
//       setState(selected);

//       if (selected?.length > 5) {
//         return Alert.alert('Maximum 5 files can be uploaded');
//       }

//       closePopover();
//       setIsUploading(true);

//       let results = await Promise.all(
//         selected?.map(async item => {
//           try {
//             let formData = new FormData();
//             formData.append('file', {
//               uri: item.uri,
//               name: item.name || 'uploaded_file',
//               type: item.mimeType || 'application/octet-stream',
//             });

//             const config = {
//               headers: {
//                 'Content-Type': 'multipart/form-data',
//               },
//             };

//             let res = await axiosInstance.post('/chat/file', formData, config);
//             let file = res.data.file;
//             return file;
//           } catch (error) {
//             setIsUploading(false);
//             console.error('Upload error:', error);
//             Alert.alert('Failed', 'Upload Failed');
//             throw error;
//           }
//         }),
//       );

//       let files = results?.map(file => ({
//         name: file?.name || 'uploaded_file',
//         size: file?.size,
//         type: file?.type,
//         url: file?.location,
//       }));

//       setIsUploading(false);
//       sendMessage(files);
//     } else {
//       console.log('Failed to pick document or canceled');
//     }
//   } catch (error) {
//     console.error('Error in uploadDocument:', error);
//     Alert.alert('Failed', 'Document upload failed');
//   }
// };
// export const handleGalleryPress = async ({setPost, setIsLoading}) => {
//   const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
//   if (status !== 'granted') {
//     return Alert.alert('Permission to access the gallery is required!');
//   }
//   setIsLoading(true);
//   const selected = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     allowsEditing: false, // Disable single image editing
//     quality: 1,
//     allowsMultipleSelection: true,
//   });
//   if (selected.assets && !selected.assets.canceled) {
//     let result = await Promise.all(
//       selected.assets?.map(async item => {
//         try {
//           let formData = new FormData();
//           formData.append('file', {
//             uri: item.uri,
//             name: 'image.jpg',
//             type: 'image/jpg',
//           });

//           const config = {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           };

//           let res = await axiosInstance.post('/chat/file', formData, config);
//           let file = res.data.file;
//           setIsLoading(false);
//           return file;
//         } catch (error) {
//           console.error('Upload error:', error);
//           Alert.alert('Failed', 'Upload Failed');
//           setIsLoading(false);
//           throw error;
//         }
//       }),
//     );

//     setPost(prevPost => ({
//       ...prevPost,
//       attachments: [
//         ...(prevPost.attachments || []),
//         ...result.map(item => ({
//           url: item.location,
//           name: item.name,
//           type: 'image/jpeg',
//           size: item.size,
//         })),
//       ],
//     }));
//   } else {
//     console.log('User canceled the image picker or result is null');
//     setIsLoading(false);
//   }
// };
export const loadProgramInfo = () => {
  axiosInstance
    .get('/enrollment/myprogram')
    .then(res => {
      store.dispatch(setPrograms(res.data));
      if (res.data.success) {
      }
    })
    .catch(error => {
      handleError(error);
    });
};
