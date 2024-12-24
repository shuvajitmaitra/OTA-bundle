import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import UpArrowIcon from '../../assets/Icons/UpArrowIcon';
import DownArrowIcon from '../../assets/Icons/DownArrowIcon';
import NotifyBell from '../../assets/Icons/NotifyBell';
import RepeatIcon from '../../assets/Icons/RepeatIcon';
import CustomFonts from '../../constants/CustomFonts';

const RemainderDropdown = ({options}) => {
  const [remainderClicked, setRemainderClicked] = useState(false);
  const [repeatClicked, setRepeatClicked] = useState(false);

  const [remainderItems, setRemainderItems] = useState('');
  const [repeatItem, setRepeatItem] = useState('');
  return (
    <>
      {/* ----------- Remainder Dropdown  ----------- */}

      <View style={{flex: 1}}>
        <TouchableOpacity
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8f8f8',
              borderWidth: 1,
              overFlow: 'hidden',
              borderBottomWidth: 0,
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: 10,
              paddingHorizontal: responsiveScreenWidth(4),
              fontFamily: CustomFonts.REGULAR,
              paddingVertical: responsiveScreenHeight(1),
              position: 'relative',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          ]}
          onPress={() => {
            setRemainderClicked(!remainderClicked);
          }}>
          <Text
            style={{
              paddingVertical: responsiveScreenHeight(0.5),
              color: 'rgba(84, 106, 126, 1)',
            }}>
            {remainderItems == '' ? (
              <View
                style={{
                  flexDirection: 'row',
                  gap: responsiveScreenWidth(1.5),
                  alignItems: 'center',
                }}>
                <NotifyBell />
                <Text>Early Reminder</Text>
              </View>
            ) : (
              remainderItems
            )}
          </Text>
          {remainderClicked ? <UpArrowIcon /> : <DownArrowIcon />}
        </TouchableOpacity>
        {remainderClicked ? (
          <View
            style={{
              backgroundColor: 'white',
              borderWidth: 1,
              overFlow: 'hidden',
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
              position: 'absolute',
              width: '100%',
              top: responsiveScreenHeight(5.3),
              zIndex: 1,
            }}>
            {options.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setRemainderItems(item.type);
                  setRemainderClicked(!remainderClicked);
                }}>
                <Text
                  style={{
                    fontFamily: CustomFonts.REGULAR,
                    fontSize: responsiveScreenFontSize(1.5),
                    color: 'rgba(0, 0, 0, 0.5)',
                    paddingHorizontal: responsiveScreenWidth(4),
                    paddingVertical: responsiveScreenHeight(1),
                  }}>
                  {item.type}
                </Text>
                <View
                  style={{
                    borderBottomWidth: options?.length == index + 1 ? 0 : 0.5,
                    borderBottomColor: 'rgba(0, 0, 0, 0.3)',
                  }}></View>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>

      {/* ----------- Repeat dropdown ----------- */}

      <View style={{flex: 1}}>
        <TouchableOpacity
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8f8f8',
              borderWidth: 1,
              overFlow: 'hidden',
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: 10,
              paddingHorizontal: responsiveScreenWidth(4),
              fontFamily: CustomFonts.REGULAR,
              paddingVertical: responsiveScreenHeight(1),
              position: 'relative',
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            },
            {borderBottomLeftRadius: repeatClicked ? 0 : 10},
            {borderBottomRightRadius: repeatClicked ? 0 : 10},
          ]}
          onPress={() => {
            setRepeatClicked(!repeatClicked);
          }}>
          <Text
            style={{
              paddingVertical: responsiveScreenHeight(0.5),
              color: 'rgba(84, 106, 126, 1)',
            }}>
            {repeatItem == '' ? (
              <View
                style={{
                  flexDirection: 'row',
                  gap: responsiveScreenWidth(1.5),
                  alignItems: 'center',
                }}>
                <RepeatIcon />
                <Text>Repeat</Text>
              </View>
            ) : (
              repeatItem
            )}
          </Text>
          {repeatClicked ? <UpArrowIcon /> : <DownArrowIcon />}
        </TouchableOpacity>
        {repeatClicked ? (
          <View
            style={{
              backgroundColor: 'white',
              borderWidth: 1,
              overFlow: 'hidden',
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
              position: 'absolute',
              width: '100%',
              top: responsiveScreenHeight(5.3),
              zIndex: 1,
            }}>
            {options.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setRepeatItem(item.type);
                  setRepeatClicked(!repeatClicked);
                }}>
                <Text
                  style={{
                    fontFamily: CustomFonts.REGULAR,
                    fontSize: responsiveScreenFontSize(1.5),
                    color: 'rgba(0, 0, 0, 0.5)',
                    paddingHorizontal: responsiveScreenWidth(4),
                    paddingVertical: responsiveScreenHeight(1),
                  }}>
                  {item.type}
                </Text>
                <View
                  style={{
                    borderBottomWidth: options?.length == index + 1 ? 0 : 0.5,
                    borderBottomColor: 'rgba(0, 0, 0, 0.3)',
                  }}></View>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>
    </>
  );
};

export default RemainderDropdown;
