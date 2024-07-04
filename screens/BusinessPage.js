import analytics from '@react-native-firebase/analytics';
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

const data = [
  {
    id: 0,
    orgName: 'Michigan Organization', //{data[0]?.organizationInstaTag}
    orgLogo:
      'https://brand.umich.edu/assets/brand/style-guide/logo-guidelines/U-M_Logo-Hex.png',
    email: 'testemail@gmail.com',
    orgPhone: '0000000000',
    orgBio: 'Here is a cool example bio for an organization. Go blue!',
    orgInsta: 'www.exampleinsta.com',
    orgWebsite: 'www.example.com',
    orgAddress: {
      building: '123 Main Street Building',
      street: 'Main Street',
      city: 'Cityville',
      state: 'State',
      zip: '12345',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    },
    office: ' ',
    openHours: [
      {day: 'Sun', open: null, close: null},
      {
        day: 'Mon',
        open: new Date(0, 0, 0, 9, 0),
        close: new Date(0, 0, 0, 17, 0),
      },
      {
        day: 'Tue',
        open: new Date(0, 0, 0, 9, 0),
        close: new Date(0, 0, 0, 17, 0),
      },
      {
        day: 'Wed',
        open: new Date(0, 0, 0, 10, 0),
        close: new Date(0, 0, 0, 14, 0),
      },
      {
        day: 'Thu',
        open: new Date(0, 0, 0, 10, 0),
        close: new Date(0, 0, 0, 14, 0),
      },
      {
        day: 'Fri',
        open: new Date(0, 0, 0, 10, 0),
        close: new Date(0, 0, 0, 14, 0),
      },
      {day: 'Sat', open: null, close: null},
    ],
    media: [
      'https://studentlife.umich.edu/sites/default/files/styles/triblock_image/public/2023-07/CMD-20210901-Full-Size-264_1.png?itok=SS4rc2tF',
      'https://giving.studentlife.umich.edu/sites/default/files/inline-images/CIC-Staff-Cube-1035.jpg',
      'https://giving.studentlife.umich.edu/sites/default/files/styles/triblock_image/public/2023-03/blavin.jpg?itok=Vac9CxxY',
      'https://www.si.umich.edu/sites/default/files/styles/internal_hero/public/2022-10/UMSI_Convocation_OrgFair_08312022_08.jpg?itok=Qt3Tq0aa',
      'https://lsa.umich.edu/content/michigan-lsa/en/news-events/all-news/student-news/university-of-michigan-launches-new-digital-access-program-for-m/jcr:content/image.transform/none/image.png',
      'https://umdearborn.edu/sites/default/files/2023-05/UMD_FALLMARKETING_POND_015-1200x.JPG',
    ],
    totalPost: '4',
    totalJobs: '2',
    totalMembers: '12',
  },
];

const formatTime = date => {
  if (!date) return 'Closed';
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
};

const BusinessPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState('Open Now');
  const [openHours, setOpenHours] = useState([
    {day: 'Sun', open: null, close: null},
    {
      day: 'Mon',
      open: new Date(0, 0, 0, 9, 0),
      close: new Date(0, 0, 0, 17, 0),
    },
    {
      day: 'Tue',
      open: new Date(0, 0, 0, 9, 0),
      close: new Date(0, 0, 0, 17, 0),
    },
    {
      day: 'Wed',
      open: new Date(0, 0, 0, 10, 0),
      close: new Date(0, 0, 0, 14, 0),
    },
    {
      day: 'Thu',
      open: new Date(0, 0, 0, 10, 0),
      close: new Date(0, 0, 0, 14, 0),
    },
    {
      day: 'Fri',
      open: new Date(0, 0, 0, 10, 0),
      close: new Date(0, 0, 0, 14, 0),
    },
    {day: 'Sat', open: null, close: null},
  ]);

  useEffect(() => {
    const checkIfOpen = () => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const todayHours = openHours[dayOfWeek];

      if (!todayHours.open || !todayHours.close) {
        setOpenStatus('Closed');
        return;
      }

      const currentDateTime = new Date();
      const openingDateTime = new Date(currentDateTime);
      openingDateTime.setHours(todayHours.open.getHours());
      openingDateTime.setMinutes(todayHours.open.getMinutes());

      const closingDateTime = new Date(currentDateTime);
      closingDateTime.setHours(todayHours.close.getHours());
      closingDateTime.setMinutes(todayHours.close.getMinutes());

      if (
        currentDateTime >= openingDateTime &&
        currentDateTime <= closingDateTime
      ) {
        setOpenStatus('Open Now');
      } else {
        setOpenStatus('Closed');
      }
    };

    checkIfOpen();
  }, [openHours]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        currentIndex => (currentIndex + 1) % data[0].media.length,
      );
    }, 500); // Change image every 1000 milliseconds (1 second)

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Business Page',
        screen_class: 'BusinessPageScreen',
      });
    } catch (e) {
      console.log({e});
    }
  };

  useEffect(() => {
    firebaseAnalyticsLog();
  }, []);

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <StatusBar hidden={true} />
      <View style={{backgroundColor: 'blue'}}>
        <View style={styles.box}>
          <ImageBackground
            source={{uri: data[0].media[currentImageIndex]}}
            style={{width: '100%', height: hp('53%')}}
            imageStyle={{borderRadius: wp(5)}}>
            {/* Other components */}
          </ImageBackground>

          <View style={styles.titleContainer}></View>
        </View>
        <View style={styles.snippetBox}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{data[0]?.orgName}</Text>
            <TouchableOpacity>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Join</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.titleContainer2}>
            <Text style={styles.descriptionText}>{data[0]?.orgBio}</Text>
          </View>
          <View style={styles.titleContainer2}>
            <TouchableOpacity>
              <View style={styles.actionButton}>
                <Text style={styles.buttonText}>{data[0]?.orgName}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.actionButton}>
                <Text style={styles.buttonText}>Chats</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.actionButton}>
                <Text style={styles.buttonText}>Info</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={toggleDropdown}>
            <View style={styles.openStatusContainer}>
              <Text style={styles.openStatusText}>{openStatus}</Text>
            </View>
          </TouchableOpacity>

          {isOpen && (
            <View style={styles.dropdown}>
              {openHours.map((item, index) => (
                <TouchableOpacity key={index} style={styles.hourRow}>
                  <Text style={styles.dayText}>{item.day}</Text>
                  <Text style={styles.hoursText}>
                    {formatTime(item.open)} - {formatTime(item.close)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      <View style={{backgroundColor: 'blue'}}>
        <View style={styles.snippetBox}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Org Name</Text>
            <TouchableOpacity>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Follow</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.titleContainer2}>
            <Text style={styles.descriptionText}>
              50 character description of organization goes here.
            </Text>
          </View>
          <View style={styles.titleContainer2}>
            <TouchableOpacity>
              <View style={styles.actionButton}>
                <Text style={styles.buttonText}>Future Events</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.actionButton}>
                <Text style={styles.buttonText}>Chats</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.actionButton}>
                <Text style={styles.buttonText}>Info</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View></View>
      <View></View>
    </ScrollView>
  );
};

export default BusinessPage;

const styles = StyleSheet.create({
  box: {
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },

  titleContainer: {
    marginLeft: wp(3),
    marginRight: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'yellow',
    justifyContent: 'space-between',
  },

  titleContainer2: {
    marginTop: hp(1),
    marginLeft: wp(3),
    marginRight: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'yellow',
    justifyContent: 'space-between',
  },

  titleText: {
    fontSize: wp(8.15),
    fontWeight: 'bold',
    color: 'black',
    marginLeft: wp(1),
    width: wp('70%'),
    flexShrink: 1,
  },

  descriptionText: {
    fontSize: wp(3),
    color: 'black',
    marginLeft: wp(1),
  },

  snippetBox: {
    paddingVertical: hp(1),
    backgroundColor: 'green',
  },

  button: {
    backgroundColor: 'green',
    paddingVertical: hp(1),
    paddingHorizontal: wp(6),
    borderRadius: wp(5),
    marginRight: wp(1),
  },

  actionButton: {
    backgroundColor: 'pink',
    width: wp(30),
    height: hp(7),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },

  buttonText: {
    fontSize: wp(4),
    color: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'red',
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
});
