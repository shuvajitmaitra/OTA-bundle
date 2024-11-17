import React, { useState } from "react";
import { Modal, Portal, PaperProvider } from "react-native-paper";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import AIcon from "react-native-vector-icons/AntDesign";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import color from "../../constants/color";
import { seconds2time, dynamicSort } from "../../utility";
import { useTheme } from "../../context/ThemeContext";
import { useGlobalAlert } from "../SharedComponent/GlobalAlertContext";
const ModuleRoute = ({ chapters, handleClickLesson, handleSetData }) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const { showAlert } = useGlobalAlert();
  const [url, setUrl] = useState("");
  const [expanded, setExpanded] = useState([]);
  const handleCollapse = (item) => {
    setExpanded((state) =>
      state.includes(item) ? state?.filter((i) => i !== item) : [...state, item]
    );
  };

  return (
    <View>
      <ScrollView style={{ backgroundColor: color.bg }}>
        {chapters?.length > 0 &&
          chapters.map((chapter) => (
            <TouchableOpacity
              onPress={() =>
                chapter?.isLocked
                  ? showAlert({
                    title: "Module Locked",
                    type: "warning",
                    message:
                      "This module is locked...",
                  })
                  : handleCollapse(chapter?._id)
              }
              style={styles.chapterWrapper}
              key={chapter?._id}
              activeOpacity={0.9}
            >
              <View style={styles.header_content}>
                <View style={{ flexDirection: "row" }}>
                  {chapter?.isLocked ? (
                    <AIcon size={20} name="lock" />
                  ) : (
                    <AIcon size={20} name="checkcircleo" />
                  )}

                  <Text
                    style={{
                      marginLeft: 5,
                      flex: 1,
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "#0B2A46",
                    }}
                  >
                    {chapter.name}
                  </Text>

                  <View style={{ marginVertical: 5 }}>
                    {!chapter?.isLocked && (
                      <>
                        {expanded.includes(chapter?._id) ? (
                          <MaterialIcon size={20} name="expand-less" />
                        ) : (
                          <MaterialIcon size={20} name="expand-more" />
                        )}
                      </>
                    )}
                  </View>
                </View>

                <View style={{ flexDirection: "row", marginVertical: 4 }}>
                  <Text style={{ marginRight: 5, color: "#546A7E" }}>
                    {chapter.lessons?.length} Classes .
                  </Text>
                  <Text style={{ color: "#546A7E" }}>
                    {seconds2time(
                      chapter.lessons.reduce(
                        (a, b) => a + (b["duration"] || 0),
                        0
                      )
                    )}
                  </Text>
                </View>

                {expanded.includes(chapter?._id) && (
                  <View
                    style={{
                      height: 1,
                      width: "100%",
                      backgroundColor: "#0000001A",
                    }}
                  ></View>
                )}
              </View>

              {expanded.includes(chapter?._id) && (
                <View>
                  {chapter.lessons?.length > 0 &&
                    chapter.lessons.sort(dynamicSort("index")).map((lesson) => (
                      <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.content}
                        onPress={() => {
                          handleClickLesson(lesson);
                          setUrl(lesson?.url);
                        }}
                        key={lesson?._id}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <View style={{ flex: 1, flexDirection: "row" }}>
                            <View>
                              {lesson.type === "file" ? (
                                <AIcon
                                  color={
                                    url === lesson.url
                                      ? color.primary
                                      : "#546A7E"
                                  }
                                  size={20}
                                  name="filetext1"
                                />
                              ) : (
                                <AIcon
                                  color={
                                    url === lesson.url
                                      ? color.primary
                                      : "#546A7E"
                                  }
                                  size={20}
                                  name="playcircleo"
                                />
                              )}
                            </View>
                            <Text
                              style={{
                                marginLeft: 5,
                                color:
                                  url === lesson.url
                                    ? color.primary
                                    : "#546A7E",
                                fontWeight: 500,
                              }}
                            >
                              {" "}
                              {lesson.title}
                            </Text>
                          </View>

                          <Text>{seconds2time(lesson?.duration)}</Text>
                        </View>
                        {
                          <View
                            style={{
                              flexDirection: "row",
                              gap: 5,
                              marginTop: 5,
                            }}
                          >
                            {lesson?.data?.summary && (
                              <TouchableOpacity
                                onPress={() =>
                                  handleSetData({
                                    title: "Summary/Notes",
                                    content: lesson?.data?.summary,
                                  })
                                }
                                activeOpacity={0.5}
                                style={styles.dataButton}
                              >
                                <Text
                                  style={{
                                    color: color.primary,
                                    fontWeight: "bold",
                                    fontSize: 12,
                                  }}
                                >
                                  Summary
                                </Text>
                              </TouchableOpacity>
                            )}

                            {lesson?.data?.implementation && (
                              <TouchableOpacity
                                onPress={() =>
                                  handleSetData({
                                    title: "Technical Implementation",
                                    content: lesson?.data?.implementation,
                                  })
                                }
                                activeOpacity={0.5}
                                style={styles.dataButton}
                              >
                                <Text
                                  style={{
                                    color: color.primary,
                                    fontWeight: "bold",
                                    fontSize: 12,
                                  }}
                                >
                                  Implementation
                                </Text>
                              </TouchableOpacity>
                            )}
                            {lesson?.data?.interview && (
                              <TouchableOpacity
                                onPress={() =>
                                  handleSetData({
                                    title: "Interview Questions and Answers",
                                    content: lesson?.data?.interview,
                                  })
                                }
                                activeOpacity={0.5}
                                style={styles.dataButton}
                              >
                                <Text
                                  style={{
                                    color: color.primary,
                                    fontWeight: "bold",
                                    fontSize: 12,
                                  }}
                                >
                                  Interview
                                </Text>
                              </TouchableOpacity>
                            )}
                            {lesson?.data?.behavioral && (
                              <TouchableOpacity
                                onPress={() =>
                                  handleSetData({
                                    title: "Behavioral Questions and Answers",
                                    content: lesson?.data?.behavioral,
                                  })
                                }
                                activeOpacity={0.5}
                                style={styles.dataButton}
                              >
                                <Text
                                  style={{
                                    color: color.primary,
                                    fontWeight: "bold",
                                    fontSize: 12,
                                  }}
                                >
                                  Behavioral
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        }
                      </TouchableOpacity>
                    ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

export default ModuleRoute;

const getStyles = (Colors) =>
  StyleSheet.create({
    detailsContainer: {},
    iframeWrapper: {},
    header_content: {
      flexDirection: "column",
      paddingVertical: 15,
      paddingHorizontal: 10,
    },
    content: {
      padding: 10,
      flexDirection: "column",
      alignItems: "center",
    },
    chapterWrapper: {
      marginBottom: 5,
      backgroundColor: Colors.White,
      shadowColor: "#c5c5c5",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.17,
      shadowRadius: 2.54,
      elevation: 3,
      borderRadius: 5,
    },
    dataButton: {
      borderColor: color.primary,
      // backgroundColor: color.primaryLight,
      borderWidth: 1,
      borderRadius: 50,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
  });
