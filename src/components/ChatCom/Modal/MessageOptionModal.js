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

const MessageOptionModal = ({
  handlePin,
  setMessageEditVisible,
  messageOptionData,
}) => {
  const dispatch = useDispatch();
  //   const {messageOptionData} = useSelector(state => state.chatSlice);
  const optionData = [
    {
      label: messageOptionData?.pinnedBy ? 'Unpin Message' : 'Pin Message',
      icon: <NewPinIcon />,
      function: () => handlePin(messageOptionData._id),
    },
    {
      label: 'Delete this message',
      icon: <BinIcon />,
      function: () => {
        handleDelete(messageOptionData._id),
          dispatch(setMessageOptionData(null));
      },
    },
    {
      label: 'Edit this message',
      icon: <EditIconTwo />,
      function: () => {
        setMessageEditVisible(messageOptionData);
        dispatch(setMessageOptionData(null));
      },
    },
    {
      label: 'Copy this message',
      icon: <CopyIcon />,
      function: () => {
        dispatch(setMessageOptionData(null));
      },
    },
    // {
    //   label: messageOptionData?.pinnedBy ? 'Unpin Message' : 'Pin Message',
    //   icon: <NewPinIcon />,
    //   function: () => handlePin(messageOptionData._id),
    // },
  ];

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
        <Text>{item?.label || 'Unavailable'}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <CustomModal
      customStyles={{paddingTop: 10, maxHeight: 160, minHeight: 100}}
      parentStyle={{zIndex: 2}}
      onPress={() => dispatch(setMessageOptionData(null))}>
      <FlatList
        data={optionData}
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

const styles = StyleSheet.create({});
