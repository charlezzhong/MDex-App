import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {COLORS} from '../utils/Constant';
import {useNavigation} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';

export default function SignupSuccess() {
  const navigation = useNavigation();
  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Signup Success Screen',
        screen_class: 'SignupSuccessScreen',
      });
    } catch (e) {
      console.log({e});
    }
  };

  useEffect(() => {
    firebaseAnalyticsLog();
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: wp(7),
            fontWeight: 'bold',
            color: COLORS.primary,
          }}>
          Welcome!
        </Text>
        <Image
          resizeMode="cover"
          style={{
            width: wp(70),
            height: wp(70),
          }}
          source={require('../images/email.jpg')}
        />
        <Text
          style={{
            color: COLORS.primary,
            fontWeight: 'bold',
            fontSize: wp(7),
            paddingVertical: wp(3),
            paddingHorizontal: wp(10),
            textAlign: 'center',
          }}>
          Verification email has been sent!
        </Text>
        <Text
          style={{
            color: 'black',
            paddingHorizontal: wp(9),
          }}>
          A verification email has been sent to your email to verify that you
          are a U-M affiliate! Once verified, click the "Back to Login" button
          below! if you have any trouble verifying your account, please email
          support@thisismdex.com
        </Text>
        <View style={{paddingTop: wp(10)}} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
          }}
          style={{
            backgroundColor: '#0C0C52',
            alignItems: 'center',
            borderRadius: 14,
            width: '80%',
            paddingVertical: wp(3),
          }}
          activeOpacity={0.7}>
          <Text
            style={{
              color: 'white',
              fontSize: wp(4),
            }}>
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
