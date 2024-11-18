import {storage} from './mmkvInstance';
// this is relative path src/utility/mmkvHelpers.js
/**
 * allMessages ={}
 */

export const getAllMessages = () => {
  const pre = storage.getString('allMessages');
  return pre ? JSON.parse(pre) : {};
};

export const setAllMessages = (chatId, messages) => {
  const allMessages = getAllMessages();
  const updatedAllMessages = {
    ...allMessages,
    [chatId]: [...(allMessages[chatId] || []), ...messages],
  };
  storage.set('allMessages', JSON.stringify(updatedAllMessages));
};

export const addNewMessage = (chatId, message) => {
  const allMessages = getAllMessages();
  const updatedAllMessages = {
    ...allMessages,
    [chatId]: [message, ...(allMessages[chatId] || [])],
  };
  storage.set('allMessages', JSON.stringify(updatedAllMessages));
};
export const setOrganization = org => {
  storage.set('organization', JSON.stringify(org));
};
