import {
  FlatList,
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import AudioMessage from './AudioMessage';
import FileIcon from '../../assets/Icons/FileIcon';
import {RegularFonts} from '../../constants/Fonts';

const MessageFileContainer = ({files, setViewImage, my}) => {
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
      <TouchableOpacity onPress={() => setViewImage([{uri: item?.url}])}>
        <Image
          source={{uri: item.url}}
          style={[
            styles.image,
            // {
            //   maxHeight: responsiveScreenHeight(30),
            //   maxWidth: responsiveScreenWidth(40),
            // },
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
      </TouchableOpacity>
    );
  };

  const renderAudio = ({item}) => {
    return (
      <View
        style={{
          backgroundColor: Colors.WhiteOpacityColor,
          paddingHorizontal: 10,
          borderRadius: 100,
          marginTop: 5,
          paddingVertical: 5,
        }}>
        <AudioMessage
          audioUrl={item.url}
          background={'transparent'}
          color={!my && Colors.BodyText}
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
    const iconName = fileIcons[fileExtension] || 'attach-file'; // Fallback icon
    const fileSizeInKb = (item.size / 1024).toFixed(2); // Assuming size is in bytes

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
    // Implement download logic here
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
      fontWeight: 'bold',
      color: Colors.PureWhite,
      fontSize: RegularFonts.HS,
    },
    fileDetails: {
      color: Colors.PureWhite,
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
  });
