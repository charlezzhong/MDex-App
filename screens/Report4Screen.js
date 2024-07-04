import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import React, {useState, useRef, useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import MapFullScreenModal from '../components/Modal/MapFullScreenModal';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SHADOW} from '../context/theme';
import CustomDatePicker from '../components/CustomDatePicker';
import {COLORS} from '../utils/Constant';
import Entypo from 'react-native-vector-icons/Entypo';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {isPointInsidePolygon} from '../utils/isPointInsidePolygon';
import axios from 'axios';
import CustomSearchDropDown from '../components/CustomSearchDropDown';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {debounce} from 'lodash';
import DropDownPicker from 'react-native-dropdown-picker';
import analytics from '@react-native-firebase/analytics';

const Report4Screen = ({route}) => {
  const {report3Content} = route.params;
  console.log(report3Content);
  const navigation = useNavigation();
  const [ModalStatus, setModalStatus] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [text, setText] = useState('');
  const [locationData, setLocationData] = useState([]);
  const [coordinatesFlag, setCoordinatesFlag] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(null);

  const setLocationText = async txt => {
    try {
      setText(txt);
      // debounce logic
      if (txt === text) return;
      debouncedHandleInputChange(txt);
    } catch (error) {
      console.log('Search Error', error);
    }
  };

  const debouncedHandleInputChange = useCallback(
    debounce(txt => {
      // Handle the input change here
      setCoordinatesFlag(false);
      setSearchText(txt);
    }, 500),
    [],
  );

  useEffect(() => {
    if (searchText !== '') {
      fetchMapboxSuggestions();
    } else {
      setLocationData([]);
    }
  }, [searchText]);

  const fetchMapboxSuggestions = async () => {
    console.log('fetching suggestions');
    const apiUrl = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(
      searchText,
    )}&access_token=pk.eyJ1IjoiaGVsbG9tZGV4IiwiYSI6ImNsb2x1bno1ODBwMXIycW1yYjNpam9oejMifQ.9u_QctlIhzYi22zPFXJG1Q&session_token=pk.eyJ1IjoiaGVsbG9tZGV4IiwiYSI6ImNscDEwYmQxaDBlenUya3BibmRxZmppajIifQ.1eegP6heWSE9k4DGX3t4-w&country=US`;
    try {
      const response = await axios.get(apiUrl);
      setLocationData([]);
      const filteredSuggestions = response.data.suggestions.filter(
        suggestion => suggestion?.name !== undefined,
      );
      setLocationData(filteredSuggestions);
    } catch (error) {
      console.error('Error fetching Mapbox suggestions:', error);
      throw error; // You can handle the error as needed
    }
  };

  const onSelectData = async data => {
    setText(`${data.name}, ${data.address}`);
    setCoordinatesFlag(true);
    // 'details' is provided when fetchDetails = true
    apiUrl = `https://api.mapbox.com/search/searchbox/v1/retrieve/${data.mapbox_id}?session_token=pk.eyJ1IjoiaGVsbG9tZGV4IiwiYSI6ImNscDEwYmQxaDBlenUya3BibmRxZmppajIifQ.1eegP6heWSE9k4DGX3t4-w&access_token=pk.eyJ1IjoiaGVsbG9tZGV4IiwiYSI6ImNsb2x1bno1ODBwMXIycW1yYjNpam9oejMifQ.9u_QctlIhzYi22zPFXJG1Q`;
    try {
      const response = await axios.get(apiUrl);
      let isNorth = isPointInsidePolygon(
        response.data.features[0].geometry.coordinates,
        'north',
      );
      let isCentral = isPointInsidePolygon(
        response.data.features[0].geometry.coordinates,
        'central',
      );
      setReport4Content({
        ...report4Content,
        eventLocation: data.full_address,
        isNorth,
        isCentral,
      });
    } catch (error) {
      console.error('Error fetching Mapbox suggestions:', error);
      throw error; // You can handle the error as needed
    }
  };

  const [report4Content, setReport4Content] = useState({
    eventDate: '',
    eventTime: '',
    eventBuildingName: '',
    eventLocation: {latitude: 42.279594, longitude: -83.732124},
    evenLocationDescription: '',
    organizationName: report3Content?.organizationName,
    body: report3Content?.body,
    image: report3Content?.image,
    postedBy: report3Content?.postedBy,
    category: report3Content?.category,
  });
  const mapRef = useRef();
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [endTime, setEndTime] = useState();
  const [coordinates, setCoordinates] = useState([]);
  const nextHandler = () => {
    // check if end time is after start time
    if (endTime && time > endTime) {
      alert('End time must be after start time');
      return;
    }
    if (dropdownValue == null) {
      alert('Please select a location');
      return;
    }
    if (date == null) {
      alert('Please select a date');
      return;
    }
    if (time == null) {
      alert('Please select a start time');
      return;
    }

    const reportContentMergered = {
      ...report4Content,
      eventDate: date.toISOString(),
      eventTime: time.toISOString(),
      eventEndTime: endTime ? endTime.toISOString() : null,
      isNorth: dropdownValue == 'north',
      isCentral: dropdownValue == 'central',
    };
    console.log('asdas', report4Content);
    navigation.navigate('Report5', {report4Content: reportContentMergered});
  };

  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Posting Screens',
        screen_class: 'PostingScreens',
      });
    } catch (e) {
      console.log({e});
    }
  };

  useEffect(() => {
    firebaseAnalyticsLog();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, marginHorizontal: wp(4)}}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{marginTop: hp(2), width: wp(7.5)}}>
        <Entypo
          name="chevron-with-circle-left"
          size={wp(7.5)}
          color="#7541FF"
        />
      </TouchableOpacity>
      <ScrollView
        nestedScrollEnabled={true}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title1}>Let&apos;s locate your event</Text>
        <Text style={styles.fieldName}>
          Room name or number <Text style={{color: 'red'}}>*</Text>
        </Text>
        <TextInput
          style={styles.textAreaContainer}
          underlineColorAndroid="transparent"
          placeholder="Ex. 1200 Mason Hall"
          placeholderTextColor="grey"
          numberOfLines={10}
          multiline={true}
          value={report4Content?.eventBuildingName || ''}
          onChangeText={text =>
            setReport4Content({...report4Content, eventBuildingName: text})
          }
        />
        <Text style={styles.fieldName}>
          Location <Text style={{color: 'red'}}>*</Text>
        </Text>
        <DropDownPicker
          open={dropdownOpen}
          value={dropdownValue}
          items={[
            {label: 'North Campus', value: 'north'},
            {label: 'Central Campus', value: 'central'},
            {label: 'Off Campus', value: 'all'},
          ]}
          setOpen={() => setDropdownOpen(!dropdownOpen)}
          setValue={val => setDropdownValue(val)}
          setItems={() => null}
          placeholder={'Select a location'}
          style={styles.textAreaContainer}
          itemSeparator
          itemSeparatorStyle={{
            backgroundColor: '#0C0C52',
            height: 0.3,
          }}
          dropDownContainerStyle={{
            borderColor: 'white',
          }}
        />
        {/* <CustomSearchDropDown
          data={locationData}
          setSelected={data => onSelectData(data)}
          value={text}
          onChangeText={text => setLocationText(text)}
        /> */}
        {/* <TextInput
          style={styles.textAreaContainer}
          underlineColorAndroid="transparent"
          placeholder="Central Campus or North Campus or Address"
          placeholderTextColor="grey"
          numberOfLines={10}
          multiline={true}
          value={report4Content?.eventLocation || ''}
          onChangeText={text =>
            setReport4Content({
              ...report4Content,
              eventLocation: text,
            })
          }
        /> */}
        {/*<Text style={styles.fieldName}>
          Optional: Additional location details
        </Text>
        <TextInput
          style={styles.textAreaContainer}
          underlineColorAndroid="transparent"
          placeholder="Optional (ex. room #1000)"
          placeholderTextColor="grey"
          numberOfLines={10}
          multiline={true}
          value={report4Content?.evenLocationDescription || ''}
          onChangeText={text =>
            setReport4Content({
              ...report4Content,
              evenLocationDescription: text,
            })
          }
        />*/}
        {/* <Text style={styles.fieldName}>
          DATE
        </Text> */}
        <View style={{marginTop: hp(4)}}>
          <Text style={styles.title1}>Date and time</Text>
          <CustomDatePicker
            value={date}
            onChange={setDate}
            placeholder="Date"
            style={{color: 'black'}}
          />
          <CustomDatePicker
            value={time}
            placeholder="Start Time"
            onChange={setTime}
            mode="time"
            style={{color: 'black'}}
          />
          <CustomDatePicker
            value={endTime}
            placeholder="End Time"
            onChange={setEndTime}
            mode="time"
            style={{color: 'black'}}
            required={false}
          />
        </View>
        {/* <View style={styles.detailsContainer}>
         
            <MapView
            onPress={() => setModalStatus(true)}
              style={{height: hp(20), width: wp(92), marginBottom: hp(2)}}
              ref={mapRef}
              initialRegion={{
                ...report4Content.eventLocation,
                latitudeDelta: 0.0043,
                longitudeDelta: 0.0034,
              }}>
              <Marker coordinate={report4Content.eventLocation} />
            </MapView>
         
        </View> */}

        {/* <MapFullScreenModal
          // coordinates={coordinates}
          // distance={distance}
          closeModal={() => {
            mapRef.current.animateToRegion({
              ...report4Content.eventLocation,
              latitudeDelta: 0.0043,
              longitudeDelta: 0.0034,
            });
            setModalStatus(false);
          }}
          isVisible={ModalStatus}
          setReport4Content={setReport4Content}
          report4Content={report4Content}
          // obj={obj}
        /> */}
      </ScrollView>
      <View style={{marginTop: hp(1), marginBottom: hp(3), ...SHADOW.darkest}}>
        <TouchableOpacity
          style={styles.buttonstyle}
          onPress={() => {
            console.log('HELLO');
            nextHandler();
            // navigation.navigate('Report5', {report4Content: report4Content});
          }}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Report4Screen;

