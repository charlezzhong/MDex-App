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
import React, {useLayoutEffect, useState, useContext, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';

import axios from '../utils/axios';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {baseUrl, baseUrlPicture} from '../utils/Constant';
import {SHADOW} from '../context/theme';
import {dateFormatter, timeformatter} from '../components/CustomDatePicker';
import MapView, {Marker} from 'react-native-maps';
import CustomerButton from '../components/CustomerButton';
import CustomBlueButton from '../components/CustomBlueButton';
import AuthContext from '../context/auth';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import analytics from '@react-native-firebase/analytics';

const Report7Screen = ({route}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState();
  const {report6Content} = route.params;
  const [state] = useContext(AuthContext);
  const [report7Content, setReport7Content] = useState({
    eventDate: dateFormatter(report6Content?.eventDate, 'mm/dd/yyyy'),
    eventTime: timeformatter(report6Content?.eventTime),
    eventEndTime: report6Content?.eventEndTime,
    isNorth: report6Content?.isNorth,
    isCentral: report6Content?.isCentral,
    eventBuildingName: report6Content?.eventBuildingName,
    eventLocation: report6Content?.eventBuildingName,
    evenLocationDescription: report6Content?.evenLocationDescription,
    organizationName: report6Content?.organizationName,
    body: report6Content?.body,
    image: report6Content?.image,
    userId: state.user._id,
    title: report6Content?.title,
    description: report6Content?.description,
    website: report6Content?.website,
    instagram: report6Content?.instagram,
    category: report6Content?.category,
    link: report6Content?.link,
  });
  console.log('cosole.log("asasdas', report7Content);

  const handlePost = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/postFeed`, report7Content, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      console.log(response.data);
      if (response.data.error) {
        alert(response.data.error);
      } else {
        console.log('response===>', response);
        navigation.navigate('Report8');
        /*alert("Navigating");*/
      }
    } catch (error) {
      console.log(error);
      alert('An error has occured. Please email support@thisismdex.com');
    }
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
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: hp(1),
          marginTop: hp(1),
          marginHorizontal: wp(4),
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{alignSelf: 'flex-start'}}>
          <Entypo
            name="chevron-with-circle-left"
            size={wp(7.5)}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.reviewTitle}>Review Your Information</Text>
        <Text style={styles.locaText11}>
          Review all information! A unique image will be generated for your post
          by our team.
        </Text>
      </View>

      <ScrollView contentContainerStyle={{paddingBottom: hp(6)}}>
        <View style={styles.post}>
          <View style={styles.titleContainer}>
            <View style={{width: wp(80)}}>
              <Text style={styles.titleText}>{report7Content?.title}</Text>
              <Text style={styles.locaOrgText}>
                {report7Content.organizationName}
              </Text>
            </View>
          </View>
          <Text style={[styles.locaText]}>
            Category: {report7Content?.category}
          </Text>
          <View style={{flexDirection: 'column', marginTop: wp(4)}}>
            <View style={styles.container}>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name={'calendar-blank'}
                  size={wp(6.5)}
                  color="#808080"
                  marginRight={wp(2)}
                />
              </View>
              <View style={styles.locationInfoContainer}>
                <Text style={styles.containerText}>
                  {report7Content.eventDate}
                </Text>
                <Text style={styles.timeText}>
                  {report7Content.eventTime}
                  {report7Content.eventEndTime
                    ? ' - ' + timeformatter(report7Content.eventEndTime)
                    : ''}
                </Text>
              </View>
            </View>
            <View style={styles.horizontalLine} />
            <View style={styles.container}>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name={'map-marker'}
                  size={wp(6.5)}
                  color="#808080"
                  marginRight={wp(2)}
                />
              </View>
              <View style={styles.locationInfoContainer}>
                <Text style={styles.containerText}>Location</Text>
                <Text style={styles.timeText}>
                  {report7Content?.eventLocation}
                </Text>
                <Text style={styles.timeText}>
                  {report7Content?.isNorth ? '(North Campus)' : ''}
                  {report7Content?.isCentral ? '(Central Campus)' : ''}
                </Text>
              </View>
            </View>
            <View style={styles.horizontalLine} />
            <View style={styles.container}>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name={'information'}
                  size={wp(6.5)}
                  color="#808080"
                  marginRight={wp(2)}
                />
              </View>
              <View style={styles.locationInfoContainer}>
                <Text style={styles.containerText}>Details</Text>
                <Text style={styles.timeText}>
                  {report7Content?.description}
                </Text>
              </View>
            </View>
            <View style={styles.horizontalLine} />
            <View style={styles.container}>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name={'web'}
                  size={wp(6.5)}
                  color="#808080"
                  marginRight={wp(2)}
                />
              </View>
              <View style={styles.locationInfoContainer}>
                <Text style={styles.containerText}>Website - Optional</Text>
                <Text style={styles.timeText}>{report7Content?.website}</Text>
              </View>
            </View>
            <View style={styles.horizontalLine} />
            <View style={styles.container}>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name={'instagram'}
                  size={wp(6.5)}
                  color="#808080"
                  marginRight={wp(2)}
                />
              </View>
              <View style={styles.locationInfoContainer}>
                <Text style={styles.containerText}>Instagram - Optional</Text>
                <Text style={styles.timeText}>{report7Content?.instagram}</Text>
              </View>
            </View>
            <View style={styles.horizontalLine} />
            <View style={styles.container}>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name={'link'}
                  size={wp(6.5)}
                  color="#808080"
                  marginRight={wp(2)}
                />
              </View>
              <View style={styles.locationInfoContainer}>
                <Text style={styles.containerText}>
                  Registration Link - Optional
                </Text>
                <Text style={styles.timeText}>{report7Content?.link}</Text>
              </View>
            </View>
          </View>
          {/*
          <ImageBackground
            source={{uri: `${baseUrlPicture}${report7Content.image}`}}
            resizeMode="contain"
            style={styles.card1}
          /> */}

          {/* <MapView
            style={{
              marginTop:hp(2),
              height: hp(20),
              alignSelf: 'center',
              width: wp(92),
              marginBottom: hp(2),
            }}
            initialRegion={{
              ...report7Content.eventLocation,
              latitudeDelta: 0.0043,
              longitudeDelta: 0.0034,
            }}>
            <Marker coordinate={report7Content.eventLocation} />
          </MapView> */}
        </View>
      </ScrollView>
      <View
        style={{
          marginHorizontal: wp(4),
          marginTop: hp(1),
          marginBottom: hp(3),
          ...SHADOW.darkest,
        }}>
        <TouchableOpacity style={styles.buttonStyle} onPress={handlePost}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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

  reviewTitle: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: 'black',
    marginTop: hp(1),
    marginHorizontal: wp(4),
  },

  image: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    backgroundColor: '#F5F5F5',
  },

  /*
  card1: {
    height: hp(30),
    width: wp(100),
    alignSelf: 'center',
    borderRadius: 10,
    resizeMode: 'cover',
    backgroundCOlor: '#682BF7',
  },

  linearGradient: {
    height: '100%',
  },

  container: {
    marginLeft: wp(3),
    borderRadius: 10,
    width: wp(35),
    alignItems: 'left',
  },

  verticalLine: {
    width: 1,
    backgroundColor: 'grey',
    height: '63%',
    marginHorizontal: 2,
    alignSelf: 'flex-end',
  },

  close: {
    margin: 5,
    position: 'absolute',
    top: 0,
    left: 0,
    width: 25,
    height: 25,
    color: 'tomato',
  },

  titleContainer: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    marginLeft: wp(3),
  },

  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
  },

  locaText: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: 'black',
    marginLeft: wp(4),
    marginTop: hp(1),
  },

  OrgText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e90ff',
    marginLeft: wp(3),
  },

  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '12%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(20)',
  },

  discText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: wp(3),
    marginBottom: 1,
  },

  containerTitle: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 1,
  },

  containerText: {
    color: '#808080',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: '5%',
  },

  aboutEvent: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: wp(3),
    marginBottom: 1,
    marginTop: wp(5),
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'top',
  },

  tagBox: {
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: '2%',
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: wp(3),
  },

  tagText: {
    fontSize: 10,
    color: 'Black',
    fontWeight: 'bold',
  },

  instaLogo: {
    width: 20,
    height: 20,
    marginRight: 5,
  },

  categoryText: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    color: '#fff',
    padding: 3,
    borderRadius: 5,
    zIndex: 1,
  },

  locationInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'top',
  },

  dropdownContainer: {
    marginTop: 10,
    backgroundColor: 'black',
    borderRadius: 15,
    marginLeft: wp(3),
    marginRight: wp(3),
  },

  dropdownText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: wp(3),
    padding: 5,
  },

  infoIcon: {
    fontSize: 15,
  },*/

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    backgroundColor: '#F5F5F5',
  },
  card1: {
    aspectRatio: 1,
    resizeMode: 'cover',
    backgroundCOlor: '#682BF7',
  },

  linearGradient: {
    height: '100%',
  },

  container: {
    flexDirection: 'row',
    marginLeft: wp(6),
    borderRadius: 10,
    width: wp(90),
    alignItems: 'left',
    marginVertical: wp(1),
  },

  horizontalLine: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    marginHorizontal: wp(4),
    marginVertical: wp(3.5),
  },

  close: {
    margin: 5,
    position: 'absolute',
    top: 0,
    left: 0,
    width: 25,
    height: 25,
    color: 'tomato',
  },

  titleContainer: {
    marginTop: hp(4),
    bottom: 3,
    left: 0,
    right: 0,
    marginLeft: wp(3),
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  titleText: {
    fontSize: wp(8.15),
    fontWeight: 'bold',
    color: 'black',
    marginRight: wp(2),
  },

  locaText: {
    fontSize: wp(3.8),
    fontWeight: 'bold',
    color: '#808080',
    marginLeft: wp(4),
  },

  locaText11: {
    fontSize: wp(3.5),
    color: '#000000',
    marginLeft: wp(4),
    marginRight: wp(4),
  },

  locaOrgText: {
    fontSize: wp(4.6),
    fontWeight: 'bold',
    color: '#E64980',
    marginRight: wp(2),
    marginTop: wp(1),
    marginBottom: wp(2),
  },

  registerButton: {
    marginLeft: wp(3),
    backgroundColor: '#E64980',
    width: wp(35),
    paddingVertical: wp(2),
    borderRadius: wp(4),
    marginTop: wp(1.5),
  },
  registerText: {
    fontSize: wp(4.6),
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  OrgText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e90ff',
    marginLeft: wp(3),
  },

  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '12%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(20)',
  },

  discText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: wp(3),
    marginBottom: 1,
  },

  containerTitle: {
    color: 'black',
    fontSize: wp(3.6),
    fontWeight: 'bold',
    marginBottom: 1,
  },

  containerText: {
    color: '#000000',
    fontSize: wp(4.4),
    fontWeight: 'bold',
    marginLeft: wp(1),
    marginBottom: wp(2),
  },

  timeText: {
    color: '#808080',
    fontSize: wp(3.9),
    fontWeight: 'bold',
    marginLeft: wp(1),
    marginRight: wp(9),
  },

  aboutEvent: {
    color: 'black',
    fontSize: wp(4.6),
    fontWeight: 'bold',
    marginLeft: wp(3),
    marginBottom: 1,
    marginTop: wp(5),
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'top',
  },

  tagBox: {
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: '2%',
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: wp(3),
  },

  tagText: {
    fontSize: 10,
    color: '#000000',
    fontWeight: 'bold',
  },

  instaLogo: {
    width: 20,
    height: 20,
    marginRight: 5,
  },

  categoryText: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: '#fff',
    padding: 4,
    borderRadius: 5,
    zIndex: 1,
    fontSize: wp(4.1),
  },

  locationInfoContainer: {
    justifyContent: 'space-between',
    alignItems: 'top',
  },

  dropdownContainer: {
    marginTop: 10,
    backgroundColor: 'black',
    borderRadius: 15,
    marginLeft: wp(3),
    marginRight: wp(3),
  },

  dropdownText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: wp(3),
    padding: 5,
  },

  infoIcon: {
    fontSize: wp(3.8),
  },
  scanIconBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(5),
    width: wp(15),
    height: wp(15),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
});

export default Report7Screen;
