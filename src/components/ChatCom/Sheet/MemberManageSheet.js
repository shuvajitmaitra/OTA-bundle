import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import CustomBottomSheet from '../../SharedComponent/CustomBottomSheet';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedMembers} from '../../../store/reducer/chatSlice';
import Divider from '../../SharedComponent/Divider';
import CustomFonts from '../../../constants/CustomFonts';
import {useTheme} from '../../../context/ThemeContext';
import CustomeBtn from '../../AuthenticationCom/CustomeBtn';
import {handleRemoveUser, handleUpdateMember} from '../../../actions/apiCall';
import GlobalRadioGroup from '../../SharedComponent/GlobalRadioButton';
import ChatMuteModal from '../Modal/ChatMuteModal';

const MemberManageSheet = ({
  option,
  blockConfirm = false,
  setBlockConfirm = () => {},
  removeConfirm = false,
  setRemoveConfirm = () => {},
  roleClicked = false,
  setRoleClicked = () => {},
  role,
  muteClicked = false,
  setMuteClicked = () => {},
}) => {
  const dispatch = useDispatch();
  const {selectedMember} = useSelector(state => state.chatSlice);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const options = [
    {label: 'Admin', value: 'admin'},
    {label: 'Moderator', value: 'moderator'},
    {label: 'Member', value: 'member'},
  ];
  return (
    <>
      {selectedMember._id && (
        <CustomBottomSheet
          onBackdropPress={() => dispatch(setSelectedMembers({}))}>
          {!muteClicked && !roleClicked && !blockConfirm && !removeConfirm && (
            <FlatList
              data={option}
              renderItem={({item}) => (
                <TouchableOpacity onPress={item.function} style={styles.list}>
                  {item.icon}
                  <Text style={styles.listText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={<Divider />}
            />
          )}
          {muteClicked && (
            <ChatMuteModal
              fullName={selectedMember.user.fullName}
              onSave={action => {
                handleUpdateMember({
                  ...action,
                  chat: selectedMember?.chat,
                  member: selectedMember?._id,
                });
                setMuteClicked(false);
              }}
              onCancel={() => {
                dispatch(setSelectedMembers({}));
                setMuteClicked(false);
              }}
            />
          )}
          {roleClicked && (
            <GlobalRadioGroup
              options={options}
              onSelect={value => {
                handleUpdateMember({
                  actionType: 'role',
                  member: selectedMember?._id,
                  chat: selectedMember?.chat,
                  role: value,
                });
                setRoleClicked(false);
              }}
              selectedValue={role}
            />
          )}
          {blockConfirm && (
            <View>
              <Text style={styles.titleText}>
                Do you want to block the user?
              </Text>
              <View style={{flexDirection: 'row', gap: 10}}>
                <CustomeBtn
                  handlePress={() => {
                    dispatch(setSelectedMembers({}));
                    setBlockConfirm(false);
                  }}
                  title="Cancel"
                  customeContainerStyle={{
                    flex: 0.5,
                    backgroundColor: Colors.SecondaryButtonBackgroundColor,
                  }}
                  isLoading={false}
                  disable={false}
                />
                <CustomeBtn
                  handlePress={() => {
                    handleUpdateMember({
                      member: selectedMember?._id,
                      chat: selectedMember?.chat,
                      actionType: selectedMember.isBlocked
                        ? 'Unblock'
                        : 'block',
                    });
                    setBlockConfirm(false);
                  }}
                  title={selectedMember.isBlocked ? 'Unblock' : 'Block'}
                  customeContainerStyle={{flex: 0.5}}
                  isLoading={false}
                  disable={false}
                />
              </View>
            </View>
          )}
          {removeConfirm && (
            <View>
              <Text style={styles.titleText}>
                Do you want to remove the user?
              </Text>
              <View style={{flexDirection: 'row', gap: 10}}>
                <CustomeBtn
                  handlePress={() => {
                    dispatch(setSelectedMembers({}));
                    setRemoveConfirm(false);
                  }}
                  title="Cancel"
                  customeContainerStyle={{
                    flex: 0.5,
                    backgroundColor: Colors.SecondaryButtonBackgroundColor,
                  }}
                  isLoading={false}
                  disable={false}
                />
                <CustomeBtn
                  handlePress={() => {
                    handleRemoveUser(selectedMember.chat, selectedMember._id);
                    setRemoveConfirm(false);
                  }}
                  title={'Remove'}
                  customeContainerStyle={{flex: 0.5}}
                  isLoading={false}
                  disable={false}
                />
              </View>
            </View>
          )}
        </CustomBottomSheet>
      )}
    </>
  );
};

export default MemberManageSheet;
const getStyles = Colors =>
  StyleSheet.create({
    titleText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: 20,
      textAlign: 'center',
      color: Colors.Heading,
    },
    listText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: 18,
    },
    list: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
  });
