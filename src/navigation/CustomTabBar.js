import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Platform} from 'react-native';
import HomeIcon from '../assets/Icons/HomeIcon';
import ProgramIcon from '../assets/Icons/ProgramIcon';
import DocumentsIcon from '../assets/Icons/DocumentsIcon';
import CalenderIcon from '../assets/Icons/CalenderIcon';
import {useTheme} from '../context/ThemeContext';
import CustomFonts from '../constants/CustomFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import CommunityIcon from '../assets/Icons/CommunityIcon';
import {loadCommunityPosts} from '../actions/chat-noti';
import {setCommunityPosts} from '../store/reducer/communityReducer';
import {useDispatch} from 'react-redux';

const CustomTabBar = ({state, descriptors, navigation}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();

  return (
    <View style={{backgroundColor: Colors.Background_color}}>
      <View
        style={[
          styles.tabContainer,
          {
            backgroundColor: Colors.White,
            paddingBottom: Platform.OS === 'ios' ? 10 : 0,
            height: 70,
          },
        ]}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (route.name === 'CommunityStack') {
              dispatch(setCommunityPosts([]));
              loadCommunityPosts({
                page: 1,
                limit: 10,
                query: '',
                tags: [],
                user: '',
                filterBy: '',
              });
            }

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const Icon = () => {
            switch (route.name) {
              case 'HomeStack':
                return (
                  <>
                    <View style={styles.tabIconContainer(isFocused)}>
                      <HomeIcon
                        color={isFocused ? Colors.PureWhite : Colors.BodyText}
                      />
                    </View>
                    <Text style={styles.label(isFocused)}>Home</Text>
                  </>
                );
              case 'ProgramStack':
                return (
                  <>
                    <View style={styles.tabIconContainer(isFocused)}>
                      <ProgramIcon
                        color={isFocused ? Colors.PureWhite : Colors.BodyText}
                      />
                    </View>
                    <Text style={styles.label(isFocused)}>Program</Text>
                  </>
                );
              case 'PresentationStack':
                return (
                  <>
                    <View style={styles.tabIconContainer(isFocused)}>
                      <DocumentsIcon
                        color={isFocused ? Colors.PureWhite : Colors.BodyText}
                      />
                    </View>
                    <Text style={styles.label(isFocused)}>Documents</Text>
                  </>
                );
              case 'MyCalenderStack':
                return (
                  <>
                    <View style={styles.tabIconContainer(isFocused)}>
                      <CalenderIcon
                        color={isFocused ? Colors.PureWhite : Colors.BodyText}
                      />
                    </View>
                    <Text style={styles.label(isFocused)}>Calendar</Text>
                  </>
                );
              case 'CommunityStack':
                return (
                  <>
                    <View style={styles.tabIconContainer(isFocused)}>
                      <CommunityIcon
                        size={24}
                        color={isFocused ? Colors.PureWhite : Colors.BodyText}
                      />
                    </View>
                    <Text style={styles.label(isFocused)}>Community</Text>
                  </>
                );
              default:
                return null;
            }
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabItem}>
              <Icon />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    tabIconContainer: isFocused => ({
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isFocused ? Colors.Primary : 'transparent',
      paddingVertical: 2,
      paddingHorizontal: 12, // Static padding instead of animated
      borderRadius: 100,
      marginBottom: 4, // Optional: Adds some spacing between icon and label
    }),
    tabContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'space-between',
      shadowColor: Colors.Gray,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
      width: '100%', // Ensure the tab bar takes full width
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
    },
    label: isFocused => ({
      color: isFocused ? Colors.Primary : Colors.BodyText,
      fontFamily: isFocused ? CustomFonts.BOLD : CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.5),
    }),
  });

export default CustomTabBar;
