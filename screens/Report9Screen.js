import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Button,
  TextInput,
  Dimensions,
  PermissionsAndroid,
  Modal,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import main_img from '../images/umich_swags.jpg';
import {useNavigation} from '@react-navigation/native';
import ImageCropPicker, {cleanSingle} from 'react-native-image-crop-picker';
import {SHADOW} from '../context/theme';
import ImagePickerModal from '../components/ImagePickerModal';
import CustomBlueButton from '../components/CustomBlueButton';
import {COLORS, baseUrl} from '../utils/Constant';
import axios from '../utils/axios';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import AuthContext from '../context/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import analytics from '@react-native-firebase/analytics';

const Report9Screen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [typeParagraph, setTypeParagraph] = useState('');
  const [imageURI, setImageURI] = useState(null);
  const [loading, setLoading] = useState(false);
  const [state] = useContext(AuthContext);
  const openCamera = async () => {
    setModalVisible(false);
    try {
      if (Platform.OS == 'ios') {
        ImageCropPicker.openCamera({
          width: 300, // Set the desired width for the image
          height: 300, // Set the desired height for the image
          cropping: true,
          compressImageQuality: 0.8, // Set the desired compression quality (adjust as per your requirement)
        })
          .then(response => {
            setImageURI(response);
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
            width: 300, // Set the desired width for the image
            height: 300, // Set the desired height for the image
            cropping: true,
            compressImageQuality: 0.8, // Set the desired compression quality (adjust as per your requirement)
          })
            .then(response => {
              setImageURI(response);
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
  };

  const openGallery = async () => {
    console.log(Platform.Version);
    const permisionBasedOnAndroidVersion =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    try {
      if (Platform.OS == 'ios') {
        ImageCropPicker.openPicker({
          width: 300, // Set the desired width for the image
          height: 300, // Set the desired height for the image
          cropping: true,
          compressImageQuality: 0.8, // Set the desired compression quality (adjust as per your requirement)
        })
          .then(response => {
            setImageURI(response);
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
            width: 300, // Set the desired width for the image
            height: 300, // Set the desired height for the image
            cropping: true,
            compressImageQuality: 0.8, // Set the desired compression quality (adjust as per your requirement)
          })
            .then(response => {
              setImageURI(response);
            })
            .catch(error => {
              console.log('ImagePicker Error: ', error);
            });
        } else {
          console.log('Gallery Permission Denied.');
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const createImagesFormData = async (images = [], key = 'image', body) => {
    try {
      console.log('crete', images);
      const data = new FormData();
      if (images) {
        body &&
          Object.keys(body).map(key => {
            data.append(key, body[key]);
          });
        // images.forEach(image => {
        const name =
          images?.filename ||
          images?.path.substring(
            images?.path.lastIndexOf('/') + 1,
            images?.path.length,
          );
        const type = images.mime;
        const uri = images?.path;
        data.append(key, {name, type, uri});
        // });
      }
      return data;
    } catch (err) {
      console.log('errrrrr', err);
      return {
        error: {
          message: err?.message,
        },
        success: false,
      };
    }
  };

  const uploadPhotoApicode = async () => {
    setLoading(true);
    let imageData = null;
    if (imageURI) {
      imageData = await createImagesFormData(imageURI, 'image', {});
    }

    //if the image is object then it should be JSONSTRINGIFY

    try {
      //if the image is object then itshould be JSONSTRINGIFY
      let imagePath = null;
      if (imageData) {
        const response = await fetch(`${baseUrl}/upload`, {
          method: 'post', // or 'PUT'
          body: imageData, // data can be `string` or {object}!
          headers: {
            'content-type': 'multipart/form-data',
          },
        });

        const responseparse = await response.json();

        console.log('REsponse Api', responseparse.filePath);
        imagePath = responseparse.filePath;
        console.log('imageRui', imagePath);
      }
      handlePost(imagePath);
      // handle success
      // navigation.navigate('Report4', {
      //   report2Content: {...report2Content, image: imagePath},
      // });

      // console.log(JSON.parse(response));
    } catch (error) {
      // handle error
      console.log('errrrr', error);
      setLoading(false);
    }
  };
  const nextHandler = () => {
    if (typeParagraph) {
      uploadPhotoApicode();
    } else {
    }
  };

  const handlePost = async imagePath => {
    setLoading(true);
    try {
      let removedCharacters = [];
      let cleanedParagraph = typeParagraph.replace(
        /[^a-zA-Z0-9\s]/g,
        function (match) {
          removedCharacters.push(match);
          return '';
        },
      );

      if (removedCharacters.length > 0) {
        let alertMessage =
          '-----Alert!! Removed the following: ' +
          removedCharacters.join('  -and-  ');
        cleanedParagraph += '\n\n' + alertMessage;
      }

      const data = {
        userId: state.user._id,
        image: imagePath,
        feedback: cleanedParagraph,
      };
      console.log('data', data);
      const response = await axios.post(`${baseUrl}/feedbackFeed`, data, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      console.log(response);
      if (response.data.error) {
        alert(response.data.error);
      } else {
        console.log('response===>', response);
        setTypeParagraph('');
        navigation.navigate('Report10');
        /*alert("Navigating");*/
      }
    } catch (error) {
      console.log(error);
      alert('An error occurred during login');
    } finally {
      setLoading(false);
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

  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{marginTop: hp(5)}}>
          <ImagePickerModal
            isVisible={isModalVisible}
            setVisible={setModalVisible}
            // onCameraPress={openCamera}
            onImageLibraryPress={openGallery}
          />

          <View style={styles.topContainer}>
            <View style={styles.rowContainer}>
              <Text style={styles.title1}>Feedback</Text>
              {loading ? (
                <ActivityIndicator color={COLORS.primary} />
              ) : (
                <TouchableOpacity
                  style={styles.blueButton}
                  onPress={nextHandler}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text
              style={{
                fontSize: wp(4),
                color: '#000000',
                marginBottom: hp(2),
              }}>
              We love hearing about your feedback!
            </Text>
            <TextInput
              value={typeParagraph}
              onChangeText={text => setTypeParagraph(text)}
              style={styles.textAreaContainer}
              placeholder="Write comment..."
              placeholderTextColor="grey"
              multiline={true}
              textAlignVertical="top"
              color="#000000"
            />
            <Pressable onPress={() => setModalVisible(true)}>
              {imageURI ? (
                <Image source={{uri: imageURI.path}} style={styles.card} />
              ) : (
                <View style={styles.card}>
                  <Text style={{fontSize: wp(3.8), color: '#000000'}}>
                    Optional: Upload an image
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
          <View style={styles.bottomContainer}>
            <Text style={styles.title2}>Contact us directly</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('mailto:support@thisismdex.com')}>
              <View style={styles.signOutButton}>
                <MaterialCommunityIcons
                  name={'email'}
                  size={wp(6)}
                  color="#000000"
                  marginRight={wp(3)}
                />
                <Text style={styles.logOutText}>support@thisismdex.com</Text>
              </View>
            </TouchableOpacity>
            <View
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: '#000000',
                flexDirection: 'row',
                marginHorizontal: wp(2),
              }}></View>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://www.instagram.com/thisismdex')
              }>
              <View style={styles.signOutButton}>
                <MaterialCommunityIcons
                  name={'instagram'}
                  size={wp(6)}
                  color="#000000"
                  marginRight={wp(3)}
                />
                <Text style={styles.logOutText}>@thisismdex</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Report9Screen;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  topContainer: {
    paddingHorizontal: hp(1),
    paddingVertical: wp(6),
    marginHorizontal: hp(1.2),
    paddingHorizontal: wp(3),
    borderRadius: wp(5),
    elevation: 5,
    borderWidth: 6,
    borderColor: '#682BF7',
    backgroundColor: 'white',
  },

  bottomContainer: {
    paddingHorizontal: hp(1),
    paddingVertical: wp(1),
    marginHorizontal: hp(1.2),
    borderRadius: wp(5),
    backgroundColor: '#EFEFEF',
    marginTop: hp(5),
    ...SHADOW.dark,
  },

  signOutButton: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.8),
    borderRadius: wp(6),
    flexDirection: 'row',
    marginVertical: hp(0.5),
    alignItems: 'center',
  },

  logOutText: {
    color: '#000000',
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },

  blueButton: {
    backgroundColor: '#682BF7',
    paddingVertical: wp(3),
    borderRadius: wp(20),
    paddingHorizontal: wp(6),
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    backgroundColor: '#EFEFEF',
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(6),
    marginBottom: 20,
  },
  backButton: {
    marginTop: 60,
    marginLeft: '6%',
  },
  backButtonText: {
    fontSize: 12,
    color: 'blue',
  },

  title1: {
    fontSize: wp(8),
    fontWeight: 'bold',
    color: 'black',
    marginTop: hp(2),
    marginBottom: hp(2.5),
  },

  title2: {
    fontSize: wp(5.5),
    fontWeight: 'bold',
    color: '#682BF7',
    marginTop: hp(2),
  },

  innerContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonstyle: {
    padding: 5,
    backgroundColor: 'blue',
    marginRight: '4%',
    borderRadius: 20,
  },

  textAreaContainer: {
    paddingHorizontal: wp(1),
    borderRadius: 8,
    ...SHADOW.dark,
    backgroundColor: '#fff',
    fontSize: wp(3.5),
    // textAlignVertical: 'top',
    height: hp(10),
    borderColor: '#8e93a1',
    marginBottom: hp(3),
    //in ios, it should be multiline={true},
    //paddingTop:10,
    //paddingLeft:10
  },
});
