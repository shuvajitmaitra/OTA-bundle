import { StyleSheet, Text, View, TouchableOpacity, Alert, ToastAndroid } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { responsiveScreenWidth, responsiveScreenFontSize, responsiveScreenHeight } from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import CustomFonts from "../../../constants/CustomFonts";
import { seconds2time } from "../../../utility";
import axiosInstance from "../../../utility/axiosInstance";
import { Feather } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { ModuleContext } from "./ContentList";
import WebView from "react-native-webview";
import ArrowTopIcon from "../../../assets/Icons/ArrowTopIcon";
import { ArrowDownTwo } from "../../../assets/Icons/ArrowDownTwo";
import { PlayButtonIcon } from "../../../assets/Icons/PlayButtonIcon";
import { ReadIcon } from "../../../assets/Icons/ReadIcon";
import { LockIcon } from "../../../assets/Icons/LockIconTwo";
import NewIcon from "../../../assets/Icons/NewIcon";
import PinIcon from "../../../assets/Icons/PinIcon";
import ThreedotIcon from "../../../assets/Icons/ThreedotIcon";
import { ScrollView } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import color from "../../../constants/color";
import { Popover, usePopover } from "react-native-modal-popover";
import { RadioButton } from "react-native-paper";
import ProgramTextDetailsModal from "./Modal/ProgramTextDetailsModal";
import { useTheme } from "../../../context/ThemeContext";
import { showToast } from "../../HelperFunction";
import Priority from "./Priority";
import BottomNavigationContainer from "./BottomNavigationContainer";
import GlobalRadioGroup from "../../SharedComponent/GlobalRadioButton";
import { showAlertModal } from "../../../utility/commonFunction";

