import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';

import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import axiosInstance from '../../utility/axiosInstance';
import ProgramDetailsCard from '../../components/ProgramCom/ProgramDetailsCard';
import ProgramTimeTracker from '../../components/ProgramCom/ProgramTimeTracker';
import ProgramFiles from '../../components/ProgramCom/ProgramFiles';
import {seconds2time} from '../../utility';
import VideoPlayer from '../../components/ProgramCom/VideoPlayer';
import CustomFonts from '../../constants/CustomFonts';
import Loading from '../../components/SharedComponent/Loading';
import {useTheme} from '../../context/ThemeContext';

export default function ProgramDetails({route, navigation}) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [segmentValue, setSegmentValue] = React.useState('Module');
  const [isLoding, setIsLoading] = React.useState(true);

  const [course, setCourse] = React.useState('');
  const [chapters, setChapters] = React.useState([]);
  const [reviewStatus, setreviewStatus] = React.useState('');
  const [rejectReason, setRejectReason] = React.useState('');

  const [workshops, setWorkshops] = React.useState([]);
  const [labs, setLabs] = React.useState([]);
  const [interviews, setInterviews] = React.useState([]);

  const [video, setVideo] = React.useState(null);
  const [expanded, setExpanded] = React.useState([]);

  const [myprogram, setMyProgram] = React.useState(null);

  const handleVideoItemClick = video => {
    setVideo(video.video);
  };

  const getAllData = async () => {
    let allCourses = await axiosInstance.get(
      `/course/content/${route?.params?.slug}`,
    );
    allCourses = await allCourses.data;

    let myworkshop = await axiosInstance.get(`/workshop/myworkshop/workshop`);
    myworkshop = await myworkshop.data;

    let mylabs = await axiosInstance.get(`/workshop/myworkshop/lab`);
    mylabs = await mylabs.data;

    let myInterview = await axiosInstance.get(`/workshop/myworkshop/interview`);
    myInterview = await myInterview.data;

    let myprogram = await axiosInstance.get('/enrollment/myprogram');
    myprogram = await myprogram.data;

    setCourse(allCourses.course);
    setChapters(allCourses.chapters);
    setreviewStatus(allCourses?.reviewStatus);
    setRejectReason(allCourses?.rejectReason);

    setWorkshops(myworkshop.workshops);
    setLabs(mylabs.workshops);
    setInterviews(myInterview.workshops);

    setMyProgram(myprogram);

    setIsLoading(false);
  };

  React.useEffect(() => {
    if (route?.params?.slug) {
      setIsLoading(true);
      getAllData();
    }
  }, [route]);

  const handleCollapse = item => {
    setExpanded(state =>
      state.includes(item) ? state?.filter(i => i !== item) : [...state, item],
    );
  };

  const CourseContent = React.memo(() => {
    let contentArray;

    switch (segmentValue) {
      case 'Module':
        contentArray = chapters;
        break;
      case 'Workshop':
        contentArray = workshops;
        break;
      case 'Interview':
        contentArray = interviews;
        break;
      default:
        contentArray = labs;
    }

    if (!contentArray) {
      return null;
    }

    return contentArray.map(item => (
      <ProgramFiles
        program={item}
        key={item?._id}
        handleVideoItemClick={handleVideoItemClick}
        expanded={expanded}
        handleCollapse={() => handleCollapse(item?._id)}
        selectedVideo={video}
      />
    ));
  });

  if (isLoding) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {video?.url ? (
        <>
          <VideoPlayer url={video?.url} />
          <Text style={styles.videoTitle}>{video?.title}</Text>
          <View style={styles.videoTypeContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ProgramTextDetails', {
                  title: video?.data?.summary,
                });
              }}
              disabled={
                video?.data?.summary === '' || video?.data?.summary === null
              }
              activeOpacity={0.8}
              style={[
                styles.videoType,
                {
                  backgroundColor: video?.data?.summary
                    ? Colors.White
                    : Colors.BorderColor,
                },
              ]}>
              <Text style={styles.videoTypeTitle}>Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ProgramTextDetails', {
                  title: video?.data?.implementation,
                });
              }}
              disabled={
                video?.data?.implementation === '' ||
                video?.data?.implementation === null
              }
              activeOpacity={0.8}
              style={[
                styles.videoType,
                {
                  backgroundColor: video?.data?.implementation
                    ? Colors.White
                    : Colors.BorderColor,
                },
              ]}>
              <Text style={styles.videoTypeTitle}>Implementation</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ProgramTextDetails', {
                  title: video?.data?.interview,
                });
              }}
              disabled={
                video?.data?.interview === '' || video?.data?.interview === null
              }
              activeOpacity={0.8}
              style={[
                styles.videoType,
                {
                  backgroundColor: video?.data?.interview
                    ? Colors.White
                    : Colors.BorderColor,
                },
              ]}>
              <Text style={styles.videoTypeTitle}>Interview</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ProgramTextDetails', {
                  title: video?.data?.behavioral,
                });
              }}
              disabled={
                video?.data?.behavioral === '' ||
                video?.data?.behavioral === null
              }
              activeOpacity={0.8}
              style={[
                styles.videoType,
                {
                  backgroundColor: video?.data?.behavioral
                    ? Colors.White
                    : Colors.BorderColor,
                },
              ]}>
              <Text style={styles.videoTypeTitle}>Behavioral</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <ProgramDetailsCard course={course} myprogram={myprogram} />
      )}

      <ScrollView>
        <CusSegmentedButtons value={segmentValue} setValue={setSegmentValue} />
        <ProgramTimeTracker />
        <CourseContent />
      </ScrollView>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.Background_color,
      flex: 1,
      paddingBottom: responsiveScreenHeight(2),
    },
    icon: {
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(0.5),
    },
    checkicon: {
      color: Colors.Primary,
      marginTop: responsiveScreenHeight(0.5),
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
  });
