import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import NoDataIcon from '../../assets/Icons/NotDataIcon';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import useChat from '../../hook/useChat';
import axiosInstance from '../../utility/axiosInstance';
import AudioMessage from './AudioMessage';
import MicIcon from '../../assets/Icons/MicIcon';
import {useTheme} from '../../context/ThemeContext';
import ArrowRight from '../../assets/Icons/ArrowRight';
import NoDataAvailable from '../SharedComponent/NoDataAvailable';
import Loading from '../SharedComponent/Loading';
import CustomeFonts from '../../constants/CustomeFonts';
import {useSelector} from 'react-redux';
import moment from 'moment';
import Images from '../../constants/Images';

export default function UserModalVoice() {
  const {singleChat: chat} = useSelector(state => state.chat);
  const [file, setFile] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const [seeMoreClicked, setSeeMoreClicked] = useState(false);
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/chat/media/${chat?._id}`, {
        limit: 50,
        type: 'voice',
      });
      console.log('response.data', JSON.stringify(response.data, null, 1));
      if (response.data && Array.isArray(response.data.medias)) {
        const reversedMedias = [...response.data.medias].reverse();
        setFile(reversedMedias);
      } else {
        setFile([]);
      }
    } catch (error) {
      console.error('Failed to fetch media:', error.message);
      setFile([]);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    fetchData();
  }, []);

  console.log('file', JSON.stringify(file, null, 1));

  const newFile = file?.length > 4 ? file.slice(0, 4) : file;
  const allFile = seeMoreClicked ? file : newFile;

  const [currentPlayingUrl, setCurrentPlayingUrl] = useState(null);

  const handlePlayToggle = url => {
    setCurrentPlayingUrl(currentPlayingUrl === url ? null : url);
  };

  return (
    <View
      style={{
        minWidth: '100%',
        justifyContent: '',
        alignItems: 'flex-start',
        borderRadius: 10,
        marginBottom: responsiveScreenHeight(2),
      }}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {file?.length ? (
            allFile?.map(item => (
              <ScrollView key={item?._id}>
                <View
                  style={{
                    minWidth: '100%',
                    justifyContent: 'center',
                    marginBottom: responsiveScreenHeight(1),
                  }}>
                  {item?.file?.type === 'audio/mp3' ||
                  item?.type === 'audio/mp3' ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 10,
                      }}>
                      <View style={{position: 'relative'}}>
                        <Image
                          style={{
                            width: responsiveWidth(13),
                            height: responsiveScreenWidth(13),
                            backgroundColor: Colors.White,
                            borderRadius: 100,
                          }}
                          // source={require("../../assets/Images/user.png")}
                          source={Images.DEFAULT_IMAGE}
                          // item?.image
                        />
                        <View
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            padding: 2,
                            backgroundColor: Colors.BorderColor,
                            borderRadius: 100,
                          }}>
                          <MicIcon />
                        </View>
                      </View>
                      <View style={{width: '80%'}}>
                        <AudioMessage
                          background={Colors.Primary}
                          audioUrl={item.url}
                          isActive={currentPlayingUrl === item.url}
                          onTogglePlay={() => handlePlayToggle(item.url)}
                        />
                        <Text
                          style={{
                            color: Colors.BodyText,
                          }}>
                          {moment(item?.createdAt).format(
                            'MMM DD, YYYY h:mm A',
                          )}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                </View>
              </ScrollView>
            ))
          ) : (
            <View
              style={{
                minHeight: responsiveScreenHeight(30),
                minWidth: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.LightGreen,
                borderRadius: 10,
                marginBottom: responsiveScreenHeight(2),
              }}>
              <NoDataIcon />
            </View>
          )}
        </>
      )}
      {file?.length > 4 && (
        <TouchableOpacity
          onPress={() => setSeeMoreClicked(prev => !prev)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: responsiveScreenWidth(2),
          }}>
          <Text
            style={{
              color: 'rgba(39, 172, 31, 1)',
              fontFamily: CustomeFonts.SEMI_BOLD,
              fontSize: responsiveScreenFontSize(1.8),
            }}>
            {seeMoreClicked ? 'See Less' : 'See More'}
          </Text>
          <ArrowRight />
        </TouchableOpacity>
      )}
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    voiceFileContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 200,
    },
  });
