import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { responsiveScreenWidth, responsiveScreenFontSize, responsiveScreenHeight } from "react-native-responsive-dimensions";

import CustomFonts from "../../constants/CustomFonts";
import { useTheme } from "../../context/ThemeContext";
import Modal from "react-native-modal";

import ModalBackAndCrossButton from "../../components/ChatCom/Modal/ModalBackAndCrossButton";
import MyButton from "../../components/AuthenticationCom/MyButton";
import { Dialog, Provider, Caption, FAB } from "react-native-paper";
import AIcon from "react-native-vector-icons/AntDesign";
import axios from "../../utility/axiosInstance";
import CustomDropDownTwo from "../../components/SharedComponent/CustomDropDownTwo";
import CircleIcon from "../../assets/Icons/CircleIcon";
import UserIconTwo from "../../assets/Icons/UserIconTwo";
import PlusCircleIcon from "../../assets/Icons/PlusCircleIcon";
import Loading from "../../components/SharedComponent/Loading";
import SearchIcon from "../../assets/Icons/SearchIcon";
import Divider from "../SharedComponent/Divider";
import { Alert } from "react-native";
import NoDataAvailable from "../SharedComponent/NoDataAvailable";
import { useSelector } from "react-redux";
import { showAlertModal } from "../../utility/commonFunction";
import GlobalAlertModal from "../SharedComponent/GlobalAlertModal";

