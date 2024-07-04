import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
  View,
  Image,
  StatusBar,
  Platform,
  Pressable,
  ImageBackground,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import apartments from '../../data/apartments.json';
import analytics from '@react-native-firebase/analytics';
import LinearGradient from 'react-native-linear-gradient';
import {SHADOW} from '../../context/theme';
import {Divider, List} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getIconName} from './helpers/houseIcons';
import {convertDateString} from '../../components/DateConverters/Datetostring';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const DetailsHousing = ({apartment}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const navigation = useNavigation();

  const AmenityItem = ({icon, title}) => (
    <View style={styles.amenityContainer}>
      <MaterialCommunityIcons name={icon} size={24} style={styles.icon} />
      <Text style={styles.amenityText}>{title}</Text>
    </View>
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        currentIndex => (currentIndex + 1) % apartments[0].e.length,
      );
    }, 500); // Change image every 1000 milliseconds (1 second)

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Details Housing Screen',
        screen_class: 'DetailsHousingScreen',
      });
    } catch (e) {
      console.log({e});
    }
  };

  const potentialAmenities = [
    {
      condition: apartments[0].q.includes(
        'Clothing storage: closet or dresser',
      ),
      icon: 'sofa-single',
      title: 'Furnished',
    },
    {
      condition: apartments[0].w.length > 0,
      icon: 'silverware-fork-knife',
      title: 'Kitchen',
    },
    {
      condition: apartments[0].m.includes('Gym'),
      icon: 'dumbbell',
      title: 'Gym',
    },
    {
      condition: apartments[0].w.includes('Coffee machine'),
      icon: 'coffee-outline',
      title: 'Coffee machine',
    },
    {
      condition: apartments[0].v.b.length > 0,
      icon: 'washing-machine',
      title: 'Laundry',
    },
  ];

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
  // Filter the amenities that meet the conditions and slice the first four
  const filteredAmenities = potentialAmenities
    .filter(amenity => amenity.condition)
    .slice(0, 4);

  useEffect(() => {
    firebaseAnalyticsLog();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#FAF9F5'}}>
      <ScrollView
        contentContainerStyle={{paddingBottom: hp(10), flexGrow: 1}}
        style={{backgroundColor: '#FAF9F5'}}>
        <StatusBar hidden={true} />
        <View style={{backgroundColor: '#FAF9F5'}}>
          <View style={styles.box}>
            <ImageBackground
              source={{uri: apartments[0].e[currentImageIndex]}}
              style={{width: '100%', height: hp('53%')}}
              imageStyle={{borderRadius: wp(5)}}>
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
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: hp(1.7),
                  alignItems: 'center'
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: '#000000',
                    fontSize: wp(3.8),
                  }}>
                  + Add listing
                </Text>
              </View>
            </TouchableOpacity>
            {/* <Text style={styles.categoryText}>{data[0]?.category}</Text> */}
          </View>
            </ImageBackground>

            <View style={styles.titleContainer}></View>
          </View>
          <View style={styles.snippetBox}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{apartments[0].c}</Text>
            </View>
            <View style={styles.roomInfo}>
              <Text style={styles.subTitle}>
                Private room in {apartments[0].i}BR/ {apartments[0].j}BA{' '}
                {apartments[0].h}
              </Text>
              <Text style={styles.descriptionText}>
                {apartments[0].k} people * {apartments[0].i} bedrooms *{' '}
                {apartments[0].j} baths
              </Text>
            </View>
          </View>
          <View style={styles.spaceBar} />
          <View style={styles.profile}>
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>About this place</Text>
              <Text>{apartments[0].d}</Text>
              <Text
                style={{marginTop: hp(1), fontSize: wp(3), fontWeight: 'bold'}}>
                Posted by Julie
              </Text>
            </View>
          </View>
          {/* {apartments[0]?.e[4] && (
            <>
              <View style={styles.spaceBar} />
              <ImageBackground
                source={{uri: apartments[0].e[4]}}
                style={{width: '100%', height: hp('40%')}}
                imageStyle={{
                  borderRadius: wp(5),
                  width: wp(98),
                  right: wp(1),
                  left: wp(1),
                }}>
              </ImageBackground>
            </>
          )} */}
          <View style={styles.spaceBar} />
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Your Room</Text>
            <View>
              <AmenityItem icon="bed" title={`${apartments[0].o} bedroom`} />
              <AmenityItem
                icon="shower-head"
                title={`${apartments[0].p} bathroom`}
              />
              {apartments[0].q.map((amenity, index) => (
                <View key={index}>
                  <AmenityItem icon={getIconName(amenity)} title={amenity} />
                </View>
              ))}
            </View>
          </View>
          <View style={styles.spaceBar} />
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>What this place offers</Text>
            <View>
              {filteredAmenities.map((amenity, index) => (
                <AmenityItem
                  key={index}
                  icon={amenity.icon}
                  title={amenity.title}
                />
              ))}
              <TouchableOpacity
                style={styles.showAllButton}
                onPress={() => {
                  navigation.navigate('AmenitiesHousing');
                }}
                left={() => <List.Icon icon="chevron-down" />}>
                <Text style={{fontWeight: 'bold'}}>Show all amenities</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.spaceBar} />

          {Object.keys(apartments[0].u.b).length > 0 && (
            <View style={styles.infoSection}>
              <Text>
                <Text style={styles.infoTitle}>Utilities </Text>
                {apartments[0].u.a > 0 ? (
                  <Text
                    style={{
                      color: 'red',
                      fontSize: wp(3.8),
                      fontWeight: 'bold',
                    }}>
                    {`$${apartments[0].u.a} per month`}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: 'green',
                      borderWidth: 1,
                      borderColor: 'green',
                      padding: 3,
                      fontSize: wp(3.8),
                      fontWeight: 'bold',
                    }}>
                    included
                  </Text>
                )}
              </Text>
              {apartments[0].u.b.map((amenity, index) => (
                <View key={index}>
                  <AmenityItem icon={getIconName(amenity)} title={amenity} />
                </View>
              ))}
            </View>
          )}

          <View style={styles.spaceBar} />

          {Object.keys(apartments[0].x).length > 0 && (
            <View style={styles.infoSection}>
              <Text>
                <Text style={styles.infoTitle}>Parking </Text>
                {apartments[0].x.a > 0 ? (
                  <Text
                    style={{
                      color: 'red',
                      fontSize: wp(3.8),
                      fontWeight: 'bold',
                    }}>
                    {`$${apartments[0].x.a} per month`}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: 'green',
                      borderWidth: 1,
                      borderColor: 'green',
                      padding: 3,
                      fontSize: wp(3.8),
                      fontWeight: 'bold',
                    }}>
                    included
                  </Text>
                )}
              </Text>
              {apartments[0].x.b.map((amenity, index) => (
                <View key={index}>
                  <AmenityItem icon={getIconName(amenity)} title={amenity} />
                </View>
              ))}
            </View>
          )}
          <View style={styles.spaceBar} />
        </View>
      </ScrollView>
      <View style={styles.bottomPadding}>
        <View style={styles.priceBox}>
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <Text style={styles.priceText}>${apartments[0].f}</Text>
            <Text> month</Text>
          </View>
          <View style={{paddingTop: hp(0.5)}}>
            <Text>
              <Text style={styles.price}>
                {apartments[0].z
                  ? `${convertDateString(apartments[0].z)}`
                  : 'Update app'}
                {apartments[0].aa
                  ? ` - ${convertDateString(apartments[0].aa)}`
                  : 'Update app'}
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          {/* <Text style={styles.buttonText}>Info</Text> */}
        </View>
        <LinearGradient
          colors={['#E64980', '#682BF7']}
          start={{x: 0, y: 0}}
          end={{x: 3.5, y: 5.2}}
          style={styles.registerButton}>
          <TouchableOpacity
            onPress={() => {
              // copyToClipboard(data[0]?.link);
              // SafePost();
            }}>
            <Text style={styles.registerText}>Contact</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

