import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from '../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/auth';
import {COLORS, baseUrl} from '../utils/Constant';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import CustomSignUpModal from '../components/Modal/CustomSigupModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import useGoogle from '../utils/useGoogle';
import Entypo from 'react-native-vector-icons/Entypo';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import analytics from '@react-native-firebase/analytics';

const SignUpScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkBox, setCheckBox] = useState(false);
  const [state, setState] = useContext(AuthContext);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [nameQuestionModal, setNameQuestionModal] = useState(false);
  const [emailQuestionModal, setEmailQuestionModal] = useState(false);
  const [passwordQuestionModal, setPasswordQuestionModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const {GoogleLogin, error, userInfo} = useGoogle();

  useEffect(() => {
    if (error) {
      //alert(error);
    }
  }, [error]);

  useEffect(() => {
    if (userInfo) {
      console.log('userInfo', userInfo);
      handleLogin(userInfo);
    }
  }, [userInfo]);
  const handleLogin = async data => {
    setLoader(true);

    try {
      const response = await axios.post(`${baseUrl}/signin-google`, data);
      console.log('response', {...response.data});
      console.log('response', JSON.stringify(response));
      if (response.data.error) {
        //alert(response.data.error);
      } else {
        let reportPost = await AsyncStorage.getItem('reportPost');
        filteredCategories = [
          'Accessories',
          'Clothes',
          'Caffeine',
          'Food',
          'Snacks',
          'Water bottles',
          'Swag bag',
          'Phone Wallets',
          'Tickets',
          'Therapy Dogs',
          'Hats',
          'Pizza',
        ];
        await AsyncStorage.setItem(
          'filteredCategories',
          JSON.stringify(filteredCategories),
        );
        let locationFilter = await AsyncStorage.getItem('locationFilter');
        locationFilter = locationFilter ? locationFilter : 'all';
        setState({
          ...response.data,
          reportPost: reportPost || [],
          filteredCategories: filteredCategories,
          locationFilter: locationFilter,
        });
        await AsyncStorage.setItem('auth-rn', JSON.stringify(response.data));
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${response.data.token}`;
        // console.log('attaching header', axios.defaults.headers.common['Authorization'])
        /*alert("Log In Successful");*/
        setLoader(false);
        navigation.navigate('Home');
        /*alert("Navigating");*/
      }
    } catch (error) {
      console.log(error);
      console.log('er', error?.message);
      alert('Use umich email to sign in');
    }
    setLoader(false);
  };
  useEffect(() => {
    if (name && email && password) {
      setIsFormComplete(true);
    } else {
      setIsFormComplete(false);
    }
  }, [name, email, password]);

  const handleSubmit = async () => {
    if (name === '' || email === '' || password === '') {
      //alert('All fields are required');
      return;
    }
    setLoader(true);

    try {
      console.log('name', name, 'email', email, 'password', password);
      const response = await axios.post(`${baseUrl}/signup`, {
        name,
        email,
        password,
      });

      console.log('response===>', response);

      if (response.data.error) {
        //alert(response.data.error);
      } else {
        // setState(response.data);
        // await AsyncStorage.setItem('auth-rn', JSON.stringify(response.data));
        // alert(response?.data?.message || 'Sign Up Successful');
        setLoader(false);
        navigation.navigate('SignupSuccess');
      }
    } catch (error) {
      console.log('err', error);
      let message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Use umich email to sign in';
      alert(message);
    }
    setLoader(false);
  };

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const triggerMediumHapticFeedback = () => {
    ReactNativeHapticFeedback.trigger('rigid', options);
  };
  /*try {
        const resp = await axios.post("http://localhost:8000/api/signup", { name, email, password, });
        console.log(resp.data);
        alert("Sign Up Successful");
    } catch (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            alert("Request failed");
        } else if (error.request) {
            console.log(error.request);
            alert("Request failed");
        } else {
            console.log("Error", error.message);
            alert("Request failed");
        }
    }*/

  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Sign Up Screen',
        screen_class: 'SignUpScreen',
      });
    } catch (e) {
      console.log({e});
    }
  };

  useEffect(() => {
    firebaseAnalyticsLog();
  }, []);

  return (
    // <KeyboardAwareScrollView contentContainerStyle={styles.container}>
    //   <KeyboardAvoidingView
    //     style={styles.container}
    //     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <SafeAreaView style={{flex: 1}}>
      <TouchableOpacity
        onPress={() => {
          triggerMediumHapticFeedback();
          navigation.goBack();
        }}
        style={{
          marginTop: heightPercentageToDP(2),
          marginLeft: widthPercentageToDP(4),
        }}>
        <Entypo
          name="chevron-with-circle-left"
          size={widthPercentageToDP(8)}
          color="#0c0c52"
        />
      </TouchableOpacity>
      <ScrollView
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Lock');
          }}>
          <Image
            source={require('./Media/MainPageTop.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.signUpLowerText}>
            Sign in using your umich email
          </Text>
          {/* <View style={{marginHorizontal: widthPercentageToDP(5)}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: widthPercentageToDP(4), color: '#8e93a1'}}>
              NAME
            </Text>
            <TouchableOpacity
              style={{marginLeft: widthPercentageToDP(1)}}
              onPress={() => setNameQuestionModal(true)}>
              <AntDesign
                name={'questioncircleo'}
                size={widthPercentageToDP(4)}
                color="#8e93a1"
              />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.signUpInput}
            value={name}
            placeholderTextColor={COLORS.primary}
            onChangeText={text => setName(text)}
            autoCapitalize="words"
            autoCorrect={false}
            placeholder="Enter your first name"
          />
        </View>
        <View style={{marginHorizontal: widthPercentageToDP(5)}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: widthPercentageToDP(4), color: '#8e93a1'}}>
              EMAIL
            </Text>
            <TouchableOpacity
              style={{marginLeft: widthPercentageToDP(1)}}
              onPress={() => setEmailQuestionModal(true)}>
              <AntDesign
                name={'questioncircleo'}
                size={widthPercentageToDP(4)}
                color="#8e93a1"
              />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.signUpInput}
            value={email}
            onChangeText={text => setEmail(text)}
            autoCompleteType="email"
            placeholderTextColor={COLORS.primary}
            autoCapitalize="none"
            placeholder="Enter your umich email"
            keyboardType="email-address"
          />
        </View>
        <View style={{marginHorizontal: widthPercentageToDP(5)}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: widthPercentageToDP(4), color: '#8e93a1'}}>
              PASSWORD
            </Text>
            <TouchableOpacity
              style={{marginLeft: widthPercentageToDP(1)}}
              onPress={() => setPasswordQuestionModal(true)}>
              <AntDesign
                name={'questioncircleo'}
                size={widthPercentageToDP(4)}
                color="#8e93a1"
              />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.signUpInput}
            value={password}
            placeholderTextColor={COLORS.primary}
            onChangeText={text => setPassword(text)}
            keyboardType="default"
            secureTextEntry={true}
            placeholder="Enter your password"
            autoCompleteType="password"
          />
        </View> */}
          <TouchableOpacity
            onPress={() => {
              GoogleLogin();
            }}
            style={[
              styles.buttonStyle,
              // checkBox && styles.buttonGreen,
            ]}
            //disabled={!checkBox}
          >
            {loader ? (
              <ActivityIndicator color={'white'} />
            ) : (
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Image
                  source={require('./Media/googleIcon.png')}
                  style={{
                    height: widthPercentageToDP(6),
                    width: widthPercentageToDP(6),
                    marginRight: widthPercentageToDP(2),
                    alignSelf: 'center',
                  }}
                />
                <Text style={styles.tstyle1}>Google Login</Text>
              </View>
            )}
          </TouchableOpacity>
          <View
            style={{
              marginHorizontal: widthPercentageToDP(5),
              paddingTop: heightPercentageToDP(2),
            }}>
            {/* <TouchableOpacity onPress={() => setCheckBox(!checkBox)}>
              <MaterialCommunityIcons
                name={checkBox ? 'checkbox-outline' : 'checkbox-blank-outline'}
                size={widthPercentageToDP(6)}
                color="black"
              />
            </TouchableOpacity> */}
            <View
              style={{
                paddingLeft: widthPercentageToDP(5),
                paddingRight: widthPercentageToDP(5),
                width: widthPercentageToDP(90),
                marginBottom: heightPercentageToDP(2),
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP(3),
                  color: '#8e93a1',
                  alignSelf: 'center',
                }}>
                By continuing, you agree to MDex's{' '}
                <Text
                  style={{
                    fontSize: widthPercentageToDP(3),
                    color: 'teal',
                    textDecorationLine: 'underline',
                  }}
                  onPress={() => navigation.navigate('WebView')}>
                  Terms of Use
                </Text>
              </Text>
            </View>
          </View>
          {/*         
        <Text
          style={{
            fontSize: widthPercentageToDP(4),
            color: '#0C0C52',
            marginLeft: '6%',
          }}>
          *Double check that your email is spelled correctly
        </Text> */}
          {/*<Text style={{ marginHorizontal: 24 }}>
                            {JSON.stringify({ name, email, password })}
    </Text>*/}
          <CustomSignUpModal
            isVisible={nameQuestionModal}
            field={'name'}
            setVisible={setNameQuestionModal}
          />
          <CustomSignUpModal
            isVisible={emailQuestionModal}
            field={'email'}
            setVisible={setEmailQuestionModal}
          />
          <CustomSignUpModal
            isVisible={passwordQuestionModal}
            field={'password'}
            setVisible={setPasswordQuestionModal}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
    //   </KeyboardAvoidingView>
    // </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    height: heightPercentageToDP(8),
    width: widthPercentageToDP(70),
    marginBottom: heightPercentageToDP(1),
    alignSelf: 'center',
  },
  signUpText: {
    fontSize: widthPercentageToDP(7),
    marginTop: heightPercentageToDP(5),
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: heightPercentageToDP(0.5),
  },
  signUpLowerText: {
    fontSize: widthPercentageToDP(4.5),
    marginTop: heightPercentageToDP(0.1),
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: heightPercentageToDP(3),
  },
  signUpInput: {
    borderBottomWidth: 0.5,
    paddingVertical: heightPercentageToDP(1),
    borderBottomColor: '#8e93a1',
    color: COLORS.primary,
    marginBottom: heightPercentageToDP(3.5),
    fontSize: widthPercentageToDP(3.5),
  },
  buttonStyle: {
    // backgroundColor: '#0C0C52',
    // justifyContent: 'center',
    // paddingVertical: heightPercentageToDP(1.5),
    // marginHorizontal: widthPercentageToDP(5),
    // borderRadius: 14,
    marginBottom: heightPercentageToDP(1.5),
    backgroundColor: '#0C0C52',
    paddingVertical: heightPercentageToDP(2),
    marginHorizontal: widthPercentageToDP(15),
    borderRadius: widthPercentageToDP(10),
    borderWidth: 1,
    borderColor: '#0C0C52',
    alignItems: 'center',
  },
  buttonGreen: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: widthPercentageToDP(4.7),
    textAlign: 'center',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
  tstyle1: {
    fontSize: widthPercentageToDP(5),
    paddingLeft: widthPercentageToDP(2),
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});

export default SignUpScreen;
