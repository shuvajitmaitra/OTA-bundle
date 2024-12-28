import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import ChatMessageInput from './ChatMessageInput';
import SendIcon from '../../assets/Icons/SendIcon';
import DocumentIconFour from '../../assets/Icons/DocumentIconFour';
import CrossCircle from '../../assets/Icons/CrossCircle';

const DocumentContainer = ({
  onClose,
  selected,
  uploadDocument,
  handleKey,
  chat,
  isChannel,
}) => {
  const [text, setText] = useState('');
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const fileUrl = selected[0]?.uri?.split('/')?.pop() || 'Unavailable';
  const fileType =
    selected[0]?.type?.split('/')?.pop()?.toUpperCase() || 'Unavailable';
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // For iOS and Android
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      style={styles.docContainer}>
      <View style={styles.inputContainer}>
        <ChatMessageInput
          chat={chat}
          handleKey={handleKey}
          isChannel={isChannel}
          text={text}
          setText={setText}
        />
        <TouchableOpacity
          onPress={() => {
            uploadDocument(text);
          }}>
          <SendIcon />
        </TouchableOpacity>
      </View>

      {selected.length > 0 && (
        <View style={styles.bottomContainer}>
          <DocumentIconFour />
          <View>
            <Text style={styles.fileName}>{fileUrl}</Text>
            <Text style={styles.fileName}>{fileType}</Text>
          </View>
          <View style={{flexGrow: 1}} />
          <Pressable onPress={onClose}>
            <CrossCircle />
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default DocumentContainer;

const getStyles = Colors =>
  StyleSheet.create({
    bottomContainer: {
      flexDirection: 'row',
      gap: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BodyText,
      margin: 10,
      borderRadius: 4,
      alignItems: 'center',
    },
    fileName: {
      color: Colors.BodyText,
      paddingTop: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      //   minHeight: 80,
      justifyContent: 'space-between',
      width: '95%',
      margin: 10,
      //   backgroundColor: 'red',
    },
    docContainer: {
      backgroundColor: Colors.Background_color,
      minHeight: 50,
      borderRadius: 30,
      marginRight: 10,
      //   flexDirection: 'row',
      //   alignItems: 'center',
      //   justifyContent: 'space-between',
      paddingHorizontal: 15,
      // flex: 1,
      overflow: 'hidden',
      maxHeight: 500,
    },
  });
