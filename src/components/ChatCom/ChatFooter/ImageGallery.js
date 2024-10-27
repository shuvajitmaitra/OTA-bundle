import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CustomModal from '../../SharedComponent/CustomModal';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import CrossIcon from '../../../assets/Icons/CrossIcon';
import CrossCircle from '../../../assets/Icons/CrossCircle';
import RightArrowButtonWithoutTail from '../../../assets/Icons/RightArrowButtonWithoutTail';
import ArrowRightCircle from '../../../assets/Icons/ArrowRightCircle';
import {useTheme} from '../../../context/ThemeContext';
import ArrowLeftCircle from '../../../assets/Icons/ArrowLeftCircle';
import SendIcon from '../../../assets/Icons/SendIcon';

const ImageGallery = ({selectedImages = [], isVisible, onClose, onSend}) => {
  const [message, setMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  //   const handleSend = () => {
  //     if (message.trim()) {
  //       onSend(message);
  //       setMessage('');
  //     }
  //   };

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

  return (
    <CustomModal
      isVisible={isVisible}
      onClose={onClose}
      customStyles={styles.modal}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.select({android: 80})}>
        <View style={styles.container}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <CrossCircle size={40} />
          </TouchableOpacity>

          {/* Image Viewer with Next/Previous Buttons */}
          <View style={styles.imageContainer}>
            {selectedImages.length > 0 && (
              <Image
                source={{uri: selectedImages[currentIndex].uri}}
                style={styles.image}
              />
            )}
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton]}
              onPress={handlePrevious}
              disabled={currentIndex === 0}>
              <ArrowLeftCircle size={60} color={Colors.Primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={handleNext}
              disabled={currentIndex === selectedImages.length - 1}>
              <ArrowRightCircle size={60} color={Colors.Primary} />
            </TouchableOpacity>
          </View>

          {/* Message Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              onPress={() => onSend(message)}
              style={styles.sendButton}>
              <SendIcon color={Colors.PureWhite} />
            </TouchableOpacity>
          </View>
        </View>
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
      // backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      // top: Platform.OS === 'ios' ? 50 : 20,
      right: 10,
      zIndex: 1,
      top: 0,
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: responsiveScreenWidth(100),
      //   backgroundColor: 'red',
    },
    image: {
      height: responsiveScreenHeight(80),
      width: responsiveScreenWidth(100),
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
      backgroundColor: '#fff',
      alignItems: 'center',
      width: '100%',
    },
    textInput: {
      flex: 1,
      maxHeight: 100,
      borderWidth: 1,
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