export default function ProgramFiles({ item, course, category, isChildren }) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();
  const { isPlayingLesson, setIsPlayingLesson, dataLoad, handleUpdateRootChapter } = useContext(ModuleContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [checked, setChecked] = React.useState();
  const [checked, setChecked] = useState(item?.isFocused ? "focus" : item?.isPinned ? "pin" : item?.isCompleted ? "complete" : null);
  const [type, setType] = useState("");
  const [isProgramDetailsModalVisible, setProgramDetailsModalVisible] = useState(false);
  const dataListArray = ["summary", "implementation", "interview", "behavioral"];

  const handleRadioChecked = (type) => {
    axiosInstance
      .post(`course/chapterv2/track/${item?.myCourse?.course}`, {
        action: type,
        chapterId: item?._id,
      })
      .then((res) => {
        let obj = {};
        if (type === "pin") obj = { isPinned: true };
        else if (type === "unpin") obj = { isPinned: false };
        else if (type === "focus") obj = { isFocused: true };
        else if (type === "unfocus") obj = { isFocused: false };
        else if (type === "complete") obj = { isCompleted: true };
        else if (type === "incomplete") obj = { isCompleted: false };

        if (isChildren) {
          let arr = [...treeData];
          let index = arr.findIndex((x) => x._id === item._id);
          arr[index] = { ...arr[index], ...obj };
          setTreeData(arr); // Update state to trigger re-render
        } else {
          handleUpdateRootChapter(item._id, obj);
        }
        showToast(`Added on ${type}`);
      })
      .catch((err) => {
        showAlertModal({
          title: "Error",
          type: "error",
          message: err?.response?.data?.error || "Something went wrong!",
        });
        console.log(err);
      });

    setChecked(type);
  };

  const radioOptions = [
    { label: item?.isPinned ? "Unpin" : "Pin", value: item?.isPinned ? "unpin" : "pin" },
    { label: item?.isFocused ? "Unfocus" : "Focus", value: item?.isFocused ? "unfocus" : "focus" },
    { label: item?.isCompleted ? "Incomplete" : "Complete", value: item?.isCompleted ? "incomplete" : "complete" },
  ];

  const handleRadioSelect = (selectedValue) => {
    handleRadioChecked(selectedValue);
    closePopover();
  };

  const onLoadData = ({ key }) => {
    return new Promise((resolve) => {
      setIsLoading(true);
      axiosInstance
        .post(`/course/chapterv2/get/${course?.slug}/${category}`, {
          parent: key,
        })
        .then((res) => {
          const loadedChildren = res.data.chapters.map((child) => ({
            title: child?.lesson?.title || child?.chapter?.name,
            key: child?._id,
            isLeaf: child?.type !== "chapter",
            ...child,
          }));
          setTreeData(loadedChildren);
          setIsLoading(false);
          resolve();
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
          resolve();
        });
    });
  };

  const handleCollapse = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    if (isExpanded && treeData?.length === 0) {
      onLoadData({ key: item?._id });
    }
  }, [isExpanded, dataLoad]);

  const handleClickLesson = async (lesson) => {
    if (lesson?.lesson?.type === "video") {
      setIsPlayingLesson(lesson);
    } else {
      showAlertModal({
        title: "Unsupported File Type",
        type: "warning",
        message: "This file type can be opened in next update.",
      });
    }
  };
  const injectedJavaScript = `
  const iframe = document.querySelector('iframe');
  const player = new Vimeo.Player(iframe);

  player.on('play', function() {
    iframe.requestFullscreen();
  });
`;
  const VideoButtonContainer = ({ item }) => {
    return (
      <View style={styles.videoTypeContainer}>
        {dataListArray.map((itemCat, index) => {
          if (!item?.lesson?.data?.[itemCat]) return null;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setType(itemCat);
                setProgramDetailsModalVisible(true);
              }}
              disabled={!item?.lesson?.data?.[itemCat]}
              activeOpacity={0.8}
              style={[
                styles.videoType,
                {
                  backgroundColor: item?.lesson?.data?.[itemCat] ? Colors.White : Colors.BorderColor,
                },
              ]}
            >
              <Text style={styles.videoTypeTitle}>{itemCat}</Text>
            </TouchableOpacity>
          );
        })}
        {item?.lesson?.data && isProgramDetailsModalVisible && (
          <ProgramTextDetailsModal
            itemType={type}
            item={item}
            dataListArray={dataListArray}
            setProgramDetailsModalVisible={setProgramDetailsModalVisible}
            isProgramDetailsModalVisible={isProgramDetailsModalVisible}
          />
        )}
      </View>
    );
  };

  const { openPopover, closePopover, popoverVisible, touchableRef, popoverAnchorRect } = usePopover();

  return (
    <View
      style={[
        item.type == "chapter" ? styles.chapterContainer : styles.lessonContainer,
        // {
        //   // width: isChildren ? "98%" : "100%",
        //   marginHorizontal: isChildren ? "1%" : 0,
        // },
        {
          borderColor: isChildren && item?.type === "chapter" ? Colors.BorderColor : Colors.BorderColor,
          backgroundColor:
            isChildren && item?.type === "chapter"
              ? Colors.Background_color
              : // : Colors.Yellow,
                Colors.White,
          marginTop: isChildren && item?.type === "chapter" && responsiveScreenHeight(1),
          borderRadius: 10,
          // marginTop: isChildren && item?.type === "lesson" && 10,
          // paddingBottom: 10,
          marginBottom: responsiveScreenHeight(1),
        },
      ]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() =>
              item.isLocked
                ? showAlertModal({
                    title: "Program Locked",
                    type: "warning",
                    message: "This Program is locked...",
                  })
                : item?.type === "chapter"
                ? handleCollapse()
                : item?.type === "lesson"
                ? handleClickLesson(item)
                : null
            }
            activeOpacity={0.7}
            style={[
              item.type == "lesson" ? styles.expandedTitleContainer : styles.titleContainer,
              {
                // backgroundColor: "pink",

                flex: 0.8,
              },
            ]}
          >
            <View
              style={{
                flex: 0.07,
              }}
            >
              {item.type == "lesson" && (
                <View>
                  {item.isLocked ? (
                    <LockIcon />
                  ) : item?.type === "lesson" ? (
                    <>
                      {item?.lesson?.type === "video" ? (
                        <PlayButtonIcon />
                      ) : item?.lesson?.type === "link" ? (
                        <EvilIcons
                          name="external-link"
                          size={responsiveScreenFontSize(3)}
                          style={[
                            styles.icon,
                            {
                              color: Colors.BodyText,
                              width: responsiveScreenWidth(5),
                            },
                          ]}
                        />
                      ) : item?.lesson?.type === "file" ? (
                        <ReadIcon />
                      ) : item?.lesson?.type === "slide" ? (
                        <ReadIcon />
                      ) : null}
                    </>
                  ) : null}
                </View>
              )}
              {item?.type === "chapter" && (item?.isLocked ? <LockIcon /> : isExpanded ? <ArrowTopIcon /> : <ArrowDownTwo />)}
            </View>
            <View
              style={{
                // backgroundColor: "red",
                flexDirection: "row",
                flex: 0.93,
                // justifyContent: "flex",
                gap: responsiveScreenWidth(1),
                alignItems: "flex-start",
                // width: "90%",
                marginLeft: responsiveScreenWidth(1),
              }}
            >
              <Text
                style={[
                  item?.type === "chapter" ? styles.details : styles.lessonDetails,
                  // { width: "90%" },
                ]}
              >
                {item?.title}
              </Text>
              <Priority priority={item.priority} />
            </View>
          </TouchableOpacity>
          <View style={styles.rightIconsContainer}>
            <TouchableOpacity>{item.isPinned ? <PinIcon /> : null}</TouchableOpacity>
            <TouchableOpacity ref={touchableRef} onPress={openPopover} activeOpacity={0.8} style={styles.threeDotIcon}>
              <ThreedotIcon />
            </TouchableOpacity>

            <Popover
              contentStyle={styles.popupContent}
              arrowStyle={styles.popupArrow}
              backgroundStyle={{ backgroundColor: Colors.BackDropColor }}
              visible={popoverVisible}
              onClose={closePopover}
              fromRect={popoverAnchorRect}
              supportedOrientations={["portrait", "landscape"]}
              placement="bottom"
            >
              <GlobalRadioGroup options={radioOptions} onSelect={handleRadioSelect} selectedValue={checked} />
            </Popover>
          </View>
        </View>
        {isPlayingLesson && isPlayingLesson?._id === item?._id && (
          <>
            <View style={{ aspectRatio: 16 / 9 }}>
              <WebView
                source={{
                  html: `<iframe src=${
                    isPlayingLesson?.lesson?.url || "https://placehold.co/1920x1080.mp4?text=No+Video+Available"
                  } width="100%" height="100%" frameborder="0" allowFullScreen   allow="accelerometer; autoplay; clipboard-write; 
                  encrypted-media; gyroscope; 
                  picture-in-picture; web-share" ></iframe>`,
                }}
                onError={() => null}
                allowsFullscreenVideo={true}
                scrollEnabled={false}
                injectedJavaScript={injectedJavaScript}
                automaticallyAdjustContentInsets={false}
              />
            </View>
            <VideoButtonContainer item={item} />
          </>
        )}
      </View>
      {isLoading ? <ActivityIndicator size="small" color={Colors.Primary} style={styles.loader} /> : isExpanded ? <></> : null}
      {isExpanded &&
        treeData.map((child) => <ProgramFiles item={child} key={child._id} course={course} category={category} isChildren={true} />)}
      {isExpanded && item?.type == "chapter" && <BottomNavigationContainer />}
    </View>
  );
}

