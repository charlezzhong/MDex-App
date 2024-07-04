import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import AuthContext from '../../context/auth';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {
  baseUrl,
  baseUrlPicture,
  convertTo12HourFormat,
} from '../../utils/Constant';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import analytics from '@react-native-firebase/analytics';

const HottestPosts = () => {
  const [state, setState] = useContext(AuthContext);
  const [safePosts, setSafePosts] = useState([]);
  const [safePostLoader, setSafePostLoader] = useState(true);
  const [dataLoader, setDataLoader] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [arrayOfSafePostsIdtoDelete, setarrayOfSafePostsIdtoDelete] = useState(
    [],
  );
  const [arrayOfSafePosts, setarrayOfSafePosts] = useState([]);

  const [data, setData] = useState({
    hotestPosts: [],
    todayPosts: [],
  });

  const handleRefresh = async () => {
    setRefreshing(true);

    // Perform your data fetching logic here
    await getPosts();
    setRefreshing(false);
  };

  const getData = async () => {
    setDataLoader(true);
    try {
      const response = await axios
        .get(`${baseUrl}/explore-screen`, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        })
        .then(item => item.data);
      console.log({checkkkss: response?.hotestPosts});
      setData(response);
    } catch (e) {
      console.log({e});
    }
    setDataLoader(false);
  };

  const getPosts = async () => {
    setSafePostLoader(true);
    try {
      const response = await axios
        .get(`${baseUrl}/getPosts`, {
          params: {
            userId: state?.user?._id,
          },
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        })
        .then(item => item.data);
      setSafePosts(response?.data);
      let onlyId = response?.data?.map(item => item?.postId?._id);
      let IdForDelete = response?.data?.map(item => item?._id);
      setarrayOfSafePosts(onlyId);
      setarrayOfSafePostsIdtoDelete(IdForDelete);
    } catch (e) {
      console.log({e});
    }
    setSafePostLoader(false);
  };

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      getPosts();
      getData();
    }, []),
  );

  function convertDateString(dateString) {
    if (!dateString) {
      return '';
    }

    let date = new Date(dateString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    if (minutes === 0) {
      return `${hours} ${ampm}`;
    } else {
      minutes = minutes < 10 ? '0' + minutes : minutes;
      return `${hours}:${minutes} ${ampm}`;
    }
  }

  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Hottest Posts',
        screen_class: 'HottestPosts',
      });
    } catch (e) {
      console.log({e});
    }
  };

  useEffect(() => {
    firebaseAnalyticsLog();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textHeading}>
        Hey {state?.user?.name.split(' ')[0]}! 🥳
      </Text>
      <ScrollView contentContainerStyle={{paddingBottom: hp(7)}}>
        <View style={styles.TodayContainer}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: wp(2),
            }}>
            <Text style={styles.TodayText}>Today's Freebies Forecast</Text>
          </View>
          <FlatList
            data={data.todayPosts}
            renderItem={({item, index}) => (
              <View
                style={{
                  borderTopWidth: index == 0 ? 0 : 0.4,
                  borderColor: '#D3D3D3',
                  paddingTop: hp(1),
                  paddingBottom: hp(1),
                  paddingHorizontal: wp(3),
                  paddingLeft: wp(1.5),
                }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('EventDetail', {
                      name: item?.title,
                      date: item?.eventDate,
                      time: item?.eventTime,
                      image: item?.image,
                      location: item?.eventLocation,
                      description: item?.description,
                      organizationName: item?.organizationName,
                      instagram: item?.instagram,
                      website: item?.website,
                      category: item?.category,
                      link: item?.link,
                      postId: item?._id,
                      eventEndTime: item?.eventEndTime,
                      campus: item?.campus,
                    })
                  }
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <MaterialCommunityIcons
                    name="bookmark"
                    data={safePosts}
                    size={wp(6)}
                    color={
                      arrayOfSafePosts.includes(item._id)
                        ? '#682BF7'
                        : '#FFFFFF'
                    }
                    alignItems="center"
                    paddingBottom={hp(1)}
                  />
                  <View>
                    <Text
                      style={{
                        fontSize: wp(4),
                        fontWeight: '700',
                        width: wp(51),
                        color: '#000000',
                      }}
                      numberOfLines={1}>
                      {item?.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: wp(3.5),
                        fontWeight: '300',
                        color: 'grey',
                      }}
                      numberOfLines={1}>
                      {convertTo12HourFormat(item?.eventTime)}
                      {item?.eventEndTime
                        ? ` - ${convertDateString(item.eventEndTime)}`
                        : ''}
                    </Text>
                  </View>
                  <View style={styles.todayButton}>
                    <Text
                      style={{color: 'white', fontWeight: 'bold'}}
                      numberOfLines={1}>
                      {item?.category}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              dataLoader ? (
                <View
                  style={{
                    width: wp(90),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator color={'grey'} size={'large'} />
                </View>
              ) : (
                <View
                  style={{
                    marginTop: hp(2),
                    marginBottom: hp(3),
                    marginLeft: wp(4),
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: wp(4.5),
                      width: wp(80),
                    }}>
                    Nothing spotted for today 😣
                  </Text>
                </View>
              )
            }
          />
        </View>

        <View style={styles.SavedPostContainer}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: wp(2),
              alignItems: 'center', // Center items vertically
            }}>
            <MaterialCommunityIcons name="fire" size={wp(6)} color="#682BF7" />
            <Text style={styles.TodayText1}>Trending</Text>
          </View>
          <FlatList
            data={data.hotestPosts}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: hp(1),
              paddingTop: hp(0.4),
              paddingHorizontal: wp(2),
            }}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.scannedImage1}
                onPress={() =>
                  navigation.navigate('EventDetail', {
                    name: item?.title,
                    date: item?.eventDate,
                    time: item?.eventTime,
                    image: item?.image,
                    location: item?.eventLocation,
                    description: item?.description,
                    organizationName: item?.organizationName,
                    instagram: item?.instagram,
                    website: item?.website,
                    category: item?.category,
                    link: item?.link,
                    postId: item?._id,
                    eventEndTime: item?.eventEndTime,
                    campus: item?.campus,
                  })
                }>
                <Image
                  source={{
                    uri: `${baseUrlPicture}/${item?.image}`,
                  }}
                  height={hp(12.5)}
                  width={wp(21)}
                  style={{borderRadius: 10}}
                />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              dataLoader ? (
                <View
                  style={{
                    width: wp(90),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator color={'grey'} size={'large'} />
                </View>
              ) : (
                <View
                  style={{
                    marginTop: hp(2),
                    marginBottom: hp(3),
                    marginLeft: wp(2),
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: wp(4.5),
                      width: wp(80),
                    }}>
                    Enjoy your break 🥳
                  </Text>
                </View>
              )
            }
            horizontal={true}
          />
        </View>

        <View style={styles.SavedPostContainer}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: wp(2),
              alignItems: 'center', // Center items vertically
            }}>
            <MaterialCommunityIcons
              name="bookmark"
              size={wp(6)}
              color="#682BF7"
            />
            <Text style={styles.TodayText1}>Saved Posts</Text>
          </View>
          <FlatList
            data={safePosts}
            numColumns={3}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: hp(1),
              paddingTop: hp(0.4),
              paddingHorizontal: wp(2),
            }}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.scannedImage2}
                onPress={() =>
                  navigation.navigate('EventDetail', {
                    name: item?.postId?.title,
                    date: item?.postId?.eventDate,
                    time: item?.postId?.eventTime,
                    image: item?.postId?.image,
                    location: item?.postId?.eventLocation,
                    description: item?.postId?.description,
                    organizationName: item?.postId?.organizationName,
                    instagram: item?.postId?.instagram,
                    website: item?.postId?.website,
                    category: item?.postId?.category,
                    postId: item?.postId?._id,
                    eventEndTime: item?.postId?.eventEndTime,
                    campus: item?.campus,
                  })
                }>
                <Image
                  source={{
                    uri: `${baseUrlPicture}/${item?.postId?.image}`,
                  }}
                  height={hp(12.5)}
                  width={wp(22)}
                  style={{borderRadius: 10}}
                />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              safePostLoader ? (
                <View
                  style={{
                    width: wp(90),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator color={'grey'} size={'large'} />
                </View>
              ) : (
                <View
                  style={{
                    marginTop: hp(2),
                    marginBottom: hp(3),
                    marginLeft: wp(2),
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: wp(4.5),
                      width: wp(80),
                    }}>
                    Save your favorite posts 😁
                  </Text>
                </View>
              )
            }
            vertical={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HottestPosts;

const styles = StyleSheet.create({
  container: {
    paddingBottom: hp(2),
    backgroundColor: '#F5F5F5',
    paddingHorizontal: wp(5),
  },
  textHeading: {
    fontSize: wp(7),
    color: '#682BF7',
    fontWeight: '600',
    marginTop: hp(1),
    marginLeft: wp(2),
  },
  TodayContainer: {
    backgroundColor: 'white',
    marginTop: hp(2),
    borderRadius: wp(3),
    elevation: 5,
  },
  TodayText: {
    fontSize: wp(5.5),
    color: 'black',
    fontWeight: 'bold',
    paddingVertical: hp(1),
    marginLeft: wp(2),
  },
  TodayText1: {
    fontSize: wp(5),
    color: 'black',
    fontWeight: '600',
    paddingVertical: hp(1),
    marginLeft: wp(0.5),
  },
  todayButton: {
    backgroundColor: '#682BF7',
    borderRadius: wp(50),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(1),
    width: wp(25),
    paddingHorizontal: wp(2),
  },
  HottestContainer: {
    backgroundColor: 'white',
    marginTop: hp(2),
    borderRadius: wp(3),
    elevation: 5,
    height: hp(20),
  },
  scannedImage1: {
    paddingHorizontal: wp(2),
    paddingBottom: hp(1),
  },
  scannedImage2: {
    paddingHorizontal: wp(2),
    paddingBottom: hp(1),
  },
  SavedPostContainer: {
    backgroundColor: 'white',
    marginTop: hp(2),
    borderRadius: wp(3),
    elevation: 5,
  },
});
