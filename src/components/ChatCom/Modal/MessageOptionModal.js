import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import CustomModal from '../../SharedComponent/CustomModal';
import {useDispatch} from 'react-redux';
import {setMessageOptionData} from '../../../store/reducer/ModalReducer';
import {handleDelete, onEmojiClick} from '../../../actions/apiCall';
import BinIcon from '../../../assets/Icons/BinIcon';
import EditIconTwo from '../../../assets/Icons/EditIcon2';
import NewPinIcon from '../../../assets/Icons/NewPinIcon';
import CopyIcon from '../../../assets/Icons/CopyIcon';
import Divider from '../../SharedComponent/Divider';
import Clipboard from '@react-native-clipboard/clipboard';
import {useTheme} from '../../../context/ThemeContext';
import MessageIcon from '../../../assets/Icons/MessageIcon';
import {useNavigation} from '@react-navigation/native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
const {width} = Dimensions.get('window');

const MessageOptionModal = ({
  handlePin,
  setMessageEditVisible,
  messageOptionData = {},
  isThread = '',
}) => {
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const copyToClipboard = () => {
    Clipboard.setString(messageOptionData?.text);
  };
  const navigation = useNavigation();
  const data = [
    {
      label: 'Reply in thread',
      value: 'thread',
      icon: <MessageIcon />,
      function: () => {
        navigation.navigate('ThreadScreen', {chatMessage: messageOptionData}),
          dispatch(setMessageOptionData(null));
      },
    },
    {
      label: messageOptionData?.pinnedBy ? 'Unpin Message' : 'Pin Message',
      value: 'pin',
      icon: <NewPinIcon />,
      function: () => handlePin(messageOptionData._id),
    },
    {
      label: 'Delete this message',
      value: 'delete',
      icon: <BinIcon />,
      function: () => {
        handleDelete(messageOptionData._id, isThread),
          dispatch(setMessageOptionData(null));
      },
    },
    {
      label: 'Edit this message',
      value: 'edit',
      icon: <EditIconTwo />,
      function: () => {
        setMessageEditVisible(messageOptionData);
        dispatch(setMessageOptionData(null));
      },
    },
    {
      label: 'Copy this message',
      value: 'copy',
      icon: <CopyIcon />,
      function: () => {
        copyToClipboard();
        dispatch(setMessageOptionData(null));
      },
    },
  ];

  const optionData = isThread
    ? data.filter(item => item.value !== 'thread' && item.value !== 'pin')
    : data;

  let emojies = [
    {
      name: 'like',
      symbol: '👍',
    },
    {
      name: 'lovely',
      symbol: '😍',
    },
    {
      name: 'love',
      symbol: '❤️',
    },
    {
      name: 'luffing',
      symbol: '😂',
    },
    {
      name: 'cute',
      symbol: '🥰',
    },
    {
      name: 'wow',
      symbol: '😯',
    },
  ];

  const withMyEmoji = emojies.map(item =>
    item.symbol == messageOptionData?.myReaction ? {...item, my: true} : item,
  );

  const opponentOption = optionData.filter(
    item => item.value !== 'delete' && item.value !== 'edit',
  );
  const filteredOption = !messageOptionData?.my
    ? opponentOption
    : messageOptionData?.text?.length === 0
    ? optionData?.filter(item => item.value !== 'edit' && item.value !== 'copy')
    : optionData;

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={item.function}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}>
        {item?.icon}
        <Text style={{color: Colors.BodyText, fontSize: 20}}>
          {item?.label || 'Unavailable'}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <CustomModal
      customStyles={{
        padding: 20,
        maxHeight: 100 * filteredOption.length,
        minHeight: 150,
        width: '90%',
        paddingTop: 20,
      }}
      parentStyle={{zIndex: 2}}
      onPress={() => dispatch(setMessageOptionData(null))}>
      <FlatList
        data={filteredOption}
        renderItem={renderItem}
        keyExtractor={() => Math.random()}
        ItemSeparatorComponent={() => (
          <Divider
            style={{backgroundColor: Colors.BodyText}}
            marginTop={1.5}
            marginBottom={1.5}
          />
        )}
      />
      {!isThread && (
        <View style={styles.emojiBox}>
          {withMyEmoji.map(item => (
            <TouchableOpacity
              onPress={() => {
                onEmojiClick(item.symbol, messageOptionData._id);
                dispatch(setMessageOptionData(null));
              }}
              style={[
                styles.emoji,
                item.my && {
                  backgroundColor: Colors.SecondaryButtonBackgroundColor,
                },
              ]}
              key={item.name}>
              <Text style={{fontSize: 25}}>{item.symbol}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </CustomModal>
  );
};

export default MessageOptionModal;

const getStyles = Colors =>
  StyleSheet.create({
    emojiBox: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 20,
      justifyContent: 'space-between',
    },
    emoji: {
      padding: responsiveScreenWidth(1.8),
      backgroundColor: Colors.CyanOpacity,
      borderRadius: 100,
    },
  });
