import React, {Component, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';

// ...
const CustomWebView = () => {
  const navigation = useNavigation();

  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Custom Web View',
        screen_class: 'CustomWebViewScreen',
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
          marginTop: '5%',
          marginBottom: '5%',
          marginLeft: '5%',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name={'arrow-left'} size={25} color="black" />
        </TouchableOpacity>
        <Text style={{marginLeft: widthPercentageToDP(5), fontSize: 20}}>
          Terms and Conditions
        </Text>
      </View>
      <WebView
        source={{
          uri: 'https://www.termsfeed.com/live/a6a13fd5-304f-4e74-a74d-c2f8734a3f0d',
        }}
        style={{flex: 1}}
      />
    </SafeAreaView>
  );
};

export default CustomWebView;
