import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

const CustomBlueButton = ({onPress, title = 'Next'}) => {
  return (
    <TouchableOpacity style={styles.buttonStyle} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomBlueButton;

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingVertical: heightPercentageToDP(1.5),
    borderRadius: 25,
    marginTop: heightPercentageToDP(2),
    marginHorizontal: widthPercentageToDP(8),
  },
  buttonText: {
    color: '#7541FF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: widthPercentageToDP(4.8),
  },
});
