import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import apartments from '../data/apartments.json';
import HousingPreview from './housing/HousingPreview';
import CustomHouseMarker from './housing/CustomHouseMarker';
import {useNavigation, useRoute} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import mapstyle from '../data/mapstyle.json';

const Map = () => {
  const [selectedApartment, setSelectedApartment] = useState(null);
  const navigation = useNavigation();

  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Map Screen',
        screen_class: 'MapScreen',
      });
    } catch (e) {
      console.log({e});
    }
  };

  useEffect(() => {
    firebaseAnalyticsLog();
  }, []);

  return (
    <View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.mapstyle1}
        customMapStyle={mapstyle}
        initialRegion={{
          latitude: 42.277073,
          longitude: -83.7382,
          latitudeDelta: 0.03677,
          longitudeDelta: 0.02068,
        }}>
        {apartments.map(apartment => (
          <CustomHouseMarker
            key={apartment.id}
            apartment={apartment}
            onPress={() => setSelectedApartment(apartment)}
          />
        ))}
      </MapView>
      {selectedApartment && (
        <HousingPreview
        style={{ zIndex: 1 }}
          apartment={selectedApartment}
          onPress={() =>
            navigation.navigate('DetailsHousing', {
              apartment: selectedApartment,
            })
          }
        />
      )}
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  mapstyle1: {
    width: '100%',
    height: '100%',
  },
});
