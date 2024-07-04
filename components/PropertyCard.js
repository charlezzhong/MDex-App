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
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const PropertyCard = ({
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
  campus,
  arrayOfSafePosts,
  setTrigger,
  trigger,
  arrayOfSafePostsIdtoDelete,
  category,
  link,
  eventEndTime,
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
    const eventDate = new Date(year, month - 1, day, ...time.split(':'));

    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const difference = eventDate - currentDate;

    const date = new Date(year, month - 1, day);

    if (difference > 0 && difference < 3600000) {
      const minutes = Math.floor(difference / 60000);
      const seconds = Math.floor((difference % 60000) / 1000);
      return `Starting in ${minutes} min`;
      //return `Starting in ${minutes} min, ${seconds} sec`;
    }

    if (
      currentDate.getFullYear() === date.getFullYear() &&
      currentDate.getMonth() === date.getMonth() &&
      currentDate.getDate() === date.getDate()
    ) {
      // It's today, display "TODAY" with the formatted time
      return `Today - ${formattedTime}${
        formattedEndTime ? ` to ${formattedEndTime}` : ''
      }`;
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
        return `Tomorrow - ${formattedTime}${
          formattedEndTime ? ` to ${formattedEndTime}` : ''
        }`;
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

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const triggerMediumHapticFeedback = () => {
    ReactNativeHapticFeedback.trigger('rigid', options);
  };

  const triggerResponseHapticFeedback = () => {
    ReactNativeHapticFeedback.trigger('soft', options);
  };

  const triggerQuietHapticFeedback = () => {
    ReactNativeHapticFeedback.trigger('impactLight', options);
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
    ? new Date(`1970-01-01T${time}`).getMinutes() === 0
      ? new Date(`1970-01-01T${time}`)
          .toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
          })
          .replace(/:(00)$/, '')
      : new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
    : '';

  const formattedEndTime = eventEndTime
    ? new Date(eventEndTime).getMinutes() === 0
      ? new Date(eventEndTime).toLocaleTimeString('en-US', {
          hour: 'numeric',
          hour12: true,
        })
      : new Date(eventEndTime).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
    : '';

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
            campus: campus,
            website: website,
            category: category,
            link: link,
            eventEndTime: eventEndTime,
          })
        }>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MaterialCommunityIcons
            name={'clock-time-five'}
            size={wp(5)}
            color="black"
            resizeMode="contain"
          />
          <Text style={styles.title1}>
            {date ? formatDate(date, formattedTime) : ' '}
          </Text>
        </View>
        <Menu>
          <MenuTrigger>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={wp(5)}
              color="red"
            />
          </MenuTrigger>
          <MenuOptions
            optionsContainerStyle={{
              marginTop: heightPercentageToDP(2.5),
              width: widthPercentageToDP(20),
              borderRadius: 5,
              backgroundColor: '#E64980',
              alignItems: 'center',
            }}>
            <MenuOption
              onSelect={() => {
                // alert with yes and no
                Alert.alert(
                  'Report',
                  'Are you sure you want to report this post?',
                  [
                    {
                      text: 'No',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Yes',
                      onPress: () => reportAccount(),
                    },
                  ],
                  {cancelable: false},
                );
              }}
              text="Report"
              customStyles={{optionText: {fontSize: wp(4)}}}
            />
          </MenuOptions>
        </Menu>
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
              campus: campus,
              eventEndTime: eventEndTime,
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
            campus: campus,
            eventEndTime: eventEndTime,
            unSafePostId:
              arrayOfSafePosts[
                arrayOfSafePosts.findIndex(item => item == postId)
              ],
          })
        }>
        <View
          style={{
            width: '73%',
          }}>
          <View
            // style={[styles.bottomTitleContainer, {backgroundColor: 'red'}]}
            style={{
              justifyContent: 'space-between',
              marginLeft: wp(3),
              paddingVertical: hp(1.3),
              // marginVertical: hp(2),
            }}>
            
            <View style={styles.pinkLocationTag}>
              <MaterialCommunityIcons
                name={'map-marker'}
                size={wp(6)}
                color="#E64980"
                resizeMode="contain"
              />
              <Text style={styles.locationText} numberOfLines={1}>
                {formatLocation(location)}
              </Text>
            </View>
            <Text style={[styles.bottomTitle]} numberOfLines={1}>
              {name}
            </Text>
          </View>
        </View>

        {/* RIGHT */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'flex-end',
            marginRight: wp(2),
            marginTop: hp(1),
          }}>
          <View
            style={{
              flex: 1,
              alignSelf: 'flex-end',
            }}>
            {arrayOfSafePosts.includes(postId) ? (
              <TouchableOpacity
                style={[
                  styles.scanIconBox,
                  {
                    // marginTop: hp(-5),
                    // marginBottom: hp(5),
                    // // marginLeft: 20,
                    backgroundColor: '#FFFFFF',
                  },
                ]}
                onPress={() => {
                  triggerQuietHapticFeedback();
                  DeletePost();
                }}>
                <MaterialCommunityIcons
                  name={'bookmark'}
                  size={wp(12)}
                  color="#E64980"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.scanIconBox}
                onPress={() => {
                  triggerMediumHapticFeedback();
                  SafePost();
                }}>
                <MaterialCommunityIcons
                  name={'bookmark-outline'}
                  size={wp(12)}
                  color="#E64980"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default PropertyCard;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#682BF7',
    borderRadius: 25,
    paddingVertical: hp(1),
    paddingHorizontal: wp(2.5),
    marginBottom: hp(5),
    marginHorizontal: wp(4),
  },

  topContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: hp(3),
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
    fontSize: wp(4),
    fontWeight: 'bold',
    left: 8,
  },

  clockImage: {
    width: 18,
    height: 18,
    left: '3%',
  },

  image: {
    width: wp(90),
    height: hp(36),
    borderRadius: 10,
    alignSelf: 'center',
  },

  bottomContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.89)',
    borderRadius: 20,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: wp(5.7),
    paddingTop: hp(0.1),
    paddingHorizontal: wp(1),
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: hp(0.6),
  },

  pinkLocationTag: {
    paddingBottom: hp(1),
    alignItems: 'flex-end',
    flexDirection: 'row',
  },

  locationText: {
    color: '#E64980',
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
