import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setEventNotification} from '../../store/reducer/calendarReducer';
import CustomMultiSelectDropDown from '../SharedComponent/CustomMultiSelectDropdown';
import CustomDropDown from '../SharedComponent/CustomDropDown';
import CrossCircle from '../../assets/Icons/CrossCircle';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';

const UpdateEventNotificationContainer = () => {
  const dispatch = useDispatch();
  const {eventNotification} = useSelector(state => state.calendar);

  const notifications = !eventNotification?.length
    ? [
        {
          timeBefore: 5,
          methods: ['push'],
          chatGroups: [],
        },
      ]
    : eventNotification;
  const {groupNameId} = useSelector(state => state.chat);
  const defaultMethod = [{data: 'push', type: 'Notification'}];

  const onChangeValue = (key, value, index) => {
    // console.log("key", JSON.stringify(key, null, 1));
    // console.log("value", JSON.stringify(value, null, 1));
    let array = [...notifications];
    if (key === 'chatGroups') {
      array[index] = {
        ...array[index],
        [key]: [...value],
      };
    } else if (key === 'methods') {
      if (!value.includes('groups')) {
        array[index] = {
          ...array[index],
          chatGroups: [],
          [key]: value,
        };
      } else {
        array[index] = {
          ...array[index],
          [key]: value,
        };
      }
    } else if (key === 'crossButton') {
      array = array?.filter((_, i) => i !== index);
    } else if (key === 'addNotification') {
      array = [
        ...array,
        {
          timeBefore: 5,
          methods: ['push'],
          chatGroups: [],
        },
      ];
    } else {
      array[index] = {
        ...array[index],
        [key]: Math.floor(value),
      };
    }

    // console.log("array....", JSON.stringify(array, null, 1));
    dispatch(setEventNotification(array));
  };

  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.notification}>
      {notifications?.map((item, index) => {
        const method = item?.methods?.map(i => ({
          data: i,
          type:
            i === 'push'
              ? 'Notification'
              : i === 'inbox'
              ? 'Chat DM'
              : i === 'groups'
              ? 'Chat Crowds'
              : i === 'email'
              ? 'Email'
              : i === 'text'
              ? 'Text Message'
              : '',
        }));
        const group = groupNameId
          ?.filter(grp => item?.chatGroups?.includes(grp.data))
          .map(a => ({
            data: a.data,
            type: a.type,
          }));
        return (
          <View key={index} style={styles.notificationRow}>
            <View style={styles.dropdownContainer}>
              <CustomDropDown
                options={[
                  {data: '5', type: '5 minutes before'},
                  {data: '10', type: '10 minutes before'},
                  {data: '15', type: '15 minutes before'},
                  {data: '20', type: '20 minutes before'},
                  {data: '30', type: '30 minutes before'},
                  {data: '45', type: '45 minutes before'},
                  {data: '60', type: '1 hour before'},
                  {data: '120', type: '2 hour before'},
                ]}
                type={
                  item.timeBefore === 5
                    ? '5 minutes before'
                    : item.timeBefore === 10
                    ? '10 minutes before'
                    : item.timeBefore === 15
                    ? '15 minutes before'
                    : item.timeBefore === 20
                    ? '20 minutes before'
                    : item.timeBefore === 30
                    ? '30 minutes before'
                    : item.timeBefore === 40
                    ? '45 minutes before'
                    : item.timeBefore === '60'
                    ? '1 hour before'
                    : item.timeBefore === '120'
                    ? '2 hour before'
                    : item.timeBefore
                }
                setState={time => {
                  onChangeValue('timeBefore', time, index);
                }}
              />
              <CustomMultiSelectDropDown
                options={[
                  {data: 'inbox', type: 'Chat DM'},
                  {data: 'groups', type: 'Chat Crowds'},
                  {data: 'push', type: 'Notification'},
                  {data: 'text', type: 'Text Message'},
                  {data: 'email', type: 'Email'},
                ]}
                initialSelections={method || defaultMethod}
                setState={mtd => {
                  onChangeValue(
                    'methods',
                    mtd.map(i => i.data),
                    index,
                  );
                }}
              />
              {item?.methods?.includes('groups') && (
                <CustomMultiSelectDropDown
                  options={groupNameId}
                  initialSelections={group}
                  setState={groups => {
                    onChangeValue(
                      'chatGroups',
                      groups.map(x => x.data),
                      index,
                    );
                  }}
                />
              )}
            </View>

            {eventNotification?.length > 1 && (
              <TouchableOpacity
                onPress={() => onChangeValue('crossButton', '', index)}>
                <CrossCircle />
              </TouchableOpacity>
            )}
          </View>
        );
      })}

      {eventNotification?.length <= 1 && (
        <TouchableOpacity
          onPress={() => {
            onChangeValue('addNotification');
          }}
          style={styles.addNotificationContainer}>
          <Text style={styles.addNotificationText}>Add Notification</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UpdateEventNotificationContainer;

const getStyles = Colors =>
  StyleSheet.create({
    dropdownContainer: {
      flex: 1,
      gap: responsiveScreenHeight(1),
    },

    notification: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor3,
      borderRadius: responsiveScreenWidth(3),
      padding: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(1),
      flexDirection: 'column',
      gap: 10,
      marginBottom: responsiveScreenHeight(2),
      zIndex: 3,
    },
    notificationRow: {
      flexDirection: 'row',
      gap: 10,
    },
    addNotificationContainer: {
      backgroundColor: Colors.Primary,
      borderRadius: 5,
      width: responsiveScreenWidth(33),
      alignItems: 'center',
      paddingVertical: responsiveScreenHeight(0.5),
      // paddingHorizontal: responsiveScreenWidth(.5)
    },
    addNotificationText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
    },
  });
