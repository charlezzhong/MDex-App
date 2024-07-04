import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useState} from 'react';
import {
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CustomIcon from '../components/CustomIcon';
import HomeScreen from '../screens/HomeScreen';
import HottestPosts from '../screens/hottestPosts';
import Profile from '../screens/profile';
import Report9Screen from '../screens/Report9Screen';
import Report1Screen from '../screens/Report1Screen';
import {useNavigation} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import {useNavigationState} from '@react-navigation/native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const triggerMediumHapticFeedback = () => {
  ReactNativeHapticFeedback.trigger("soft", options)
};

const Tab = createBottomTabNavigator();

const TABS = [
  {
    id: 1,
    name: 'Home',
    iconFocused: (
      <CustomIcon
        type="entypo"
        icon="home"
        color={'#682BF7'}
        size={wp(7)}
        disabled
      />
    ),
    icon: <CustomIcon type="entypo" icon="home" size={wp(6.5)} disabled />,
    component: HomeScreen,
  },
  {
    id: 2,
    name: 'HottestPosts',
    iconFocused: (
      <CustomIcon
        type="feather"
        icon="coffee"
        color={'#682BF7'}
        size={wp(7)}
        disabled
      />
    ),
    icon: <CustomIcon type="feather" icon="coffee" size={wp(6.5)} disabled />,
    component: HottestPosts,
  },
  {
    id: 3,
    name: 'Report1',
    icon: (
      <View
        style={{
          width: wp(11),
          height: wp(11),
          borderRadius: hp(5),
          backgroundColor: '#E64980',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: hp(-0.7),
        }}>
        <CustomIcon
          type="entypo"
          icon="plus"
          color={'white'}
          size={wp(6)}
          disabled
        />
      </View>
    ),
    component: Report1Screen,
  },
  {
    id: 4,
    name: 'Profile',
    iconFocused: (
      <CustomIcon
        type="ionicons"
        icon="person"
        color={'#682BF7'}
        size={wp(7)}
        disabled
      />
    ),
    icon: <CustomIcon type="ionicons" icon="person" size={wp(6.5)} disabled />,
    component: Profile,
  },
  {
    id: 5,
    name: 'Report9',
    iconFocused: (
      <CustomIcon
        type="materialCommunityIcons"
        icon="message-text"
        color={'#682BF7'}
        size={wp(7)}
        disabled
      />
    ),
    icon: (
      <CustomIcon
        type="materialCommunityIcons"
        icon="message-text"
        size={wp(6.5)}
        disabled
      />
    ),
    component: Report9Screen,
  },
];

const BottomTabNavigator = () => {
  const navigation = useNavigation();
  const tabsBar = TABS;
  const [selectedTab, setSelectedTab] = useState(tabsBar[0].name);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarStyle:
          Platform.OS == 'android'
            ? {
                backgroundColor: '#FFFFFF',
                marginBottom: hp(2),
              }
            : {},
        tabBarBackground: () => (
          <View
            style={
              Platform.OS === 'ios'
                ? {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: hp(10),
                    backgroundColor: '#FFFFFF',
                  }
                : {
                    backgroundColor: '#FFFFFF',
                    height: '100%'
                  }
            }
          />
        ),
      }}>
      {tabsBar.map(tab => (
        <Tab.Screen
          {...tab}
          key={tab.id}
          options={{
            tabBarButton: props => {
              let focused = props.accessibilityState.selected;
              return (
                <TouchableWithoutFeedback
                  key={tab.id}
                  {...props}
                  style={[...props.style]}
                  onPress={() => {
                    tab.name == 'Report1'
                      ? navigation.navigate('Report1')
                      : props.onPress();
                      triggerMediumHapticFeedback();
                  }}>
                  <View
                    style={[
                      ...props.style,
                      {bottom: Platform.OS == 'ios' ? hp(1) : hp(0)},
                    ]}
                    key={tab.id}>
                    {focused ? tab.iconFocused : tab.icon}
                  </View>
                </TouchableWithoutFeedback>
              );
            },
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
  button: {
    width: wp(10),
    height: wp(10),
    borderRadius: hp(5),
    backgroundColor: '#E64980',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
