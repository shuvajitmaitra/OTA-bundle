import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import CustomModal from '../../components/SharedComponent/CustomModal';
import Message2 from '../../components/ChatCom/Message2';
import {useTheme} from '../../context/ThemeContext';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
// import {FlashList} from '@shopify/flash-list';

const PinnedMessagesScreen = ({pinned, setPinnedScreenVisible}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const renderItem = ({item, index}) => {
    return <Message2 item={item} index={index} nextSender={false} />;
  };

  return (
    <CustomModal parentStyle={{zIndex: 1}} customStyles={styles.customStyles}>
      <FlatList
        data={pinned || []}
        renderItem={renderItem}
        keyExtractor={() => Math.random().toString()}
        inverted
      />
      <TouchableOpacity
        onPress={() => setPinnedScreenVisible(false)}
        style={styles.exitButton}>
        <Text style={styles.exitText}>Exit from pin screen</Text>
      </TouchableOpacity>
    </CustomModal>
  );
};

export default PinnedMessagesScreen;

const getStyles = Colors =>
  StyleSheet.create({
    exitButton: {
      backgroundColor: Colors.Background_color,
      padding: 10,
      margin: 10,
      borderRadius: 10,
      alignItems: 'center',
    },
    exitText: {
      color: Colors.Primary,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
    },
    customStyles: {
      flex: 1,
      width: '100%',
      zIndex: 2,
    },
  });
