// socketHandler.js

import axios from '../utility/axiosInstance';
import {loadChats} from '../actions/chat-noti';
import store from '../store';
import {
  addOnlineUser,
  markRead,
  pushMessage,
  removeOnlineUser,
  setChats,
  setGroupNameId,
  setTyping,
  updateChatMessages,
  updateChats,
  updateLatestMessage,
} from '../store/reducer/chatReducer';
import {
  appendLocalMessage,
  updateRepliesCount,
} from '../store/reducer/chatSlice';
import {addNewMessage} from './mmkvHelpers';
import {newNotification} from '../store/reducer/notificationReducer';

const updateStatus = (messageId, status) => {
  axios
    .patch(`/chat/update-status/${messageId}`, {status})
    .then(res => {})
    .catch(err => {
      console.log(err);
    });
};

const setupSocketListeners = socket => {
  let user = store.getState()?.auth?.user;

  if (!socket || !user?._id) return;

  socket.on('join_online', data => {
    socket.emit('online', {id: user?._id});
  });

  socket.on('newmessage', data => {
    if (data.message?.sender?._id !== user?._id) {
      if (data?.message?.parentMessage) {
        store.dispatch(updateRepliesCount(data?.message?.parentMessage));
        // console.log('newmessage', JSON.stringify(data.message, null, 1));
      } else {
        store.dispatch(
          updateLatestMessage({
            chatId: data?.message?.chat,
            latestMessage: data?.message,
            counter: 1,
          }),
        );
        addNewMessage(data.chat?._id, data.message);
        store.dispatch(appendLocalMessage(data.message));
      }
    }
    //   // updateStatus(data?.message?._id, 'delivered');
    //   console.log(
    //     'New message..........',
    //     JSON.stringify(data.message, null, 2),
    //   );
    //   // store.dispatch(
    //   //   pushMessage({chat: data.chat?._id, message: data.message}),
    //   // );

    //   // store.dispatch(
    //   //   addNewMessage({chatId: data.chat?._id, message: data.message}),
    //   // );
    // } else if (data?.message?.type !== 'message') {
    //   store.dispatch(
    //     pushMessage({chat: data.chat?._id, message: data.message}),
    //   );
    // }
    // store.dispatch(setNew Messages(data.message));
    // store.dispatch(pushMessage({ chat: data.chat?._id, message: data.message }))
  });

  // socket.on('updatemessage', data => {
  //   // console.log('updatemessage', JSON.stringify(data, null, 1));

  //   store.dispatch(updateMessage(data.message));
  // });
  socket.on('updatechat', data => {
    console.log('updatechat', JSON.stringify(data.chat, null, 1));
    store.dispatch(updateChats(data?.chat));
  });

  socket.on('syncMyMessages', data => {
    // console.log('syncMyMessages', JSON.stringify(data, null, 1));
    // console.log('syncMyMessages');
    // console.log(data?.messages?.length);
    if (data?.messages?.length) {
      store.dispatch(
        updateChatMessages({
          chat: data?.chat?._id,
          messages: data?.messages || [],
        }),
      );

      // store.dispatch(
      //   syncMessage({
      //     chat: data?.chat?._id,
      //     messages: data?.messages || [],
      //     lastSync: moment().toISOString(),
      //   })
      // );

      store.dispatch(markRead({chatId: data?.chat?._id}));
    }
  });

  socket.on('mychats', data => {
    let chats = data?.chats;
    // console.log(data);

    // console.log("mychats");
    // console.log('chats', JSON.stringify(chats, null, 2));
    store.dispatch(setGroupNameId(chats));

    store.dispatch(setChats(chats));
    let totalUnread = chats?.filter(
      chat =>
        !chat?.myData?.isRead &&
        chat?.myData?.user !== chat?.latestMessage?.sender?._id,
    )?.length;
    // Notifications.setBadgeCountAsync(totalUnread || 0);
  });

  socket.on('getmessage', data => {
    // console.log(data);
    let {chat, messages} = data;
    // console.log('getmessage', JSON.stringify(data, null, 1));
    store.dispatch(
      updateChatMessages({
        chat: chat?._id,
        messages: messages,
      }),
    );
    store.dispatch(markRead({chatId: chat?._id}));
  });
  socket.on('newnotification', data => {
    if (
      data?.notification?.categories?.includes('student') ||
      data?.notification?.categories?.includes('global')
    ) {
      store.dispatch(newNotification(data.notification));
    }

    // if (data?.notification?.notificationType === "thread") {
    //     audio.play();

    //     notification.success({
    //         message: `${data?.notification?.userFrom?.fullName} replied in a thread`,
    //         description: data?.message,
    //         duration: 10,
    //         onClick: () => {
    //             window.location.href = `/chat/${data?.notification?.entityId}?message=${data?.notification?.text}`
    //         },
    //     });
    // }
  });

  socket.on('pushmessage', data => {
    // console.log('pushmessage', JSON.stringify(data, null, 1));
    store.dispatch(pushMessage({chat: data.chat, message: data.message}));
  });

  socket.on('addOnlineUser', data => {
    // console.log(data);
    // console.log('addOnlineUser', JSON.stringify(data.user, null, 1));

    store.dispatch(addOnlineUser(data.user));
  });
  socket.on('removeOnlineUser', data => {
    // console.log('removeOnlineUser', JSON.stringify(data.user, null, 1));
    store.dispatch(removeOnlineUser(data.user));
  });

  socket.on('istyping', data => {
    // console.log(data);

    store.dispatch(
      setTyping({chatId: data?.chatId, typingData: data.typingData}),
    );
  });

  socket.on('newchatevent', data => {
    // console.log(data);
    loadChats();
    socket.emit('join-chat-room', {chatId: data?.chat?._id});
  });

  return () => {
    socket.off('join_online');
    socket.off('newmessage');
    socket.off('updatemessage');
    socket.off('updatechat');
    socket.off('pushmessage');
    socket.off('newnotification');
    socket.off('addOnlineUser');
    socket.off('removeOnlineUser');
    socket.off('istyping');
    socket.off('newchatevent');
    socket.off('syncMyMessages');
    socket.off('mychats');
    socket.off('getmessage');
  };
};

export default setupSocketListeners;
