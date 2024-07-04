import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  PermissionsAndroid,
  Dimensions,
  Pressable,
  Modal,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import ImageCropPicker from 'react-native-image-crop-picker';
import {COLORS, baseUrl} from '../utils/Constant';
import ImagePickerModal from '../components/ImagePickerModal';
import AuthContext from '../context/auth';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from '../utils/axios';
import analytics from '@react-native-firebase/analytics';

const Report2Screen = ({route}) => {
  const [loading, setLoading] = useState(false);
  const [state] = useContext(AuthContext);
  console.log('state', state.user._id);
  const navigation = useNavigation();
  const {report1Content = ''} = route.params;
  const [imageURI, setImageURI] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [report2Content, setReport2Content] = useState({
    organizationName: report1Content?.organizationName,
    body: report1Content?.body,
    image: '',
    postedBy: state.user._id,
  });

  // const handleImagePicker = () => {
  //   ImagePicker.openPicker({
  //     width: 300,
  //     height: 300,
  //     compressImageQuality: 0.7,
  //     cropping: true,
  //   })
  //     .then(response => {
  //       setImageURI(response.path);
  //     })
  //     .catch(error => {
  //       console.log('ImagePicker Error: ', error);
  //     });
  // };

  // const handlePost = async () => {
  //   try {
  //     const formData = new FormData();

  //     formData.append('image', {
  //       uri: imageURI,
  //       name: 'image.jpg',
  //     });
  //     const response = await axios.post(
  //       'http://192.168.10.6:8000/api/upload',
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data', // Important to set the appropriate content type for FormData
  //         },
  //       },
  //     );

  //     console.log('respnse===>', response);

  //     if (response.data.error) {
  //       alert(response.data.error);
  //     } else {
  //       console.log('response===>', response);
  //       navigation.navigate('Report8');
  //       /*alert("Navigating");*/
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     alert('An error occurred during login');
  //   }
  // };

  const handleImagePicker = () => {
    setModalVisible(true);
  };

  const openCamera = async () => {
    try {
      if (Platform.OS == 'ios') {
        ImageCropPicker.openCamera({
          // width: 400, // Set the desired width for the image
          // height: 400, // Set the desired height for the image
          cropping: false,
        })
          .then(response => {
            setImageURI(response);
            // setReport2Content({...report2Content, image: response.path});
          })
          .catch(error => {
            console.log('ImagePicker Error: ', error);
          });
      } else {
        const cameraGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission Required',
            message: 'App needs access to your camera to take photos.',
          },
        );

        if (cameraGranted === PermissionsAndroid.RESULTS.GRANTED) {
          ImageCropPicker.openCamera({
            // width: 300, // Set the desired width for the image
            // height: 300, // Set the desired height for the image
            cropping: false,
            compressImageQuality: 0.7, // Set the desired compression quality (adjust as per your requirement)
          })
            .then(response => {
              setImageURI(response);
              // setReport2Content({...report2Content, image: response.path});
            })
            .catch(error => {
              console.log('ImagePicker Error: ', error);
            });
        } else {
          console.log('Camera Permission Denied.');
        }
      }
    } catch (err) {
      console.warn(err);
    }
    // setModalVisible(false);
  };

  const openGallery = async () => {
    const permisionBasedOnAndroidVersion =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    try {
      if (Platform.OS == 'ios') {
        ImageCropPicker.openPicker({
          // width: 300, // Set the desired width for the image
          // height: 300, // Set the desired height for the image
          cropping: false,
          compressImageQuality: 0.7, // Set the desired compression quality (adjust as per your requirement)
        })
          .then(response => {
            setImageURI(response);
            // setReport2Content({...report2Content, image: response.path});
          })
          .catch(error => {
            console.log('ImagePicker Error: ', error);
          });
      } else {
        const galleryGranted = await PermissionsAndroid.request(
          permisionBasedOnAndroidVersion,
          {
            title: 'Camera Permission Required',
            message: 'App needs access to your camera to take photos.',
          },
        );

        if (galleryGranted === PermissionsAndroid.RESULTS.GRANTED) {
          ImageCropPicker.openPicker({
            // width: 300, // Set the desired width for the image
            // height: 300, // Set the desired height for the image
            cropping: false,
            compressImageQuality: 0.7, // Set the desired compression quality (adjust as per your requirement)
          })
            .then(response => {
              setImageURI(response);
              // setReport2Content({...report2Content, image: response.path});
            })
            .catch(error => {
              console.log('ImagePicker Error: ', error);
            });
        } else {
          console.log('Camera Permission Denied.');
        }
      }
    } catch (err) {
      console.warn(err);
    }
    // setModalVisible(false);
  };

  const createImagesFormData = async (images = [], key = 'image', body) => {
    try {
      console.log(images, key, body);
      const data = new FormData();
      if (images) {
        const name =
          images?.filename ||
          images?.path.substring(
            images?.path.lastIndexOf('/') + 1,
            images?.path.length,
          );
        const type = images.mime;
        const uri = images?.path;
        console.log('appepnding');
        console.log('name', name);
        console.log('type', type);
        console.log('uri', uri);

        data.append(key, {name, type, uri});
        // });
      }
      return data;
    } catch (err) {
      console.log(err);
      return {
        error: {
          message: err?.message,
        },
        success: false,
      };
    }
  };

  const uploadPhotoApicode = async () => {
    console.log('ccccc', imageURI);
    setLoading(true);
    const imageData = await createImagesFormData(imageURI, 'image', {});
    // console.log('image data', imageData?._parts[0][1]);
    //if the image is object then it should be JSONSTRINGIFY
    try {
      // if the image is object then itshould be JSONSTRINGIFY

      // const response = await fetch(`${baseUrl}/upload`, {
      //   method: 'post', // or 'PUT'
      //   body: imageData,
      //   headers: {
      //     'content-type': 'multipart/form-data',
      //   },
      // });
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${state.token}`,
        },
        method: 'post',
        data: imageData,
        url: `${baseUrl}/upload`,
      };
      const res = await axios(config);

      // handle success
      navigation.navigate('Report3', {
        report2Content: {...report2Content, image: res?.data?.filePath},
      });
    } catch (error) {
      // handle error
      let message = error?.message || error?.data?.message;
      console.log('message', message, error.response);
      console.log(error);
      alert(message);
    }
    setLoading(false);
  };

  const nextHandler = () => {
    if (imageURI) {
      uploadPhotoApicode();
    } else {
      alert('Select a Picture to Continue');
    }
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
    <SafeAreaView style={{paddingHorizontal: wp(4)}}>
      {/* <ScrollView> */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{marginTop: hp(2)}}>
        <Entypo name="chevron-with-circle-left" size={wp(8)} color="black" />
      </TouchableOpacity>
      <ImagePickerModal
        isVisible={isModalVisible}
        setVisible={setModalVisible}
        onCameraPress={openCamera}
        onImageLibraryPress={openGallery}
      />
      <Text style={styles.title1}>
        Now let&apos;s upload an image of the giveaway
      </Text>
      <Pressable onPress={handleImagePicker}>
        {imageURI ? (
          <Image source={{uri: imageURI.path}} style={styles.card} />
        ) : (
          <View style={styles.card}>
            <Text style={styles.title3}>Click Here</Text>
            <Text style={styles.title3}>To Upload One Image</Text>
          </View>
        )}
      </Pressable>
      {/* <View style={styles.buttonstyle}> */}
      {loading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => {
            nextHandler();
            // uploadPhotoApicode();
          }}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      )}
      {/* </View> */}
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default Report2Screen;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  modalContainer: {
    // alignSelf: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',

    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    paddingVertical: 20,
  },
  cross: {
    position: 'absolute',
    right: 0,
    top: -15,
    fontSize: 30,

    color: 'red',
  },
  option: {},
  optionText: {
    fontSize: 20,
    color: 'black',
  },

  title1: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: 'black',
    marginTop: hp(2),
    marginHorizontal: wp(0.5),
    marginBottom: hp(2),
  },

  card: {
    backgroundColor: 'black',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(55),
    marginBottom: hp(3),
  },

  title2: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    paddingLeft: 15,
    marginBottom: hp(2),
  },

  title3: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
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

  textAreaContainer: {
    borderColor: 'grey',
    borderWidth: 1,
    color: COLORS.primary,

    padding: 5,
    borderRadius: 8,
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    textAlignVertical: 'top',
    //in ios, it should be multiline={true},
    paddingTop: 10,
    paddingLeft: 10,
  },
  buttonStyle: {
    backgroundColor: '#0C0C52',
    justifyContent: 'center',
    borderRadius: 15,
    paddingVertical: hp(1),
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: wp(4.5),
  },
});
