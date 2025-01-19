import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, StatusBar} from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import axiosInstance from '../../utility/axiosInstance';
import {useDispatch, useSelector} from 'react-redux';
import Loading from '../../components/SharedComponent/Loading';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import {setMedias} from '../../store/reducer/audioVideoReducer';
import Divider from '../../components/SharedComponent/Divider';
import AudioVideoCard from '../../components/AudioVideoCom/AudioVideoCard';

export default function AudioVideoScreen() {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const {medias} = useSelector(state => state.medias);

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get('/media/mymedia')
      .then(res => {
        setIsLoading(false);
        if (res.data.success) {
          dispatch(setMedias(res.data.medias));
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(
          'Error fetching media:',
          JSON.stringify(error.response?.data, null, 1),
        );
        dispatch(setMedias([]));
      });
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{flex: 1, backgroundColor: Colors.White}}>
        <Loading />
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: Colors.Background_color}}>
      <StatusBar
        translucent
        backgroundColor={Colors.Background_color}
        barStyle={
          Colors.Background_color === '#F5F5F5'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <Text style={styles.heading}>Audios & Videos</Text>
      <View style={{paddingHorizontal: responsiveScreenWidth(4)}}>
        <Divider marginBottom={0.2} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.mediaContainer}>
          {medias?.length > 0 ? (
            medias.map((media, index) => (
              <AudioVideoCard media={media} index={index} key={media._id} />
            ))
          ) : (
            <NoDataAvailable height={70} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    scrollViewContainer: {
      flexGrow: 1,
      backgroundColor: Colors.Background_color,
      paddingTop: responsiveScreenHeight(1.5),
    },
    heading: {
      fontFamily: 'YourCustomFontSemiBold', // Replace with your actual font constant if needed
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
      paddingHorizontal: responsiveScreenWidth(4),
    },
    mediaContainer: {
      backgroundColor: Colors.Background_color,
      borderRadius: responsiveScreenWidth(3),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingBottom: responsiveScreenHeight(2),
    },
  });
