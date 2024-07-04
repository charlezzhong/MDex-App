import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {baseUrl, baseUrlPicture} from '../utils/Constant';
import {SHADOW} from '../context/theme';
import MapView, {Marker} from 'react-native-maps';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {hashPassword} from '../server/helpers/auth';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import CustomSignUpModal from '../components/Modal/CustomSigupModal';
import axios from 'axios';
import AuthContext from '../context/auth';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import analytics from '@react-native-firebase/analytics';

const EventDetailScreen = ({route}) => {
  const navigation = useNavigation();
  const [copiedText, setCopiedText] = useState('');
  const [copyModal, setCopyModal] = useState(false);
  const [imageBase64, setImageBase64] = useState(null);
  const {
    name,
    date,
    time,
    location,
    description,
    organizationName,
    eventLocationDescription,
    instagram,
    website,
    image,
    category,
    link,
    postId,
    eventEndTime,
    campus,
  } = route.params;

  const data = [
    {
      id: '0',
      name: name,
      date: date,
      time: time,
      location: location,
      eventLocationDescription: eventLocationDescription,
      image: image,
      organizationName: organizationName,
      organizationInstaTag: instagram || 'No Instagram',
      organizationWebsite: website || 'No Website',
      description: description,
      category: category,
      link: link,
      campus: campus,
    },
  ];

  const formatDate = inputDate => {
    const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsOfYear = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const dateParts = inputDate.split('/');
    const month = parseInt(dateParts[0], 10);
    const day = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);

    const date = new Date(year, month - 1, day);
    const dayOfWeek = daysOfWeek[date.getDay()];
    const monthName = monthsOfYear[date.getMonth()];

    return `${dayOfWeek}, ${monthName} ${day}`;
  };

  const daysRemaining = inputDate => {
    // Parse the input date
    const dateParts = inputDate.split('/');
    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[0], 10) - 1; // Adjust month index for JS (0-based)
    const day = parseInt(dateParts[1], 10);

    // Current date and target date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Ignore time part to compare dates accurately
    const targetDate = new Date(year, month, day);

    // Calculate the number of days remaining
    const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in one day
    const difference = targetDate - currentDate;
    const daysRemaining = Math.round(difference / oneDay);

    if (daysRemaining === 0) {
      return 'Today';
    } else if (daysRemaining === 1) {
      return '1 day left';
    } else if (daysRemaining < 0) {
      return 'The event has passed';
    } else {
      return `in ${daysRemaining} days`;
    }
  };

  const formatMonth = inputDate => {
    const monthsOfYear = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const dateParts = inputDate.split('/');
    const month = parseInt(dateParts[0], 10);
    const day = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);

    const date = new Date(year, month - 1, day);
    const monthName = monthsOfYear[date.getMonth()];

    return `${monthName}`;
  };

  const formatMonthBig = inputDate => {
    const monthsOfYear = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];

    const dateParts = inputDate.split('/');
    const month = parseInt(dateParts[0], 10);
    const day = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);

    const date = new Date(year, month - 1, day);
    const monthNameBig = monthsOfYear[date.getMonth()];

    return `${monthNameBig}`;
  };

  const formatDay = inputDate => {
    const dateParts = inputDate.split('/');
    const day = parseInt(dateParts[1], 10);

    return `${day}`;
  };

  const formattedTime = time
    ? new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : 'no Time';
  const formattedEndTime = eventEndTime
    ? new Date(eventEndTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : '';

  const formatLocation = inputString => {
    const [building, campusLocation] = inputString
      .split(',')
      .map(part => part.trim());

    return `${building}`;
  };

  const [showDescription, setShowDescription] = useState(false);
  const [state, setState] = useContext(AuthContext);

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  const copyToClipboard = url => {
    if (!url.includes('http') && !url.includes('https')) {
      url = `https://${url}`;
    }
    try {
      Linking.openURL(url);
    } catch (err) {}
    // Clipboard.setString(text);
    // setCopyModal(true);
  };

  // const fetchCopiedText = async () => {
  //   const text = await Clipboard.getString();
  //   setCopiedText(text);
  // };
  const [arrayOfSafePostsIdtoDelete, setarrayOfSafePostsIdtoDelete] = useState(
    [],
  );
  const [arrayOfSafePosts, setarrayOfSafePosts] = useState([]);
  const getSafePostsData = async () => {
    const response = await axios
      .get(`${baseUrl}/getPosts`, {
        params: {
          userId: state?.user?._id,
        },
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      })
      .then(item => item?.data);
    console.log('safePosts', response?.data);
    let onlyId = response?.data?.map(item => item?.postId?._id);
    let IdForDelete = response?.data?.map(item => item?._id);
    setarrayOfSafePosts(onlyId);
    setarrayOfSafePostsIdtoDelete(IdForDelete);
  };

  const [trigger, setTrigger] = useState(false);
  useEffect(() => {
    getSafePostsData();
  }, [trigger]);

  const DeletePost = async () => {
    const index = arrayOfSafePosts.findIndex(item => item == postId);
    try {
      const response = await axios
        .post(
          `${baseUrl}/deletePost`,
          {
            id: arrayOfSafePostsIdtoDelete[index],
          },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          },
        )
        .then(item => item?.data);
      console.log('DELETING', {response});
    } catch (err) {
      console.log({err});
    }
    setTrigger(!trigger);
    setState({
      ...state,
      safeAndUnsafePostTrigger: !state.safeAndUnsafePostTrigger,
    });
  };

  const SafePost = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/savePost`,
        {
          postId: postId,
          userId: state?.user?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        },
      );
    } catch (err) {
      console.log({err});
    }
    setTrigger(!trigger);
    setState({
      ...state,
      safeAndUnsafePostTrigger: !state.safeAndUnsafePostTrigger,
    });
  };

  const userRSVP = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/rsvpPost`,
        {
          postId: postId,
          userId: state?.user?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        },
      );
    } catch (err) {
      console.log({err});
    }
    setTrigger(!trigger);
    setState({
      ...state,
      rsvpTrigger: !state.rsvpTrigger,
    });
  };

  useEffect(() => {
    if (image) {
      downloadImage(`${baseUrlPicture}/${image}`);
    }
  }, []);
  const downloadImage = async (url, times = 0) => {
    if (times == 3) return;
    const options = {
      fromUrl: url,
      toFile: RNFS.CachesDirectoryPath + '/image.png',
    };
    try {
      let file = await RNFS.downloadFile(options).promise;
      if (file.statusCode == 200) {
        let data = await RNFS.readFile(
          RNFS.CachesDirectoryPath + '/image.png',
          'base64',
        );
        setImageBase64('data:image/png;base64,' + data);
        // data:image/png;base64,
      } else {
        //re-download the file again
        setTimeout(() => {
          downloadImage(url, times + 1);
        }, 3000);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  const openLink = () => {
    const urlAndroid =
      'https://play.google.com/store/apps/details?id=com.thisismdex.mdex&hl=en_US&gl=US';
    const urlIOS = 'https://apps.apple.com/us/app/mdex-app/id6462492208';
    const urlOther = 'Found this on MDex!';

    let platformUrl;
    if (Platform.OS === 'android') {
      platformUrl = urlAndroid;
    } else if (Platform.OS === 'ios') {
      platformUrl = urlIOS;
    } else {
      platformUrl = urlOther;
    }

    const fullMessage =
      `${platformUrl ?? ''}\n\n` +
      `${data[0]?.name ?? ''} on ${formatDate(date) ?? ''}, ${
        formattedTime ?? ''
      } at ${formatLocation(data[0]?.location) ?? ''}!`;

    Share.open({
      //url: imageBase64,
      title: fullMessage,
      message: fullMessage,
      subject: fullMessage,
    }).catch(err => {});
    triggerResponseHapticFeedback();
  };

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const triggerMediumHapticFeedback = () => {
    ReactNativeHapticFeedback.trigger('impactMedium', options);
  };

  const triggerResponseHapticFeedback = () => {
    ReactNativeHapticFeedback.trigger('soft', options);
  };

  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Event Detail',
        screen_class: 'EventDetailScreen',
      }).then(res => {
        console.log(res)
      })
      await analytics().logEvent('Events_Viewed', {
        key: postId,
        name: data[0]?.name,
      });
    } catch (e) {
      console.log({e});
    }
  };

  useEffect(() => {
    firebaseAnalyticsLog();
  }, []);

  {
    console.log('CAMPUSSS', data[0]?.campus);
  }

  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <StatusBar hidden={true} />
      <ScrollView
        contentContainerStyle={{paddingBottom: hp(10), flexGrow: 1}}
        style={{backgroundColor: '#FFFFFF'}}>
        <View>
          <View style={styles.topPadding}>
            <TouchableOpacity
              onPress={() => {
                triggerResponseHapticFeedback();
                navigation.goBack();
              }}
              style={{paddingLeft: 15}}>
              <MaterialCommunityIcons
                name={'arrow-left-circle'}
                size={wp(8.5)}
                color="#FFFFFF"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                triggerResponseHapticFeedback();
                navigation.navigate('Report1');
              }}
              style={{paddingRight: 15}}>
              <View
                style={{
                  paddingVertical: hp(0.7),
                  paddingHorizontal: wp(2),
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: hp(1.4),
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                    fontSize: wp(3.8),
                  }}>
                  + Create event
                </Text>
              </View>
            </TouchableOpacity>
            {/* <Text style={styles.categoryText}>{data[0]?.category}</Text> */}
          </View>
          <ImageBackground
            source={{uri: `${baseUrlPicture}/${image}`}}
            style={styles.card1}>
            <LinearGradient
              colors={['transparent', '#FFFFFF']} // Fades from transparent to white
              style={styles.linearGradient}>
              <View style={styles.titleContainer}>
                <View style={{width: wp(80)}}>
                  <Text style={[styles.titleText, {width: wp(75)}]}>
                    {data[0]?.name}
                  </Text>
                  <Text style={[styles.locaOrgText, {width: wp(75)}]}>
                    {data[0]?.organizationName}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 15,
                    padding: wp('1'),
                    marginLeft: wp(-4),
                  }}>
                  <TouchableOpacity
                    onPress={openLink}
                    style={{alignItems: 'center'}}>
                    <Ionicons
                      name="share-outline"
                      size={wp(11)}
                      color="#000000"
                    />
                  </TouchableOpacity>
                  {arrayOfSafePosts.includes(postId) ? (
                    <TouchableOpacity
                      style={[styles.scanIconBox]}
                      onPress={() => {
                        triggerResponseHapticFeedback();
                        DeletePost();
                      }}>
                      <MaterialCommunityIcons
                        name={'bookmark'}
                        size={wp(12)}
                        color="#E64980"
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.scanIconBox}
                      onPress={() => {
                        triggerMediumHapticFeedback();
                        SafePost();
                      }}>
                      <MaterialCommunityIcons
                        name={'bookmark-outline'}
                        size={wp(12)}
                        color="#E64980"
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
          {/* <Text style={styles.locaText}>{data[0].location}</Text> */}

          <View style={styles.rowContainer}>
            {data[0]?.organizationInstaTag !== 'No Instagram' ? (
              <View style={styles.tagBox}>
                <Image
                  source={require('./Media/InstaLogo.png')}
                  style={styles.instaLogo}
                />
                <Text style={styles.tagText}>
                  {data[0]?.organizationInstaTag}
                </Text>
              </View>
            ) : null}
            {data[0]?.organizationWebsite !== 'No Website' ? (
              <View style={styles.tagBox1}>
                <TouchableOpacity
                  onPress={() => {
                    // check if url contains http or https if not add https
                    let url = data[0]?.organizationWebsite;
                    if (!url.includes('http') && !url.includes('https')) {
                      url = `https://${url}`;
                    }
                    Linking.openURL(url);
                  }}>
                  <Image
                    source={require('./Media/website.png')}
                    style={styles.chromelogo}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: 'column',
              marginTop: wp(3),
              backgroundColor: '#FFFFFF',
            }}>
            <View style={styles.inputTopStyleContainer}>
              <View style={styles.calendarContainer}>
                <View style={styles.monthContainer}>
                  <Text style={styles.monthStyle}>
                    {date ? `${formatMonthBig(date)}` : ' '}
                  </Text>
                </View>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateStyle}>
                    {date ? `${formatDay(date)}` : ' '}
                  </Text>
                </View>
              </View>

              <View style={styles.locationInfoContainer}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.containerText}>
                    {date ? `${formatDate(date)}` : ' '}
                  </Text>
                  <View style={styles.ovalShape}>
                    <Text style={styles.ovalText}>
                      {date ? `${daysRemaining(date)}` : ' '}
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={[styles.timeText, {marginRight: 0}]}>
                    {formattedTime}
                  </Text>
                  {formattedEndTime ? (
                    <Text style={styles.timeText}> to {formattedEndTime}</Text>
                  ) : null}
                </View>
              </View>
            </View>
            <View style={styles.horizontaTogetherlLine} />
            <View style={styles.inputTopStyleContainer}>
              <View style={styles.inputTopContainer}>
                <MaterialCommunityIcons
                  name={'map-marker'}
                  size={wp(6.5)}
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.locationInfoContainer}>
                <Text style={styles.containerText}>
                  {formatLocation(data[0]?.location)}
                </Text>
                <Text style={styles.timeText}>
                   {data[0]?.campus === 'central'
                    ? 'Central Campus'
                    : data[0]?.campus === 'north'
                    ? 'North Campus'
                    : ''} 
                </Text>
                {/* Add any additional content for the location */}
              </View>
            </View>
            <View style={styles.horizontalLine} />
            <View style={styles.container1}>
              <View style={styles.inputBottomContainer}>
                <MaterialCommunityIcons
                  name={'information'}
                  size={wp(6.5)}
                  color="#8551ffff"
                  marginRight={wp(2)}
                  marginLeft={wp(0.5)}
                />
                <Text style={styles.containerText1}>Details</Text>
              </View>
              <View style={styles.detailsInfoContainer}>
                
                <Text style={styles.locationText}>{data[0]?.description}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* <MapView
            style={{
              marginTop:heightPercentageToDP(2),
              height: heightPercentageToDP(20),
              alignSelf: 'center',
              width: wp(92),
              marginBottom: heightPercentageToDP(2),
            }}
            initialRegion={{
              longitude,
              latitude,
              latitudeDelta: 0.0043,
              longitudeDelta: 0.0034,
            }}>
            <Marker coordinate={{latitude,longitude}} />
          </MapView> */}
      </ScrollView>
      <View style={styles.bottomPadding}>
        {data[0]?.link && (
          <LinearGradient
            colors={['#E64980', '#682BF7']}
            start={{x: 0, y: 0}}
            end={{x: 0.5, y: 13.2}}
            style={styles.registerButton}>
            <TouchableOpacity
              onPress={() => {
                copyToClipboard(data[0]?.link);
                SafePost();
              }}>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}
      </View>

      <CustomSignUpModal
        field={'copied'}
        isVisible={copyModal}
        setVisible={setCopyModal}
      />
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp(2),
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
    alignItems: 'top',
    marginVertical: wp(1),
  },
  container1: {
    marginLeft: wp(6),
    borderRadius: 10,
    width: wp(90),
    alignItems: 'top',
    marginVertical: wp(1),
  },

  horizontalLine: {
    borderBottomWidth: 6,
    borderColor: '#FFFFFF',
    marginHorizontal: wp(0),
    marginVertical: wp(3),
  },

  horizontaTogetherlLine: {
    marginVertical: wp(0.8),
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
    bottom: 0,
    left: 0,
    right: 0,
    marginLeft: wp(3),
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
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
    marginLeft: wp(3),
  },

  locaOrgText: {
    fontSize: wp(4.6),
    fontWeight: 'bold',
    color: '#682BF7',
    marginRight: wp(2),
    marginTop: wp(1),
    marginBottom: wp(2),
  },

  registerButton: {
    marginRight: wp(5),
    paddingVertical: hp(1.2),
    width: wp(88),
    marginRight: wp(6),
    marginLeft: wp(6),
    borderRadius: wp(10),
    marginTop: hp(1.5),
    marginBottom: hp(3.8),
  },
  registerText: {
    fontSize: wp(4),
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

  containerText1: {
    color: '#000000',
    fontSize: wp(4.4),
    fontWeight: 'bold',
  },

  timeText: {
    color: '#682BF7',
    fontSize: wp(3.9),
    fontWeight: 'bold',
    marginLeft: wp(1),
    marginRight: wp(9),
    top: wp(-0.5),
    bottom: wp(-0.5),
  },

  locationText: {
    color: '#808080',
    fontSize: wp(3.9),
    fontWeight: 'bold',
    marginLeft: wp(1),
    marginRight: wp(2),
    marginTop: hp(1),
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

  inputTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: hp(5.9),
    height: hp(5.9),
    backgroundColor: '#8551ffff',
    borderRadius: 10,
  },

  calendarContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  monthContainer: {
    width: '100%',
    backgroundColor: '#8551ffff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 3,
    width: hp(5.9),
    paddingBottom: 1,
  },
  dateContainer: {
    width: '100%',
    backgroundColor: '#682BF7',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 1.5,
    width: hp(5.9),
  },
  monthStyle: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateStyle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },

  inputTopStyleContainer: {
    flexDirection: 'row',
    marginLeft: wp(6),
    borderRadius: 10,
    width: wp(90),
    alignItems: 'center',
    marginVertical: wp(1),
  },

  tagBox: {
    flexDirection: 'row',
    backgroundColor: '#edededff',
    paddingHorizontal: 12,
    paddingVertical: hp(0.5),
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: wp(3),
  },

  tagBox1: {
    flexDirection: 'row',
    backgroundColor: '#edededff',
    paddingHorizontal: wp(1),
    paddingVertical: hp(0.5),
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: wp(3),
  },

  tagText: {
    marginLeft: wp(0.7),
    fontSize: wp(2.7),
    color: '#000000',
    fontWeight: 'bold',
  },

  instaLogo: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
  chromelogo: {
    width: 25,
    height: 25,
    marginHorizontal: 8,
  },

  categoryText: {
    position: 'absolute',
    top: hp(6),
    right: wp(4),
    color: '#fff',
    borderRadius: 5,
    zIndex: 1,
    fontSize: wp(4.1),
  },

  ovalShape: {
    backgroundColor: '#8551ffff',
    borderRadius: 20,
    paddingHorizontal: hp(1.2),
    height: hp(2.5),
    left: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },

  ovalText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  locationInfoContainer: {
    justifyContent: 'space-between',
    alignItems: 'top',
    backgroundColor: '#FFFFFF',
    left: wp(2),
    flex: 0.95,
  },

  detailsInfoContainer: {
    justifyContent: 'space-between',
    alignItems: 'top',
    backgroundColor: '#FFFFFF',
  },

  inputBottomContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },

  topPadding: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'top',
    backgroundColor: '#682BF7',
    paddingTop: hp(5),
  },

  bottomPadding: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    ...SHADOW.darkest,
    ...Platform.select({
      android: {
        // Additional or override styles for Android
        backgroundColor: '#FFFFFF', // Example of adding elevation for a "bump" effect
        paddingBottom: hp(3.5), // Adjusting bottom margin specifically for Android
      },
      ios: {},
    }),
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

export default EventDetailScreen;
