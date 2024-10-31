import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import AudioMessage from './AudioMessage';

const MessageFileContainer = ({files}) => {
  const [imageDimensions, setImageDimensions] = useState({});
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const handleImageLayout = (uri, width, height) => {
    const aspectRatio = width / height;
    setImageDimensions(prev => ({
      ...prev,
      [uri]: {aspectRatio},
    }));
  };

  const imageRender = ({item}) => {
    const {aspectRatio} = imageDimensions[item.url] || {};

    return (
      <Image
        source={{uri: item.url}}
        style={[
          styles.image,
          aspectRatio ? {aspectRatio} : {height: responsiveScreenHeight(20)},
        ]}
        onLoad={({nativeEvent}) =>
          handleImageLayout(
            item.url,
            nativeEvent.source.width,
            nativeEvent.source.height,
          )
        }
      />
    );
  };

  const renderAudio = ({item}) => {
    return (
      <View
        style={{
          backgroundColor: Colors.Gray3,
          paddingHorizontal: 10,
          borderRadius: 100,
          marginTop: 5,
          paddingVertical: 5,
        }}>
        <AudioMessage audioUrl={item.url} background={'transparent'} />
      </View>
    );
  };

  return (
    <FlatList
      data={files}
      renderItem={({item}) =>
        item.type.startsWith('audio')
          ? renderAudio({item})
          : imageRender({item})
      }
      keyExtractor={item => item.url}
      contentContainerStyle={styles.container}
      //   ItemSeparatorComponent={() => <View style={{height: 5}}></View>}
    />
  );
};

export default MessageFileContainer;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      padding: 10,
    },
    image: {
      width: '100%',
      resizeMode: 'contain',
      marginBottom: 10,
      marginTop: 5,
    },
  });
