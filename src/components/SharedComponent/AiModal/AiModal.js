import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../../context/ThemeContext';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import AiButtonContainer from './AiButtonContainer';
import CustomFonts from '../../../constants/CustomFonts';
import {RegularFonts} from '../../../constants/Fonts';
import Markdown from 'react-native-markdown-display';
import ReactNativeModal from 'react-native-modal';
import AiDrawer from './AiDrawer';
import axiosInstance from '../../../utility/axiosInstance';
import {handleError} from '../../../actions/chat-noti';
import AiTopSection from './AiTopSection';
import CopyIcon from '../../../assets/Icons/CopyIcon';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import GlobalAlertModal from '../GlobalAlertModal';
import {showAlertModal} from '../../../utility/commonFunction';
import AiIcon2 from '../../../assets/Icons/AiIcon2';
import Clipboard from '@react-native-clipboard/clipboard';

const AiModal = ({state, setState = () => {}, onCancelPress, isVisible}) => {
  const {top} = useSafeAreaInsets();
  const Colors = useTheme();
  const styles = getStyles(Colors, top);
  const [generatedText, setGeneratedText] = useState(state);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState({});
  const [result, setResult] = useState('');
  const [previousResult, setPreviousResult] = useState('');
  const [preVisible, setPreVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Reanimated shared value for opacity
  const opacity = useSharedValue(1);

  const handleCancelButton = () => {
    onCancelPress();
    setResult('');
  };

  // Animated style
  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    setGeneratedText(state);
  }, [state]);

  useEffect(() => {
    if (isVisible) {
      opacity.value = withRepeat(
        withTiming(0, {duration: 500, easing: Easing.linear}),
        -1,
        true,
      );
    } else {
      cancelAnimation(opacity);
      opacity.value = withTiming(1, {duration: 500, easing: Easing.linear});
    }

    return () => {
      cancelAnimation(opacity);
    };
  }, [isVisible, opacity]);

  const generatePrompt = () => {
    let pro = '';

    if (
      selectedValues['Questions'] &&
      Array.isArray(selectedValues['Questions'])
    ) {
      const questions = selectedValues['Questions'].join(' ');
      pro += ` ${questions}`;
    }

    if (selectedValues['Rewrite']) {
      pro += ` ${selectedValues['Rewrite']}`;
    }
    if (selectedValues['About'] && Array.isArray(selectedValues['About'])) {
      const about = selectedValues['About'].join(' ');
      pro += ` ${about}`;
    }

    if (selectedValues['Styles']) {
      pro += ` ${selectedValues['Styles']}`;
    }

    if (
      selectedValues['S Media posts'] &&
      Array.isArray(selectedValues['S Media posts'])
    ) {
      const sMediaPosts = selectedValues['S Media posts'].join(' ');
      pro += ` ${sMediaPosts}`;
    }

    if (selectedValues['Size']) {
      pro += ` ${selectedValues['Size']}`;
    }

    handleGenerate(pro);
  };

  const handleGenerate = prompt => {
    const data = prompt
      ? prompt.includes(generatedText)
        ? prompt
        : `${generatedText} ${prompt}`
      : generatedText;
    if (!generatedText) {
      showAlertModal({
        title: 'Queries field empty',
        type: 'warning',
        message: 'Please write your queries in the field',
      });
      return;
    }
    setIsLoading(true);
    axiosInstance
      .post('/organization/integration/generate-text', {prompt: data})
      .then(res => {
        if (res.data.success) {
          setResult(res.data.text);
          setSelectedValues({});
          setGeneratedText('');
          setPreviousResult(result);
          setIsCopied(false);
        }
      })
      .catch(error => {
        showAlertModal({
          title: 'Something went wrong!',
          type: 'error',
          message: error.response.data.error || 'There is some error',
        });
        handleError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const copyAvailableAfter = () => {
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const handleApplyPress = () => {
    if (preVisible) {
      setState(previousResult);
    } else {
      setState(result);
    }
    onCancelPress();
  };

  const handleClipBoard = () => {
    const data = preVisible ? previousResult : result;
    try {
      Clipboard.setString(data);
      setIsCopied(true);
      copyAvailableAfter();
    } catch (error) {
      console.error('Error while copying to clipboard:', error);
    }
  };

  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackdropPress={() => onCancelPress()}
      style={{margin: 0}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        {isDrawerVisible ? (
          <AiDrawer
            generatedText={generatedText}
            toggle={() => setIsDrawerVisible(pre => !pre)}
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
          />
        ) : (
          <View style={styles.container}>
            <AiTopSection
              setIsDrawerVisible={setIsDrawerVisible}
              preVisible={preVisible}
              setPreVisible={state => {
                setPreVisible(state);
                setIsCopied(false);
              }}
              previousResult={previousResult}
            />
            <ScrollView
              contentContainerStyle={{width: responsiveScreenWidth(100)}}>
              {isLoading ? (
                <View style={[styles.loadingContainer, {width: '38%'}]}>
                  <AiIcon2 color={Colors.PureCyan} />
                  <Animated.Text style={[styles.text, animatedTextStyle]}>
                    Thinking...
                  </Animated.Text>
                </View>
              ) : (
                <>
                  {result && (
                    <View
                      style={{
                        marginHorizontal: responsiveScreenWidth(4),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <View style={styles.loadingContainer}>
                        <AiIcon2 color={Colors.PureCyan} />
                        <Text style={[styles.text]}>Your result:</Text>
                      </View>
                      {isCopied ? (
                        <View style={styles.copyContainer}>
                          <Text style={[styles.text, {color: Colors.BodyText}]}>
                            Copied...
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={handleClipBoard}
                          style={styles.copyContainer}>
                          <CopyIcon />
                          <Text style={[styles.text, {color: Colors.BodyText}]}>
                            Copy
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                  <Markdown style={styles.markdownStyle}>
                    {preVisible ? previousResult : result}
                  </Markdown>
                </>
              )}
            </ScrollView>
            <TextInput
              keyboardAppearance={
                Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
              }
              placeholder="Write your queries"
              multiline
              style={styles.input}
              value={generatedText}
              onChangeText={text => setGeneratedText(text)}
              placeholderTextColor={Colors.BodyText}
              autoCorrect={false}
            />
            <AiButtonContainer
              handleCancelButton={handleCancelButton}
              generatePrompt={generatePrompt}
              onApplyPress={handleApplyPress}
              onResetPress={() => {
                setResult('');
              }}
              resetVisible={result && !isLoading}
            />
          </View>
        )}
        <GlobalAlertModal />
      </KeyboardAvoidingView>
    </ReactNativeModal>
  );
};

export default AiModal;

const getStyles = (Colors, top) =>
  StyleSheet.create({
    copyContainer: {
      backgroundColor: Colors.WhiteOpacityColor,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    loadingContainer: {
      backgroundColor: Colors.CyanOpacity,
      // width: "38%",
      alignItems: 'center',
      paddingVertical: 3,
      flexDirection: 'row',
      paddingHorizontal: responsiveScreenWidth(4),

      gap: 10,
      borderRadius: 4,
    },
    text: {
      fontSize: 18,
      color: Colors.PureCyan,
      fontFamily: CustomFonts.MEDIUM,
    },

    input: {
      backgroundColor: Colors.ScreenBoxColor,
      width: '95%',
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      minHeight: 40,
      maxHeight: 100,
      borderRadius: 30,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: Platform.OS === 'ios' && 10,
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: RegularFonts.BR,
      textAlignVertical: 'center',
    },

    container: {
      backgroundColor: Colors.Background_color,
      paddingTop: top,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
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
        color: Colors.BodyText,
        fontFamily: CustomFonts.REGULAR,
        lineHeight: 24,
        textAlign: 'justify',
        height: 'auto',
        paddingHorizontal: 10,
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
      fence: {
        flex: 1,
        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 4,
        fontFamily: 'monospace',
      },
      bullet_list: {
        fontFamily: 'monospace',
      },
      ordered_list: {
        fontFamily: 'monospace',
        paddingRight: 10,
      },
    },
  });
