import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
  Text,
  View,
} from 'react-native';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import ReactNativeModal from 'react-native-modal';
const ImagePickerModal = ({
  isVisible,
  onClose,
  setVisible,
  onImageLibraryPress,
  onCameraPress,
}) => {
  return (
    <ReactNativeModal
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}
      //   modalStyle={styles.modal}
      style={{
        flex: 1,
        marginHorizontal: 0,
        borderWidth: 0,
        justifyContent: 'flex-end',
        margin: 0,
      }}
      isVisible={isVisible}>
      <View style={styles.content}>
        <View style={styles.buttons}>
          <Pressable style={styles.button} onPress={onImageLibraryPress}>
            <FontAwesome
              //   style={styles.buttonIcon}
              onPress={onImageLibraryPress}
              color={'#0C0C52'}
              name={'picture-o'}
              size={wp(8)}
            />

            <Text style={styles.text}>Library</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={onCameraPress}>
            <Entypo
              style={styles.buttonIcon}
              color={'#0C0C52'}
              onPress={onCameraPress}
              name={'camera'}
              size={wp(8)}
            />
            <Text style={styles.text}>camera</Text>
          </Pressable>
        </View>
      </View>
    </ReactNativeModal>
  );
};
export default ImagePickerModal;
const styles = StyleSheet.create({
  content: {
    // margin: 0,
    // flex: 1,
    borderRadius: 15,
    backgroundColor: '#fff',
  },

  buttonIcon: {
    alignSelf: 'center',
  },
  buttons: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    // backgroundColor: 'red',
    flexDirection: 'row',
    paddingBottom: hp(2),
    paddingTop: wp(3),
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#0C0C52',
    fontWeight: '500',
    fontSize: 17,
  },
});
