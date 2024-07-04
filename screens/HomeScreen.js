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
} from 'react-native';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import DraggableBottomSheet from '../components/DraggableBottomSheet';
import PropertyCard from '../components/PropertyCard';
import axios from '../utils/axios';
import {COLORS, baseUrl} from '../utils/Constant';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import io from 'socket.io-client';
import {cleanSingle} from 'react-native-image-crop-picker';
import AuthContext from '../context/auth';
import {APP_VERSION} from '../components/appconfig';
import {
  GetFCMToken,
  NotificationListener,
  requestAndroidUserPermission,
  requestUserPermission,
} from '../utils/PushNotification_Helper';
import {usePushNotificationIos} from '../utils/usePushNotifcation_ios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {stat} from 'react-native-fs';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropertyCardGrid from '../components/PropertyCardGrid';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import analytics from '@react-native-firebase/analytics';

const HomeScreen = () => {
  // const socket = io();
  const [socket, setSocket] = useState(null);
  const route = useRoute();
  const [refreshing, setRefreshing] = useState(false);
  const [popUpNotification, setPopUpNotification] = useState({
    data: null,
    status: false,
  });
  const [state, setState] = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [gridPosts, setGridPosts] = useState([]);
  const [openSheet, setOpenSheet] = useState(false);

  const navigation = useNavigation();
  let space = hp(5);
  usePushNotificationIos(navigation);

  const [isModalOpen, setModalOpen] = useState(false);

  console.log('state', state);
  const [selectedOption, setSelectedOption] = useState(state.postView);

  const handleOptionPress = async option => {
    setSelectedOption(option);
    setState({
      ...state,
      listView: option,
    });
    await AsyncStorage.setItem('postView', option);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleButton1Press = () => {
    handleCloseModal();
    navigation.navigate('Report1');
  };

  const handleButton2Press = () => {
    handleCloseModal();
    navigation.navigate('Report9');
  };

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const triggerHapticFeedback = () => {
    ReactNativeHapticFeedback.trigger('impactMedium', options);
  };

  const triggerSlideHapticFeedback = () => {
    ReactNativeHapticFeedback.trigger('soft', options);
  };

  const getPosts = async isSocket => {
    try {
      const response = await axios.get(`${baseUrl}/postFeed`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      let responseFilteredPosts = [];
      if (state?.filteredCategories.length != 0) {
        const queryParams = state?.filteredCategories
          ?.map((category, index) => `categories[${index}]=${category}`)
          ?.join('&');

        console.log('queryParamsd', queryParams);

        const locationFilter =
          state.locationFilter == 'north' ? 'isNorth=true' : 'isCentral=true';

        if (state.locationFilter == 'all') {
          responseFilteredPosts = await axios.get(
            `${baseUrl}/getFilteredPosts?${queryParams}`,
          );
          responseFilteredPosts = responseFilteredPosts?.data?.posts;
        } else {
          responseFilteredPosts = await axios.get(
            `${baseUrl}/getFilteredPosts?${queryParams}&${locationFilter}`,
          );
          responseFilteredPosts = responseFilteredPosts?.data?.posts;
        }
      }

      if (response.data) {
        setPosts([
          {check: 'filtered'},
          ...responseFilteredPosts,
          {check: 'all'},
          ...response?.data?.posts,
        ]);
        if (responseFilteredPosts.length == 0) {
          setGridPosts([
            {check: 'all'},
            {check: 'all1'},
            {check: 'all2'},
            ...response?.data?.posts,
          ]);
        } else if (responseFilteredPosts.length % 3 == 0) {
          setGridPosts([
            {check: 'filtered'},
            {check: 'filtered1'},
            {check: 'filtered2'},
            ...responseFilteredPosts,
            {check: 'all'},
            {check: 'all1'},
            {check: 'all2'},
            ...response?.data?.posts,
          ]);
        } else if (responseFilteredPosts.length % 3 == 1) {
          setGridPosts([
            {check: 'filtered'},
            {check: 'filtered1'},
            {check: 'filtered2'},
            ...responseFilteredPosts,
            {check: 'allForNothing1'},
            {check: 'allForNothing2'},

            {check: 'all'},
            {check: 'all1'},
            {check: 'all2'},
            ...response?.data?.posts,
          ]);
        }
        if (responseFilteredPosts.length % 3 == 2) {
          setGridPosts([
            {check: 'filtered'},
            {check: 'filtered1'},
            {check: 'filtered2'},
            ...responseFilteredPosts,
            {check: 'allFOrNothing'},

            {check: 'all'},
            {check: 'all1'},
            {check: 'all2'},
            ...response?.data?.posts,
          ]);
        }
      }
    } catch (err) {
      console.log('error', err);
    }
  };

  const [tokenTrigger, setTokenTrigger] = useState(false);

  const saveUserToken = async () => {
    Platform.OS == 'ios'
      ? await requestUserPermission()
      : await requestAndroidUserPermission();
    const token = await GetFCMToken();
    if (token == null) {
      return;
    }
    console.log('token', token);
    console.log('state', state?.user?._id);
    if (!token) {
      return setTokenTrigger(!tokenTrigger);
    }
    if (token && state?.user?._id) {
      try {
        const res = await axios.post(
          `${baseUrl}/user/saveToken`,
          {
            userId: state?.user?._id,
            token: token,
          },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          },
        );
        // console.log('res', res?.data);
        if (!res?.data?.status) {
          console.log('There was some error in subscribing to notifications');
        }
      } catch (err) {
        Alert.alert(
          'Notification',
          'There was some error in subscribing to notifications, Will try again later',
        );
      }
    }
  };

  useEffect(() => {
    NotificationListener(navigation);
    saveUserToken();
  }, [tokenTrigger]);

  useEffect(() => {
    console.log('getting posts');
    getPosts();
    getBannerStatus();
  }, [state?.filteredCategories, state?.locationFilter]);

  useEffect(() => {
    const compareVersions = (v1, v2) => {
      const v1Parts = v1.split('.').map(Number);
      const v2Parts = v2.split('.').map(Number);

      for (let i = 0; i < v1Parts.length; ++i) {
        if (v2Parts.length === i) {
          return true;
        }

        if (v1Parts[i] === v2Parts[i]) {
          continue;
        } else if (v1Parts[i] > v2Parts[i]) {
          return false;
        } else {
          return true;
        }
      }

      return false;
    };

    const checkVersionAndUpdate = async () => {
      const storedVersion = await AsyncStorage.getItem('appVersion');
      if (
        storedVersion === null ||
        compareVersions(storedVersion, APP_VERSION)
      ) {
        await AsyncStorage.setItem('appVersion', APP_VERSION);
        navigation.navigate('WhatsNew');
      }
    };

    checkVersionAndUpdate();
  }, []);

  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Home',
        screen_class: 'HomeScreen',
      });
    } catch (e) {
      console.log({e});
    }
  };

  useEffect(() => {
    firebaseAnalyticsLog();
  }, []);

  const updateGridViewOrListView = async () => {
    try {
      await analytics().logScreenView({
        screen_name: selectedOption == 'grid' ? 'Grid View' : 'Feed View',
        screen_class: selectedOption == 'grid' ? 'Grid View' : 'Feed View',
      });
    } catch (e) {
      console.log('error', e);
    }
  };

  useEffect(() => {
    updateGridViewOrListView();
  }, [selectedOption]);

  const getBannerStatus = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getBannerNotifications`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      // console.log(response.data);
      if (response?.data?.status) {
        setPopUpNotification(response?.data);
      } else {
        setPopUpNotification({
          data: null,
          status: false,
        });
      }
    } catch (err) {
      console.log('BANNER ERROR', {err});
    }
  };

  const [arrayOfSafePosts, setarrayOfSafePosts] = useState([]);
  const [arrayOfSafePostsIdtoDelete, setarrayOfSafePostsId] = useState([]);
  const getSafePostsData = async () => {
    const response = await axios
      .get(`${baseUrl}/getPosts`, {
        params: {
          userId: state?.user?._id,
        },
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      })
      .then(item => item?.data);
    console.log('safePosts', response?.data);
    let onlyId = response?.data?.map(item => item?.postId?._id);
    let IdForDelete = response?.data?.map(item => item?._id);
    setarrayOfSafePosts(onlyId);
    setarrayOfSafePostsId(IdForDelete);
  };
  const [trigger, setTrigger] = useState(false);
  useEffect(() => {
    getSafePostsData();
  }, [trigger, state?.safeAndUnsafePostTrigger]);

  const handleSocket = data => {
    try {
      console.log('==9999999999>', data);
      getPosts();
    } catch (error) {
      console.log('ERROROROROROOROROR', error);
    }
  };

  useEffect(() => {
    const socket = io('https://api.thisismdex.com', {
      transports: ['websocket'],
      autoConnect: true,
    });
    socket.on('connect', () => {
      console.log('connected');
    });
    socket.on('connect_error', error => {
      console.log('error', error);
      console.log('error', error?.message);
    });

    socket.on('postApprove', handleSocket);

    return () => {
      socket.off('postApprove', handleSocket);
      console.log('disconect');
      socket.disconnect();
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);

    // Perform your data fetching logic here
    await getPosts();
    setRefreshing(false);
  };
  // Keep status bar visible for home screen!
  const {top, bottom} = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        marginBottom: Platform.OS == 'android' ? -30 : 0,
      }}>
      <StatusBar hidden={false} />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.pinkLocationTag}
          onPress={() => {
            triggerSlideHapticFeedback();
            navigation.navigate('Map'); //NotificationScreen
          }}>
          <MaterialCommunityIcons
            name={'bell-outline'}
            size={widthPercentageToDP(6.5)}
            color="#FFFFFF"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.rowContainer}>
          <TouchableWithoutFeedback onPress={() => handleOptionPress('grid')}>
            <View
              style={[
                styles.optionContainer,
                selectedOption === 'grid' && styles.selectedOption,
              ]}>
              <Text style={styles.optionText}>Grid</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => handleOptionPress('feed')}>
            <View
              style={[
                styles.optionContainer,
                selectedOption === 'feed' && styles.selectedOption,
              ]}>
              <Text style={styles.optionText}>Feed</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Pressable
          style={styles.pinkLocationTag}
          onPress={() => {
            triggerSlideHapticFeedback();
            navigation.navigate('Filters');
          }}>
          <MaterialCommunityIcons
            name={'tune-variant'}
            size={wp(6)}
            color="#FFFFFF"
            resizeMode="contain"
          />
        </Pressable>
      </View>
      {popUpNotification.status && popUpNotification.data && (
        <View style={styles.popUpAlert}>
          <Text
            style={{
              marginLeft: 15,
              fontWeight: 'bold',
              color: 'white',
              fontSize: wp(4.5),
            }}>
            ALERT: {popUpNotification.data.message}
          </Text>
        </View>
      )}
      <View style={{height: hp(0.1), backgroundColor: '#F5F5F5'}} />
      <View style={{}}>
        {selectedOption == 'grid' ? (
          <FlatList
            key={'_'}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: '#F5F5F5'}}
            data={gridPosts}
            numColumns={3}
            scrollEnabled={true}
            renderItem={({item, index}) =>
              state.reportPost.includes(item._id) ? null : item?.check ==
                'filtered' ? (
                <View
                  key={index}
                  style={{
                    backgroundColor: '#F5F5F5',
                    paddingVertical: hp(1),
                    paddingHorizontal: wp(4),
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons
                    name="heart"
                    color={'grey'}
                    disabled
                    size={wp(5)}
                  />
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'grey',
                      fontSize: wp(4),
                      marginLeft: wp(2),
                    }}>
                    Filtered Feed
                  </Text>
                </View>
              ) : item?.check == 'all' ? (
                <View
                  key={index}
                  style={{
                    backgroundColor: '#F5F5F5',
                    paddingVertical: hp(1),
                    paddingHorizontal: wp(4),
                    marginTop: hp(-4),
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'grey',
                      fontSize: wp(4),
                      marginTop: hp(4),
                    }}>
                    ALL
                  </Text>
                  <View
                    style={{
                      height: 0.4,
                      backgroundColor: 'black',
                      width: '100%',
                      marginVertical: 10,
                    }}
                  />
                </View>
              ) : item?.check &&
                (item?.check.includes('filtered') ||
                  item?.check.includes('all')) ? (
                <View style={{width: wp(30)}}></View>
              ) : (
                <PropertyCardGrid
                  key={index}
                  name={item?.title}
                  date={item?.eventDate}
                  time={item?.eventTime}
                  location={item?.eventLocation}
                  image={item?.image}
                  instagram={item?.instagram}
                  website={item?.website}
                  organizationName={item?.organizationName}
                  description={item?.description}
                  navigation={navigation}
                  postedById={item?.postedBy?._id}
                  userId={state?.user?._id}
                  postId={item?._id}
                  category={item?.category}
                  arrayOfSafePosts={arrayOfSafePosts}
                  setTrigger={setTrigger}
                  trigger={trigger}
                  arrayOfSafePostsIdtoDelete={arrayOfSafePostsIdtoDelete}
                  link={item?.link}
                  eventEndTime={item?.eventEndTime}
                  campus={item?.campus}
                />
              )
            }
            ListFooterComponent={() => (
              <View style={{marginBottom: heightPercentageToDP(20)}} />
            )}
          />
        ) : (
          <FlatList
            key={'#'}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: '#F5F5F5'}}
            contentContainerStyle={
              {
                // paddingBottom: space - hp(55)
              }
            }
            data={posts}
            // keyExtractor={(item, index) => index.toString()}
            scrollEnabled={true}
            renderItem={({item, index}) =>
              state.reportPost.includes(item._id) ? null : item?.check ==
                'filtered' ? (
                <View
                  key={index}
                  style={{
                    backgroundColor: '#F5F5F5',
                    paddingVertical: hp(1),
                    paddingHorizontal: wp(4),
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons
                    name="heart"
                    color={'grey'}
                    disabled
                    size={wp(5)}
                  />
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'grey',
                      fontSize: wp(4),
                      marginLeft: wp(2),
                    }}>
                    Filtered Feed
                  </Text>
                </View>
              ) : item?.check == 'all' ? (
                <View
                  key={index}
                  style={{
                    backgroundColor: '#F5F5F5',
                    paddingVertical: hp(1),
                    paddingHorizontal: wp(4),
                    marginTop: hp(-4),
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'grey',
                      fontSize: wp(4),
                    }}>
                    ALL
                  </Text>
                  <View
                    style={{
                      height: 0.4,
                      backgroundColor: 'black',
                      width: '100%',
                      marginVertical: 10,
                    }}
                  />
                </View>
              ) : (
                <PropertyCard
                  key={index}
                  name={item?.title}
                  date={item?.eventDate}
                  time={item?.eventTime}
                  location={item?.eventLocation}
                  image={item?.image}
                  instagram={item?.instagram}
                  website={item?.website}
                  organizationName={item?.organizationName}
                  description={item?.description}
                  navigation={navigation}
                  postedById={item?.postedBy?._id}
                  userId={state?.user?._id}
                  postId={item?._id}
                  category={item?.category}
                  arrayOfSafePosts={arrayOfSafePosts}
                  setTrigger={setTrigger}
                  trigger={trigger}
                  arrayOfSafePostsIdtoDelete={arrayOfSafePostsIdtoDelete}
                  link={item?.link}
                  eventEndTime={item?.eventEndTime}
                  campus={item?.campus}
                />
              )
            }
            ListFooterComponent={() => (
              <View style={{marginBottom: heightPercentageToDP(20)}} />
            )}
          />
        )}
      </View>
      {/* <BottomSheet
        index={0}
        snapPoints={[hp(10), "100%"]}
        animateOnMount={false}
        onChange={() => setOpenSheet(!openSheet)}
        style={styles.bottomSheet}
        handleComponent={() =>
          <View style={[styles.dragHandle, { opacity: openSheet ? 0 : 1}]} />
        }
        >
        <DraggableBottomSheet trigger={trigger} openSheet={openSheet} />
      </BottomSheet> */}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: wp(4),
    paddingTop: hp(0.4),
    paddingBottom: hp(0.1),
    marginRight: wp(4),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  optionContainer: {
    paddingTop: hp(2),
    paddingBottom: hp(0.5),
  },
  optionText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: wp(5),
    paddingHorizontal: wp(4),
  },
  selectedOption: {
    borderBottomWidth: 1.5,
    borderBottomColor: 'black',
  },

  image: {
    width: wp(26),
    height: wp(8),
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -wp(13),
    marginTop: -wp(2),
  },
  headerStyle: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: 'transparent',
    height: 100,
  },
  headerRightContainer: {
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: '5%',
  },
  button: {
    width: wp(10),
    height: wp(10),
    borderRadius: hp(5),
    backgroundColor: '#E64980',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText1: {
    color: '#000000',
    fontSize: wp(7.5),
    fontWeight: 'bold',
    textAlign: 'left',
  },
  buttonParagraph: {
    color: '#000000',
    fontSize: wp(3.6),
    textAlign: 'left',
    marginTop: hp(0.5),
  },
  buttonText2: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    marginHorizontal: wp(4),
  },
  modalButton: {
    marginBottom: 20,
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },

  buttonBox: {
    marginLeft: '3%',
    marginRight: '3%',
    width: '94%',
    paddingTop: 12,
    paddingBottom: 25,
    paddingLeft: 6,
    paddingRight: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: wp(1),
    borderColor: '#000000',
    borderRadius: 20,
  },
  closeButton: {
    width: wp(8),
    height: wp(8),
    borderRadius: 100,
    backgroundColor: 'red',
    marginBottom: 10,
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    marginRight: 15,
    marginTop: 15,
  },
  popUpAlert: {
    backgroundColor: '#E64980',
    paddingHorizontal: wp(3),
    paddingVertical: hp(2),
    borderRadius: 15,
    marginHorizontal: wp(5),
    marginBottom: hp(1),
    marginTop: hp(1),
  },
  bottomSheet: {
    ...Platform.select({
      android: {elevation: 3},
      ios: {
        shadowColor: '#a8bed2',
        shadowOpacity: 1,
        shadowRadius: 6,
        shadowOffset: {
          width: 2,
          height: 2,
        },
      },
    }),
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  dragHandle: {
    width: 120,
    height: 6,
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
    alignSelf: 'center',
    paddingVertical: 4,
    marginTop: hp(1),
    marginBottom: hp(1),
  },

  pinkLocationTag: {
    backgroundColor: '#682BF7',
    borderRadius: 1000,
    width: wp(11),
    height: wp(11),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
