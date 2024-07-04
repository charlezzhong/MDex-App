import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import main_img from '../images/umich_swags.jpg';
import {useNavigation} from '@react-navigation/native';
import {SHADOW} from '../context/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../utils/Constant';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AuthContext from '../context/auth';
import analytics from '@react-native-firebase/analytics';

const Report1Screen = () => {
  const [state] = useContext(AuthContext);

  const navigation = useNavigation();
  const [report1Content, setReport1Content] = useState({
    organizationName: '',
    body: '',
    image: '',
  });

  const nextHandler = () => {
    if (report1Content.organizationName == '') {
      alert('Enter organization name');
    } else {
      navigation.navigate('Report3', {
        report1Content: report1Content,
        body: state?.user?.name || '',
      });
    }
    console.log('report1Conent', report1Content);
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
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{marginTop: hp(2)}}>
        <Entypo name="chevron-with-circle-left" size={wp(8)} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.title1}>What is your organization's name?</Text>
      <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="handled">
        <TextInput
          style={[
            styles.textAreaContainer,
            {textAlign: 'center', fontSize: wp(6), color: '#FFFFFF'},
          ]}
          placeholder="Enter official organization name"
          placeholderTextColor="grey"
          autoFocus={true}
          value={report1Content?.organizationName}
          onChangeText={text =>
            setReport1Content({...report1Content, organizationName: text})
          }
        />

        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => {
            nextHandler();
          }}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Report1Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    backgroundColor: '#7541FF',
  },
  backButton: {
    marginTop: 60,
    marginLeft: '6%',
  },
  backButtonText: {
    fontSize: 12,
    color: 'blue',
  },

  title1: {
    fontSize: wp(6),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: hp(2),
    marginHorizontal: wp(0.5),
  },

  innerContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonStyle: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    borderRadius: 25,
    marginTop: hp(2),
    marginHorizontal: wp(8),
  },
  buttonText: {
    color: '#7541FF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: wp(4.8),
  },

  textAreaContainer: {
    marginHorizontal: wp(0.5),
    fontSize: wp(3.6),
    paddingVertical: hp(1.7),
    paddingHorizontal: wp(2),
    marginTop: hp(2),
    marginBottom: hp(2),
  },
});
