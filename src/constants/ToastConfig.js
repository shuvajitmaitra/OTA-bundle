import {Text, View} from 'react-native';
import {BaseToast, ErrorToast} from 'react-native-toast-message';

/*
  1. Create the config
*/
export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: props => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'pink',
        backgroundColor: 'red',
        width: '50%',
        alignItems: 'center',
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({text1, props}) => {
    return (
      <View
        style={{
          minHeight: 40,
          minWidth: '30%',
          backgroundColor: props.background || 'rgba(0, 0, 0, 0.5)',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          paddingHorizontal: 20,
        }}>
        <Text
          style={{
            color: props.color || 'white',
            fontSize: 18,
          }}>
          {text1}
        </Text>
      </View>
    );
  },
};
