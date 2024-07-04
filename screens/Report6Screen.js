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
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {SHADOW} from '../context/theme';
import CustomBlueButton from '../components/CustomBlueButton';
import {COLORS} from '../utils/Constant';
import Entypo from 'react-native-vector-icons/Entypo';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import analytics from '@react-native-firebase/analytics';

const Report6Screen = ({route}) => {
  const navigation = useNavigation();
  const {report5Content} = route.params;

  const [report6Content, setReport6Content] = useState({
    isNorth: report5Content?.isNorth,
    isCentral: report5Content?.isCentral,
    eventDate: report5Content?.eventDate,
    eventTime: report5Content?.eventTime,
    eventEndTime: report5Content?.eventEndTime,
    eventBuildingName: report5Content?.eventBuildingName,
    eventLocation: report5Content?.eventLocation,
    evenLocationDescription: report5Content?.evenLocationDescription,
    organizationName: report5Content?.organizationName,
    body: report5Content?.body,
    image: report5Content?.image,
    postedBy: report5Content?.postedBy,
    title: report5Content?.title,
    description: '',
    website: '',
    link: '',
    instagram: '',
    category: report5Content?.category,
  });
  const nextHandler = () => {
    if (report6Content.description == '') {
      alert('Please complete the fields');
    } else {
      console.log(report6Content);
      navigation.navigate('Report7', {report6Content});
    }
  };
  console.log(report6Content);

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
        style={{width: wp(7.5), marginTop: hp(1)}}>
        <Entypo
          name="chevron-with-circle-left"
          size={wp(7.5)}
          color="#7541FF"
        />
      </TouchableOpacity>
      <ScrollView>
        <Text style={styles.title}>Create your description</Text>
        <Text style={styles.text}>Share what makes your event special.</Text>

        <View>
          <Text style={styles.fieldName}>
            About the event <Text style={{color: 'red'}}>*</Text>
          </Text>
          <TextInput
            style={styles.descriptionContainer}
            underlineColorAndroid="transparent"
            placeholder="Enter description"
            placeholderTextColor="grey"
            numberOfLines={10}
            multiline={true}
            value={report6Content?.description}
            onChangeText={text =>
              setReport6Content({...report6Content, description: text})
            }
          />
          <View style={{marginTop: hp(4)}}>
            <Text style={styles.text}>
              Additional optional information to personalize your post:
            </Text>
            <Text style={styles.fieldName}>REGISTRATION LINK</Text>
            <TextInput
              style={styles.textAreaContainer}
              placeholder="example.com"
              placeholderTextColor="grey"
              value={report6Content?.link}
              onChangeText={text =>
                setReport6Content({...report6Content, link: text})
              }
              autoCapitalize="none"
            />
            <Text style={styles.fieldName}>WEBSITE</Text>
            <TextInput
              style={styles.textAreaContainer}
              placeholder="example.com"
              placeholderTextColor="grey"
              value={report6Content?.website}
              onChangeText={text =>
                setReport6Content({...report6Content, website: text})
              }
              autoCapitalize="none"
            />
            <Text style={styles.fieldName}>INSTAGRAM</Text>
            <TextInput
              style={styles.textAreaContainer}
              placeholder="@ExampleOrg"
              placeholderTextColor="grey"
              value={report6Content?.instagram}
              onChangeText={text =>
                setReport6Content({...report6Content, instagram: text})
              }
              autoCapitalize="none"
            />
          </View>
        </View>
      </ScrollView>
      <View style={{marginTop: hp(1), marginBottom: hp(3), ...SHADOW.darkest}}>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => {
            nextHandler();
            // navigation.navigate('Report5', {report4Content: report4Content});
          }}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  formalContent: {
    flexDirection: 'column',
    marginHorizontal: wp(4),
    flex: 1,
  },
  title: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: '#7541FF',
    marginTop: hp(2),
  },
  backButton: {
    marginTop: 60,
    marginLeft: '6%',
  },

  backButtonText: {
    fontSize: 12,
    color: 'blue',
  },

  text: {
    fontSize: wp(3.8),
    fontWeight: '500',
    color: '#000000',
    marginBottom: hp(2),
    fontWeight: 'bold',
  },

  textAreaContainer: {
    borderRadius: 8,
    backgroundColor: 'white',
    color: COLORS.primary,
    ...SHADOW.medium,
    paddingHorizontal: wp(2),
    paddingVertical: hp(1.5),
    marginHorizontal: wp(0.5),
    marginTop: hp(1),
    marginBottom: hp(2),
    fontSize: wp(3.5),
  },

  descriptionContainer: {
    borderRadius: 8,
    backgroundColor: 'white',
    color: COLORS.primary,
    ...SHADOW.medium,
    paddingHorizontal: wp(2),
    paddingVertical: hp(1.5),
    height: hp(15),
    fontSize: wp(3.5),
    marginBottom: hp(2),
    marginTop: hp(1),
  },

  textArea: {
    height: 150,
    justifyContent: 'flex-start',
    margin: 0,
  },

  buttonStyle: {
    backgroundColor: '#7541FF',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    marginTop: hp(2),
  },
  buttonText: {
    fontSize: wp(4.9),
    color: '#FFFFFF',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },

  fieldName: {fontSize: wp(4.1), color: '#8e93a1', marginHorizontal: wp(0.5)},
});
export default Report6Screen;
