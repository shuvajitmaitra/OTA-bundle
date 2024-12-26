import {createSlice} from '@reduxjs/toolkit';
import moment from 'moment';
import {loadChats} from '../../actions/chat-noti';

function sortByLatestMessage(data = []) {
  return data?.slice().sort((a, b) => {
    const dateA =
      a?.latestMessage && a?.latestMessage?.createdAt
        ? new Date(a?.latestMessage?.createdAt)
        : new Date(0);
    const dateB =
      b?.latestMessage && b?.latestMessage?.createdAt
        ? new Date(b?.latestMessage?.createdAt)
        : new Date(0);

    return dateB - dateA; // For descending order
  });
}

const initialState = {
  chats: [],
  chatsObj: {},
  onlineUsers: [],
  chatMessages: {},
  bots: [],
  displayMode: '',
  pinned: [],
  chat: {},
  groupNameId: [],
  singleMessage: {},
  playingAudio: null,
  socketStatus: false,
  messages: [],
  singleChat: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setNewMessages: (state, action) => {
      const oldId = state.messages[0].chat || '';
      const newId = action.payload.chat;
      const old = state.messages[0]._id;
      const n = action.payload._id;
      if (oldId === newId && old !== n) {
        state.messages = [action.payload, ...state.messages];
      }
    },
    setSocketStatus: (state, action) => {
      state.socketStatus = action.payload;
    },
    setPlayingAudio: (state, action) => {
      state.playingAudio = action.payload;
    },
    clearPlayingAudio: state => {
      state.playingAudio = null;
    },
    updateMembersCount: (state, action) => {
      const {_id, membersCount} = action.payload;
      const chatIndex = state.chats.findIndex(x => x?._id === _id);

      if (chatIndex !== -1) {
        state.chats[chatIndex].membersCount = membersCount;
      } else {
        // console.log(JSON.stringify(_id, null, 1));
        console.log('it is -1');
      }
    },
    updateChat: (state, action) => {
      state.chat = action.payload;
    },
    setPinned: (state, action) => {
      state.pinned = action.payload;
    },
    setDisplayMode: (state, action) => {
      state.displayMode = action.payload;
    },
    setGroupNameId: (state, action) => {
      const result = action.payload.reduce((acc, obj) => {
        acc[obj._id] = obj;
        return acc;
      }, {});
      state.chatsObj = result;
      const filteredChats =
        action.payload?.filter(c => c.isChannel === true && c.name) || [];

      const groupNameId = filteredChats.map(item => {
        return {
          data: item._id,
          type: item.name,
        };
      });
      state.groupNameId = groupNameId;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setBots: (state, action) => {
      state.bots = action.payload;
    },
    removeChat: (state, action) => {
      state.chats = state.chats?.filter(x => x?._id !== action.payload);
    },
    updateChats: (state, action) => {
      state.chats = updateArray(state.chats, action.payload);
    },
    setTyping: (state, action) => {
      const {chatId, typingData} = action.payload;
      const typingChatIndex = state.chats.findIndex(x => x?._id === chatId);
      if (typingChatIndex !== -1) {
        state.chats[typingChatIndex].typingData = typingData;
      }
    },
    updateMyData: (state, action) => {
      const {_id, field, value} = action.payload;
      const chatIndex = state.chats.findIndex(x => x?._id === _id);

      if (chatIndex !== -1) {
        state.chats[chatIndex].myData = {
          ...state.chats[chatIndex].myData,
          [field]: value,
        };
      } else {
        console.log('it is -1');
      }
    },
    updateLatestMessage: (state, action) => {
      const {chatId, latestMessage, counter} = action.payload;
      const chatIndex = state.chats.findIndex(x => x?._id === chatId);
      console.log('chatIndex', JSON.stringify(chatIndex, null, 2));
      if (chatIndex !== -1) {
        state.chats[chatIndex].latestMessage = {
          ...(state.chats[chatIndex]?.latestMessage || {}),
          ...latestMessage,
        };
        state.chats[chatIndex].unreadCount = counter
          ? parseInt(state.chats[chatIndex].unreadCount) + parseInt(counter)
          : null;
        // console.log(
        //   'chatIndex',
        //   JSON.stringify(state.chats[chatIndex], null, 2),
        // );
      }
    },

    markRead: (state, action) => {
      const {chatId} = action.payload;
      const chatIndex = state.chats.findIndex(x => x?._id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].unreadCount = 0;
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    addOnlineUser: (state, action) => {
      state.onlineUsers = addToArray(state.onlineUsers, action.payload);
    },
    removeOnlineUser: (state, action) => {
      // state.onlineUsers = removeFromArray(
      //   state.onlineUsers,
      //   action.payload,
      //   '_id',
      // );
      state.onlineUsers = state.onlineUsers.filter(
        user => user._id !== action.payload._id,
      );
    },
    updateChatMessages: (state, action) => {
      const {chat, messages} = action.payload;
      state.chatMessages[chat] = messages;
      //set last sync time in chats
    },
    syncMessage: (state, action) => {
      const {chat, messages, lastSync} = action.payload;

      // Always clone arrays or objects before modifying to preserve immutability
      let updatedChatMessages = [...(state.chatMessages[chat] || [])];

      messages?.forEach(msg => {
        const index = updatedChatMessages.findIndex(x => x?._id === msg._id);
        if (index !== -1) {
          // Replace the existing message by creating a new object
          updatedChatMessages[index] = {
            ...updatedChatMessages[index],
            ...msg,
          };
        } else {
          // Concatenate the new message to avoid direct mutation
          updatedChatMessages = updatedChatMessages.concat(msg);
        }
      });

      // Sort messages
      updatedChatMessages = sortByLatestMessage(updatedChatMessages);

      // Return new state
      return {
        ...state,
        chatMessages: {
          ...state.chatMessages,
          [chat]: updatedChatMessages,
        },
        chats: state.chats.map(c =>
          c._id === chat
            ? {
                ...c,
                lastSync: lastSync || moment().toISOString(),
              }
            : c,
        ),
      };
    },

    updateThreadMessage: (state, action) => {
      const {chat, message} = action.payload;
      let messagesArray = state.chatMessages[chat] || [];
      // console.log("messageArray", JSON.stringify(messagesArray, null, 1));
    },

    pushHistoryMessages: (state, action) => {
      const {chat, messages} = action.payload;
      let messagesArray = state.chatMessages[chat] || [];
      messagesArray = [...messages, ...messagesArray];
      state.chatMessages[chat] = messagesArray;
    },
    pushMessage: (state, action) => {
      const {message} = action.payload;
      const chatId = message.chat;
      let messagesArray = state.chatMessages[chatId] || [];

      if (message.parentMessage) {
        const parentMessageIndex = messagesArray.findIndex(
          m => m?._id === message.parentMessage,
        );
        if (parentMessageIndex !== -1) {
          messagesArray[parentMessageIndex]?.replies?.push(message);
          messagesArray[parentMessageIndex] = {
            ...messagesArray[parentMessageIndex],
            replyCount: messagesArray[parentMessageIndex]?.replyCount + 1,
          };
        }
      } else {
        const existingMessageIndex = messagesArray.findIndex(
          m => m?._id === message?._id,
        );
        if (existingMessageIndex !== -1) {
          messagesArray[existingMessageIndex] = {
            ...messagesArray[existingMessageIndex],
            ...message,
          };
        } else {
          messagesArray.push(message);
          messagesArray = messagesArray.slice(
            Math.max(messagesArray?.length - 20, 0),
            messagesArray?.length,
          );
        }
      }

      state.chatMessages[chatId] = messagesArray;
    },
    updateMessage: (state, action) => {
      const {message} = action.payload;
      const chatId = message.chat;
      const messagesArray = state.chatMessages[chatId] || [];

      if (message.parentMessage) {
        const messageIndex = messagesArray.findIndex(
          m => m?._id === message.parentMessage,
        );
        if (messageIndex !== -1) {
          let replies = messagesArray[messageIndex]?.replies || [];
          let replyIndex = replies?.findIndex(x => x?._id === message?._id);
          if (replyIndex !== -1) {
            replies[replyIndex] = {...replies[replyIndex], ...message};
          }

          messagesArray[messageIndex] = {
            ...messagesArray[messageIndex],
            replies,
          };
        }
      } else {
        const messageIndex = messagesArray.findIndex(
          m => m?._id === message?._id,
        );

        if (messageIndex !== -1) {
          messagesArray[messageIndex] = {
            ...messagesArray[messageIndex],
            ...message,
          };
        }
      }

      state.chatMessages[chatId] = messagesArray;
    },
    updateSendingInfo: (state, action) => {
      const {message, trackingId} = action.payload;
      const chatId = message.chat;
      let messagesArray = [...state.chatMessages[chatId]] || [];

      if (message.parentMessage) {
        const messageIndex = messagesArray.findIndex(
          m => m?._id === message.parentMessage,
        );

        let replies = [...messagesArray[messageIndex]?.replies] || [];

        let replyIndex = replies.findIndex(m => m?._id === trackingId);

        if (replyIndex !== -1) {
          replies[replyIndex] = {
            ...replies[replyIndex],
            ...message,
          };
        }

        messagesArray[messageIndex] = {
          ...messagesArray[messageIndex],
          replies: replies || [],
        };
      } else {
        const messageIndex = messagesArray.findIndex(
          m => m?._id === trackingId,
        );
        if (messageIndex !== -1) {
          messagesArray[messageIndex] = {
            ...messagesArray[messageIndex],
            ...message,
          };
        }
      }

      state.chatMessages[chatId] = messagesArray;
    },
    setSingleMessage: (state, action) => {
      state.singleMessage = action.payload;
    },
    setSingleChat: (state, action) => {
      state.singleChat = action.payload;
    },
    updateSingleChatMemberCount: (state, {payload}) => {
      // console.log('payload', JSON.stringify(payload, null, 1));
      if (payload === 'remove') {
        state.singleChat = {
          ...state.singleChat,
          membersCount: state.singleChat.membersCount - 1,
        };
      } else {
        state.singleChat = {
          ...state.singleChat,
          membersCount: state.singleChat.membersCount + 1,
        };
      }
    },

    updateFavoriteSingleChat: (state, {payload}) => {
      state.singleChat = {
        ...state.singleChat,
        myData: {
          ...state.singleChat.myData,
          isFavourite: payload.isFavourite,
        },
      };
    },
    updateSingleChatArchive: (state, {payload}) => {
      state.singleChat = {
        ...state.singleChat,
        ...payload,
      };
    },
    updateChatsArchive: (state, {payload}) => {
      const {_id, field, value} = payload;
      const chatIndex = state.chats.findIndex(x => x?._id === _id);
      if (chatIndex !== -1) {
        if (field === 'isArchived') {
          state.chats[chatIndex] = {
            ...state.chats[chatIndex],
            isArchived: value,
          };
        }
      }
    },

    updateSingleChatProfile: (state, {payload}) => {
      state.singleChat = {
        ...state.singleChat,
        ...payload,
      };
    },
  },
});

