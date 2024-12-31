import React, {useEffect, useState, useCallback, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import CommunityCreatePost from '../../components/CommunityCom/CommunityCreatePost';
import {loadCommunityPosts} from '../../actions/chat-noti';
import CommunityPost from '../../components/CommunityCom/CommunityPost';
import {useSelector} from 'react-redux';
import LoadingSmall from '../../components/SharedComponent/LoadingSmall';
import ScrollToTop from '../../assets/Icons/ScrollToTop';
import SearchAndFilter from '../../components/SharedComponent/SearchAndFilter';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import CrossCircle from '../../assets/Icons/CrossCircle';
import PostPopup from '../../components/CommunityCom/Modal/PostPopup';
import GlobalCommentModal from '../../components/SharedComponent/GlobalCommentModal';

const CommunityScreen = () => {
  const {
    posts = [],
    totalPost = 0,
    isLoading: loadingData = false,
    singlePost = null,
  } = useSelector(state => state.community);
  const {bottomSheetVisible} = useSelector(state => state.modal);

  const [modalVisible, setModalVisible] = useState(false);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [page, setPage] = useState(2);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [searchTag, setSearchTag] = useState([]);
  const [data, setData] = useState({
    page: 1,
    limit: 10,
    query: '',
    tags: [],
    user: '',
    filterBy: filterValue,
  });
  const filterData = [
    {
      id: 1,
      label: 'Clear',
      value: '',
    },
    {
      id: 2,
      label: 'Saved Posts',
      value: 'save',
    },
    {
      id: 3,
      label: 'Reported Posts',
      value: 'report',
    },
    {
      id: 4,
      label: 'My Posts',
      value: 'mypost',
    },
    {
      id: 5,
      label: 'Recent',
      value: 'recent',
    },
    {
      id: 6,
      label: 'This Week',
      value: 'lastweek',
    },
    {
      id: 7,
      label: 'This Month',
      value: 'lastmonth',
    },
  ];

  const scrollY = useSharedValue(0);
  const flatListRef = useRef(null);
  const buttonTranslateY = useSharedValue(250);

  const onScroll = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
    if (event.contentOffset.y > 200) {
      buttonTranslateY.value = withSpring(0, {
        damping: 10,
        mass: 1,
        stiffness: 100,
      });
    } else {
      buttonTranslateY.value = withSpring(250, {
        damping: 10,
        mass: 1,
        stiffness: 100,
      });
    }
  });

  const renderItem = useCallback(({item, index}) => {
    if (!item) return null;
    return (
      <CommunityPost
        post={item}
        index={index}
        handleTopContributor={handleTopContributor}
        handleTagSearch={handleTagSearch}
      />
    );
  }, []);

  const keyExtractor = useCallback((item, index) => item?._id?.toString() || index.toString(), []);

  const handleScrollToTop = () => {
    flatListRef.current.scrollToOffset({animated: true, offset: 0});
  };

  const handleFilter = value => {
    setFilterValue(value);
    const filterOption = filterData.find(option => option.value === value);

    if (!filterOption) {
      console.error('Invalid filter value:', value);
      return;
    }
  };
  const handleTagSearch = tag => {
    setSearchTag(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags;
      }
      const updatedTags = [...prevTags, tag];
      return updatedTags;
    });
    handleScrollToTop();
  };
  const handleRemoveTag = tagToRemove => {
    setSearchTag(prevTags => {
      const updatedTags = prevTags.filter(tag => tag !== tagToRemove);
      return updatedTags;
    });
  };

  const handleTopContributor = id => {
    setUserId(id);
    loadCommunityPosts({
      page: 1,
      limit: 10,
      query: data.query,
      tags: [],
      user: id,
      filterBy: '',
    });
  };

  const handleFetchMore = () => {
    if (posts.length < totalPost) {
      loadCommunityPosts({
        page: page,
        limit: 10,
        query: data.query,
        tags: searchTag,
        user: userId,
        filterBy: '',
      });
      setPage(prevPage => prevPage + 1);
    }
  };
  const handleSearch = () => {
    loadCommunityPosts({
      page: 1,
      limit: 10,
      query: data.query,
      tags: [],
      user: '',
      filterBy: '',
    });
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: responsiveScreenHeight(50),
        animated: true,
      });
    }
  };

  useEffect(() => {
    loadCommunityPosts({
      page: 1,
      limit: 10,
      query: '',
      tags: searchTag,
      user: '',
      filterBy: filterValue,
    });
  }, [searchTag, filterValue]);

  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: buttonTranslateY.value}],
    };
  });

  return (
    <View
      style={{
        backgroundColor: Colors.Background_color,
        position: 'relative',
        flex: 1,
      }}>
      <View
        style={{
          backgroundColor: Colors.Background_color,
        }}
      />
      <Animated.View style={[styles.upButtonContainer, buttonStyle]}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleScrollToTop}>
          <ScrollToTop />
        </TouchableOpacity>
      </Animated.View>
      <Animated.FlatList
        ref={flatListRef}
        data={isLoading ? [] : posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Community</Text>
            <Text style={styles.subHeading}>
              Engage and inspire: post, share, and discover
            </Text>
            <View style={{paddingHorizontal: 10, paddingBottom: 10}}>
              <SearchAndFilter
                setSearchText={text => setData(pre => ({...pre, query: text}))}
                // placeholderText="Search by tag..."
                searchText={data?.query ? data.query : ''}
                handleSearch={handleSearch}
                itemList={filterData}
                handleFilter={handleFilter}
                filterValue={filterValue}
                // setFilterValue={setFilterValue}
                setFilterValue={value => {
                  setData(pre => ({
                    ...pre,
                    filterBy: value,
                    ...(value === '' && {query: ''}),
                  }));
                }}
              />

              {/* <Divider /> */}
            </View>
            <CommunityCreatePost />
            {/* {isLoading && <Loading />} */}
            {searchTag?.length > 0 && (
              <View style={styles.tagContainer}>
                {searchTag?.map((tag, idx) => (
                  <View key={idx} style={styles.tagButton}>
                    <Text style={styles.tagSearchText}>{tag}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveTag(tag)}
                      style={styles.crossIcon}>
                      <CrossCircle color={Colors.Red} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </>
        }
        contentContainerStyle={styles.container}
        onScroll={onScroll}
        onEndReached={() => {
          if (posts.length < totalPost) {
            handleFetchMore();
          }
        }}
        ListFooterComponent={
          <>
            {totalPost === posts?.length ? (
              <Text style={[styles.title, {textAlign: 'center'}]}>
                No data available
              </Text>
            ) : (
              <View
                style={{
                  height: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <LoadingSmall color={Colors.Primary} size={20} />
              </View>
            )}
          </>
        }
        ListEmptyComponent={!loadingData && <NoDataAvailable />}
      />

      {singlePost && <PostPopup />}
      {bottomSheetVisible && <GlobalCommentModal />}
    </View>
  );
};

export default CommunityScreen;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      // paddingHorizontal: responsiveScreenWidth(4),
      backgroundColor: Colors.Background_color,
    },
    title: {
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontWeight: '500',
      // marginBottom: responsiveScreenHeight(2),
      paddingHorizontal: 15,
    },
    subHeading: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
      paddingBottom: responsiveScreenHeight(2),
      paddingHorizontal: 15,
    },
    separator: {
      // backgroundColor: "red",
      minHeight: responsiveScreenHeight(10),
    },
    buttonContainer: {
      backgroundColor: Colors.CyanOpacity,
      borderRadius: 100,
      width: responsiveScreenFontSize(5),
      height: responsiveScreenFontSize(5),
      alignItems: 'center',
      justifyContent: 'center',
    },

    upButtonContainer: {
      position: 'absolute',
      zIndex: 100,
      bottom: responsiveScreenHeight(5),
      right: responsiveScreenWidth(8),
    },
    tagSearchText: {
      color: Colors.Heading,
      paddingHorizontal: 15,
      paddingVertical: 5,
      fontFamily: CustomFonts.REGULAR,
    },
    tagContainer: {
      paddingTop: 5,
      flex: 1,
      flexWrap: 'wrap',
      flexDirection: 'row',
      gap: 15,
      paddingBottom: 15,
      paddingHorizontal: 10,
    },
    tagButton: {
      backgroundColor: Colors.White,
    },
    crossIcon: {
      position: 'absolute',
      right: -10,
      top: -10,
    },
  });
