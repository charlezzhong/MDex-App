import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useContext, useEffect, useState} from 'react';
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SHADOW} from '../../context/theme';
import AuthContext from '../../context/auth';
import {COLORS, baseUrl, baseUrlPicture} from '../../utils/Constant';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomIcon from '../../components/CustomIcon';
import {ScrollView} from 'react-native-gesture-handler';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import analytics from '@react-native-firebase/analytics';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const Profile = ({trigger, openSheet}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [state, setState] = useContext(AuthContext);

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const triggerMediumHapticFeedback = () => {
    ReactNativeHapticFeedback.trigger('soft', options);
  };

  const signOut = async () => {
    try {
      const res = await axios
        .post(
          `${baseUrl}/user/saveToken`,
          {
            userId: state?.user?._id,
            token: '',
          },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          },
        )
        .catch(err => {});
      console.log({res});
      setState({...state, token: '', user: null, reportPost: []});
      await AsyncStorage.removeItem('auth-rn');
      await AsyncStorage.removeItem('reportPost');
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      navigation.navigate('Lock');
    } catch (e) {
      console.log({e});
    }
  };

  useEffect(() => {
    if (state && state.user) {
      const {name, email, role} = state.user;
      setName(name);
      setEmail(email);
      setRole(role);
    }
  }, [state]);

  const navigation = useNavigation();

  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Profile Screen',
        screen_class: 'ProfileScreen',
      });
    } catch (e) {
      console.log({e});
    }
  };

  useEffect(() => {
    firebaseAnalyticsLog();
  }, []);

  console.log('opensheet', openSheet);
  return (
    <SafeAreaView>
      <View style={styles.topContainer}>
        <View
          style={{
            borderBottomWidth: 2,
            borderBottomColor: '#682BF7',
            flexDirection: 'row',
          }}>
          <Text style={styles.whatsNew}>What's New?</Text>
        </View>
        <View style={{marginVertical: hp(0.5)}} />
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name={'tune-variant'}
              size={widthPercentageToDP(9)}
              color="#682BF7"
              marginRight={widthPercentageToDP(1)}
            />
          </View>
          <View style={styles.locationInfoContainer}>
            <Text style={styles.containerText}>
              New category filters to personalize your feed!
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name={'export-variant'}
              size={widthPercentageToDP(9)}
              color="#682BF7"
              marginRight={widthPercentageToDP(1)}
            />
          </View>
          <View style={styles.locationInfoContainer}>
            <Text style={styles.containerText}>
              Improved event sharing feature for messages!
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name={'bell'}
              size={widthPercentageToDP(9)}
              color="#682BF7"
              marginRight={widthPercentageToDP(1)}
            />
          </View>
          <View style={styles.locationInfoContainer}>
            <Text style={styles.containerText}>
              Pizza, snacks, and therapy dogs have been added to notification
              categories!
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name={'lightning-bolt-outline'}
              size={widthPercentageToDP(9)}
              color="#692BF7"
              marginRight={widthPercentageToDP(1)}
            />
          </View>
          <View style={styles.locationInfoContainer}>
            <Text style={styles.containerText}>
              Sleek design upgrades for enhanced user experience!
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name={'grid-large'}
              size={widthPercentageToDP(9)}
              color="#682BF7"
              marginRight={widthPercentageToDP(1)}
            />
          </View>
          <View style={styles.locationInfoContainer}>
            <Text style={styles.containerText}>
              New grid view for incredible feed overview!
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => {
            triggerMediumHapticFeedback();
            navigation.navigate('NotificationScreen');
          }}
          style={styles.signOutButton}>
          <MaterialCommunityIcons
            name={'bell-outline'}
            size={widthPercentageToDP(6)}
            color="black"
            marginRight={widthPercentageToDP(3)}
          />
          <Text style={styles.logOutText}>Notifications</Text>
          <View
            style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <MaterialCommunityIcons
              name={'chevron-right'}
              size={widthPercentageToDP(6)}
              color="black"
              style={{marginRight: widthPercentageToDP(0.5)}}
            />
          </View>
        </TouchableOpacity>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: '#efefefef',
            flexDirection: 'row',
            marginHorizontal: widthPercentageToDP(2),
          }}></View>
        <TouchableOpacity
          onPress={() => {
            triggerMediumHapticFeedback();
            navigation.navigate('EditProfile');
          }}
          style={styles.signOutButton}>
          <MaterialCommunityIcons
            name={'cog-outline'}
            size={widthPercentageToDP(6)}
            color="black"
            marginRight={widthPercentageToDP(3)}
          />
          <Text style={styles.logOutText}>Settings</Text>
          <View
            style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <MaterialCommunityIcons
              name={'chevron-right'}
              size={widthPercentageToDP(6)}
              color="black"
              style={{marginRight: widthPercentageToDP(0.5)}}
            />
          </View>
        </TouchableOpacity>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: '#efefefef',
            flexDirection: 'row',
            marginHorizontal: widthPercentageToDP(2),
          }}></View>
        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <MaterialCommunityIcons
            name={'logout'}
            size={widthPercentageToDP(6)}
            color="red"
            marginRight={widthPercentageToDP(3)}
          />
          <Text style={styles.logOutText1}>Log out</Text>
          <View
            style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <MaterialCommunityIcons
              name={'chevron-right'}
              size={widthPercentageToDP(6)}
              color="red"
              marginRight={widthPercentageToDP(0.5)}
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  circle: {
    height: hp(20),
    aspectRatio: 1,
    borderRadius: hp(20),
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrowContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: widthPercentageToDP(5),
    backgroundColor: 'white',
  },

  draggableArea: {
    width: '100%',
    height: 37,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  downContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: widthPercentageToDP(5),
    marginBottom: heightPercentageToDP(3),
    paddingVertical: heightPercentageToDP(0.5),
  },
  greetingTextDown: {
    fontSize: widthPercentageToDP(6),
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  profilePictureDown: {
    height: hp(5),
    width: hp(10),
  },

  topContainer: {
    marginTop: hp(2),
    marginBottom: hp(1),
    paddingHorizontal: hp(1),
    paddingVertical: widthPercentageToDP(5),
    marginHorizontal: hp(1.2),
    borderRadius: widthPercentageToDP(6),
    backgroundColor: '#FFFFFF',
    ...SHADOW.dark,
  },

  bottomContainer: {
    paddingHorizontal: hp(1),
    marginBottom: hp(2),
    top: hp(1),
    marginHorizontal: hp(1.2),
    borderRadius: widthPercentageToDP(6),
    backgroundColor: '#FFFFFF',
    ...SHADOW.dark,
  },

  profileNameStyle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  bottomTitle: {
    color: '#000000',
    fontSize: widthPercentageToDP(4.5),
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    marginLeft: widthPercentageToDP(5),
    marginTop: hp(2),
  },

  bottomText: {
    color: '#000000',
    fontSize: widthPercentageToDP(3.2),
    alignSelf: 'flex-start',
    marginLeft: widthPercentageToDP(5),
    marginTop: hp(1.5),
  },

  scannedImage1: {
    paddingHorizontal: widthPercentageToDP(2),
    marginTop: hp(2),
  },

  signOutButton: {
    paddingHorizontal: widthPercentageToDP(4),
    paddingVertical: hp(1.8),
    borderRadius: widthPercentageToDP(6),
    flexDirection: 'row',
    marginVertical: hp(0.5),
    alignItems: 'center',
  },

  logOutText: {
    color: '#000000',
    fontSize: widthPercentageToDP(4),
    fontWeight: 'bold',
  },

  logOutText1: {
    color: 'red',
    fontSize: widthPercentageToDP(4),
    fontWeight: 'bold',
  },

  whatsNew: {
    fontSize: widthPercentageToDP(7),
    color: '#000000',
    fontWeight: '600',
    paddingVertical: hp(1.5),
    marginLeft: widthPercentageToDP(4),
  },

  newText: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: hp(1),
    paddingBottom: hp(1),
    paddingHorizontal: widthPercentageToDP(3),
    paddingLeft: widthPercentageToDP(5),
  },

  container: {
    flexDirection: 'row',
    marginLeft: widthPercentageToDP(6),
    borderRadius: 10,
    width: widthPercentageToDP(80),
    alignItems: 'left',
    marginVertical: widthPercentageToDP(1),
    marginRight: widthPercentageToDP(8),
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'top',
    paddingVertical: hp(0.5),
  },

  locationInfoContainer: {
    justifyContent: 'space-between',
    alignItems: 'top',
    paddingHorizontal: widthPercentageToDP(5),
    marginBottom: hp(1),
  },

  containerText: {
    color: '#000000',
    fontSize: widthPercentageToDP(4),
    fontWeight: 'normal',
    marginBottom: widthPercentageToDP(1),
    marginTop: hp(0.8),
  },
  timeText: {
    color: '#808080',
    fontSize: widthPercentageToDP(3.9),
    fontWeight: 'bold',
    marginLeft: widthPercentageToDP(1),
    backgroundColor: 'red',
  },
});
