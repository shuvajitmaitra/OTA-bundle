import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from 'react';
import {ScrollView, StyleSheet, View, FlatList, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ChatItem from '../../components/ChatCom/ChatItem';
import CustomFonts from '../../constants/CustomFonts';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTheme} from '../../context/ThemeContext';
import OnlineUsersItem from '../../components/ChatCom/OnlineUsersItem';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import {SafeAreaView} from 'react-native';
import {loadChats} from '../../actions/chat-noti';
import ChatHeaderFilter from '../../components/ChatCom/ChatHeaderFilter';
import {RegularFonts} from '../../constants/Fonts';
import Divider from '../../components/SharedComponent/Divider';
import ChatSearchField from '../../components/ChatCom/ChatSearchField';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FilterOptionModal from '../../components/ChatCom/Modal/FilterOptionModal';
import {TouchableWithoutFeedback} from 'react-native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import CreateCrowdModal from '../../components/ChatCom/Modal/CreateCrowdModal';
import axiosInstance from '../../utility/axiosInstance';
import {setChats, setGroupNameId} from '../../store/reducer/chatReducer';
import FloatingActionButton from '../../components/ChatCom/FloatingActionButton';

// const data = {
//   user: {
//     phone: {
//       isVerified: true,
//       number: '1949887896',
//       countryCode: '880',
//     },
//     isEmailVerified: {
//       status: true,
//       token: '',
//     },
//     chatPermissions: {
//       isSuspended: false,
//       canJoinChat: true,
//       canInitiateChat: true,
//       canCreateChannel: true,
//       canReadMessage: true,
//       canSendMessage: true,
//     },
//     suspension: {
//       isSuspended: false,
//       suspendedUntil: null,
//       reason: '',
//     },
//     botInfo: {
//       branches: [],
//       description: '',
//       isActive: true,
//     },
//     personalData: {
//       address: {
//         country: 'Bangladesh ',
//         city: 'Rampal',
//         street: '318/01 Talbunia',
//         postalCode: '9340',
//         state: '',
//       },
//       socialMedia: {
//         facebook: '',
//         twitter: '',
//         linkedin: '',
//         instagram: '',
//         github: '',
//       },
//       resume: '',
//       bio: 'Hello, I am a react native developer.\n\nhttps://portal.bootcampshub.ai/dashboard',
//     },
//     profileStatus: {
//       recurring: {
//         isDailyRecurring: true,
//         fromTime: '09:00 AM',
//         toTime: '05:00 PM',
//       },
//       currentStatus: 'online',
//     },
//     profilePicture:
//       'https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/1717578966219-Shuvajit_Maitra',
//     lastName: 'Maitra',
//     about:
//       'Hello, I am a react native developer.\n\nhttps://portal.bootcampshub.ai/dashboard',
//     type: 'marketing',
//     password_reset_token:
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvdHAiOiI1NjE3OTMiLCJlbWFpbCI6InNodXZhaml0bWFpdHJhQGdtYWlsLmNvbSIsImlhdCI6MTcxMzMzOTEyMSwiZXhwIjoxNzEzMzQyNzIxfQ.xpukx8pGk6845m1tPBYOCgyziXCjJffjHSI5oUfvFbk',
//     pushTokens: [
//       'ExponentPushToken[0bw6oPKQXT-JhXNPomKF9Z]',
//       'ExponentPushToken[ErXy9rH_Icz2mtHqbkB4r3]',
//       'ExponentPushToken[4UhWw5LjvKG55wSTP4DGHw]',
//       'ExponentPushToken[h2BnJbEw9rJsC989zi2PNv]',
//       'ExponentPushToken[ud12pjPG2_oDIwe6OcoMOr]',
//       'ExponentPushToken[rMdQmdN2L9VZAqOuue6Sp0]',
//       'ExponentPushToken[FClU_zEv39e6SJ7NN5_mwl]',
//       'ExponentPushToken[41jk0XN6Ou4OL5ZtjzTJvn]',
//       'ExponentPushToken[PXY3TQFBCZ40FPypGkQBoz]',
//       'ExponentPushToken[oQ4f_RKHP8BD3WtkmV3Uty]',
//       'ExponentPushToken[KBXAsrH6uAtJkNjiiCGIeo]',
//       'ExponentPushToken[EfnshDAFthwLa6Md4b8T01]',
//       'ExponentPushToken[MjUYCbCfaf29hlP98rT49X]',
//       'ExponentPushToken[7EQ06bFVq6Ii5Dz1XTMBQ9]',
//       'ExponentPushToken[KbZ048B7O15YA2i0iDEifF]',
//       'ExponentPushToken[BL4gzBGWhi_gNbGZnt0ihp]',
//     ],
//     readingLists: [],
//     isLockExcluded: false,
//     _id: '658ce2bf45ea7e0019776f2f',
//     isApproved: false,
//     email: 'shuvajitmaitra@gmail.com',
//     firstName: 'Shuvajit ',
//     hash_password:
//       '$2b$10$y9AYr3chYY4r7cmLQ9q3I.s/bmxud8Tc4HD4VCT6PM3aeYHpxXz8m',
//     createdAt: '2023-12-28T02:51:43.264Z',
//     updatedAt: '2024-12-12T11:46:55.866Z',
//     id: 2210,
//     __v: 0,
//     lastActive: '2024-12-12T11:46:55.865Z',
//     deviceToken:
//       'eLgIbMzG8kjOh1Si5JlADc:APA91bEjZNagx2v0flpiCT_o6msZJR8PNq1QEoSr69V91VoVSDwf5FkNdMHgqBSPm4s6YoTpaCsaoocty7N_luCZnCrtnq2nHeOLBJi1Mppx738iJCVe3es',
//     fullName: 'Shuvajit  Maitra',
//   },
//   status: 'pending',
// };

