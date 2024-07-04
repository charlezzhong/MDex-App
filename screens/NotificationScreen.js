import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Switch} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getNotificationToggles} from '../server/controllers/user';
import axios from '../utils/axios';
import {baseUrl} from '../utils/Constant';
import AuthContext from '../context/auth';
import {ScrollView} from 'react-native-gesture-handler';
import {SHADOW} from '../context/theme';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import analytics from '@react-native-firebase/analytics';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const {top} = useSafeAreaInsets();
  const [popUp, setPopUp] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      name: 'Clothes',
      value: false,
    },
    {
      name: 'Food',
      value: false,
    },
    {
      name: 'Water Bottles',
      value: false,
    },
    {
      name: 'Swag bag',
      value: false,
    },
    {
      name: 'Phone Wallets',
      value: false,
    },
    {
      name: 'Accessories',
      value: false,
    },
    {
      name: 'Caffeine',
      value: false,
    },
    {
      name: 'Tickets',
      value: false,
    },
    {
      name: 'Pizza',
      value: false,
    },
    {
      name: 'Snacks',
      value: false,
    },
    {
      name: 'Therapy Dogs',
      value: false,
    },
    {
      name: 'Hats',
      value: false,
    },
    {
      name: 'Saved Posts',
      value: true,
    },
    {
      name: 'Freebies Forecast',
      value: true,
    },
  ]);

  const [state, setState] = useContext(AuthContext);

  const getNotificationToggles = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/user/getNotificationToggles?userId=${state.user._id}`,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        },
      );
      console.log('notifications', response.data);
      if (response.data.status) {
        setPopUp(response.data.allow_notifications);
        let temp = notifications.map(item => {
          if (response.data.notifications.includes(item.name)) {
            return {name: item.name, value: true};
          }
          return {name: item.name, value: false};
        });
        setNotifications(temp);
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong, please try again later!');
    }
  };

  const handleNotifications = async index => {
    let temp = [...notifications];
    temp[index].value = !temp[index].value;
    setNotifications(temp);
    let onlyNames = temp.filter(item => item.value).map(item => item.name);
    console.log('onlyNames', {onlyNames});
    try {
      const response = await axios.post(
        `${baseUrl}/user/updateNotification`,
        {
          userId: state.user._id,
          notification: popUp,
          categories: onlyNames,
        },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        },
      );
      if (!response.data.status) {
        Alert.alert('Error', response.data.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong, please try again later!');
    }
  };

  const handleBannerNotification = async () => {
    let onlyNames = notifications
      .filter(item => item.value)
      .map(item => item.name);
    try {
      const response = await axios.post(
        `${baseUrl}/user/updateNotification`,
        {
          userId: state.user._id,
          notification: !popUp,
          categories: onlyNames,
        },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        },
      );
      setPopUp(!popUp);
    } catch (err) {
      console.log(err.message);
    }
  };

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const triggerResponseHapticFeedback = () => {
    ReactNativeHapticFeedback.trigger('soft', options);
  };

  useEffect(() => {
    getNotificationToggles();
  }, []);

  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Notification Screen',
        screen_class: 'NotificationScreen',
      });
    } catch (e) {
      console.log({e});
    }
  };

  useEffect(() => {
    firebaseAnalyticsLog();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, paddingTop: hp(1)}}>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '5%',
            marginLeft: wp(5),
            marginTop: '6%',
          }}>
          <TouchableOpacity
            onPress={() => {
              triggerResponseHapticFeedback();
              navigation.goBack();
            }}>
            <MaterialCommunityIcons
              name={'arrow-left'}
              size={wp(6.3)}
              color="black"
            />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: wp(5),
              fontSize: wp(6),
              fontWeight: 'bold',
              color: 'black',
            }}>
            Notifications
          </Text>
        </View>
        <View style={styles.notificationContainer}>
          <View
            style={[
              styles.notificationContainerOfPost,
              {
                borderBottomWidth: 0,
              },
            ]}>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                fontSize: wp(4.2),
              }}>
              Pop-up Alerts
            </Text>
            <Switch
              value={popUp}
              thumbColor={popUp ? 'white' : 'white'}
              trackColor={{true: '#682BF7', false: 'white'}}
              onValueChange={() => handleBannerNotification()}
              style={{transform: [{scaleX: wp(0.25)}, {scaleY: wp(0.25)}]}}
            />
          </View>
          {notifications.map((item, index) =>
            index >= 12 ? (
              <View
                style={[
                  styles.notificationContainerOfPost,
                  {
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(0,0,0,0.15)',
                    borderBottomWidth: 0,
                  },
                ]}
                key={index}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'black',
                    fontSize: wp(4.2),
                  }}>
                  {item.name}
                </Text>

                <Switch
                  value={item.value}
                  thumbColor={item.value ? 'white' : 'white'}
                  trackColor={{true: '#682BF7', false: 'white'}}
                  onValueChange={() => handleNotifications(index)}
                  style={{transform: [{scaleX: wp(0.25)}, {scaleY: wp(0.25)}]}}
                />
              </View>
            ) : null,
          )}
        </View>
        <View style={styles.notificationContainerBottom}>
          <Text
            style={{
              fontWeight: 'bold',
              color: 'black',
              fontSize: wp(5),
              paddingHorizontal: wp(4),
              paddingVertical: hp(1),
              marginTop: hp(1),
            }}>
            New Post Notifications
          </Text>
          <View style={styles.PostNotificationContainer}>
            {notifications.map((item, index) =>
              index < 12 ? (
                <View
                  style={[
                    styles.notificationContainerOfPost,
                    index == 11 && {borderBottomWidth: 0},
                  ]}
                  key={index}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'black',
                      fontSize: wp(4.2),
                    }}>
                    {item.name}
                  </Text>

                  <Switch
                    value={item.value}
                    thumbColor={item.value ? 'white' : 'white'}
                    trackColor={{true: '#682BF7', false: 'white'}}
                    onValueChange={() => handleNotifications(index)}
                    style={{
                      transform: [{scaleX: wp(0.25)}, {scaleY: wp(0.25)}],
                    }}
                  />
                </View>
              ) : null,
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  notificationContainer: {
    paddingHorizontal: hp(1),
    paddingVertical: wp(1),
    marginHorizontal: hp(1.2),
    borderRadius: wp(6),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(4),
    ...SHADOW.dark,
  },
  notificationContainerBottom: {
    paddingHorizontal: hp(1),
    paddingVertical: wp(1),
    marginTop: hp(2),
    marginBottom: hp(3),
    marginHorizontal: hp(1.2),
    borderRadius: wp(6),
    backgroundColor: '#FFFFFF',
    ...SHADOW.dark,
  },
  upperPostNotificationContainer: {
    paddingHorizontal: hp(1),
    paddingVertical: wp(1),
    marginHorizontal: hp(1.2),
    borderRadius: wp(6),
    backgroundColor: '#FFFFFF',
    ...SHADOW.dark,
  },

  PostNotificationContainer: {
    paddingHorizontal: wp(6),
    borderRadius: 20,
  },
  notificationContainerOfPost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.15)',
  },
});
