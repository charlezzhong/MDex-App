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
import {SHADOW} from '../context/theme';
import {COLORS, baseUrl, baseUrlPicture} from '../utils/Constant';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import analytics from '@react-native-firebase/analytics';

export default function WhatsNew() {
  const navigation = useNavigation();
  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Whats New Screen',
        screen_class: 'WhatsNewScreen',
      });
    } catch (e) {
      console.log({e});
    }
  };

  useEffect(() => {
    firebaseAnalyticsLog();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center'}}>
      <View style={styles.topContainer}>
        <View
          style={{
            borderBottomWidth: 2,
            borderBottomColor: '#682BF7',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text style={styles.whatsNew}>🥳 NEW UPDATES 🥳</Text>
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
      </View>
      <View style={{marginTop: hp(5)}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home');
          }}
          style={[styles.buttonStyle]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.tstyle1}>Close</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    paddingHorizontal: hp(1),
    paddingVertical: widthPercentageToDP(5),
    marginHorizontal: hp(1.2),
    borderRadius: widthPercentageToDP(6),
    elevation: 5,
    padding: 5,
    backgroundColor: '#FFFFFF',
    ...SHADOW.dark,
  },

  bottomContainer: {
    paddingHorizontal: hp(1),
    paddingVertical: widthPercentageToDP(1),
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
  buttonStyle: {
    // backgroundColor: '#0C0C52',
    // justifyContent: 'center',
    // paddingVertical: heightPercentageToDP(1.5),
    // marginHorizontal: widthPercentageToDP(5),
    // borderRadius: 14,
    marginBottom: heightPercentageToDP(1.5),
    backgroundColor: '#682BF7',
    paddingVertical: heightPercentageToDP(1.5),
    marginHorizontal: widthPercentageToDP(15),
    borderRadius: widthPercentageToDP(10),
    // borderWidth: 1,
    // borderColor: '#0C0C52',
    alignItems: 'center',
  },
  tstyle1: {
    fontSize: widthPercentageToDP(4),
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});
