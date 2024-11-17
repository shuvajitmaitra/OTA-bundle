import React, { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import axiosInstance from "../../../utility/axiosInstance";
import ProgramFiles from "./ProgramFiles";
import Loading from "../../SharedComponent/Loading";
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import CustomFonts from "../../../constants/CustomFonts";
import SearchAndFilter from "../../SharedComponent/SearchAndFilter";
import Divider from "../../SharedComponent/Divider";
import { useTheme } from "../../../context/ThemeContext";
import ProgramPriority from "./ProgramPriority";
import NoDataAvailable from "../../SharedComponent/NoDataAvailable";

export const ModuleContext = React.createContext(null);

function ContentList({ category, course }) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isPlayingLesson, setIsPlayingLesson] = useState(null);
  const [treeData, setTreeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoad, setDataLoad] = useState(false);
  const [filterValue, setFilterValue] = React.useState("all");
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // console.log("treeData", JSON.stringify(treeData, null, 1));
  const itemList = [
    { label: "All", value: "all" },
    { label: "Newly updated", value: "newly updated" },
    { label: "Focus", value: "focused" },
    { label: "Pinned", value: "pinned" },
    { label: "Completed", value: "completed" },
    { label: "Incomplete", value: "incomplete" },
  ];

  const handleFetchData = ({ course, category, searchText, filterBy }) => {
    if (!course?.slug) return;

    setIsLoading(true);
    axiosInstance
      .post(`/course/chapterv2/get/${course?.slug}/${category}`, {
        parent: null,
        queryText: searchText?.length > 2 ? searchText : null,
        filterBy,
      })
      // .then((res) => {
      //   const initialChapters = res.data?.chapters.map((chapter) => ({
      //     title: chapter.lesson?.title || chapter.chapter?.name,
      //     key: chapter?._id,
      //     isLeaf: chapter?.isLocked ? true : chapter.type !== "chapter",
      //     ...chapter,
      //   }));
      //   setTreeData(initialChapters);
      //   setIsLoading(false);
      // })
      // .catch((err) => {
      //   console.log(err);
      //   setIsLoading(false);
      // });
      .then((res) => {
        const initialChapters = res.data?.chapters.map((chapter) => ({
          title: chapter.lesson?.title || chapter.chapter?.name,
          key: chapter?._id,
          isLeaf: chapter?.isLocked ? true : chapter.type !== "chapter",
          ...chapter,
        }));
        setTreeData(initialChapters);
        setFilteredData(initialChapters); // Initialize filteredData
        setIsLoading(false);
      })

      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handlePriorityChange = (priority) => {
    let filtered;
    if (priority === "high") {
      filtered = treeData.filter((item) => item.priority === 3); // High Priority
    } else if (priority === "medium") {
      filtered = treeData.filter((item) => item.priority === 2); // Medium Priority
    } else if (priority === "low") {
      filtered = treeData.filter((item) => item.priority === 0); // Low Priority
    } else if (priority === "pinned") {
      filtered = treeData.filter((item) => item.isPinned); // Pinned
    } else if (priority === "completed") {
      filtered = treeData.filter((item) => item.isCompleted); // Completed
    } else if (priority === "incomplete") {
      filtered = treeData.filter((item) => !item.isCompleted); // Incomplete
    } else {
      filtered = treeData;
    }
    setFilteredData(filtered);
  };

  useEffect(() => {
    handleFetchData({
      course,
      category,
      searchText,
      filterBy: filterValue,
    });
  }, [course?.slug, category]);

  // const debounce = (func, wait) => {
  //   let timeout;

  //   return function executedFunction(...args) {
  //     const later = () => {
  //       clearTimeout(timeout);
  //       func(...args);
  //     };

  //     clearTimeout(timeout);
  //     timeout = setTimeout(later, wait);
  //   };
  // };
  // const debouncedSearch = debounce(handleFetchData, 1000);

  const handleSearch = () => {
    handleFetchData({
      course,
      category,
      searchText,
      filterBy: filterValue,
    });
    // if (searchText?.length > 2) {
    //   debouncedSearch({
    //     course, // Ensure this variable is accessible
    //     category, // Ensure this variable is accessible
    //     searchText: searchText,
    //     filterBy: filterValue,
    //   });
    // } else if (!searchText) {
    //   debouncedSearch({
    //     course, // Ensure this variable is accessible
    //     category, // Ensure this variable is accessible
    //     searchText: "",
    //     filterBy: filterValue,
    //   });
    // }
  };

  const handleFilter = (value) => {
    setFilterValue(value);
    // console.log("value", JSON.stringify(value, null, 1));
    handleFetchData({
      course, // Ensure this variable is accessible
      category, // Ensure this variable is accessible
      searchText: searchText,
      filterBy: value,
    });
  };
  const handleUpdateRootChapter = (chapterId, data) => {
    const newTreeData = treeData.map((item) => {
      if (item?._id === chapterId) {
        return {
          ...item,
          ...data,
        };
      }
      return item;
    });
    setTreeData(newTreeData);
  };
  return (
    <ModuleContext.Provider
      value={{
        setIsPlayingLesson,
        isPlayingLesson,
        dataLoad,
        setDataLoad,
        handleUpdateRootChapter,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: Colors.Background_color,
        }}
      >
        <StatusBar
          translucent={true}
          backgroundColor={Colors.Background_color}
          barStyle={Colors.Background_color === "#F5F5F5" ? "dark-content" : "light-content"}
        />
        <View style={styles.searchFilterContainer}>
          <SearchAndFilter
            handleSearch={handleSearch}
            handleFilter={handleFilter}
            setSearchText={setSearchText}
            filterValue={filterValue}
            itemList={itemList}
            searchText={searchText}
            setFilterValue={setFilterValue}
          />
          <Divider />
          <ProgramPriority onPriorityChange={handlePriorityChange} />
        </View>
        <View style={styles.mainContainer}>
          {isLoading ? (
            <Loading backgroundColor={"transparent"} />
          ) : (
            <>
              {/* {treeData?.length > 0 ? (
                treeData?.map((item) => (
                  <ProgramFiles
                    item={item}
                    key={item?._id}
                    course={course}
                    category={category}
                    isChildren={false}
                    dataLoad={dataLoad}
                    setDataLoad={setDataLoad}
                  />
                ))
              ) : (
                <NoDataAvailable />
              )} */}
              {filteredData?.length > 0 ? (
                filteredData?.map((item) => (
                  <ProgramFiles
                    item={item}
                    key={item?._id}
                    course={course}
                    category={category}
                    isChildren={false}
                    dataLoad={dataLoad}
                    setDataLoad={setDataLoad}
                  />
                ))
              ) : (
                <NoDataAvailable />
              )}
            </>
          )}
        </View>
      </ScrollView>
    </ModuleContext.Provider>
  );
}

export default ContentList;
const getStyles = (Colors) =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: Colors.Background_color,
      // marginTop: responsiveScreenHeight(2),
      paddingVertical: responsiveScreenHeight(1),
      paddingBottom: responsiveScreenHeight(10),
      paddingHorizontal: responsiveScreenWidth(2),
      minHeight: responsiveScreenHeight(50),
    },
    searchFilterContainer: {
      paddingTop: responsiveScreenHeight(1.5),
      marginHorizontal: responsiveScreenWidth(4),
    },
    headingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.1),
      color: "rgba(0, 0, 0, 0.80)",
    },
  });
