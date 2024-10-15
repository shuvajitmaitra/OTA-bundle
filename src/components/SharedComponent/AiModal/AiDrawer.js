// AiDrawer.js
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useCallback } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { responsiveScreenWidth } from "react-native-responsive-dimensions";
import CrossCircle from "../../../assets/Icons/CrossCircle";
import RightArrowButtonWithoutTail from "../../../assets/Icons/RightArrowButtonWithoutTail";
import CustomeFonts from "../../../constants/CustomeFonts";
import { RegularFonts } from "../../../constants/Fonts";
import GlobalRadioGroup2 from "../GlobalRadioGroup2";
import GlobalRadioGroup from "../GlobalRadioButton";

const AiDrawer = ({ generatedText = "", toggle, setSelectedValues, selectedValues }) => {
  const { top } = useSafeAreaInsets();
  const Colors = useTheme();
  const styles = getStyles(Colors, top);
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = useCallback((category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  const keywordsCategories = [
    {
      title: "Rewrite",
      keywords: [
        { label: "Discussion", value: "Rewrite as Discussion" },
        { label: "Opinions", value: "Rewrite as Opinions" },
        { label: "Advise", value: "Rewrite as Advise" },
        { label: "Recommendations", value: "Rewrite as Recommendations" },
        { label: "Outstanding", value: "Rewrite as Outstanding" },
        { label: "Exceptional", value: "Rewrite as Exceptional" },
        { label: "Feedback", value: "Rewrite as Feedback" },
      ],
      inputType: "radio",
    },
    {
      title: "Questions",
      keywords: [
        {
          label: "What",
          value: `What is ${generatedText}?  and answer with first line question  and under write answer`,
        },
        {
          label: "Why",
          value: `Why is used ${generatedText}?  and answer with first line question  and under write answer`,
        },
        {
          label: "Where",
          value: `Where is used  ${generatedText}?  and answer with first line question  and under write answer`,
        },
        {
          label: "When",
          value: `When is use ${generatedText}?  and answer with first line question  and under write answer`,
        },
        {
          label: "Advantage",
          value: `What is the Advantage of ${generatedText}?  and answer with first line question  and under write answer`,
        },
        {
          label: "Disadvantages ",
          value: `What is the  Disadvantages of ${generatedText}?  and answer with first line question  and under write answer`,
        },
        {
          label: "Alternative",
          value: `Alternative of ${generatedText}?  and answer with first line question  and under write answer`,
        },
        {
          label: "How ",
          value: `How to use ${generatedText}?  and give the example? and answer with first line question  and under write answer`,
        },
      ],
      inputType: "checkbox",
    },
    {
      title: "About",
      keywords: [
        { label: "Objective", value: "Objective" },
        { label: "Mission", value: "Mission" },
      ],
      inputType: "checkbox",
    },
    {
      title: "Styles",
      keywords: [
        { value: "write with Professional", label: "Professional" },
        { value: "write with Formal", label: "Formal" },
        { value: "write with Informal", label: "Informal" },
        { value: "write with Funny", label: "Funny" },
        { value: "write with Humor", label: "Humor" },
        { value: "write with Political", label: "Political" },
        { value: "write with Motivational", label: "Motivational" },
        { value: "write with Inspirational", label: "Inspirational" },
        { value: " write with Sad", label: "Sad" },
        { value: "write with Sorrow", label: "Sorrow" },
        { value: "write with Welcoming", label: "Welcoming" },
        { value: "write with Excited", label: "Excited" },
        { value: "write with Innovative", label: "Innovative" },
        { value: "write with Revolutionary", label: "Revolutionary" },
      ],
      inputType: "radio",
    },
    {
      title: "S Media posts",
      keywords: [
        { label: "Engaging", value: "Engaging" },
        { label: "Lucrative", value: "Lucrative" },
        { label: "Quick Outcome centric", value: "Quick Outcome centric" },
        { label: "Exceptional", value: "Exceptional" },
        { label: "Ask questions to engage", value: "Ask questions to engage" },
        {
          label: "Provide constructive feedback",
          value: "Provide constructive feedback",
        },
      ],
      inputType: "checkbox",
    },
    {
      title: "Size",
      keywords: [
        { label: "Long", value: "write in Long" },
        { label: "Shots", value: "write in Shots" },
        { label: "Medium", value: "write in  Medium" },
        { label: "100 words", value: "write in 100 words" },
        { label: "200 words", value: "write in 200 words" },
      ],
      inputType: "radio",
    },

    // Add more categories as needed
  ];

  const handleRadioSelect = useCallback((category, value) => {
    setSelectedValues((prev) => ({
      ...prev,
      [category]: value,
    }));
  }, []);

  const handleCheckboxToggle = useCallback((category, updatedSelections) => {
    setSelectedValues((prev) => ({
      ...prev,
      [category]: updatedSelections,
    }));
  }, []);

  //   {
  //     "prompt": "hello boss What is  ? and answer with first line question  and under write answer Why is used   ? and answer with first line question  and under write answer Where is used  ? and answer with first line question  and under write answer Objective Mission Engaging .must be less than 3000 characters including spaces and punctuation, also don't wrap the text into quotations"
  // }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          toggle();
          //   generatePrompt();
        }}
        style={styles.drawerContainer}
      >
        <CrossCircle size={40} />
      </TouchableOpacity>

      <ScrollView>
        <View>
          {keywordsCategories.map((item, index) => (
            <View
              style={{
                marginBottom: 10,
                backgroundColor: Colors.WhiteOpacityColor,
                borderRadius: 10,
                marginHorizontal: responsiveScreenWidth(4),
                paddingBottom: expandedCategories[item.title] && 10,
              }}
              key={item.title + index}
            >
              <TouchableOpacity onPress={() => toggleCategory(item.title)} style={styles.buttonContainer}>
                <Text style={styles.itemText}>{item.title}</Text>
                <RightArrowButtonWithoutTail bgColor={Colors.Background_color} />
              </TouchableOpacity>
              <View style={{ paddingHorizontal: responsiveScreenWidth(8) }}>
                {expandedCategories[item.title] &&
                  (item.inputType === "radio" ? (
                    <GlobalRadioGroup
                      options={item.keywords}
                      selected={selectedValues[item.title] || ""}
                      onSelect={(value) => handleRadioSelect(item.title, value)}
                    />
                  ) : (
                    <GlobalRadioGroup2
                      options={item.keywords}
                      selected={selectedValues[item.title] || []}
                      onSelect={(updatedSelections) => handleCheckboxToggle(item.title, updatedSelections)}
                    />
                  ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default AiDrawer;

const getStyles = (Colors, top) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.White,
      paddingTop: top,
    },
    drawerContainer: {
      //   position: "absolute",
      //   top: top,
      //   left: responsiveScreenWidth(4),
      backgroundColor: Colors.PrimaryOpacity,
      borderRadius: 100,
      padding: 10,
      zIndex: 10,
    },
    buttonContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.Background_color,
      //   marginTop: top / 1.2,
      justifyContent: "space-between",
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: 10,
      paddingVertical: 15,
    },
    itemText: {
      fontFamily: CustomeFonts.MEDIUM,
      fontSize: RegularFonts.HL,
      color: Colors.Heading,
    },
    // Additional styles for radio and checkbox options can be moved to child components
  });
