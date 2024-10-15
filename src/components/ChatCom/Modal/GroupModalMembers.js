import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";

import GroupMemberInfo from "./GroupMemberInfo";
import CustomeFonts from "../../../constants/CustomeFonts";
import SearchAndFilter from "./SearchAndFilter";
import ArrowRight from "../../../assets/Icons/ArrowRight";
import NoDataAvailable from "../../SharedComponent/NoDataAvailable";
import useChat from "../../../hook/useChat";
import Loading from "../../SharedComponent/Loading";

export default function GroupModalMembers({}) {
  const {
    chat,
    fetchMembers,
    members,
    filterMembers,
    setFilterMembers,
    isLoading,
  } = useChat();
  const [seeMoreClicked, setSeeMoreClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   fetchMembers();
  // }, []);

  const handleRadioButton = (val) => {
    if (val === 1) {
      // Filtering for blocked users
      let filteredChats = members?.filter((c) => c?.isBlocked);
      // console.log(JSON.stringify(filteredChats, null, 2));
      setFilterMembers(filteredChats);
    } else if (val === 2) {
      // Filtering for muted users
      let filteredChats = members?.filter((c) => c?.mute?.isMuted);
      // console.log(JSON.stringify(filteredChats, null, 1));
      setFilterMembers(filteredChats);
    } else {
      // Resetting to all members if no filter is applied
      setFilterMembers(members);
    }
  };

  const handleFilter = (val) => {
    if (val) {
      let filteredChats = members?.filter((c) =>
        c?.user?.fullName?.toLowerCase().includes(val?.toLowerCase())
      );
      setFilterMembers(filteredChats);
    } else {
      setFilterMembers(members);
    }
  };

  const limitedMembers =
    filterMembers?.length > 6 ? filterMembers.slice(0, 6) : filterMembers;
  const handleSeeMore = () => {
    setSeeMoreClicked(!seeMoreClicked);
  };
  const allMembers = seeMoreClicked ? filterMembers : limitedMembers;
  return (
    <View
      style={{
        paddingTop: responsiveScreenHeight(0.5),
      }}
    >
      <SearchAndFilter
        handleRadioButton={handleRadioButton}
        handleFilter={handleFilter}
      />
      {loading ? (
        <Loading />
      ) : (
        <View
          style={{
            paddingTop: responsiveScreenHeight(0.7),
          }}
        >
          {allMembers?.map((item, index) => {
            return (
              <GroupMemberInfo
                chat={chat}
                fetchMembers={fetchMembers}
                key={index}
                item={item}
                index={index}
                setLoading={setLoading}
              />
            );
          })}
        </View>
      )}
      {(isLoading && <Loading />) ||
        (filterMembers?.length === 0 && <NoDataAvailable />) ||
        (filterMembers?.length > 6 && (
          <TouchableOpacity
            onPress={() => handleSeeMore()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: responsiveScreenWidth(2),
              paddingVertical: responsiveScreenHeight(1),
            }}
          >
            <Text
              style={{
                color: "rgba(39, 172, 31, 1)",
                fontFamily: CustomeFonts.SEMI_BOLD,
                fontSize: responsiveScreenFontSize(1.8),
              }}
            >
              {seeMoreClicked ? "See Less" : "See More"}
            </Text>
            <ArrowRight />
          </TouchableOpacity>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({});