export default function ShareInterviewModal({ toggleShareModal, isShareModalVisible, interview }) {
  const [searchName, setSearchName] = useState("");
  const { user } = useSelector((state) => state.auth);

  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isUserFetching, setIsUserFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedUsers, setAddedUsers] = useState([]);

  // useEffect(() => {
  //   if (!isShareModalVisible && sound) {
  //     sound.pauseAsync?.();
  //     sound.unloadAsync?.();
  //   }
  // }, [isShareModalVisible, sound]);

  useEffect(() => {
    axios
      .get("/user/enrollmentdata")
      .then((res) => {
        setPrograms(res.data.programs || []);
        setSessions(res.data.sessions || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleAddUser = (user) => {
    if (addedUsers?.filter((u) => u?._id === user?._id)?.length > 0) {
      return;
    } else {
      setAddedUsers((prev) => [...prev, { ...user, canDelete: true }]);
    }
  };

  const isUserAdded = (user) => {
    return addedUsers.some((addedUser) => addedUser._id === user._id);
  };

  const handleRemove = (user) => {
    setAddedUsers((prev) => prev?.filter((u) => u?._id !== user?._id));
  };

  const fetchUsers = (options) => {
    setIsUserFetching(true);
    axios
      .post("/user/filter", options)
      .then((res) => {
        setFetchedUsers(res.data.users.filter((item) => item._id !== user._id) || []);
        setIsUserFetching(false);
      })
      .catch((err) => {
        setIsUserFetching(false);
        console.log(err);
      });
  };

  useEffect(() => {
    const searchParams = {
      program: selectedProgram,
      session: selectedSession,
      query: searchName,
    };

    fetchUsers(searchParams);
  }, [selectedProgram, selectedSession, searchName]);

  const handleShare = () => {
    setIsUserFetching(true);
    let data = {
      users: addedUsers.map((u) => u?._id),
    };
    axios
      .patch(`/interview/share/${interview}`, data)
      .then((res) => {
        showAlertModal({
          title: "Success",
          type: "success",
          message: "Shared successfully",
        });
        if (res.data.success) {
          toggleShareModal();
        }
        setIsUserFetching(false);
      })
      .catch((err) => {
        setIsUserFetching(false);
        console.log(err);
      });
  };

  return (
    <Modal isVisible={isShareModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalTop}>
          <ModalBackAndCrossButton toggleModal={toggleShareModal} />
        </View>
        <Text style={styles.heading}>Share Interview</Text>

        <View style={styles.inputContainer}>
          <TextInput
            keyboardAppearance={Colors.Background_color === "#F5F5F5" ? "light" : "dark"}
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={Colors.BodyText}
            value={searchName}
            onChangeText={(text) => setSearchName(text)}
            autoCorrect={false}
          />
          <SearchIcon />
        </View>
        <Divider marginBottom={0.00001} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {isUserFetching ? (
            <Loading />
          ) : (
            <View style={styles.searchContainer}>
              {/* Show User List*/}
              {fetchedUsers?.length > 0 ? (
                fetchedUsers?.map((user, index) => (
                  <View style={styles.userContainer} key={index}>
                    <View style={styles.user}>
                      <View style={{ position: "relative" }}>
                        {user.profilePicture ? (
                          <Image source={{ uri: user.profilePicture }} style={styles.img} />
                        ) : (
                          <UserIconTwo size={40} />
                        )}
                      </View>
                      <View>
                        <Text style={styles.name}>{user?.fullName}</Text>
                        <Text style={styles.id}>ID: {user?.id}</Text>
                      </View>
                    </View>
                    {isUserAdded(user) ? (
                      <TouchableOpacity style={styles.addedBtn} activeOpacity={0.3} disabled={true}>
                        <Text style={styles.addedBtnText}>Added</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.addBtn} activeOpacity={0.3} onPress={() => handleAddUser(user)}>
                        <Text style={styles.addBtnText}>Add</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <NoDataAvailable height={20} />
                </View>
              )}
            </View>
          )}
        </ScrollView>
        {/* <ScrollView
          nestedScrollEnabled={true}
          style={{
            maxHeight: 200,
            marginBottom: 10,
            backgroundColor: Colors.White,
            padding: 10,
          }}
        >
          {addedUsers?.length > 0 ? (
            addedUsers.map((user, i) => (
              <View key={i} style={styles.dCenterBet}>
                <Text style={styles.id}>{user.fullName}</Text>
                {user?.canDelete && (
                  <AIcon
                    onPress={() => handleRemove(user)}
                    size={25}
                    name="delete"
                    color="red"
                  />
                )}
              </View>
            ))
          ) : (
            <Text style={styles.name}>Shared with none</Text>
          )}
        </ScrollView> */}
        <View style={styles.btnContainer}>
          <MyButton
            onPress={() => {
              toggleShareModal();
            }}
            title={"Cancel"}
            bg={Colors.PrimaryOpacityColor}
            colour={Colors.Primary}
            flex={0.5}
            height={responsiveScreenHeight(5)}
          />
          <MyButton
            onPress={handleShare}
            title={"Share"}
            bg={Colors.Primary}
            colour={Colors.PureWhite}
            flex={0.5}
            height={responsiveScreenHeight(5)}
          />
        </View>
      </View>
      <GlobalAlertModal />
    </Modal>
  );
}

const getStyles = (Colors) =>
  StyleSheet.create({
    dCenterBet: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 5,
      borderBottomColor: Colors.BorderColor,
      borderBottomWidth: 1,
      paddingBottom: responsiveScreenHeight(1),
    },
    container: {
      flex: 1,
    },
    modalTop: {
      paddingVertical: responsiveScreenHeight(2),
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    modalContainer: {
      width: responsiveScreenWidth(90),
      backgroundColor: Colors.White,
      borderRadius: responsiveScreenWidth(3),
      paddingHorizontal: responsiveScreenWidth(5),
      paddingBottom: responsiveScreenHeight(1.5),
      maxHeight: responsiveScreenHeight(80),
      // height: responsiveScreenHeight(80),
    },
    heading: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
      marginBottom: responsiveScreenHeight(2),
    },
    title: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
    },
    searchContainer: {
      backgroundColor: Colors.Background_color,
      // paddingVertical: responsiveScreenWidth(1),
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(2),
      marginBottom: responsiveScreenHeight(2),
      marginTop: responsiveScreenHeight(2),
    },
    inputContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: "red",
      alignItems: "center",
      backgroundColor: Colors.Background_color,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenHeight(2),
    },
    input: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      flex: 1,
      minHeight: responsiveScreenHeight(5),
    },
    input2: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      flex: 1,
      zIndex: -2,
    },
    searchBtn: {
      width: responsiveScreenWidth(38.5),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenWidth(1.5),
      borderRadius: responsiveScreenWidth(1.5),
      backgroundColor: Colors.Primary,
      color: Colors.PureWhite,
      zIndex: -3,
    },
    btnText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.PureWhite,
      textAlign: "center",
    },
    userContainer: {
      flexDirection: "row",
      marginTop: responsiveScreenWidth(3),
      marginBottom: responsiveScreenWidth(3),
      justifyContent: "space-between",
    },
    user: {
      flexDirection: "row",
      gap: 8,
    },
    img: {
      height: 40,
      width: 40,
      borderRadius: 50,
    },
    name: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
      width: responsiveScreenWidth(50),
    },
    id: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.6),
      fontFamily: CustomFonts.REGULAR,
    },
    addBtnText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.PureWhite,
    },
    addBtn: {
      paddingHorizontal: responsiveScreenWidth(3),
      // paddingVertical: responsiveScreenHeight(.5),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      flexDirection: "row",
      gap: responsiveScreenWidth(1),
      alignItems: "center",
      height: responsiveScreenHeight(4),
      // justifyContent: "center",
    },
    addedBtnText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Primary,
    },
    addedBtn: {
      paddingHorizontal: responsiveScreenWidth(3),
      // paddingVertical: responsiveScreenHeight(.5),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.PrimaryOpacityColor,
      flexDirection: "row",
      gap: responsiveScreenWidth(1),
      alignItems: "center",
      height: responsiveScreenHeight(4),
      // justifyContent: "center",
    },
    btnContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: responsiveScreenHeight(2),
      alignItems: "center",
      // borderTopWidth: 1.5,
      // borderColor: Colors.BorderColor,
      paddingTop: responsiveScreenHeight(1),
      gap: 10,
    },
    noUsersText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      textAlign: "center",
      marginVertical: responsiveScreenHeight(2),
    },
  });
