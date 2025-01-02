import React, {useEffect, useState, useRef} from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import CreatePostButtonContainer from './CreatePostButtonContainer';
import Feather from 'react-native-vector-icons/Feather';
import {RegularFonts} from '../../constants/Fonts';

const CommunityCreatePost = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [post, setPost] = useState({});
  const [fullView, setFullView] = useState(false);

  const titleInputRef = useRef(null);

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const toggleStatusSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFullView(!fullView);

    if (!fullView) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 300);
    }
  };

  return (
    <View style={styles.createPostContainer}>
      {fullView ? (
        <>
          <Pressable onPress={toggleStatusSection} style={styles.toggleSection}>
            <Text style={styles.title}>Create Post</Text>
            <Feather name="minimize-2" size={24} color={Colors.Primary} />
          </Pressable>
          <View style={styles.fieldContainer}>
            <TextInput
              ref={titleInputRef} // Attach ref to the title input
              keyboardAppearance={
                Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
              }
              placeholder="Enter post title..."
              multiline
              textAlignVertical="top"
              placeholderTextColor={Colors.BodyText}
              style={[styles.input, {fontFamily: CustomFonts.REGULAR}]}
              onChangeText={text => setPost(pre => ({...pre, title: text}))}
              value={post.title || ''}
            />
          </View>
          <View style={styles.fieldContainer}>
            <TextInput
              keyboardAppearance={
                Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
              }
              placeholder="Write post..."
              placeholderTextColor={Colors.BodyText}
              textAlignVertical="top"
              multiline
              style={[
                styles.input,
                {
                  minHeight: responsiveScreenHeight(15),
                  fontFamily: CustomFonts.REGULAR,
                },
              ]}
              onChangeText={text =>
                setPost(pre => ({...pre, description: text}))
              }
              value={post.description || ''}
            />
          </View>
          <CreatePostButtonContainer post={post} setPost={setPost} />
        </>
      ) : (
        <TouchableOpacity
          onPress={toggleStatusSection}
          style={styles.dummyInput}>
          <Text style={styles.sloganText}>What's on your mind?</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CommunityCreatePost;

const getStyles = Colors =>
  StyleSheet.create({
    sloganText: {
      color: Colors.BodyText,
      fontSize: RegularFonts.BR,
    },
    toggleSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: responsiveScreenHeight(1),
    },
    dummyInput: {
      height: 50,
      backgroundColor: Colors.Background_color,
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 7,
      paddingHorizontal: 15,
      justifyContent: 'center',
    },
    input: {
      backgroundColor: Colors.Background_color,
      minHeight: responsiveScreenHeight(6),
      borderRadius: responsiveScreenFontSize(1),
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overflow: 'hidden',
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(1.5),
      paddingVertical: responsiveScreenHeight(1),
      color: Colors.BodyText,
    },
    createPostContainer: {
      backgroundColor: Colors.White,
      minHeight: 50,
      paddingHorizontal: responsiveScreenWidth(2),
      marginBottom: 10,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
    },
    title: {
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
    },
    fieldContainer: {
      marginTop: responsiveScreenHeight(1),
      gap: responsiveScreenHeight(1),
    },
  });
