import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import MapView, {Marker, Polyline} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Entypo from 'react-native-vector-icons/Entypo'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const MapFullScreenModal = props => {
  const {closeModal, isVisible, setReport4Content, report4Content} = props;

  const coordinates = [{latitude: 24.6596565, longitude: 67.184289}];
const mapRef=useRef()
  const [address, setAddress] = useState(null);
  const _address = useRef();
  const [marker, setMarker] = useState({
    latitude: 23.4241,
    longitude: 53.8478,
  });

  const handleMarker = e => {
    setReport4Content({...report4Content, eventLocation: marker});

    setMarker(e.nativeEvent.coordinate);
  };

  // const handleAddress = async marker => {
  //   // const address = await axios.get(
  //   //   `https://maps.googleapis.com/maps/api/geocode/json?latlng=${marker.latitude},${marker.longitude}&key=AIzaSyCLmr10Fki0XLqeck5k3YdyeLchKOYvQ30`,
  //   // );

  //   // if (address) {
  //   //   _address.current = address?.data?.results[0]?.formatted_address;
  //   //   setAddress(_address.current);
  //   //   setReport4Content({...report4Content, eventLocation: _address.current});
  //   // }

  //   // console.log('address', address);
  //   setReport4Content({...report4Content, eventLocation: marker});
  //   console.log('marker values', marker);

  //   // console.log("permission", requestLocationPermission)
  // };

  // // useEffect(() => {
  // //   if (coordinates[0]?.latitude) {
  // //     handleAddress(marker);
  // //   }
  // // }, [coordinates[0]?.latitude, marker]);

const {top}=useSafeAreaInsets()
  return (
    <ReactNativeModal
      animationOut={'slideOutDown'}
      animationOutTiming={700}
      isVisible={isVisible}
      onBackdropPress={closeModal}
      // backdropOpacity={100}
      // backdropColor="white"
      style={{margin: 0, flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <View style={styles.mapContainer}>
        <MapView
        ref={mapRef}
          style={{height: hp(100), width: '100%'}}
          onPress={handleMarker}
          mapType="standard"
          zoomEnabled={true}
          pitchEnabled={true}
          showsUserLocation={true}
          followsUserLocation={true}
          showsCompass={true}
          showsBuildings={true}
          showsTraffic={true}
          showsIndoors={true}
          initialRegion={{
            latitude: 42.279594,
            longitude: -83.732124,
            latitudeDelta: 0.0043,
            longitudeDelta: 0.0034,
          }}>
          {!marker !== null ? <Marker draggable coordinate={marker} /> : null}
        </MapView>
        <Entypo name="cross" onPress={closeModal} color={"black"} size={wp(10)} style={{position:"absolute",top:top,right:4}} />
        <View style={{backdropColor: '#fff'}}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text
              style={{
                textAlign: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              {address}
            </Text>
          </View>
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default MapFullScreenModal;

const styles = StyleSheet.create({
  bottomDistance: {
    height: hp(7),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bottomInnerDistance: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: hp(5),
  },
  mapContainer: {
    alignItems: 'center',
  height:hp(100)
    // bottom: -10,
  },
});
