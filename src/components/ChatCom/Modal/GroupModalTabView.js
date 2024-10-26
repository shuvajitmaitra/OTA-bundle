import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import CustomeFonts from '../../../constants/CustomeFonts';
import UserModalImageGallary from '../UserModalImageGallary';
import GroupModalMembers from './GroupModalMembers';
import {useTheme} from '../../../context/ThemeContext';
import {useSelector} from 'react-redux';
import axiosInstance from '../../../utility/axiosInstance';

// eslint-disable-next-line no-undef
export default GroupModalTabView = () => {
  // const {chat, fetchMembers, members, filterMembers, setFilterMembers} =
  //   useChat();
  const {singleChat: chat} = useSelector(state => state.chat);
  const [media, setMedia] = useState([]);
  const [isLoading, setLoading] = useState(true);

  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [status, setStatus] = useState(chat.isChannel ? 'Members' : 'Images');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = async () => {
    if (media.length > 0) {
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/chat/media/${chat?._id}`, {
        limit: 1,
        type: 'image',
      });
      if (response.data && Array.isArray(response.data.medias)) {
        const reversedMedias = [...response.data.medias].reverse();
        setMedia(reversedMedias);
      } else {
        setMedia([]);
      }
    } catch (error) {
      console.error('Failed to fetch media:', error.message);
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [chat._id]);
  const handleTabStatus = status => {
    setStatus(status);
  };
  const GroupTabLists = chat.isChannel
    ? [
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
      ]
    : [
        // {
        //   status: 'Members',
        // },
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
      {status === 'Members' && <GroupModalMembers />}
      {status === 'Images' && (
        <UserModalImageGallary
          chat={chat}
          media={media}
          isLoading={isLoading}
        />
      )}
      {/* {status === 'Voices' && <UserModalVoice />} */}
      {/* <View>
        {
          //  ||
          ||
            (status === 'Files' && <UserModalUploadedFile chat={chat} />) ||
            
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
