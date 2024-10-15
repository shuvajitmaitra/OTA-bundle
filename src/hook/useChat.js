import { useContext } from "react";
import { ChatContext } from "../screens/Chat/ChatProvider";

const useChat = () => {
  return useContext(ChatContext);
};
export default useChat;
