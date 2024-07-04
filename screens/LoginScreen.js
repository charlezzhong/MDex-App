import React, {useContext, useState, useEffect} from 'react';
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

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from '../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/auth';
import {useNavigation} from '@react-navigation/native';
import {COLORS, baseUrl} from '../utils/Constant';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import analytics from '@react-native-firebase/analytics';

const LogInScreen = () => {
  // const {GoogleLogin} = useGoogle();

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    if (email && password) {
      setIsFormComplete(true);
    } else {
      setIsFormComplete(false);
    }
  }, [email, password]);

  const handleSubmit = async () => {
    if (email === '' || password === '') {
      alert('All fields are required');
      return;
    }
    setLoader(true);

    try {
      const response = await axios.post(`${baseUrl}/signin`, {
        email,
        password,
      });
      console.log('response', response.data);
      if (response.data.error) {
        alert(response.data.error);
      } else {
        let reportPost = await AsyncStorage.getItem('reportPost');
        let filteredCategories = await AsyncStorage.getItem(
          'filteredCategories',
        );
        filteredCategories = [
          'Accessories',
          'Clothes',
          'Caffeine',
          'Food',
          'Snacks',
          'Water Bottles',
          'Swag Bag',
          'Phone Wallets',
          'Tickets',
          'Caffeine',
        ];
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
      alert('An error occurred during login');
    }
    setLoader(false);
  };

  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Login Screen',
        screen_class: 'LoginScreen',
      });
    } catch (e) {
      console.log({e});
    }
  };

  useEffect(() => {
    firebaseAnalyticsLog();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView
        keyboardDismissMode="on-drag"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Lock')}
          style={{alignSelf: 'center'}}>
          <Image
            source={require('./Media/MainPageTop.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.signUpText}>Welcome Back!</Text>
        <View style={{marginHorizontal: widthPercentageToDP(5)}}>
          <Text style={{fontSize: widthPercentageToDP(4), color: '#8e93a1'}}>
            EMAIL ADDRESS
          </Text>
          <TextInput
            style={styles.signUpInput}
            value={email}
            onChangeText={text => setEmail(text)}
            autoCapitalize="none"
            placeholderTextColor={COLORS.primary}
            placeholder="Enter your umich email"
            autoCorrect={false}
          />
        </View>
        <View style={{marginHorizontal: widthPercentageToDP(5)}}>
          <Text style={{fontSize: widthPercentageToDP(4), color: '#8e93a1'}}>
            PASSWORD
          </Text>
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
        </View>
        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.buttonStyle, isFormComplete && styles.buttonGreen]}
          disabled={!isFormComplete || loader}>
          {loader ? (
            <ActivityIndicator color={'white'} />
          ) : (
            <Text style={styles.buttonText}>LOG IN</Text>
          )}
        </TouchableOpacity>
        {/*<Text style={{ marginHorizontal: 24 }}>
                            {JSON.stringify({ email, password })}
    </Text>*/}
        <Text style={styles.deleteText}>
          Forgot password? Email support@thisismdex.com
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    height: '100%',
  },
  image: {
    height: heightPercentageToDP(10),
    width: widthPercentageToDP(70),
    marginTop: heightPercentageToDP(17),
  },
  signUpInput: {
    borderBottomWidth: 0.5,
    paddingVertical: heightPercentageToDP(1),
    borderBottomColor: '#8e93a1',
    color: COLORS.primary,
    marginBottom: heightPercentageToDP(3.5),
    fontSize: widthPercentageToDP(3.5),
  },
  signUpText: {
    fontSize: widthPercentageToDP(7),
    marginTop: heightPercentageToDP(5),
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: heightPercentageToDP(3),
  },
  buttonStyle: {
    backgroundColor: '#0C0C52',
    justifyContent: 'center',
    paddingVertical: heightPercentageToDP(1.5),
    marginHorizontal: widthPercentageToDP(5),
    borderRadius: 14,
    marginBottom: heightPercentageToDP(2),
    marginTop: heightPercentageToDP(1),
  },
  buttonGreen: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    paddingVertical: heightPercentageToDP(1.5),
    marginHorizontal: widthPercentageToDP(5),
    borderRadius: 14,
    marginBottom: heightPercentageToDP(2),
    marginTop: heightPercentageToDP(1),
  },
  buttonText: {
    fontSize: widthPercentageToDP(4.7),
    textAlign: 'center',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },

  deleteText: {
    fontSize: widthPercentageToDP(3.3),
    textAlign: 'center',
    color: '#000000',
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
});

export default LogInScreen;
