import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import GroupMemberInfo from './GroupMemberInfo';
import CustomFonts from '../../../constants/CustomFonts';
import ArrowRight from '../../../assets/Icons/ArrowRight';
import NoDataAvailable from '../../SharedComponent/NoDataAvailable';
import Loading from '../../SharedComponent/Loading';
import {useSelector} from 'react-redux';
import ArrowLeft from '../../../assets/Icons/ArrowLeft';
import {useTheme} from '../../../context/ThemeContext';

export default function GroupModalMembers() {
  const [seeMoreClicked, setSeeMoreClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  const {crowdMembers} = useSelector(state => state.chatSlice);
  const [filterMembers, setFilterMembers] = useState(crowdMembers);

  useEffect(() => {
    setFilterMembers(crowdMembers);

    return () => {
      setFilterMembers([]);
    };
  }, [crowdMembers]);

  const handleRadioButton = val => {
    if (val === 1) {
      // Filtering for blocked users
      let filteredChats = crowdMembers?.filter(c => c?.isBlocked);
      // console.log(JSON.stringify(filteredChats, null, 2));
      setFilterMembers(filteredChats);
    } else if (val === 2) {
      // Filtering for muted users
      let filteredChats = crowdMembers?.filter(c => c?.mute?.isMuted);
      // console.log(JSON.stringify(filteredChats, null, 1));
      setFilterMembers(filteredChats);
    } else {
      // Resetting to all members if no filter is applied
      setFilterMembers(crowdMembers);
    }
  };

  const handleFilter = val => {
    if (val) {
      let filteredChats = crowdMembers?.filter(c =>
        c?.user?.fullName?.toLowerCase().includes(val?.toLowerCase()),
      );
      setFilterMembers(filteredChats);
    } else {
      setFilterMembers(crowdMembers);
    }
  };

  const limitedMembers =
    filterMembers?.length > 6 ? filterMembers.slice(0, 6) : filterMembers;
  const handleSeeMore = () => {
    setSeeMoreClicked(!seeMoreClicked);
  };
  const allMembers = seeMoreClicked ? filterMembers : limitedMembers;
  const Colors = useTheme();
  return (
    <View
      style={{
        paddingTop: responsiveScreenHeight(0.5),
      }}>
      {/* <SearchAndFilter
        handleRadioButton={handleRadioButton}
        handleFilter={handleFilter}
      /> */}
      {false ? (
        <Loading />
      ) : (
        <View
          style={{
            paddingTop: responsiveScreenHeight(0.7),
          }}>
          {allMembers?.map((item, index) => {
            return (
              <GroupMemberInfo
                // chat={chat}
                // fetchMembers={fetchMembers}
                key={index}
                item={item}
                index={index}
                setLoading={setLoading}
              />
            );
          })}
        </View>
      )}
      {(filterMembers?.length === 0 && <NoDataAvailable />) ||
        (filterMembers?.length > 6 && (
          <TouchableOpacity
            onPress={() => handleSeeMore()}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: responsiveScreenWidth(2),
              paddingVertical: responsiveScreenHeight(1),
            }}>
            <Text
              style={{
                color: Colors.Primary,
                fontFamily: CustomFonts.SEMI_BOLD,
                fontSize: responsiveScreenFontSize(1.8),
              }}>
              {seeMoreClicked ? 'See Less' : 'See More'}
            </Text>
            {seeMoreClicked ? (
              <ArrowLeft color={Colors.Primary} size={20} />
            ) : (
              <ArrowRight />
            )}
          </TouchableOpacity>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({});