export function sortByNestedProperty(array, propertyPath, order = 'desc') {
  const getValue = (obj, path) =>
    path.split('.').reduce((o, k) => (o || {})[k], obj);

  return [...array].sort((a, b) => {
    const valueA = new Date(getValue(a, propertyPath));
    const valueB = new Date(getValue(b, propertyPath));

    if (order === 'asc') {
      return valueA - valueB;
    }
    return valueB - valueA; // Default to descending order
  });
}

function sortByLatestMessage(data = []) {
  return data?.slice().sort((a, b) => {
    const dateA =
      a?.latestMessage && a?.latestMessage.createdAt
        ? new Date(a?.latestMessage.createdAt)
        : new Date(0);
    const dateB =
      b?.latestMessage && b?.latestMessage.createdAt
        ? new Date(b?.latestMessage.createdAt)
        : new Date(0);

    return dateB - dateA; // For descending order
  });
}

export default function NewChatScreen({navigation: {goBack}}) {
  const Colors = useTheme();
  const {chats, onlineUsers} = useSelector(state => state.chat);
  const {user} = useSelector(state => state.auth);
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const [checked, setChecked] = useState('chats');
  const [records, setRecords] = useState([]);
  const [results, setResults] = useState([]);
  const [isOnlineUsers, setOnlineUsers] = useState(onlineUsers);
  const [isCreateCrowdModalVisible, setIsCreateCrowdModalVisible] =
    useState(false);
  const toggleCreateCrowdModal = () => {
    setIsCreateCrowdModalVisible(!isCreateCrowdModalVisible);
  };
  const bottomSheetRef = useRef(null);
  // useEffect(() => {
  //   console.log('NewChatScreen');
  //   const filteredChats = chats?.filter(x => !x?.isArchived) || [];
  //   setRecords(filteredChats);
  //   setResults(filteredChats);
  //   return () => {};
  // }, []);

  useEffect(() => {
    const filteredChats = chats?.filter(x => !x?.isArchived) || [];

    setRecords(filteredChats);
    setResults(filteredChats);
  }, [chats]);
  useEffect(() => {
    setOnlineUsers(onlineUsers);

    return () => {
      setOnlineUsers([]);
    };
  }, [onlineUsers]);

  const handleRadioChecked = useCallback(
    item => {
      let filteredChats = [];
      switch (item) {
        case 'mention':
          filteredChats = [];
          break;
        case 'chats':
          loadChats();
          console.log('called');
          filteredChats = chats?.filter(x => !x?.isArchived) || [];
          break;
        case 'crowds':
          filteredChats = chats?.filter(c => c.isChannel === true) || [];
          break;
        case 'unreadMessage':
          filteredChats =
            chats?.filter(
              x =>
                x?.isArchived === false &&
                x?.unreadCount > 0 &&
                x?.latestMessage?.sender?._id !== user?._id,
            ) || [];
          break;
        case 'favorites':
        case 'pinned':
          filteredChats =
            chats?.filter(x => x?.myData?.isFavourite && !x?.isArchived) || [];
          break;
        case 'archived':
          filteredChats = chats?.filter(x => x?.isArchived) || [];
          break;
        default:
          filteredChats = chats?.filter(x => !x?.isArchived) || [];
      }

      const sortedChats = sortByNestedProperty(
        filteredChats,
        'latestMessage.createdAt',
      );
      setRecords(sortedChats);
      setChecked(item);
    },
    [chats, user?._id],
  );

  const handleFilter = useCallback(
    val => {
      console.log('val', JSON.stringify(val, null, 1));
      if (checked === 'onlines') {
        if (val) {
          const filteredUsers = onlineUsers?.filter(c =>
            c?.fullName?.toLowerCase().includes(val?.toLowerCase()),
          );
          setOnlineUsers(filteredUsers);
        } else {
          setOnlineUsers(onlineUsers);
        }
      } else {
        if (val) {
          const filteredChats = results?.filter(
            c =>
              c?.latestMessage?.text
                ?.toLowerCase()
                .includes(val?.toLowerCase()) ||
              c?.name?.toLowerCase().includes(val?.toLowerCase()) ||
              c?.otherUser?.fullName
                ?.toLowerCase()
                .includes(val?.toLowerCase()),
          );
          setRecords(filteredChats);
        } else {
          handleRadioChecked(checked);
        }
      }
    },
    [checked, onlineUsers, results, handleRadioChecked],
  );

  const renderChatItem = useCallback(
    ({item}) => (
      <ChatItem onlineUsers={onlineUsers} chat={item} setChecked={setChecked} />
    ),
    [onlineUsers],
  );

  const openBottomSheet = useCallback(() => {
    setBottomSheetVisible(true);
    bottomSheetRef.current?.present();
  }, []);
  const styles = getStyles(Colors, checked);

  // const loadInitialChat = async () => {
  //   console.log('loadChats called');

  //   await axiosInstance
  //     .get('/chat/mychats')
  //     .then(res => {
  //       console.log('getting all chat', JSON.stringify(res.data, null, 2));
  //       dispatch(setChats(res.data.chats));
  //       // // console.log('res.data.chats', JSON.stringify(res.data.chats, null, 1));
  //       dispatch(setGroupNameId(res.data.chats));
  //       // let totalUnread = res.data.chats?.filter(
  //       //   chat =>
  //       //     !chat?.myData?.isRead &&
  //       //     chat.myData.user !== chat?.latestMessage?.sender?._id,
  //       // )?.length;
  //       // await Notifications.setBadgeCountAsync(totalUnread || 0);
  //     })
  //     .catch(err => {
  //       // console.log(err);
  //       console.log('err to get initial get', JSON.stringify(err, null, 2));
  //     });
  // };

  // useEffect(() => {
  //   loadInitialChat();

  //   return () => {};
  // }, []);

  return (
    <TouchableWithoutFeedback
      style={{zIndex: 1111111}}
      onPress={() => bottomSheetRef.current?.dismiss()}>
      <SafeAreaView style={[styles.container, {paddingTop: top}]}>
        <StatusBar
          translucent={true}
          backgroundColor={Colors.Background_color}
          barStyle={
            Colors.Background_color === '#F5F5F5'
              ? 'dark-content'
              : 'light-content'
          }
        />
        {/* <ChatTopPart handleRadioChecked={handleRadioChecked} /> */}
        <View style={styles.searchContainer}>
          <ChatSearchField
            handleFilter={handleFilter}
            checked={checked}
            handleRadioChecked={handleRadioChecked}
            goBack={goBack}
          />
        </View>
        <ChatHeaderFilter
          handleFilterModalPress={openBottomSheet}
          checked={checked}
          handleRadioChecked={handleRadioChecked}
        />
        {checked === 'onlines' ? (
          <ScrollView>
            {isOnlineUsers?.map(item => (
              <View key={item._id}>
                {user?._id !== item?._id && (
                  <OnlineUsersItem item={item} navigation={navigation} />
                )}
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={[styles.chatListContainer, {}]}>
            {
              <FlatList
                data={sortByLatestMessage(records, 'latestMessage.createdAt')}
                renderItem={renderChatItem}
                keyExtractor={item => item?._id || Math.random().toString()}
                showsVerticalScrollIndicator={false}
                initialNumToRender={8}
                ItemSeparatorComponent={() => (
                  <Divider marginTop={0.000001} marginBottom={0.00001} />
                )}
                ListEmptyComponent={() => (
                  <View
                    style={{
                      height: responsiveScreenHeight(80),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <NoDataAvailable />
                  </View>
                )}
              />
            }
          </View>
        )}
        <BottomSheetModalProvider>
          <FilterOptionModal
            bottomSheetRef={bottomSheetRef}
            openBottomSheet={openBottomSheet}
            handleRadioChecked={handleRadioChecked}
            toggleCreateCrowdModal={toggleCreateCrowdModal}
            setBottomSheetVisible={setBottomSheetVisible}
          />
        </BottomSheetModalProvider>
        <CreateCrowdModal
          isCreateCrowdModalVisible={isCreateCrowdModalVisible}
          setIsCreateCrowdModalVisible={setIsCreateCrowdModalVisible}
          toggleCreateCrowdModal={toggleCreateCrowdModal}
        />
        {!bottomSheetVisible && <FloatingActionButton />}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const getStyles = (Colors, checked) =>
  StyleSheet.create({
    NoDataContainer: {
      // backgroundColor: "red",
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    createCrowdIcon: {
      // backgroundColor: Colors.Primary,
      justifyContent: 'center',
      paddingHorizontal: responsiveScreenWidth(1),
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      // paddingVertical: 5,
    },
    CrowdsTexts: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
    },
    CrowdHeadingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: responsiveScreenWidth(4),
      // paddingTop: responsiveScreenHeight(2),
      paddingBottom: responsiveScreenHeight(1),
    },
    container: {
      zIndex: 0,
      flex: 1,
      // // paddingTop: responsiveScreenHeight(3.5),
      backgroundColor: Colors.Background_color,
      // marginBottom: 10
      position: 'relative',
    },
    searchContainer: {
      paddingHorizontal: responsiveScreenWidth(4),
      // marginTop: responsiveScreenHeight(1),
      zIndex: 1,
    },
    chatListContainer: {
      paddingHorizontal: responsiveScreenWidth(4),
      // paddingTop: responsiveScreenHeight(1),
      // backgroundColor: Colors.Red
      height: checked === 'crowds' && '73%',
      flex: 1,
    },
    recentText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      marginVertical: responsiveScreenHeight(2),
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
    },
  });
