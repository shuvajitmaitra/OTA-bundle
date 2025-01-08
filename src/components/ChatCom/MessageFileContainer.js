import {
  FlatList,
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import AudioMessage from './AudioMessage';
import FileIcon from '../../assets/Icons/FileIcon';
import {RegularFonts} from '../../constants/Fonts';
import DownloadIcon2 from '../../assets/Icons/DowloadIcon2';

const MessageFileContainer = ({files, setViewImage, my}) => {
  const [imageDimensions, setImageDimensions] = useState({});
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [imageLoading, setImageLoading] = useState(false);
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
      <TouchableOpacity
        activeOpacity={0.8}
        style={{position: 'relative'}}
        onPress={() => setViewImage([{uri: item?.url}])}>
        <Image
          source={{uri: item.url}}
          onLoadStart={() => {
            console.log('Image loading started');
            setImageLoading(true);
          }}
          onLoadEnd={() => {
            console.log('Image loading ended');
            setImageLoading(false);
          }}
          style={[
            styles.image,
            aspectRatio ? {aspectRatio} : {height: responsiveScreenHeight(20)},
          ]}
          onLoad={({nativeEvent}) => {
            handleImageLayout(
              item.url,
              nativeEvent.source.width,
              nativeEvent.source.height,
            );
          }}
        />
        {imageLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Colors.Primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderAudio = ({item}) => {
    return (
      <View
        style={{
          backgroundColor: my
            ? Colors.Background_color
            : Colors.WhiteOpacityColor,
          paddingHorizontal: 10,
          borderRadius: 100,
          marginTop: 5,
          paddingVertical: 5,
        }}>
        <AudioMessage
          audioUrl={item.url}
          background={'transparent'}
          color={Colors.BodyText}
        />
      </View>
    );
  };

  const renderDocument = ({item}) => {
    // Define a mapping for file types to icons
    const fileIcons = {
      pdf: 'picture-as-pdf',
      doc: 'description',
      docx: 'description',
      xls: 'grid-view',
      xlsx: 'grid-view',
      ppt: 'slideshow',
      pptx: 'slideshow',
      txt: 'text-snippet',
    };

    const fileExtension = item.url.split('.').pop();
    const iconName = fileIcons[fileExtension] || 'attach-file';
    const fileSizeInKb = (item.size / 1024).toFixed(2);

    return (
      <View style={styles.documentContainer}>
        {/* <MaterialIcons name={iconName} size={40} color={Colors.Gray2} /> */}
        <FileIcon />
        <View style={styles.documentInfo}>
          <Text style={styles.fileName}>{item.name}</Text>
          <Text
            style={
              styles.fileDetails
            }>{`Type: ${fileExtension.toUpperCase()}`}</Text>
          <Text style={styles.fileDetails}>{`Size: ${fileSizeInKb} KB`}</Text>
        </View>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => handleDownload(item.url)}>
          <Text style={styles.downloadButtonText}>Download</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleDownload = url => {
    Linking.openURL(url);
    console.log(`Downloading file from: ${url}`);
  };

  return (
    <FlatList
      data={files}
      renderItem={({item}) =>
        item.type.startsWith('audio')
          ? renderAudio({item})
          : item.type.startsWith('image')
          ? imageRender({item})
          : renderDocument({item})
      }
      keyExtractor={item => item.url}
      contentContainerStyle={styles.container}
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
      borderRadius: 10,
    },
    documentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.WhiteOpacityColor,
      padding: 10,
      borderRadius: 8,
      marginVertical: 5,
    },
    documentInfo: {
      flex: 1,
      marginLeft: 10,
    },
    fileName: {
      fontWeight: '500',
      color: Colors.BodyText,
      fontSize: RegularFonts.BR,
    },
    fileDetails: {
      color: Colors.BodyText,
    },
    downloadButton: {
      backgroundColor: Colors.Primary,
      padding: 10,
      borderRadius: 5,
      marginLeft: 10,
    },
    downloadButtonText: {
      color: Colors.PureWhite,
      fontWeight: 'bold',
    },
    ImageDownloadIconContainer: {
      position: 'absolute',
      right: 10,
      top: 10,
      zIndex: 1,
      backgroundColor: Colors.PureWhite,
      padding: 5,
      borderRadius: 5,
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: 'rgba(0, 0, 0, 0.1)',
      zIndex: 1,
    },
  });