export default DetailsHousing;

const styles = StyleSheet.create({
  box: {
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },

  titleContainer: {
    marginHorizontal: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'yellow',
    justifyContent: 'space-between',
    marginTop: hp(0.3),
  },

  titleContainer2: {
    marginTop: hp(1),
    marginHorizontal: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'yellow',
    justifyContent: 'space-between',
  },
  roomInfo: {
    marginTop: hp(1),
    marginHorizontal: wp(4),
    // backgroundColor: 'yellow',
    justifyContent: 'space-between',
  },

  titleText: {
    fontSize: wp(7.5),
    fontWeight: 'bold',
    color: 'black',
    marginLeft: wp(1),
    width: wp('96%'),
    flexShrink: 1,
  },

  descriptionText: {
    fontSize: wp(3.5),
    color: 'black',
    marginLeft: wp(1),
  },

  subTitle: {
    fontSize: wp(3.5),
    color: 'black',
    marginLeft: wp(1),
    fontWeight: 'bold',
  },

  snippetBox: {
    paddingVertical: hp(1),
    // backgroundColor: 'green',
  },

  infoSection: {
    // backgroundColor: 'pink',
    marginHorizontal: wp(4),
  },

  infoTitle: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    marginBottom: hp(1),
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    // backgroundColor: 'red',
  },
  openStatusContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  openStatusText: {
    fontSize: 16,
    color: '#4CAF50',
  },
  dropdown: {
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  hoursText: {
    fontSize: 16,
    color: '#666',
  },
  spaceBar: {
    borderBottomWidth: 1,
    borderColor: '#dadce0',
    marginHorizontal: wp(4),
    marginVertical: wp(3.5),
  },

  registerButton: {
    paddingVertical: hp(0.5),
    width: wp(30),
    borderRadius: wp(10),
    marginRight: wp(6),
    marginTop: hp(1.5),
    marginBottom: hp(4),
    justifyContent: 'center',
    alignItems: 'center',
  },

  priceBox: {
    paddingVertical: hp(0.5),
    width: wp(30),
    //backgroundColor: 'red',
    marginRight: wp(6),
    marginLeft: wp(6),
    marginTop: hp(1.5),
    marginBottom: hp(4),
  },

  priceText: {
    fontSize: wp(4),
    color: '#000000',
    fontWeight: 'bold',
  },

  registerText: {
    fontSize: wp(4),
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  bottomPadding: {
    justifyContent: 'space-between',
    //alignItems: 'flex-end',
    backgroundColor: '#FAF9F5',
    flexDirection: 'row',
    ...SHADOW.darkest,
    ...Platform.select({
      android: {
        // Additional or override styles for Android
        backgroundColor: '#FAF9F5', // Example of adding elevation for a "bump" effect
        paddingBottom: hp(3.5), // Adjusting bottom margin specifically for Android
      },
      ios: {},
    }),
  },
  amenityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  amenityText: {
    fontSize: 16,
  },
  showAllButton: {
    paddingVertical: hp(1.3),
    borderRadius: wp(2),
    marginTop: hp(1.5),
    marginBottom: hp(1),
    justifyContent: 'center', // Align items in the center vertically
    alignItems: 'center',
    borderColor: '#000000',
    borderWidth: 1.1,
  },

  topPadding: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: hp(5),
  },
});
