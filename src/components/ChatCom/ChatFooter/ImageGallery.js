import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Pressable,
} from 'react-native';
import CustomModal from '../../SharedComponent/CustomModal';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CrossCircle from '../../../assets/Icons/CrossCircle';
import ArrowRightCircle from '../../../assets/Icons/ArrowRightCircle';
import {useTheme} from '../../../context/ThemeContext';
import ArrowLeftCircle from '../../../assets/Icons/ArrowLeftCircle';
import SendIcon from '../../../assets/Icons/SendIcon';
import ChatMessageInput from '../ChatMessageInput';
import Loading from '../../SharedComponent/Loading';

const ImageGallery = ({
  selectedImages = [],
  isVisible,
  onClose,
  onSend,
  uploading,
}) => {
  const [message, setMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const handleNext = () => {
    if (currentIndex < selectedImages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <CustomModal
      isVisible={isVisible}
      onClose={onClose}
      customStyles={styles.modal}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <Pressable onPress={() => Keyboard.dismiss()} style={styles.container}>
          {/* Close Button */}
          {uploading ? (
            <Loading backgroundColor={'transparent'} />
          ) : (
            <>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <CrossCircle size={40} />
              </TouchableOpacity>
              {/* Image Viewer with Next/Previous Buttons */}
              <View style={styles.imageContainer}>
                {selectedImages.length > 0 && (
                  <Image
                    source={{uri: selectedImages[currentIndex].uri}}
                    style={[
                      styles.image,
                      imageDimensions[selectedImages[currentIndex].uri]
                        ? {
                            aspectRatio:
                              imageDimensions[selectedImages[currentIndex].uri]
                                .aspectRatio,
                          }
                        : {height: responsiveScreenHeight(80)},
                    ]}
                    onLoad={({nativeEvent}) =>
                      handleImageLayout(
                        selectedImages[currentIndex].uri,
                        nativeEvent.source.width,
                        nativeEvent.source.height,
                      )
                    }
                  />
                )}
                {/* Conditionally render the navigation buttons */}
                {currentIndex > 0 && (
                  <TouchableOpacity
                    style={[styles.navButton, styles.prevButton]}
                    onPress={handlePrevious}>
                    <ArrowLeftCircle size={60} color={Colors.Primary} />
                  </TouchableOpacity>
                )}
                {currentIndex < selectedImages.length - 1 && (
                  <TouchableOpacity
                    style={[styles.navButton, styles.nextButton]}
                    onPress={handleNext}>
                    <ArrowRightCircle size={60} color={Colors.Primary} />
                  </TouchableOpacity>
                )}
              </View>
              {/* Message Input */}
              <View style={styles.inputContainer}>
                {/* <TextInput
                style={styles.textInput}
                placeholder="Type your message..."
                value={message}
                onChangeText={setMessage}
                multiline
              /> */}
                <ChatMessageInput text={message} setText={setMessage} />
                <TouchableOpacity
                  onPress={() => onSend(message)}
                  style={styles.sendButton}>
                  <SendIcon color={Colors.PureWhite} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </CustomModal>
  );
};

export default ImageGallery;

const getStyles = Colors =>
  StyleSheet.create({
    modal: {
      justifyContent: 'center',
      margin: 0,
      backgroundColor: Colors.White,
    },
    container: {
      flex: 1,
      width: responsiveScreenWidth(100),
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      right: 10,
      zIndex: 1,
      top: 0,
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: responsiveScreenWidth(100),
    },
    image: {
      width: '100%',
      resizeMode: 'contain',
    },
    navButton: {
      position: 'absolute',
      top: '45%',
      padding: 10,
      zIndex: 2,
    },
    prevButton: {
      left: 10,
    },
    nextButton: {
      right: 10,
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 10,
      backgroundColor: Colors.Background_color,
      alignItems: 'center',
      width: '95%',
      marginBottom: 30,
      justifyContent: 'space-between',
      borderRadius: 30,
      marginHorizontal: 50,
    },
    textInput: {
      flex: 1,
      maxHeight: 100,
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: '#ccc',
      borderRadius: 25,
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginRight: 10,
    },
    sendButton: {
      backgroundColor: Colors.Primary,
      borderRadius: 25,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