// Export actions generated by createSlice
export const {
  updateChatsArchive,
  updateSingleChatArchive,
  updateSingleChatProfile,
  updateSingleChatMemberCount,
  updateFavoriteSingleChat,
  setNewMessages,
  setSingleChat,
  setMessages,
  setSocketStatus,
  clearPlayingAudio,
  setPlayingAudio,
  setSingleMessage,
  setGroupNameId,
  updateChat,
  updateMembersCount,
  setPinned,
  setDisplayMode,
  setChats,
  setBots,
  removeChat,
  updateChats,
  setTyping,
  updateMyData,
  updateLatestMessage,
  markRead,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  updateChatMessages,
  pushMessage,
  updateMessage,
  updateSendingInfo,
  setCurrentTheme,
  pushHistoryMessages,
  syncMessage,
  updateThreadMessage,
} = chatSlice.actions;

// Export the reducer
export default chatSlice.reducer;

// Helper functions
const updateArray = (array, item, key = '_id') => {
  const index = array.findIndex(el => el[key] === item[key]);
  if (index === -1) {
    return [item, ...array];
  }
  const updatedArray = [...array];
  updatedArray[index] = {...updatedArray[index], ...item};
  return updatedArray;
};

const addToArray = (array, item) => {
  if (!array.find(el => el?._id === item?._id)) {
    return [item, ...array];
  }
  return array;
};

const removeFromArray = (array, item, key = '_id') => {
  return array?.filter(el => el[key] !== item[key]);
};
