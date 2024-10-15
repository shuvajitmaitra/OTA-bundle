import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {memo, useState} from 'react';

import ReactNativeModal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {
  setSelectedMessageScreen,
  setThreadOpen,
} from '../../store/reducer/ModalReducer';
import NewMessageScreen from '../../screens/Chat/NewMessageScreen';
import {useTheme} from '../../context/ThemeContext';
import ThreadScreen from '../../screens/Chat/ThreadScreen';

const ChatMessageModal = () => {
  const dispatch = useDispatch();
  let {
    selectedMessageScreen: selectedChat,
    isThreadOpen,
    params,
  } = useSelector(state => state.modal);
  let deviceHeight = Dimensions.get('window').height;
  let deviceWidth = Dimensions.get('window').width;
  const Colors = useTheme();
  const [isModalShwown, setIsModalShown] = useState(false);

  const handleSetSelectedChat = chat => {
    dispatch(setSelectedMessageScreen(chat));
    setIsModalShown(false);
  };
  return (
    <ReactNativeModal
      animationInTiming={200}
      animationOutTiming={200}
      animationIn="slideInRight"
      animationOut={'slideOutRight'}
      backdropOpacity={0.9}
      coverScreen={true}
      backdropColor={Colors.BackDropColor}
      isVisible={Boolean(selectedChat)}
      onBackdropPress={() => handleSetSelectedChat(null)}
      useNativeDriver={true} // Use native driver for better performance
      deviceHeight={deviceHeight}
      hasBackdrop={false}
      deviceWidth={deviceWidth}
      style={{margin: 0, padding: 0}}
      onModalShow={() => setIsModalShown(true)}
      onModalWillHide={() => setIsModalShown(false)}
      // onSwipeComplete={() => handleSetSelectedChat(false)}
      // swipeDirection="left"
      onBackButtonPress={() => handleSetSelectedChat(null)}>
      <KeyboardAvoidingView
        style={{flex: 1, backgroundColor: Colors.Background_color}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // For iOS and Android
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Adjust this value based on your header height
      >
        {/* {isModalShwown && selectedChat ? (
          isThreadOpen ? (
            <ThreadScreen route={params} />
          ) : (
            <NewMessageScreen
              selectedChat={selectedChat}
              route={{params: selectedChat}}
              setSelectedChat={handleSetSelectedChat}
            />
          )
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size={80} color={Colors.Primary} />
          </View>
        )} */}
      </KeyboardAvoidingView>
    </ReactNativeModal>
  );
};

export default memo(ChatMessageModal);

const styles = StyleSheet.create({});
