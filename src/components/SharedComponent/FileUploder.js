import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker'; // Changed import
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
      // Use react-native-document-picker's API
      const results = await DocumentPicker.pickMultiple({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
        ],
      });

      if (results.length > maxFiles) {
        return showAlert({
          title: 'Limit Exceeded',
          type: 'warning',
          message: `Maximum ${maxFiles} files can be uploaded`,
        });
      }

      console.log('Selected files:', JSON.stringify(results, null, 2));

      setIsUploading(true);

      // Process each selected file
      const uploadPromises = results.map(async file => {
        try {
          console.log('Processing file:', JSON.stringify(file, null, 2));

          const isImage = file.type && file.type.startsWith('image');
          const data = {
            uri: file.uri,
            name:
              file.name ||
              `uploaded_file.${file.name?.split('.').pop() || 'bin'}`,
            type: file.type || 'application/octet-stream',
          };

          console.log('Form Data:', JSON.stringify(data, null, 2));

          let formData = new FormData();
          formData.append('file', data);

          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          };

          const res = await axiosInstance.post(
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
              JSON.stringify(error.request, null, 2),
            );
          } else {
            console.error('Error:', error.message);
          }
          return null;
        }
      });

      let uploadedFiles = await Promise.all(uploadPromises);
      uploadedFiles = uploadedFiles.filter(file => file !== null);

      setAttachments(prev => [...prev, ...uploadedFiles]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit gracefully
        console.log('User cancelled document picker');
      } else {
        console.error('Unknown error:', err);
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } finally {
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
          {isUploading && (
            <View
              style={{
                position: 'absolute',
                zIndex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator color={Colors?.Primary} size="large" />
            </View>
          )}
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
            {getFileTypeFromUri(item) === 'image' ? (
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
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    CrossCircle: {
      width: 20,
      justifyContent: 'center',
      alignItems: 'center',
      height: 20,
      borderRadius: 100,
      position: 'absolute',
      top: -10,
      right: -10,
      backgroundColor: Colors.Background, // Optional: Add a background color for better visibility
    },
  });

export default FileUploader;
