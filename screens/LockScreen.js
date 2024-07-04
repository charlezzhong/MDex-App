import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Animated, Easing} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import AuthContext from '../context/auth';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import analytics from '@react-native-firebase/analytics';

const LockScreen = ({navigation}) => {
  const animatedValue = new Animated.Value(0);
  const colorValue = new Animated.Value(0);
  // const {GoogleLogin, error, userInfo} = useGoogle();
  const [loader, setLoader] = useState(false);
  const [state, setState] = useContext(AuthContext);

  // Create an animation sequence for the gradient
  Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]),
  ).start();

  // Create an animation sequence for the color transitions
  Animated.loop(
    Animated.sequence([
      Animated.timing(colorValue, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: false,
      }),
      Animated.timing(colorValue, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]),
  ).start();

  // Calculate the interpolated colors based on the animated values
  const interpolatedColors = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#0C0C52', '#040424'],
  });

  const interpolatedFlashingColors = colorValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.5)'],
  });

  // Apply the animated gradient style with flashing effects
  const animatedGradientStyle = {
    flex: 1,
    backgroundColor: interpolatedColors,
  };

  const animatedFlashingStyle = {
    flex: 1,
    backgroundColor: interpolatedFlashingColors,
  };

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const triggerMediumHapticFeedback = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy', options);
  };

  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Lock Screen',
        screen_class: 'LockScreen',
      });
    } catch (e) {
      console.log({e});
    }
  };

  useEffect(() => {
    firebaseAnalyticsLog();
  }, []);

  return (
    <Animated.View style={animatedGradientStyle}>
      <Animated.View style={animatedFlashingStyle}>
        <SafeAreaView style={styles.container}>
          <View style={styles.footerContainer}>
            <Image source={require('./Logo.png')} style={styles.image} />
            <Text style={styles.textStyle1}>Join the U-M Campus Community</Text>
          </View>
          <View style={styles.footerContainer}>
            <Pressable
              style={styles.button1}
              disabled={loader}
              onPress={() => {
                // GoogleLogin();
                triggerMediumHapticFeedback();
                navigation.navigate('SignUp');
              }}>
              {loader ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.tstyle1}>Start 🥳</Text>
                // <View style={{flexDirection: 'row', alignItems: 'center'}}>
                //   <Image
                //     source={require('./Media/googleIcon.png')}
                //     style={{
                //       height: widthPercentageToDP(5),
                //       width: widthPercentageToDP(5),
                //       marginRight: widthPercentageToDP(2),
                //     }}
                //   />
                //   <Text style={styles.tstyle1}>Google Login</Text>
                // </View>
              )}
            </Pressable>
            {/*<Pressable
              style={styles.button2}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.tstyle2}>Log In</Text>
  </Pressable>*/}
          </View>
        </SafeAreaView>
      </Animated.View>
    </Animated.View>
  );
};

export default LockScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  footerContainer: {
    marginBottom: heightPercentageToDP(15),
  },
  image: {
    height: heightPercentageToDP(17),
    width: widthPercentageToDP(80),
    alignSelf: 'center',
    marginTop: heightPercentageToDP(20),
  },
  textStyle: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 25,
  },
  textStyle1: {
    color: 'white',
    fontSize: widthPercentageToDP(5),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textStyle2: {
    color: 'white',
    textAlign: 'center',
    fontSize: widthPercentageToDP(3.8),
    paddingVertical: heightPercentageToDP(3),
    paddingHorizontal: widthPercentageToDP(4),
  },
  button1: {
    backgroundColor: '#F8F8F8',
    paddingVertical: heightPercentageToDP(1.6),
    marginHorizontal: widthPercentageToDP(25),
    borderRadius: widthPercentageToDP(10),
    borderWidth: 1,
    borderColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button2: {
    marginTop: heightPercentageToDP(1.5),
    backgroundColor: '#040424',
    paddingVertical: heightPercentageToDP(1.8),
    marginHorizontal: widthPercentageToDP(7),
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1.5,
  },
  tstyle1: {
    fontSize: widthPercentageToDP(6),
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  tstyle2: {
    fontSize: widthPercentageToDP(3.8),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '85%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  drawerText: {
    fontSize: 20,
  },
});
