import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Ellipse, Path } from "react-native-svg";
import React, { useState } from "react";
import CustomFonts from "../../constants/CustomFonts";
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import ArrowTopIcon from "../../assets/Icons/ArrowTopIcon";
import { ScrollView } from "react-native";
import { LineChapterModuleIcon } from "../../assets/Icons/LineChapterModuleIcon";
import ArrowDown from "../../assets/Icons/ArrowDown";
import { GreenCorrectIcon } from "../../assets/Icons/GreenCorrectIcon";
import { PlayButtonIcon } from "../../assets/Icons/PlayButtonIcon";
import { LockIcon } from "../../assets/Icons/LockIconTwo";
import ThreedotIcon from "../../assets/Icons/ThreedotIcon";
import ArrowRight from "../../assets/Icons/ArrowRight";
import { ReadIcon } from "../../assets/Icons/ReadIcon";
import { ArrowDownTwo } from "../../assets/Icons/ArrowDownTwo";
export const chaptersData = [
  {
    id: 1,
    title: "What youre going to get from this course",
    duration: "30m 08s",
    icon: "complete",
  },
  {
    id: 2,
    title: "What youre going to get from this course",
    duration: "30m 08s",
    icon: "video",
  },
  {
    id: 3,
    title: "What youre going to get from this course",
    duration: "Read 15 minutes",
    icon: "read",
  },
  {
    id: 4,
    title: "What youre going to get from this course",
    duration: "30m 08s",
    icon: "lock",
  },
];

export const Button = ({ title, btnWidth }) => {
  return (
    <View style={[buttonStyles.btnContainer, { width: btnWidth }]}>
      <Text style={buttonStyles.buttonName}>{title}</Text>
    </View>
  );
};

const buttonStyles = StyleSheet.create({
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
    maxWidth: responsiveScreenWidth(70),
  },
});

const ChapterModulesVideos = () => {
  const [chapters, setChapters] = useState(chaptersData);
  const [showChapter, setShowChapter] = useState(false);
  return (
    <ScrollView>
      <View style={chapterStyles.container}>
        <View style={chapterStyles.chapterArea}>
          <View style={chapterStyles.chapterNameArea}>
            <Text style={chapterStyles.chapterName}>Chapter 1 - Working with variable in Python to manage data</Text>
            {showChapter ? (
              <ArrowTopIcon onPress={() => setShowChapter(!showChapter)} />
            ) : (
              <ArrowDownTwo onPress={() => setShowChapter(!showChapter)} />
            )}
          </View>
          <View style={chapterStyles.lectureArea}>
            <Text style={chapterStyles.lectureDuration}>15 lectures • 1h 30m</Text>
          </View>
          <View style={chapterStyles.btnArea}>
            <Button title={"Chat"} btnWidth={70} />
            <Button title={"Calendar"} btnWidth={90} />
            <Button title={"Presentation"} btnWidth={110} />
          </View>

          {showChapter === true ? (
            <View>
              <View style={chapterStyles.lineContainer}>
                <LineChapterModuleIcon />
              </View>
              <View>
                {chapters &&
                  chapters.map((chapter, index) => (
                    <View style={chapterStyles.loadChapterTitleContainer} key={chapter.id}>
                      <View style={chapterStyles.loadChapterTitle}>
                        <View>
                          {chapter.icon === "complete" ? (
                            <GreenCorrectIcon />
                          ) : chapter.icon === "video" ? (
                            <PlayButtonIcon />
                          ) : chapter.icon === "read" ? (
                            <ReadIcon />
                          ) : chapter.icon === "lock" ? (
                            <LockIcon />
                          ) : null}
                        </View>

                        <View>
                          <Text style={chapterStyles.chapterTitle}>{chapter.title}</Text>
                          <Text style={chapterStyles.duration}>{chapter.duration}</Text>
                        </View>
                      </View>
                      <View>
                        <TouchableOpacity>
                          <ThreedotIcon />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
              </View>
              <View style={chapterStyles.lineContainer}>
                <LineChapterModuleIcon />
              </View>
              <TouchableOpacity onPress={() => {}}>
                <View style={chapterStyles.seeMore}>
                  <Text>See More</Text>
                  <ArrowRight />
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

export default ChapterModulesVideos;

const chapterStyles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    paddingTop: responsiveScreenHeight(5),
  },
  chapterArea: {
    borderWidth: 1,
    borderColor: "rgba(39, 172, 31, 1)",
    borderRadius: responsiveScreenWidth(2),
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
  },
  chapterNameArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chapterName: {
    fontFamily: CustomFonts.MEDIUM,
    fontSize: responsiveScreenFontSize(1.7),
    color: "rgba(11, 42, 70, 1)",
    maxWidth: responsiveScreenWidth(60),
  },
  lectureArea: {
    paddingTop: responsiveScreenHeight(1.7),
  },
  lectureDuration: {
    fontSize: responsiveScreenFontSize(1.7),
    color: "rgba(84, 106, 126, 1)",
    fontFamily: CustomFonts.REGULAR,
    fontWeight: "400",
  },
  btnArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: responsiveScreenHeight(1.7),
  },
  lineContainer: {
    paddingTop: responsiveScreenHeight(2),
    paddingBottom: responsiveScreenHeight(1),
  },
  loadChapterTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loadChapterTitle: {
    flexDirection: "row",
    width: responsiveScreenWidth(40),
    gap: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(1),
  },
  chapterTitle: {
    fontFamily: CustomFonts.MEDIUM,
    color: "rgba(11, 42, 70, 1)",
    fontSize: responsiveScreenFontSize(1.6),
    fontWeight: "500",
  },
  duration: {
    fontFamily: CustomFonts.MEDIUM,
    color: "rgba(84, 106, 126, 1)",
    fontSize: responsiveScreenFontSize(1.4),
    fontWeight: "400",
    paddingTop: responsiveScreenHeight(0.5),
  },
  seeMore: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: responsiveScreenWidth(2),
  },
});
