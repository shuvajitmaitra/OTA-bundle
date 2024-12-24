import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo, useState} from 'react';
import Markdown from 'react-native-markdown-display';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveFontSize,
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import PostHeader from './PostHeader';
import CustomFonts from '../../constants/CustomFonts';
import TopContributorSlider from './TopContributorSlider';
import PostFooterSection from './PostFooterSection';
import {getComments} from '../../actions/chat-noti';
import CommentSection from '../CommentCom/CommentSection';
import ReportModal from './Modal/ReportModal';
import ViewPostImage from './ViewPostImage';
import {autoLinkify} from '../ChatCom/MessageHelper';
import {showToast} from '../HelperFunction';

const CommunityPost = memo(
  ({post, index, handleTopContributor, handleTagSearch}) => {
    if (post?.title?.includes('Overcoming')) {
      console.log('post', JSON.stringify(post, null, 2));
    }
    const Colors = useTheme();
    const styles = getStyles(Colors);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // State for toggling expanded text

    const toggleCommentSection = () => {
      setShowComments(!showComments);
      getComments(post?._id);
    };

    const postText = post?.description || '';
    const isTextLong = postText.length > 400; // Check if the text is long
    const displayText = isExpanded ? postText : `${postText.slice(0, 400)}...`;

    const handleSeeMoreToggle = () => {
      setIsExpanded(true);
    };

    return (
      <>
        {(index === 1 ||
          index === 5 ||
          index === 10 ||
          index === 15 ||
          index === 20) && (
          <View style={styles.TopContributorsContainer}>
            <Text style={styles.postTitle}>Top Contributors</Text>
            <TopContributorSlider handleTopContributor={handleTopContributor} />
          </View>
        )}
        <View style={styles.postContainer}>
          <PostHeader setIsReportModalVisible={setIsModalVisible} post={post} />
          <Text style={styles.postTitle}>{post?.title}</Text>
          {post?.tags?.length > 0 && (
            <View style={styles.tagContainer}>
              {post?.tags.map((tag, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleTagSearch(tag)}>
                  <Text style={styles.tag}>#{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {post?.attachments?.length > 0 && <ViewPostImage post={post} />}
          <Markdown style={styles.markdownStyle}>
            {autoLinkify(displayText)}
          </Markdown>
          {isTextLong && !isExpanded && (
            <TouchableOpacity onPress={handleSeeMoreToggle}>
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
          )}
          <PostFooterSection
            toggleCommentSection={toggleCommentSection}
            post={post}
            showComments={showComments}
          />
          {isModalVisible && (
            <ReportModal
              isModalVisible={isModalVisible}
              setIsReportModalVisible={setIsModalVisible}
            />
          )}
        </View>
      </>
    );
  },
);

export default CommunityPost;

const getStyles = Colors =>
  StyleSheet.create({
    TopContributorsContainer: {
      gap: responsiveScreenHeight(1),
      marginBottom: responsiveScreenHeight(2),
      marginHorizontal: responsiveScreenWidth(4),
    },
    postContainer: {
      backgroundColor: Colors.White,
      marginBottom: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      // paddingVertical: responsiveScreenHeight(2),
      paddingTop: responsiveScreenHeight(2),
      paddingBottom: responsiveScreenHeight(0.5),
      zIndex: -1,
      position: 'relative',
      gap: 10,
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: Colors.BorderColor,
    },
    postTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.6),
      color: Colors.Heading,
    },
    tagContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      flexWrap: 'wrap',
    },
    tag: {
      color: Colors.Primary,
    },
    seeMoreText: {
      // textAlign: "right",
      color: Colors.Red,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(2),
      // marginTop8 responsiveScreenHeight(1),
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
      },
      heading1: {
        fontSize: 24,
        color: Colors.Heading,
        marginBottom: 10,
      },
      heading2: {
        fontSize: 20,
        color: Colors.Heading,
        marginBottom: 8,
      },
      heading3: {
        fontSize: 18,
        color: Colors.Heading,
        marginBottom: 6,
      },
      paragraph: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'justify',
      },
      link: {
        color: Colors.Primary,
      },
      blockquote: {
        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_block: {
        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_inline: {
        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 4,
        fontFamily: 'monospace',
      },
    },
  });
