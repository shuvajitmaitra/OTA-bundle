import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker'; // For Expo
import axiosInstance from '../../utility/axiosInstance';
import {useGlobalAlert} from './GlobalAlertContext';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import CrossCircle from '../../assets/Icons/CrossCircle';
import {getFileTypeFromUri} from '../TechnicalTestCom/TestNow';
const FileUploader = ({setAttachments, attachments, maxFiles = 5}) => {
  const [isUploading, setIsUploading] = useState(false);
  const {showAlert} = useGlobalAlert();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const UploadAnyFile = async () => {
    try {
      const selected = await DocumentPicker.getDocumentAsync({
        type: [
          'image/*',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!selected.assets) {
        console.error('No assets found');
        return;
      }

      if (selected?.assets?.length > 5) {
        return showAlert({
          title: 'Limit Exceeded',
          type: 'warning',
          message: 'Maximum 5 files can be uploaded',
        });
      }

      console.log('selected', JSON.stringify(selected, null, 1));

      setIsUploading(true);

      let results = await Promise.all(
        selected?.assets?.map(async item => {
          try {
            console.log('item', JSON.stringify(item, null, 1));
            const isImage =
              item.type &&
              typeof item.type === 'string' &&
              item.type.startsWith('image');
            const data = isImage
              ? {
                  uri: item.uri,
                  name: 'uploaded_file.png',
                  type: item.mimeType || 'image/png',
                }
              : {
                  uri: item.uri,
                  name: item.name || 'uploaded_file',
                  type: item.mimeType || 'application/octet-stream',
                };
            console.log('data', JSON.stringify(data, null, 1));
            let formData = new FormData();
            formData.append('file', data);

            const config = {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            };

            let res = await axiosInstance.post(
              '/document/userdocumentfile',
              formData,
              config,
            );

            if (res?.data?.fileUrl) {
              return res.data.fileUrl;
            } else {
              console.error('No file URL returned from server');
              return null;
            }
          } catch (error) {
            if (error.response) {
              console.error('Server error:', error.response.data);
            } else if (error.request) {
              console.error('Network error:', error.request);
              console.log(
                'Network error:',
                JSON.stringify(error.request, null, 1),
              );
            } else {
              console.error('Error:', error.message);
            }
            return null;
          }
        }),
      );

      results = results?.filter(result => result !== null);

      setAttachments(prev => [...prev, ...results]);
      setIsUploading(false);
    } catch (error) {
      if (error.response) {
        console.error('Server error:', error.response.data);
      } else if (error.request) {
        console.error('Network error:', error.request);
        console.log('Network error:', JSON.stringify(error.request, null, 1));
      } else {
        console.error('Error:', error.message);
      }
      setIsUploading(false);
    }
  };

  const removeDocument = uri => {
    setAttachments(attachments?.filter(item => item !== uri));
  };

  return (
    <View>
      <View style={styles.fieldContainer}>
        <Text style={styles.idStyle}>Upload Attachment (Optional)</Text>
        <TouchableOpacity
          onPress={UploadAnyFile}
          style={styles.attachment}
          disabled={isUploading}>
          <Text style={styles.uploadText}>Upload Attachment</Text>
          {isUploading ? (
            <View
              style={{
                position: 'absolute',
                zIndex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator color={Colors?.Primary} size={40} />
            </View>
          ) : null}
        </TouchableOpacity>
        <Text style={styles.attachmentText}>Upload JPEG/PNG/PDF/Docs file</Text>
      </View>

      <View
        style={[
          styles.docPreview,
          attachments?.length && {
            marginVertical: responsiveScreenHeight(1.5),
          },
        ]}>
        {attachments?.map(item => (
          <View key={item} style={{position: 'relative'}}>
            {getFileTypeFromUri(item) == 'image' ? (
              <Image style={{height: 100, width: 100}} source={{uri: item}} />
            ) : getFileTypeFromUri(item) === 'pdf' ? (
              <Image
                style={{height: 100, width: 100}}
                source={require('../../assets/Images/pdf.png')}
              />
            ) : (
              <Image
                style={{height: 100, width: 100}}
                source={require('../../assets/Images/doc.png')}
              />
            )}
            <TouchableOpacity
              onPress={() => removeDocument(item)}
              style={styles.CrossCircle}>
              <CrossCircle color={Colors.Red} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    fieldContainer: {
      marginBottom: responsiveScreenHeight(2),
    },
    idStyle: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      marginTop: responsiveScreenWidth(3),
    },
    attachment: {
      height: responsiveScreenHeight(10),
      backgroundColor: Colors.PrimaryOpacityColor,
      borderRadius: responsiveScreenWidth(3),
      marginVertical: responsiveScreenHeight(1),
      borderStyle: 'dashed',
      borderColor: Colors.Primary,
      borderWidth: 1.5,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    uploadText: {
      color: Colors.Primary,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
    },
    attachmentText: {
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
    },

    docPreview: {
      width: '100%',
      // backgroundColor: "red",
      flexDirection: 'row',
      flexWrap: 'wrap',
      flexBasis: 99,
      gap: 10,
    },
    CrossCircle: {
      // backgroundColor: Colors.Primary,
      width: 20,
      justifyContent: 'center',
      alignItems: 'center',
      height: 20,
      borderRadius: 100,
      position: 'absolute',
      top: -10,
      right: -10,
    },
  });

export default FileUploader;