const styles = StyleSheet.create({
  title1: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: '#7541FF',
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  fieldName: {fontSize: wp(4.1), color: '#8e93a1', marginHorizontal: wp(0.5)},
  title2: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    paddingLeft: 15,
  },

  backButton: {
    marginTop: 60,
    marginLeft: '6%',
  },

  backButtonText: {
    fontSize: 12,
    color: 'blue',
  },

  text: {
    fontSize: wp(3.8),
    fontWeight: '500',
    color: '#000000',
    marginBottom: hp(2),
    fontWeight: 'bold',
  },

  buttonstyle: {
    backgroundColor: '#7541FF',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    marginTop: hp(2),
  },
  buttonText: {
    fontSize: wp(4.9),
    color: '#FFFFFF',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  detailsContainer: {
    alignItems: 'center',
  },
  textAreaContainer: {
    marginTop: hp(1),
    backgroundColor: '#fff',
    color: COLORS.primary,
    height: hp(5),
    borderRadius: 8,
    justifyContent: 'center',
    ...SHADOW.medium,
    marginBottom: hp(2),
    paddingHorizontal: wp(2),
    fontSize: wp(3.5),
    borderColor: 'white',
  },
  mapContainer: {height: hp(20), width: wp(92), marginBottom: hp(2)},
});
