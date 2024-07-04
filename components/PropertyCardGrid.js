import {
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  ImageBackground,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {baseUrl, baseUrlPicture} from '../utils/Constant';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import axios from '../utils/axios';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthContext from '../context/auth';
import {report} from '../server/routes/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PropertyCardGrid = ({
  name,
  date,
  time,
  image,
  organizationName,
  description,
  location,
  navigation,
  instagram,
  website,
  postedById,
  userId,
  postId,
  arrayOfSafePosts,
  setTrigger,
  trigger,
  arrayOfSafePostsIdtoDelete,
  category,
  link,
  eventEndTime,
  campus,
}) => {
  const [state, setState] = useContext(AuthContext);

  const formatDate = inputDate => {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const monthsOfYear = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const dateParts = inputDate.split('/');
    const month = parseInt(dateParts[0], 10);
    const day = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);

    const currentDate = new Date();
    const date = new Date(year, month - 1, day);

    if (
      currentDate.getFullYear() === date.getFullYear() &&
      currentDate.getMonth() === date.getMonth() &&
      currentDate.getDate() === date.getDate()
    ) {
      // It's today, display "TODAY" with the formatted time
      return `${formattedTime}`;
    } else {
      // Check if it's tomorrow
      const tomorrow = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1,
      );

      if (
        tomorrow.getFullYear() === date.getFullYear() &&
        tomorrow.getMonth() === date.getMonth() &&
        tomorrow.getDate() === date.getDate()
      ) {
        // It's tomorrow, display "TOMORROW" with the formatted time
        return `Tomorrow - ${formattedTime}`;
      } else {
        // It's not today or tomorrow, display the formatted date and time
        const dayOfWeek = daysOfWeek[date.getDay()];
        const monthName = monthsOfYear[date.getMonth()];
        return `${dayOfWeek}, ${monthName} ${day} - ${formattedTime}`;
      }
    }
  };

  const formatLocation = inputString => {
    const [building, campusLocation] = inputString
      .split(',')
      .map(part => part.trim());

    return `${building}`;
  };

  const DeletePost = async () => {
    const index = arrayOfSafePosts.findIndex(item => item == postId);
    try {
      const response = await axios
        .post(
          `${baseUrl}/deletePost`,
          {
            id: arrayOfSafePostsIdtoDelete[index],
          },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          },
        )
        .then(item => item?.data);
      console.log('DELETING', {response});
    } catch (err) {
      console.log({err});
    }
    setTrigger(!trigger);
  };

  const SafePost = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/savePost`,
        {
          postId: postId,
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        },
      );
    } catch (err) {
      console.log({err});
    }
    setTrigger(!trigger);
  };

  const reportAccount = async () => {
    try {
      setState({...state, reportPost: [...state.reportPost, postId]});
      await AsyncStorage.setItem(
        'reportPost',
        JSON.stringify([...state.reportPost, postId]),
      );
      setTrigger(!trigger);
    } catch (err) {
      console.log({err});
    }
  };

  const formattedTime = time
    ? new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : 'no Time';

  return (
    <View style={styles.card}>
      <Pressable
        style={styles.topContainer}
        onPress={() =>
          navigation.navigate('EventDetail', {
            name: name,
            date: date,
            time: time,
            image: image,
            location: location,
            description: description,
            organizationName: organizationName,
            instagram: instagram,
            website: website,
            category: category,
            link: link,
            eventEndTime: eventEndTime,
            campus: campus,
          })
        }>
        <View
          style={{flexDirection: 'row', alignItems: 'center', width: wp(30)}}>
          <MaterialCommunityIcons
            name={'clock-time-five'}
            size={wp(3)}
            color="black"
            resizeMode="contain"
          />
          <Text style={styles.title1} numberOfLines={1}>
            {date
              ? formatDate(date, formattedTime).split(' ')[0].replace(',', '')
              : ' '}
          </Text>
        </View>
      </Pressable>
      <View>
        <Pressable
          onPress={() =>
            navigation.navigate('EventDetail', {
              name: name,
              date: date,
              time: time,
              image: image,
              location: location,
              description: description,
              organizationName: organizationName,
              instagram: instagram,
              website: website,
              category: category,
              link: link,
              arrayOfSafePosts: arrayOfSafePosts,
              postId: postId,
              userId: userId,
              eventEndTime: eventEndTime,
              campus: campus,
              unSafePostId:
                arrayOfSafePosts[
                  arrayOfSafePosts.findIndex(item => item == postId)
                ],
            })
          }>
          <ImageBackground
            source={{uri: `${baseUrlPicture}/${image}`}}
            style={styles.image}
            resizeMode="contain"></ImageBackground>
        </Pressable>
      </View>
      <Pressable
        style={styles.bottomContainer}
        onPress={() =>
          navigation.navigate('EventDetail', {
            name: name,
            date: date,
            time: time,
            image: image,
            location: location,
            description: description,
            organizationName: organizationName,
            instagram: instagram,
            website: website,
            category: category,
            link: link,
            arrayOfSafePosts: arrayOfSafePosts,
            postId: postId,
            userId: userId,
            eventEndTime: eventEndTime,
            campus: campus,
            unSafePostId:
              arrayOfSafePosts[
                arrayOfSafePosts.findIndex(item => item == postId)
              ],
          })
        }>
        <View
          // style={[styles.bottomTitleContainer, {backgroundColor: 'red'}]}
          style={{
            justifyContent: 'space-between',
            marginLeft: wp(1),
            marginRight: wp(1),
            paddingVertical: hp(1),
            flexDirection: 'row',
            // marginVertical: hp(2),
          }}>
          <Text style={[styles.bottomTitle]} numberOfLines={2}>
            {name}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default PropertyCardGrid;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#682BF7',
    borderRadius: 20,
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(1.5),
    marginBottom: hp(5),
    marginLeft: wp(2),
    width: wp(30.5),
  },

  topContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(0.7),
    paddingHorizontal: wp(2),
    borderRadius: hp(5),
  },
  categoryText: {
    alignSelf: 'flex-end',
    marginRight: wp(4),
    marginTop: hp(1),
    color: '#FFFFFF',
    fontSize: wp(3.6),
    fontWeight: 'bold',
  },

  title1: {
    color: '#000000',
    fontSize: wp(3),
    fontWeight: 'bold',
    left: wp(0.8),
    right: wp(0.8),
    width: wp(20),
  },

  clockImage: {
    width: 18,
    height: 18,
    left: '3%',
  },

  image: {
    width: wp(30),
    height: hp(15),
    borderRadius: 10,
    alignSelf: 'center',
  },

  bottomContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.89)',
    borderRadius: 14,
    marginTop: 5,
    flex: 1,
    justifyContent: 'center',
  },

  bottomTitleContainer: {
    // position: 'absolute',
    // left: '3%',
    // right: '28%',
    // top: '8%',
    // width: 'auto',
  },
  bottomTitle: {
    color: '#000000',
    fontSize: wp(3),
    paddingHorizontal: wp(1),
    fontWeight: 'bold',
    textAlign: 'left',
    width: wp(25),
  },

  pinkLocationTag: {
    backgroundColor: '#E64980',
    borderRadius: 1000,
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(1.5),
    alignItems: 'center',
    flexDirection: 'row',
  },

  locationText: {
    color: '#FFFFFF',
    fontSize: wp(4.2),
    fontWeight: 'bold',
    flex: 1,
  },

  scanIcon: {
    alignSelf: 'center',
    aspectRatio: 1,
  },

  scanIconBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(5),
    width: wp(15),
    height: wp(15),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },

  iconImage: {
    height: '65%',
  },
  buttonText1: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  buttonText2: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: '6%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    marginTop: '45%',
    paddingVertical: '10%',
    paddingHorizontal: '8%',
    borderRadius: 25,
    height: '50%',
    width: '94%',
  },

  deleteModalButton: {
    backgroundColor: 'green',
    paddingHorizontal: '18%',
    paddingVertical: '5%',
    borderRadius: 5,
  },

  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 25,
    backgroundColor: 'red',
    borderRadius: 25,
    textAlign: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
});
