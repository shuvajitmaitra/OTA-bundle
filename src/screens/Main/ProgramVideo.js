import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import {useRoute} from '@react-navigation/native';

import CustomFonts from '../../constants/CustomFonts';
import VideoPlayer from '../../components/ProgramCom/VideoPlayer';
import CusSegmentedButtons from '../../components/ProgramCom/CusSegmentedButtons';
import ProgramFiles from '../../components/ProgramCom/ProgramFiles';
import axiosInstance from '../../utility/axiosInstance';
import {seconds2time} from '../../utility';
import Loading from '../../components/SharedComponent/Loading';
import {useTheme} from '../../context/ThemeContext';
import PlayIcon from '../../assets/Icons/PlayIcon';
import {LockIcon} from '../../assets/Icons/LockIconTwo';

export default function ProgramVideo() {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [segmentValue, setSegmentValue] = React.useState('Module');
  const route = useRoute();
  const {videoURL, videoName} = route.params;

  const [isLoding, setIsLoading] = React.useState(true);
  const [chapters, setChapters] = React.useState([]);
  const [workshops, setWorkshops] = React.useState([]);
  const [labs, setLabs] = React.useState([]);
  const [interviews, setInterviews] = React.useState([]);

  const getAllData = async () => {
    let allCourses = await axiosInstance.get(
      `/course/content/flex:-software-quality-automation-engineer`,
    );
    allCourses = await allCourses.data;

    let myworkshop = await axiosInstance.get(`/workshop/myworkshop/workshop`);
    myworkshop = await myworkshop.data;

    let mylabs = await axiosInstance.get(`/workshop/myworkshop/lab`);
    mylabs = await mylabs.data;

    let myInterview = await axiosInstance.get(`/workshop/myworkshop/interview`);
    myInterview = await myInterview.data;

    setChapters(allCourses.chapters);
    setWorkshops(myworkshop.workshops);
    setLabs(mylabs.workshops);
    setInterviews(myInterview.workshops);
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (videoURL) {
      setIsLoading(true);
      getAllData();
    }
  }, []);

  const CourseContent = () => {
    if (segmentValue === 'Module') {
      return chapters.map(item => {
        let cls =
          item.lessons?.length > 1
            ? `${item.lessons?.length} Classes`
            : `${item.lessons?.length} Class`;
        let duration = seconds2time(
          item.lessons.reduce((a, b) => a + (b['duration'] || 0), 0),
        );

        if (item.isLocked) {
          return (
            <ProgramFiles
              icon={<LockIcon />}
              program={item}
              programTime={`${cls} • ${duration}`}
              key={item?._id}
            />
          );
        } else {
          return (
            <ProgramFiles
              icon={<PlayIcon />}
              program={item}
              programTime={`${cls} • ${duration}`}
              key={item?._id}
            />
          );
        }
      });
    } else if (segmentValue === 'Workshop') {
      return workshops.map(item => {
        let cls =
          item.lessons?.length > 1
            ? `${item.lessons?.length} Classes`
            : `${item.lessons?.length} Class`;
        let duration = seconds2time(
          item.lessons.reduce((a, b) => a + (b['duration'] || 0), 0),
        );

        if (item.isLocked) {
          return (
            <ProgramFiles
              icon={<LockIcon />}
              program={item}
              programTime={`${cls} • ${duration}`}
              key={item?._id}
            />
          );
        } else {
          return (
            <ProgramFiles
              icon={<PlayIcon />}
              program={item}
              programTime={`${cls} • ${duration}`}
              key={item?._id}
            />
          );
        }
      });
    } else if (segmentValue === 'Interview') {
      return interviews.map(item => {
        let cls =
          item.lessons?.length > 1
            ? `${item.lessons?.length} Classes`
            : `${item.lessons?.length} Class`;
        let duration = seconds2time(
          item.lessons.reduce((a, b) => a + (b['duration'] || 0), 0),
        );

        if (item.isLocked) {
          return (
            <ProgramFiles
              icon={<LockIcon />}
              program={item}
              programTime={`${cls} • ${duration}`}
              key={item?._id}
            />
          );
        } else {
          return (
            <ProgramFiles
              icon={<PlayIcon />}
              program={item}
              programTime={`${cls} • ${duration}`}
              key={item?._id}
            />
          );
        }
      });
    } else {
      return labs.map(item => {
        let cls =
          item.lessons?.length > 1
            ? `${item.lessons?.length} Classes`
            : `${item.lessons?.length} Class`;
        let duration = seconds2time(
          item.lessons.reduce((a, b) => a + (b.duration || 0), 0),
        );

        if (item.isLocked) {
          return (
            <ProgramFiles
              icon={<LockIcon />}
              program={item}
              programTime={`${cls} • ${duration}`}
              key={item?._id}
            />
          );
        } else {
          return (
            <ProgramFiles
              icon={<PlayIcon />}
              program={item}
              programTime={`${cls} • ${duration}`}
              key={item?._id}
            />
          );
        }
      });
    }
  };

  if (isLoding) {
    return <Loading />;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <VideoPlayer url={videoURL} />
        <Text style={styles.videoTitle}>{videoName}</Text>
        <View style={styles.videoTypeContainer}>
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.8}
            style={styles.videoType}>
            <Text style={styles.videoTypeTitle}>Summary</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.8}
            style={styles.videoType}>
            <Text style={styles.videoTypeTitle}>Implementation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.8}
            style={styles.videoType}>
            <Text style={styles.videoTypeTitle}>Interview</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.8}
            style={styles.videoType}>
            <Text style={styles.videoTypeTitle}>Behavioral</Text>
          </TouchableOpacity>
        </View>
        <CusSegmentedButtons value={segmentValue} setValue={setSegmentValue} />
        <CourseContent />
      </View>
    </ScrollView>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: responsiveScreenHeight(2),
      paddingBottom: responsiveScreenHeight(2),
    },
    videoTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
      marginHorizontal: responsiveScreenWidth(4),
      marginTop: responsiveScreenHeight(2),
    },
    videoTypeContainer: {
      marginHorizontal: responsiveScreenWidth(4),
      marginTop: responsiveScreenHeight(2),
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      rowGap: responsiveScreenHeight(1.5),
    },
    videoType: {
      backgroundColor: Colors.White,
      width: responsiveScreenWidth(44),
      height: responsiveScreenHeight(6),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    videoTypeTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.7),
      color: Colors.Primary,
    },
    icon: {
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(0.5),
    },
    checkicon: {
      color: Colors.Primary,
      marginTop: responsiveScreenHeight(0.5),
    },
  });
