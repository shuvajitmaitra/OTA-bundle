import {createContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import axiosInstance from '../../utility/axiosInstance';
import {useDispatch} from 'react-redux';
import {updateMyData} from '../../store/reducer/chatReducer';

export const ChatContext = createContext(null);
const ChatProvider = ({
  children,
  route,
  chat,
  image,
  name,
  onlineUsers,
  pinnedMessages,
  setIsPinnedVisible,
  setIsDialogueVisible,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [filterMembers, setFilterMembers] = useState([]);

  const [isFavourite, setIsFavourite] = useState(
    useEffect(() => {
      if (chat) {
        setIsFavourite(chat.myData?.isFavourite);
        // fetchMembers();
      }
    }, [chat]),
  );

  useEffect(() => {
    if (isGroupModalVisible) {
      fetchMembers();
    }
  }, [isGroupModalVisible]);

  const toogleFavourite = data => {
    axiosInstance
      .put('/chat/favourite', data)
      .then(res => {
        if (res.data.success) {
          setIsFavourite(!isFavourite);

          dispatch(
            updateMyData({
              field: 'isFavourite',
              value: res.data.member.isFavourite,
              _id: chat?._id,
            }),
          );
        }
      })
      .catch(err => {
        Alert.alert(err?.response?.data?.error);
        console.log(err);
      });
  };

  const fetchMembers = () => {
    axiosInstance
      .post(`/chat/members/${chat?._id}`)
      .then(res => {
        setMembers(res.data?.results || []);
        setFilterMembers(res.data?.results || []);
        if (res.data.results) {
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const chatInfo = {
    isLoading,
    fetchMembers,
    route,
    chat,
    image,
    name,
    onlineUsers,
    pinnedMessages,
    setIsPinnedVisible,
    setIsDialogueVisible,
    toogleFavourite,
    isFavourite,
    isProfileModalVisible,
    setIsProfileModalVisible,
    isGroupModalVisible,
    setIsGroupModalVisible,
    members,
    filterMembers,
    setFilterMembers,
  };
  return (
    <ChatContext.Provider value={chatInfo}>{children}</ChatContext.Provider>
  );
};

export default ChatProvider;
