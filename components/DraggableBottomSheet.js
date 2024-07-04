import {
  Animated,
  PanResponder,
  Platform,
  StyleSheet,
  View,
  Text,
  Image,
  Modal,
  Alert,
  Pressable,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useRef} from 'react';
import {WINDOW_HEIGHT} from '.';
import AuthContext from '../context/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import axios from '../utils/axios';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {COLORS, baseUrl, baseUrlPicture} from '../utils/Constant';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DraggableBottomSheet = ({trigger, openSheet}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [state, setState] = useContext(AuthContext);

  const signOut = async () => {
    const res = await axios.post(`${baseUrl}/user/saveToken`, {
      userId: state?.user?._id,
      token: '',
    },{
      headers: {
        Authorization: `Bearer ${state.token}`
      }
    }).catch(err => {
      
    })
    console.log({res});
    setState({...state, token: '', user: null, reportPost: []});
    await AsyncStorage.removeItem('auth-rn');
    await AsyncStorage.removeItem('reportPost');
  };

  useEffect(() => {
    if (state && state.user) {
      const {name, email, role} = state.user;
      setName(name);
      setEmail(email);
      setRole(role);
    }
  }, [state]);

  const handleSubmit = async () => {
    if (email === '' || password === '') {
      alert('All fields are required');
      return;
    }
    const resp = await axios.post('http://localhost:800/api/signin', {
      email,
      password,
    },{
      headers: {
        Authorization: `Bearer ${state.token}`
      }
    });
    if (resp.data.error) alert(resp.data.error);
    else {
      setState(resp.data);
      await AsyncStorage.setItem('auth-rn', JSON.stringify(resp.data));
      alert('Sign in Successful');
    }
  };

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setNewPassword('');
    setCurrentPassword('');
    setNewPasswordAgain('');
    setModalOpen(false);
  };

  const handleButton1Press = () => {
    handleCloseModal();
  };

  const [safePosts, setSafePosts] = useState([]);

  const getPosts = async () => {
    const response = await axios
      .get(`${baseUrl}/getPosts`, {
        params: {
          userId: state?.user?._id,
        },
        headers: {
          Authorization: `Bearer ${state.token}`
        }
      })
      .then(item => item.data);
    setSafePosts(response?.data);
  };

  const navigation = useNavigation();

  useEffect(() => {
    getPosts();
  }, [trigger]);

  const opacityValue = new Animated.Value(openSheet ? 0 : 1);
  const scaleValue = new Animated.Value(1);

  useEffect(() => {
    if (openSheet) {
      Animated.parallel([
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 0,
          friction: 10,
          tension: 1,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300,
          speed: 5,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 10,
          tension: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [openSheet]);


  console.log('opensheet', openSheet);
  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        {(
          <Animated.View style={[styles.downContainer, { 
            opacity: opacityValue,
            transform: [{ scale: scaleValue }],
          }]}>
            <Text style={styles.greetingTextDown}>
              {true ? `Hello, ${name}!` : ''}
            </Text>
            {true && (
              <Image
                source={require('./ProfilePicture.png')}
                style={styles.profilePictureDown}
                resizeMode="contain"
              />
            )}
          </Animated.View>
        )}
        <View style={styles.cogContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={{
              paddingVertical: hp(1),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialCommunityIcons
              name={'cog'}
              size={widthPercentageToDP(9)}
              color="#682BF7"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.topContainer}>
          <LinearGradient
            colors={['#87f1ff', '#0C0C52']}
            locations={[0, 0.4]}
            style={styles.circle}>
            <Text style={styles.profileNameStyle}>{name}</Text>
          </LinearGradient>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <Text style={styles.logOutText}>Log out</Text>
        </TouchableOpacity>
        <Text style={styles.bottomTitle} numberOfLines={1}>
          Saved Posts:{' '}
        </Text>
        <FlatList
          data={safePosts}
          contentContainerStyle={{
            paddingHorizontal: widthPercentageToDP(3),
          }}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.scannedImage1}
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
                  eventEndTime: item?.postId?.eventEndTime,
                })
              }>
              <Image
                source={{
                  uri: `${baseUrlPicture}/${item?.postId?.image}`,
                }}
                height={heightPercentageToDP(12)}
                width={widthPercentageToDP(20)}
                style={{borderRadius: 10}}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View
              style={{marginTop: hp(1), marginLeft: widthPercentageToDP(2)}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: widthPercentageToDP(4.5),
                  width: widthPercentageToDP(80),
                }}>
                No posts saved, Yet!
              </Text>
            </View>
          }
          horizontal={true}
        />
        <Text style={styles.bottomText}>Notifications for saved posts coming soon!</Text>
      </View>
    </View>
  );
};

export default DraggableBottomSheet;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  circle: {
    height: hp(20),
    aspectRatio: 1,
    borderRadius: hp(20),
    alignItems: 'center',
    justifyContent: 'center',
  },

  cogContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: widthPercentageToDP(5),
  },

  draggableArea: {
    width: '100%',
    height: 37,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  downContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: widthPercentageToDP(5),
    marginBottom: heightPercentageToDP(3),
    paddingVertical: heightPercentageToDP(0.5),
  },
  greetingTextDown: {
    fontSize: widthPercentageToDP(6),
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  profilePictureDown: {
    height: hp(5),
    width: hp(10),
  },

  topContainer: {
    height: hp(20),
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileNameStyle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  bottomTitle: {
    color: '#000000',
    fontSize: widthPercentageToDP(4.5),
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    marginLeft: widthPercentageToDP(5),
    marginTop: hp(2),
  },

  bottomText: {
    color: '#000000',
    fontSize: widthPercentageToDP(3.2),
    alignSelf: 'flex-start',
    marginLeft: widthPercentageToDP(5),
    marginTop: hp(1.5),
  },

  scannedImage1: {
    paddingHorizontal: widthPercentageToDP(2),
    marginTop: hp(2),
  },

  signOutButton: {
    backgroundColor: 'red',
    alignSelf: 'center',
    paddingHorizontal: widthPercentageToDP(4),
    paddingVertical: hp(1),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(2),
  },

  logOutText: {
    color: '#FFFFFF',
    fontSize: widthPercentageToDP(3.7),
    fontWeight: 'bold',
  },
});
