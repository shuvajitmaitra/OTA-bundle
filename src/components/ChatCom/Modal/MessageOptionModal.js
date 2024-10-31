import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import CustomModal from '../../SharedComponent/CustomModal';
import {useDispatch, useSelector} from 'react-redux';
import {setMessageOptionData} from '../../../store/reducer/ModalReducer';
import {handleDelete} from '../../../actions/apiCall';
import BinIcon from '../../../assets/Icons/BinIcon';
import EditIconTwo from '../../../assets/Icons/EditIcon2';
import NewPinIcon from '../../../assets/Icons/NewPinIcon';
import CopyIcon from '../../../assets/Icons/CopyIcon';
import Divider from '../../SharedComponent/Divider';
import Clipboard from '@react-native-clipboard/clipboard';
import {useTheme} from '../../../context/ThemeContext';

const MessageOptionModal = ({
  handlePin,
  setMessageEditVisible,
  messageOptionData = {},
}) => {
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  //   const {messageOptionData} = useSelector(state => state.chatSlice);
  console.log('messageOptionData', JSON.stringify(messageOptionData, null, 1));
  const copyToClipboard = () => {
    Clipboard.setString(messageOptionData.text);
  };
  const optionData = [
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
        handleDelete(messageOptionData._id),
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

  console.log(
    'messageOptionData.my',
    JSON.stringify(!messageOptionData.my, null, 1),
  );

  const opponentOption = optionData.filter(
    item => item.value !== 'delete' && item.value !== 'edit',
  );
  const filteredOption = !messageOptionData.my
    ? opponentOption
    : messageOptionData.text.length === 0
    ? optionData.filter(item => item.value !== 'edit' && item.value !== 'copy')
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
        <Text style={{color: Colors.BodyText}}>
          {item?.label || 'Unavailable'}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <CustomModal
      customStyles={{paddingTop: 10, maxHeight: 160, minHeight: 100}}
      parentStyle={{zIndex: 2}}
      onPress={() => dispatch(setMessageOptionData(null))}>
      <FlatList
        data={filteredOption}
        renderItem={renderItem}
        keyExtractor={() => Math.random()}
        ItemSeparatorComponent={() => (
          <Divider marginTop={1} marginBottom={1} />
        )}
      />
    </CustomModal>
  );
};

export default MessageOptionModal;

const getStyles = Colors => StyleSheet.create({});
