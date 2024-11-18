import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, Button, TextInput} from 'react-native';
import {DrawerLayout} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons'; // For expo vector icons
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import TextArea from '../../Calendar/Modal/TextArea';
import AiButtonContainer from './AiButtonContainer';
import CustomFonts from '../../../constants/CustomFonts';
import {RegularFonts} from '../../../constants/Fonts';
import Markdown from 'react-native-markdown-display';
import ReactNativeModal from 'react-native-modal';
import AiDrawer from './AiDrawer';
import axiosInstance from '../../../utility/axiosInstance';
import {handleError} from '../../../actions/chat-noti';

const AiModal = ({post, setPost, onCancelPress, isVisible}) => {
  const {top} = useSafeAreaInsets();
  const Colors = useTheme();
  const styles = getStyles(Colors, top);
  const [generatedText, setGeneratedText] = useState(post);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedValues, setSelectedValues] = useState({});

  const generatePrompt = () => {
    let pro = '';

    if (selectedValues['Rewrite']) {
      pro += ` ${selectedValues['Rewrite']}:\n`;
    }

    if (
      selectedValues['Questions'] &&
      Array.isArray(selectedValues['Questions'])
    ) {
      const questions = selectedValues['Questions']
        .map((q, index) => {
          const [questionText, answerText] = q.split(' and ');
          return `${questionText.trim()}${answerText.trim()}`;
        })
        .join('\n');
      pro += ` ${questions}`;
    }

    if (selectedValues['About'] && Array.isArray(selectedValues['About'])) {
      const about = selectedValues['About'].join('.\n');
      pro += ` ${about}.\n`;
    }

    if (selectedValues['Styles']) {
      pro += ` ${selectedValues['Styles']}\n`;
    }

    if (
      selectedValues['S Media posts'] &&
      Array.isArray(selectedValues['S Media posts'])
    ) {
      const sMediaPosts = selectedValues['S Media posts'].join('.\n');
      pro += ` ${sMediaPosts}.\n`;
    }

    if (selectedValues['Size']) {
      pro += ` ${selectedValues['Size']}\n`;
    }

    setPrompt(pro.trim());
    handleGenerate();
  };

  const handleGenerate = () => {
    axiosInstance
      .post('/organization/integration/generate-text', {prompt})
      .then(res => console.log('res.data', JSON.stringify(res.data, null, 1)))
      .catch(error => handleError(error));
  };

  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackdropPress={() => onCancelPress()}
      style={{margin: 0}}>
      {/* <View style={styles.drawerContent}>
        <Text style={styles.drawerText}>This is the secondary drawer</Text>
        <Ionicons name="settings" size={24} color="black" />
      </View> */}
      {isDrawerVisible ? (
        <AiDrawer
          generatedText={generatedText}
          toggle={() => setIsDrawerVisible(pre => !pre)}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
        />
      ) : (
        <View style={styles.container}>
          <View style={styles.drawerContainer}>
            <Ionicons
              name="menu"
              size={30}
              color={Colors.Heading}
              onPress={() => {
                setIsDrawerVisible(pre => !pre);
              }}
            />
          </View>
          <Markdown style={styles.markdownStyle}>{prompt}</Markdown>
          <View style={{flexGrow: 1}}></View>
          <TextInput
            placeholder="Write your queries"
            multiline
            style={styles.input}
            value={generatedText}
            onChangeText={text => setGeneratedText(text)}
            placeholderTextColor={Colors.BodyText}
          />
          <AiButtonContainer
            onCancelPress={onCancelPress}
            generatePrompt={generatePrompt}
          />
        </View>
      )}
    </ReactNativeModal>
  );
};

export default AiModal;

const getStyles = (Colors, top) =>
  StyleSheet.create({
    input: {
      backgroundColor: Colors.ScreenBoxColor,
      width: '100%',
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      minHeight: 40,
      maxHeight: 100,
      borderRadius: 30,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: 10,
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: RegularFonts.HS,
      // marginHorizontal: 100,
    },
    drawerContainer: {
      position: 'absolute',
      top: top,
      left: responsiveScreenWidth(4),
    },
    container: {
      backgroundColor: Colors.Background_color,
      paddingTop: top,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      gap: 10,
      paddingHorizontal: responsiveScreenWidth(2),
      paddingBottom: 30,
    },
    drawerContent: {
      flex: 1,
      backgroundColor: Colors.Background_color,
      padding: 20,
      paddingTop: top,
    },
    drawerText: {
      fontSize: 18,
      marginBottom: 20,
      color: Colors.Heading,
    },
    markdownStyle: {
      bullet_list: {
        marginVertical: 10,
      },
      ordered_list: {
        marginVertical: 10,
      },
      list_item: {
        marginVertical: 10,
      },
      body: {
        flex: 1,
        color: Colors.BodyText,
        fontFamily: CustomFonts.REGULAR,
        lineHeight: 24,
        textAlign: 'justify',
        // marginBottom: responsiveScreenHeight(1.5),
        // backgroundColor: Colors.ScreenBoxColor,
        maxHeight: responsiveScreenHeight(72),
        marginTop: top / 1.5,
        paddingHorizontal: responsiveScreenWidth(2),
      },
      heading1: {
        flex: 1,

        fontSize: 24,
        color: Colors.Heading,
        marginBottom: 10,
      },
      heading2: {
        flex: 1,

        fontSize: 20,
        color: Colors.Heading,
        marginBottom: 8,
      },
      heading3: {
        flex: 1,

        fontSize: 18,
        color: Colors.Heading,
        marginBottom: 6,
      },
      paragraph: {
        flex: 1,

        marginTop: 10,
        marginBottom: 10,
        textAlign: 'justify',
      },
      link: {
        flex: 1,

        color: Colors.Primary,
        // marginBottom: 100,
      },
      blockquote: {
        flex: 1,

        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_block: {
        flex: 1,

        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_inline: {
        flex: 1,

        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 4,
        fontFamily: 'monospace',
      },
    },
  });
