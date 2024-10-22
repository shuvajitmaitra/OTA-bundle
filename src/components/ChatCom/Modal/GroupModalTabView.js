import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import CustomeFonts from '../../../constants/CustomeFonts';
import UserModalImageGallary from '../UserModalImageGallary';
import UserModalUploadedFile from '../UserModalUploadedFile';
import UserModalVoice from '../UserModalVoice';
import GroupModalMembers from './GroupModalMembers';
import {useTheme} from '../../../context/ThemeContext';

// eslint-disable-next-line no-undef
export default GroupModalTabView = ({members}) => {
  // const {chat, fetchMembers, members, filterMembers, setFilterMembers} =
  //   useChat();

  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [status, setStatus] = useState('Members');

  const handleTabStatus = status => {
    setStatus(status);
  };
  const GroupTabLists = [
    {
      status: 'Members',
    },
    {
      status: 'Images',
    },
    // {
    //   status: 'Files',
    // },
    {
      status: 'Voices',
    },
  ];

  return (
    <View style={[styles.tabViewcontainer]}>
      <View style={styles.tabContainer}>
        {GroupTabLists.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleTabStatus(tab.status)}>
            <Text
              style={[
                {
                  fontFamily: CustomeFonts.MEDIUM,
                  fontSize: responsiveScreenFontSize(1.8),
                  color: Colors.BodyText,
                },
                status === tab.status && styles.tabActive,
              ]}>
              {tab.status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {status === 'Members' && <GroupModalMembers members={members} />}
      {/* <View>
        {
          //  ||
          (status === 'Images' && <UserModalImageGallary chat={chat} />) ||
            (status === 'Files' && <UserModalUploadedFile chat={chat} />) ||
            (status === 'Voices' && <UserModalVoice />)
        }
      </View> */}
    </View>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    tabViewcontainer: {
      minHeight: responsiveScreenHeight(10),
    },

    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: responsiveScreenWidth(10),
      alignItems: 'center',
      paddingBottom: responsiveScreenHeight(1),
    },
    tabActive: {
      color: Colors.Primary,
      borderBottomColor: Colors.Primary,
      borderBottomWidth: 2,
      paddingVertical: responsiveScreenWidth(1),
    },
  });
