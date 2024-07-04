import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import ReactNativeModal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const CustomSignUpModal = ({
  isVisible,
  onClose,
  setVisible,
  onImageLibraryPress,
  onCameraPress,
  field,
}) => {
  const text = {
    name: 'Get creative! You can make it anything you want!',
    email:
      'MDex is exclusive to the Umich campus. We require your email to verify that you are a Umich student. A verification link will be sent to your email after you complete the sign up.',
    password:
      'Make your password fun and distinct from other accounts you use (just like any other password). MDex is NOT able to access/ see your password.',
    copied:
      'Registration link has been copied! Paste into your browser to complete registration!',
  };
  return (
    <ReactNativeModal
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
      //   modalStyle={styles.modal}
      style={{
        flex: 1,
        marginHorizontal: widthPercentageToDP(10),
        borderWidth: 0,
        justifyContent: 'center',
        margin: 0,
      }}
      isVisible={isVisible}>
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => setVisible(false)}
          style={{alignSelf: 'flex-end'}}>
          <MaterialCommunityIcons
            name={'close-circle'}
            size={widthPercentageToDP(6)}
            color="black"
          />
        </TouchableOpacity>
        <Text style={styles.text}>{text[field]}</Text>
      </View>
    </ReactNativeModal>
  );
};
export default CustomSignUpModal;
const styles = StyleSheet.create({
  content: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    // textAlign: 'center',
    fontSize: widthPercentageToDP(3.5),
  },
});
