import React, {useState, useEffect, useCallback, useRef} from 'react';
import {ScrollView, StyleSheet, View, FlatList, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ChatItem from '../../components/ChatCom/ChatItem';
import CustomeFonts from '../../constants/CustomeFonts';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../context/ThemeContext';
import OnlineUsersItem from '../../components/ChatCom/OnlineUsersItem';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import {SafeAreaView} from 'react-native';
import {loadChats} from '../../actions/chat-noti';
import {setSelectedMessageScreen} from '../../store/reducer/ModalReducer';
import ChatHeaderFilter from '../../components/ChatCom/ChatHeaderFilter';
import {RegularFonts} from '../../constants/Fonts';
import Divider from '../../components/SharedComponent/Divider';
import ChatSearchField from '../../components/ChatCom/ChatSearchField';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FilterOptionModal from '../../components/ChatCom/Modal/FilterOptionModal';
import {TouchableWithoutFeedback} from 'react-native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import CreateCrowdModal from '../../components/ChatCom/Modal/CreateCrowdModal';
import initializeOneSignal from '../../utility/PushNotiService';
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
  const dispatch = useDispatch();
  const Colors = useTheme();
  const {chats, onlineUsers} = useSelector(state => state.chat);
  const {user} = useSelector(state => state.auth);
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();

  const [focusedChat, setFocusedChat] = useState(null);
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

  useEffect(() => {
    initializeOneSignal();
  }, []);

  const handleSetSelectedChat = useCallback(chat => {
    dispatch(setSelectedMessageScreen(chat));
  }, []);

  useEffect(() => {
    const filteredChats = chats?.filter(x => !x?.isArchived) || [];
    setRecords(filteredChats);
    setResults(filteredChats);
  }, [chats]);

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
    [checked, onlineUsers, records, handleRadioChecked],
  );

  const renderChatItem = useCallback(
    ({item}) => (
      <ChatItem
        setChecked={setChecked}
        setFocusedChat={setFocusedChat}
        onlineUsers={onlineUsers}
        navigation={navigation}
        chat={item}
        isChatClicked={focusedChat === item?._id}
        setSelectedChat={handleSetSelectedChat}
        bottomSheetRef={bottomSheetRef}
      />
    ),
    [],
  );

  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const styles = getStyles(Colors, checked);
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
          />
        </BottomSheetModalProvider>
        <CreateCrowdModal
          isCreateCrowdModalVisible={isCreateCrowdModalVisible}
          setIsCreateCrowdModalVisible={setIsCreateCrowdModalVisible}
          toggleCreateCrowdModal={toggleCreateCrowdModal}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const getStyles = (Colors, checked) =>
  StyleSheet.create({
    createCrowdText: {
      fontFamily: CustomeFonts.MEDIUM,
      color: Colors.Primary,
      fontSize: RegularFonts.HS,
    },
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
      fontFamily: CustomeFonts.MEDIUM,
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
      // backgroundColor: "yellow",
      // // paddingTop: responsiveScreenHeight(3.5),
      backgroundColor: Colors.Background_color,
      // marginBottom: 10
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
      fontFamily: CustomeFonts.SEMI_BOLD,
      marginVertical: responsiveScreenHeight(2),
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
    },
  });