const getStyles = (Colors) =>
  StyleSheet.create({
    popupContent: {
      padding: 16,
      backgroundColor: Colors.White,
      borderRadius: 8,
      width: responsiveScreenWidth(50),
      height: responsiveScreenHeight(15),
      top: responsiveScreenHeight(-2.5),
    },
    popupArrow: {
      borderTopColor: Colors.White,
      marginTop: responsiveScreenHeight(-2.5),
    },
    radioContainer: {
      flexDirection: "row",
      alignItems: "center",
      // marginTop: responsiveScreenHeight(2)
    },
    radioText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      color: Colors.Heading,
    },
    btnContainer: {
      backgroundColor: "rgba(84, 106, 126, 1)",
      height: responsiveScreenHeight(4.5),
      borderRadius: responsiveScreenWidth(1),
      justifyContent: "center",
      alignItems: "center",
    },
    buttonName: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.5),
      color: Colors.White,
      paddingHorizontal: responsiveScreenWidth(5),
    },
    lessonContainer: {
      width: "100%",
      justifyContent: "center",
    },
    chapterContainer: {
      width: "100%",
      alignSelf: "center",
      borderRadius: 10,
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      backgroundColor: Colors.Background_color,
      paddingVertical: responsiveScreenHeight(2),
      marginBottom: responsiveScreenHeight(2),
      justifyContent: "center",
      // backgroundColor: Colors.Red
    },
    contentContainer: {
      // padding: 5,
      paddingHorizontal: responsiveScreenWidth(1),
      // paddingBottom: responsiveScreenHeight(1),
      borderRadius: 10,
      // backgroundColor: Colors.Red
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      // backgroundColor: Colors.Yellow
    },
    titleContainer: {
      flexDirection: "row",
      // justifyContent: "space-between",
      alignItems: "center",
      width: "85%",
      paddingHorizontal: responsiveScreenWidth(1),
      // backgroundColor: "blue",
      gap: responsiveScreenWidth(2),
    },
    expandedTitleContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      gap: responsiveScreenHeight(1),
      alignItems: "center",
      paddingVertical: responsiveScreenHeight(2),
      width: "86%",
    },
    details: {
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      textAlign: "left",
      // minHeight: responsiveScreenHeight(4),
    },
    lessonDetails: {
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.7),
    },
    rightIconsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: responsiveScreenWidth(1),
      // paddingTop: responsiveScreenHeight(2.5),
      // backgroundColor: "red",
      flex: 0.2,
    },
    threeDotIcon: {
      paddingHorizontal: responsiveScreenWidth(1),
    },
    loader: {
      marginTop: responsiveScreenHeight(2),
    },
    videoTypeContainer: {
      marginTop: responsiveScreenHeight(2),
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: 10,
    },
    videoType: {
      backgroundColor: Colors.White,
      width: responsiveScreenWidth(35),
      height: responsiveScreenHeight(5),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 6,
      borderWidth: 1,
      borderColor: Colors.Primary,
    },
    videoTypeTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.7),
      color: Colors.Primary,
      textTransform: "capitalize",
    },
  });
