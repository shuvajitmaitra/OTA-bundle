import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';

import CustomFonts from '../../constants/CustomFonts';
import {seconds2time} from '../../utility';
import {useTheme} from '../../context/ThemeContext';

export default function ProgramFiles({
  program,
  expanded,
  handleVideoItemClick,
  handleCollapse,
  selectedVideo,
}) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();

  const ProgramVideo = ({video, handeler}) => {
    return (
      <TouchableOpacity
        onPress={handeler}
        activeOpacity={0.8}
        style={styles.programVideoDetails}>
        {video.type === 'video' ? (
          <AntDesign
            name="playcircleo"
            size={responsiveScreenFontSize(2.6)}
            style={styles.checkicon}
          />
        ) : (
          <AntDesign
            name="filetext1"
            size={responsiveScreenFontSize(2.2)}
            style={styles.checkicon}
          />
        )}
        <Text
          style={[
            styles.programVideoName,
            {
              color:
                selectedVideo?._id === video?._id
                  ? Colors.Primary
                  : Colors.BodyText,
            },
          ]}>
          {video.title}
        </Text>
        {video.type === 'video' ? (
          <Text style={styles.programVideoTime}>
            {seconds2time(video.duration)}
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  let cls =
    program.lessons?.length > 1
      ? `${program.lessons?.length} Classes`
      : `${program.lessons?.length} Class`;
  let duration = seconds2time(
    program.lessons.reduce((a, b) => a + (b['duration'] || 0), 0),
  );

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        onPress={() =>
          program.isLocked
            ? Alert.alert("This Program is locked...")
            : handleCollapse()
        }
        activeOpacity={0.7}
        // style={styles.titleContainer}
      >
        {expanded.includes(program?._id) ? null : program.isLocked ? (
          <Fontisto
            name="locked"
            size={responsiveScreenFontSize(2.8)}
            style={styles.icon}
          />
        ) : (
          <AntDesign
            name="playcircleo"
            size={responsiveScreenFontSize(2.8)}
            style={styles.icon}
          />
        )}
        <Text style={styles.details}>{program?.name}</Text>
        <AntDesign
          name={expanded.includes(program?._id) ? "up" : "down"}
          size={responsiveScreenFontSize(2)}
          style={styles.downIcon}
        />
      </TouchableOpacity> */}
      <Text
        style={[
          styles.timing,
          {
            marginLeft: expanded.includes(program?._id)
              ? responsiveScreenWidth(2)
              : responsiveScreenWidth(8),
          },
        ]}>{`${cls} • ${duration}`}</Text>

      {expanded.includes(program?._id) ? (
        <View style={styles.programDetailsContainer}>
          <View style={styles.line}></View>

          {program?.lessons.map(item => {
            if (item?.type === 'video') {
              return (
                <ProgramVideo
                  key={item?.index}
                  video={item}
                  handeler={() => handleVideoItemClick({video: item})}
                />
              );
            } else {
              return (
                <ProgramVideo
                  key={item?.index}
                  video={item}
                  handeler={() => {
                    navigation.navigate('ProgramTextDetails', {
                      title: item.title,
                    });
                  }}
                />
              );
            }
          })}
        </View>
      ) : null}
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      width: responsiveScreenWidth(90),
      // paddingHorizontal: responsiveScreenWidth(3),
      paddingVertical: responsiveScreenHeight(2),
      marginTop: responsiveScreenHeight(2),
      backgroundColor: Colors.Red,
      alignSelf: 'center',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    titleContainer: {
      flexDirection: 'row',
      backgroundColor: 'red',
    },
    details: {
      width: responsiveScreenWidth(65),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.7),
      marginLeft: responsiveScreenWidth(2),
    },
    downIcon: {
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(0.5),
      marginLeft: responsiveScreenWidth(3),
      position: 'absolute',
      right: responsiveScreenWidth(3),
    },
    timing: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      marginTop: responsiveScreenHeight(0.5),
      marginLeft: responsiveScreenWidth(8),
    },
    line: {
      width: responsiveScreenWidth(80),
      height: 2,
      backgroundColor: Colors.LineColor,
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(2),
      marginBottom: responsiveScreenHeight(3),
    },
    programVideoDetails: {
      flexDirection: 'row',
      marginBottom: responsiveScreenHeight(2),
    },
    checkicon: {
      color: Colors.Primary,
    },
    icon: {
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(0.5),
    },
    programVideoName: {
      color: Colors.BodyText,
      width: responsiveScreenWidth(60),
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      marginLeft: responsiveScreenWidth(2),
    },
    programVideoTime: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      position: 'absolute',
      right: responsiveScreenWidth(5),
    },
  });
