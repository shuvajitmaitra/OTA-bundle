import {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import DownArrowIcon from '../../assets/Icons/DownArrowIcon';
import UpArrowIcon from '../../assets/Icons/UpArrowIcon';
import {useTheme} from '../../context/ThemeContext';
import {StyleSheet} from 'react-native';
import CustomFonts from '../../constants/CustomFonts';

const CustomDropDown = ({options, state, setState}) => {
  const [clicked, setClicked] = useState(false);
  const [item, setItem] = useState('');
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.design,
          {borderBottomLeftRadius: clicked ? 0 : 10},
          {borderBottomRightRadius: clicked ? 0 : 10},
        ]}
        onPress={() => {
          setClicked(!clicked);
        }}>
        <Text
          style={{
            paddingVertical: responsiveScreenHeight(0.5),
            color: Colors.BodyText,
          }}>
          {item == '' ? 'Select event type' : item}
        </Text>
        {clicked ? <UpArrowIcon /> : <DownArrowIcon />}
      </TouchableOpacity>
      {clicked ? (
        <View style={styles.optionsContainer}>
          {options.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setItem(item.type);
                setClicked(!clicked);
                setState(item.data);
              }}>
              <Text
                style={{
                  fontFamily: CustomFonts.REGULAR,
                  fontSize: responsiveScreenFontSize(1.5),
                  color: Colors.BodyText,
                  paddingHorizontal: responsiveScreenWidth(4),
                  paddingVertical: responsiveScreenHeight(1),
                }}>
                {item.type}
              </Text>
              <View
                style={{
                  borderBottomWidth: options?.length == index + 1 ? 0 : 0.5,
                  borderBottomColor: Colors.BorderColor,
                }}></View>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    optionsContainer: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: Colors.BorderColor,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      position: 'absolute',
      width: '100%',
      top: responsiveScreenHeight(5.3),
      zIndex: 1,
    },
    container: {
      flex: 1,
    },
    design: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: Colors.BorderColor,
      //   borderColor: Colors.borderColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      fontFamily: CustomFonts.REGULAR,
      paddingVertical: responsiveScreenHeight(1),
      position: 'relative',
    },
  });
export default CustomDropDown;
