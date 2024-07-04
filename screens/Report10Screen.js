import {
  View,
  Text,
  TouchableHighlightSafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInputAndroidProps,
  TextInput,
  Alert,
  Button,
  TouchableOpacity,
} from 'react-native';
import React, {useLayoutEf, fect, useEffect} from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import main_img from '../images/umich_swags.jpg';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import analytics from '@react-native-firebase/analytics';

const Report8Screen = () => {
  const navigation = useNavigation();
  const resetAction = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home'}],
      }),
    );
  };

  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Posting Screens',
        screen_class: 'PostingScreens',
      });
    } catch (e) {
      console.log({e});
    }
  };

  useEffect(() => {
    firebaseAnalyticsLog();
  }, []);

  return (
    <SafeAreaView style={styles.formalContent}>
      <View>
        <Text style={styles.title}>Feedback Submitted!</Text>
        <Text style={styles.text}>Thank you for your feedback!</Text>
        <View style={{marginVertical: hp(3)}}></View>
      </View>
      <TouchableOpacity
        style={styles.buttonstyle}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Back To Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  formalContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: wp(10),
    marginHorizontal: wp(10),
  },

  title: {
    fontSize: wp(7.5),
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
  },

  text: {
    fontSize: wp(3.8),
    fontWeight: '500',
    color: 'grey',
    alignSelf: 'center',
  },

  textAreaContainer: {
    borderColor: 'grey',
    borderWidth: 1,
    padding: 5,
    borderRadius: 8,

    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    textAlignVertical: 'top',
    //in ios, it should be multiline={true},
    paddingTop: 10,
    paddingLeft: 10,
  },

  textArea: {
    height: 150,
    justifyContent: 'flex-start',
    margin: 0,
  },
  buttonstyle: {
    backgroundColor: '#0C0C52',
    borderRadius: 15,
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(90),
    paddingVertical: hp(1.5),
  },
  buttonText: {
    fontSize: wp(5),
    textAlign: 'center',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});
export default Report8Screen;
