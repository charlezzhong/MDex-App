import {
  Button,
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInputAndroidProps,
  TextInput,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import CustomBlueButton from '../components/CustomBlueButton';
import {SHADOW} from '../context/theme';
import {COLORS} from '../utils/Constant';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import analytics from '@react-native-firebase/analytics';

const Report5Screen = ({route}) => {
  const {report4Content} = route.params;
  const [report5Content, setReport5Content] = useState({
    ...report4Content,
    title: '',
  });
  console.log('REport', report4Content);
  const nextHandler = () => {
    if (report5Content.title == '') {
      alert('Please complete the fields');
    } else {
      navigation.navigate('Report6', {report5Content});
    }
  };
  const navigation = useNavigation();

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
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{marginTop: hp(2), width: wp(7.5), alignSelf: 'flex-start'}}>
        <Entypo
          name="chevron-with-circle-left"
          size={wp(7.5)}
          color="#FFFFFF"
        />
      </TouchableOpacity>
      <ScrollView>
        <Text style={styles.title1}>Now, let&apos;s give your event</Text>
        <Text style={styles.title2}>a title</Text>
        <View>
          <TextInput
            style={[
              styles.textAreaContainer,
              {textAlign: 'center', fontSize: wp(6), color: '#FFFFFF'},
            ]}
            onChangeText={text =>
              setReport5Content({...report4Content, title: text})
            }
            underlineColorAndroid="transparent"
            placeholder="Enter title"
            placeholderTextColor="grey"
            numberOfLines={10}
            multiline={true}
            autoFocus={true}
            blurOnSubmit={false}
          />

          <Text style={styles.text}>Short titles work best!</Text>
          <CustomBlueButton onPress={nextHandler} />
          {/* <View style={styles.buttonstyle}>
          <Button
            title="Next"
            style={styles.buttonstyle}
            onPress={() => {
              // navigation.navigate('Report6');
            }}
          /> */}
          {/* </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  formalContent: {
    paddingHorizontal: wp(4),
    backgroundColor: '#7541FF',
    flex: 1,
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
    color: '#FFFFFF',
    marginTop: hp(2),
    textAlign: 'center',
  },
  title2: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  text: {
    fontSize: wp(4),
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: hp(2),
    textAlign: 'center',
  },

  textAreaContainer: {
    textAlignVertical: 'top',
    height: hp(20),
    //in ios, it should be multiline={true},
    paddingHorizontal: wp(2),
    paddingTop: hp(1),
    marginTop: hp(1.7),
    marginHorizontal: wp(0.5),
    fontSize: wp(3.5),
  },
  textArea: {
    height: 150,
    margin: 0,
  },

  buttonstyle: {
    marginTop: 10,
    padding: 5,
    backgroundColor: 'blue',
    marginLeft: '4%',
    marginRight: '4%',
    borderRadius: 20,
  },
});
export default Report5Screen;
