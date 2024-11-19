import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';

import axiosInstance from '../../utility/axiosInstance';
import CustomFonts from '../../constants/CustomFonts';
import Toppart from '../../components/DashboardCom/Toppart';
import ProgramItem from '../../components/ProgramCom/ProgramItem';
import {useTheme} from '../../context/ThemeContext';

export default function Program() {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = React.useState(true);
  const [myProgram, setMyProgram] = React.useState(null);
  const [myProgressMetrics, setMyProgressMetrics] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        let myprogram = await axiosInstance.get('/enrollment/myprogram');
        let myprogress = await axiosInstance.get('/progress/myprogress');
        setMyProgressMetrics(myprogress.data?.metrics || []);
        setMyProgram(myprogram.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    })();
  }, []);
  const handleLeaderBoard = () => {
    navigation.navigate('Leaderboard');
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.White,
        }}>
        <ActivityIndicator size={50} animating={true} color={Colors.Primary} />
      </View>
    );
  }

  return (
    <View
      style={{flex: 1, padding: 16, backgroundColor: Colors.Background_color}}>
      <SafeAreaView style={[styles.container]}>
        <Toppart />
        <Text style={[styles.title, {color: Colors.Heading}]}>Bootcamps</Text>
        <Text style={styles.details}>Keep learning to make progress</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ProgramItem
            myprogram={myProgram}
            myProgressMetrics={myProgressMetrics}
          />

          {/* <TouchableOpacity
          onPress={handleLeaderBoard}
          activeOpacity={0.8}
          style={styles.myPrograssBtn}
        >
          <Image
            style={styles.progressIcon}
            source={require("../../assets/ApplicationImage/MainPage/Program/leaderboard.png")}
          />
          <Text style={styles.progressText}>Leaderboard</Text>
        </TouchableOpacity> */}
          <View style={styles.emptyContainer}></View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: responsiveScreenHeight(5),
      backgroundColor: Colors.Background_color,
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      marginTop: responsiveScreenHeight(2),
    },
    details: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      marginTop: responsiveScreenHeight(0.5),
      color: Colors.BodyText,
      marginBottom: responsiveScreenHeight(0.5),
    },
    emptyContainer: {
      height: responsiveScreenHeight(2),
    },
    myPrograssBtn: {
      backgroundColor: Colors.White,
      width: responsiveScreenWidth(93),
      borderRadius: 5,
      marginTop: responsiveScreenHeight(2),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: responsiveScreenHeight(1.5),
    },
    progressText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.7),
      color: Colors.Primary,
    },
  });
