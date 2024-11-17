import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, useColorScheme, StatusBar} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '../../context/ThemeContext';
import {setDisplayMode} from '../../store/reducer/chatReducer';
import CustomFonts from '../../constants/CustomFonts';
import ScreenHeader from '../../components/SharedComponent/ScreenHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GlobalRadioGroup from '../../components/SharedComponent/GlobalRadioButton';

const DisplaySettingsScreen = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {displayMode} = useSelector(state => state.chat);
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const [checked, setChecked] = useState(displayMode || 'default');
  const options = [
    {value: 'default', label: 'Default'},
    {value: 'dark', label: 'Dark'},
  ];
  useEffect(() => {
    if (displayMode) {
      setChecked(displayMode);
    }
  }, [displayMode]);

  const handleRadioChecked = status => {
    setChecked(status);
    if (status === 'default') {
      dispatch(setDisplayMode(status));
    } else if (status === 'dark') {
      dispatch(setDisplayMode(status));
    } else if (colorScheme === 'dark') {
      dispatch(setDisplayMode('dark'));
    } else if (colorScheme === 'light') {
      dispatch(setDisplayMode('default'));
    }
  };
  const {top} = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: Colors.White, paddingTop: top},
      ]}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.White}
        barStyle={
          Colors.Background_color === '#F5F5F5'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <ScreenHeader />
      <Text style={styles.headingText}>Display settings</Text>
      <Text style={styles.description}>Choose your display color</Text>
      <View style={styles.themeContainer}>
        <GlobalRadioGroup
          options={options}
          onSelect={stc => handleRadioChecked(stc)}
          selectedValue={checked}
          customStyle={styles.customStyle}
        />
      </View>

      {/* <Button title="Restart" onPress={() => Restart()} /> */}
    </View>
  );
};

export default DisplaySettingsScreen;

const getStyles = Colors =>
  StyleSheet.create({
    customStyle: {
      flexDirection: 'row',
      gap: 30,
    },
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.White,
      width: responsiveScreenWidth(40),
      paddingRight: responsiveScreenWidth(2),
      borderRadius: 10,
    },
    radioText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      color: Colors.Heading,
    },
    themeContainer: {
      flexDirection: 'row',
      backgroundColor: Colors.Background_color,
      justifyContent: 'space-between',
      borderRadius: 10,
      paddingVertical: responsiveScreenHeight(3),
      paddingHorizontal: responsiveScreenHeight(2),
      marginVertical: responsiveScreenHeight(2),
    },
    description: {
      color: Colors.BodyText,
      // paddingTop: responsiveScreenHeight(0.5),
      fontFamily: CustomFonts.REGULAR,
    },
    headingText: {
      fontSize: responsiveScreenFontSize(2.5),
      fontWeight: '600',
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      marginTop: 10,
    },
    container: {
      flex: 1,
      // justifyContent: "center",
      // alignItems: "center",
      paddingVertical: responsiveScreenHeight(2),
      paddingHorizontal: responsiveScreenWidth(3),

      minHeight: responsiveScreenHeight(10),
    },
  });
