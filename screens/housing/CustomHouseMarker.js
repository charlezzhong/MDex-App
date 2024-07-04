import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Marker} from 'react-native-maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getSeasonIcon} from './helpers/semesterIcon';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const CustomHouseMarker = ({apartment, onPress}) => {
  return (
    <Marker
      onPress={onPress}
      coordinate={{
        latitude: apartment.a,
        longitude: apartment.b,
      }}>
      <View
        style={{
          backgroundColor: 'white',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: 2,
          width: wp(12),
          height: wp(12),
          borderRadius: 100,
          borderWidth: 0.9,
          borderColor: '#767676',
        }}>
        {/* Top Icon */}
        {apartment.ab && apartment.ab.length > 0 && (
          <View
            style={{
              height: '33%',
              justifyContent: 'center',
            }}>
            <Text
              style={{fontSize: wp(2.6)}}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.01}>
              {getSeasonIcon(apartment.ab[0])}
            </Text>
          </View>
        )}

        {/* Middle Text */}
        <View
          style={{
            height: '33%',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: hp(1.6),
              paddingHorizontal: 2,
              textAlign: 'center',
            }}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.01}>
            ${apartment.f}
          </Text>
        </View>

        {/* Bottom Icon */}
        {apartment.ab && apartment.ab.length > 1 ? (
          <View
            style={{
              height: '33%',
              justifyContent: 'center',
            }}>
            <Text
              style={{fontSize: wp(2.6)}}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.01}>
              {getSeasonIcon(apartment.ab[1])}
            </Text>
          </View>
        ) : (
          <Text>
            
          </Text>
        )}
      </View>
    </Marker>
  );
};

export default CustomHouseMarker;

const styles = StyleSheet.create({});
