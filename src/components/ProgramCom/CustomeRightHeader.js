import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import ProgramSwitchModal from '../SharedComponent/ProgramSwitchModal';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {useMainContext} from '../../context/MainContext';

const CustomeRightHeader = ({CustomButton, setModalOutside}) => {
  const Colors = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const {handleVerify} = useMainContext();

  const activeProgram = async () => {
    // if (
    //   (myEnrollments?.length === 1 || myEnrollments?.length === 2) &&
    //   myEnrollments[0]?.status === 'approved'
    // ) {
    //   await AsyncStorage.setItem(
    //     'active_enrolment',
    //     JSON.stringify(myEnrollments[0]),
    //   );
    //   dispatch(setProgramActive(myEnrollments[0]));
    //   handleVerify();
    //   console.log('222222222222222222222222222');
    // } else {
    //   console.log('3333333333333333333333333333');
    //   setModalOpen(true);
    // }
  };

  useEffect(() => {
    if (setModalOutside) {
      activeProgram();
      // setModalOpen(true);
    }
  }, [setModalOutside]);

  return (
    <>
      {CustomButton ? (
        <TouchableOpacity onPress={() => setModalOpen(true)}>
          <CustomButton />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            width: responsiveScreenWidth(25),
            backgroundColor: Colors.PrimaryButtonBackgroundColor,
            paddingVertical: responsiveScreenHeight(0.8),
            borderRadius: responsiveScreenWidth(1.5),
          }}
          onPress={() => setModalOpen(true)}>
          <Text
            style={{
              color: Colors.PureWhite,
              fontFamily: CustomFonts.MEDIUM,
              textAlign: 'center',
              fontSize: responsiveFontSize(1.6),
            }}>
            Switcddddh
          </Text>
        </TouchableOpacity>
      )}

      {modalOpen && (
        <ProgramSwitchModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          handleVerify={handleVerify}
        />
      )}
    </>
  );
};

export default React.memo(CustomeRightHeader);
