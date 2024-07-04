import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthContext from '../context/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import analytics from '@react-native-firebase/analytics';

const Filters = ({navigation}) => {
  const [state, setState] = useContext(AuthContext);
  const [selectedFilter, setSelectedFilter] = useState(
    state.locationFilter == 'all'
      ? 'All'
      : state.locationFilter == 'north'
      ? 'North Campus'
      : 'Central Campus',
  );
  const [selectedFilters1, setSelectedFilters1] = useState(
    state?.filteredCategories || [],
  );

  console.log({state});

  const filters = ['All', 'Central Campus', 'North Campus'];

  const filters1 = [
    'Clothes',
    'Tickets',
    'Caffeine',
    'Pizza',
    'Food',
    'Snacks',
    'Water bottles',
    'Swag bag',
    'Therapy Dogs',
    'Hats',
    'Phone Wallets',
    'Accessories',
  ];

  const handleFilterSelect = filter => {
    if (filter === 'All') {
      setState({...state, locationFilter: 'all'});
      AsyncStorage.setItem('locationFilter', 'all');
    } else if (filter === 'Central Campus') {
      setState({...state, locationFilter: 'central'});
      AsyncStorage.setItem('locationFilter', 'central');
    } else {
      setState({...state, locationFilter: 'north'});
      AsyncStorage.setItem('locationFilter', 'north');
    }
    setSelectedFilter(filter);
  };

  const handleFilterSelect1 = (
    filter,
    selectedFilters1,
    setSelectedFilters1,
  ) => {
    if (selectedFilters1.includes(filter)) {
      let filterItems = selectedFilters1.filter(
        selected => selected !== filter,
      );
      setSelectedFilters1(filterItems);
      setState({...state, filteredCategories: filterItems});
      AsyncStorage.setItem('filteredCategories', JSON.stringify(filterItems));
    } else {
      setSelectedFilters1([...selectedFilters1, filter]);
      setState({...state, filteredCategories: [...selectedFilters1, filter]});
      AsyncStorage.setItem(
        'filteredCategories',
        JSON.stringify([...selectedFilters1, filter]),
      );
    }
  };

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const triggerResponseHapticFeedback = () => {
    ReactNativeHapticFeedback.trigger('soft', options);
  };

  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Filters Screen',
        screen_class: 'FiltersScreen',
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
            fontSize: wp(5.3),
            fontWeight: 'bold',
            color: 'black',
          }}>
          Feed Personalization
        </Text>
      </View>
      <Text
        style={{
          marginLeft: wp(5),
          fontSize: wp(4),
          fontWeight: 'bold',
          color: 'black',
        }}>
        Pin
      </Text>
      <View style={styles.filterContainer}>
        {filters1.map((filter, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              handleFilterSelect1(filter, selectedFilters1, setSelectedFilters1)
            }
            style={[
              styles.filterButton,
              {
                backgroundColor: selectedFilters1.includes(filter)
                  ? '#682BF7'
                  : 'transparent',
              },
            ]}>
            <Text
              style={[
                styles.filterButtonText,
                {
                  color: selectedFilters1.includes(filter)
                    ? 'white'
                    : '#682BF7',
                },
              ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text
        style={{
          marginLeft: wp(5),
          fontSize: wp(4),
          fontWeight: 'bold',
          color: 'black',
          marginTop: hp(5),
        }}>
        Pin Location Filter
      </Text>
      <View style={styles.filterContainer}>
        {filters.map((filter, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleFilterSelect(filter)}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  selectedFilter === filter ? '#682BF7' : 'transparent',
              },
            ]}>
            <Text
              style={[
                styles.filterButtonText,
                {color: selectedFilter === filter ? 'white' : '#682BF7'},
              ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Filters;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '5%',
    marginLeft: wp(5),
    marginTop: '6%',
  },
  headerText: {
    marginLeft: wp(5),
    fontSize: wp(5.3),
    color: 'black',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'left',
    marginLeft: wp(5),
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: wp(3.2),
    paddingVertical: hp(1),
    margin: 5,
    borderRadius: 25,
    borderWidth: wp(0.5),
    borderColor: '#682BF7',
  },

  filterButtonText: {
    fontWeight: 'bold',
    fontSize: hp(1.8),
  },
});
