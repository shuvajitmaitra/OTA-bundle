import axios from '../utility/axiosInstance';
import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AIcon from 'react-native-vector-icons/AntDesign';
import WebView from 'react-native-webview';
import color from '../constants/color';
import {seconds2time, dynamicSort} from '../utility';
import {useTheme} from '../context/ThemeContext';
import {useGlobalAlert} from '../components/SharedComponent/GlobalAlertContext';
const InterviewVideoScreen = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [expanded, setExpanded] = useState([]);
  const handleCollapse = item => {
    setExpanded(state =>
      state.includes(item) ? state?.filter(i => i !== item) : [...state, item],
    );
  };
  const [isLoading, setIsLoading] = useState(false);

  const [chapters, setChapters] = useState([]);
  const [url, setUrl] = useState('');
  const {showAlert} = useGlobalAlert();

  const handleClickLesson = useCallback(
    lesson => {
      if (lesson.type === 'video') {
        setUrl(lesson.url);
      } else if (lesson.type === 'file') {
        // window.open(`/content/documents-and-labs/${lesson.url}`, '_blank')
      }
    },
    [url],
  );

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        let myprogram = await axios.get('/user/myprogram');
        //setPrograms(myprogram.data.program)
        // console.log(myprogram.data.program);

        let intervideRes = await axios.get(
          `/workshop/all/active/${myprogram.data.program?._id}/interview`,
        );

        setChapters(intervideRes.data?.workshops || []);
        let filtered = intervideRes.data?.workshops?.filter(x => !x.isLocked);
        if (filtered?.length > 0) {
          setUrl(filtered[0]?.lessons.sort(dynamicSort('index'))[0]?.url);
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size={50} animating={true} color={color.primary} />
      </View>
    );
  }

  return (
    <>
      <View style={{aspectRatio: 16 / 9}}>
        <WebView
          source={{
            html: `
                        <iframe src=${url} width="100%" height="100%" frameborder="0" allowFullScreen></iframe>
                    `,
          }}
          onError={() => null}
          allowsFullscreenVideo={true}
          scrollEnabled={false}
          automaticallyAdjustContentInsets={false}
        />
      </View>

      <ScrollView style={{backgroundColor: Colors.White}}>
        {chapters?.length > 0 &&
          chapters.map(chapter => (
            <TouchableOpacity
              onPress={() =>
                chapter?.isLocked
                  ? showAlert({
                      title: 'Interview Locked',
                      type: 'warning',
                      message: 'This interview is locked...',
                    })
                  : handleCollapse(chapter?._id)
              }
              key={chapter?._id}>
              <View style={styles.header_content}>
                {chapter?.isLocked ? (
                  <AIcon size={20} name="lock" />
                ) : expanded.includes(chapter?._id) ? (
                  <AIcon size={20} name="minus" />
                ) : (
                  <AIcon size={20} name="plus" />
                )}
                <Text
                  style={{
                    marginLeft: 5,
                    flex: 1,
                    fontSize: 15,
                    fontWeight: 'bold',
                    opacity: 0.8,
                  }}>
                  {chapter.name}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{marginRight: 5}}>
                    {chapter.lessons?.length} Classes .
                  </Text>
                  <Text>
                    {seconds2time(
                      chapter.lessons.reduce(
                        (a, b) => a + (b['duration'] || 0),
                        0,
                      ),
                    )}
                  </Text>
                </View>
              </View>

              {expanded.includes(chapter?._id) && (
                <View>
                  {chapter.lessons?.length > 0 &&
                    chapter.lessons.sort(dynamicSort('index')).map(lesson => (
                      <TouchableOpacity
                        style={[
                          styles.content,
                          {
                            backgroundColor:
                              url === lesson.url
                                ? color.primary
                                : 'rgba(6, 37, 57, .8)',
                          },
                        ]}
                        onPress={() => handleClickLesson(lesson)}
                        key={lesson?._id}>
                        <View>
                          {lesson.type === 'file' ? (
                            <AIcon
                              size={20}
                              style={{color: Colors.White}}
                              name="filetext1"
                            />
                          ) : (
                            <AIcon
                              size={20}
                              style={{color: Colors.White}}
                              name="play"
                            />
                          )}
                        </View>
                        <Text style={{marginLeft: 5, color: Colors.White}}>
                          {lesson.index} {lesson.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
      </ScrollView>
    </>
  );
};

export default InterviewVideoScreen;

const getStyles = Colors =>
  StyleSheet.create({
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor: Colors.White,
    },
    detailsContainer: {},
    iframeWrapper: {},
    header_content: {
      flexDirection: 'row',
      paddingVertical: 15,
      paddingHorizontal: 10,
      justifyContent: 'space-between',
      borderBottomColor: Colors.BorderColor,
      borderBottomWidth: 1,
      alignItems: 'center',
    },
    content: {
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(6, 37, 57, .8)',
      borderBottomColor: Colors.BorderColor,
      borderBottomWidth: 1,
    },
  });
