import analytics from '@react-native-firebase/analytics';
import {useNavigation} from '@react-navigation/native';
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Animated,
  Easing,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default function SignUpProgress() {
  const [currentField, setCurrentField] = useState(1);
  const navigation = useNavigation();
  const [fieldValues, setFieldValues] = useState({
    name: '',
    email: '',
    password: '',
  });

  const slideAnimation = useRef(new Animated.Value(0)).current;

  const slideToField = targetField => {
    const slideValue = targetField < currentField ? 1 : -1;
    Animated.timing(slideAnimation, {
      toValue: slideValue,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      setCurrentField(targetField);
      slideAnimation.setValue(0);
    });
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Field values:', fieldValues);
  };

  const slideLeft = slideAnimation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-400, 0, 400], // Adjust as needed
  });

  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Sign Up Progress Screen',
        screen_class: 'SignUpProgressScreen',
      });
    } catch (e) {
      console.log({e});
    }
  };

  useEffect(() => {
    firebaseAnalyticsLog();
  }, []);

  const renderName = () => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            marginTop: hp('10'),
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: wp('8'),
            }}>
            What's your name?
          </Text>
        </View>
        <TextInput
          placeholder="Name"
          placeholderTextColor={'gray'}
          style={{
            color: 'white',
            fontSize: wp('5'),
            marginTop: hp('4'),
          }}></TextInput>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SignIn');
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: wp('3.3'),
              marginTop: hp('4'),
              textDecorationLine: 'underline',
            }}>
            Sign in
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: hp('5'),
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              width: wp('40'),
              height: hp('5'),
              borderRadius: wp('40') / 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#0C0C52',
                fontSize: wp('4.5'),
              }}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#0C0C52',
        // backgroundColor:"#040424",
      }}>
      <KeyboardAvoidingView
        contentContainerStyle={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Animated.View style={{flex: 1, transform: [{translateX: slideLeft}]}}>
          {renderName()}
          {/* {currentField === 1 && (
          <View>
            <Text>Enter your first field:</Text>
            <TextInput
              placeholder="Field 1"
              value={fieldValues.field1}
              onChangeText={text =>
                setFieldValues({...fieldValues, field1: text})
              }
            />
          </View>
        )}
        {currentField === 2 && (
          <View>
            <Text>Enter your second field:</Text>
            <TextInput
              placeholder="Field 2"
              value={fieldValues.field2}
              onChangeText={text =>
                setFieldValues({...fieldValues, field2: text})
              }
            />
          </View>
        )}

        <Button
          title="Back"
          onPress={() => slideToField(currentField - 1)}
          disabled={currentField === 1}
        />
        <Button
          title={currentField < 2 ? 'Next' : 'Done'}
          onPress={
            currentField < 2
              ? () => slideToField(currentField + 1)
              : handleSubmit
          }
        /> */}
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
