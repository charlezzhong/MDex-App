import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Animated,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, baseUrl} from '../utils/Constant';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthContext from '../context/auth';
import axios from '../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';

const EditProfileScreen = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordAgain, setNewPasswordAgain] = useState('');
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const [state, setState] = useContext(AuthContext);

  useEffect(() => {
    if (state && state.user) {
      const {name, email, role} = state.user;
      setName(name);
      setEmail(email);
      setRole(role);
    }
  }, [state]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const DeleteAccount = async () => {
    try {
      console.log('COMING HERE');
      const response = await axios.delete(
        `${baseUrl}/user/${state?.user?._id}`,
        {
          params: {
            userId: state?.user?._id,
          },
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        },
      );
      Alert.alert('Account Deleted Successfully');
      setState({token: '', user: null});
      await AsyncStorage.removeItem('auth-rn');
    } catch (err) {
      console.log({err});
    }
  };

  const handleButton1Press = async () => {
    if (newPassword == '' || newPasswordAgain == '' || currentPassword == '') {
      return alert('Fill all the fields');
    } else if (newPasswordAgain != newPassword) {
      return alert('New passwords are not matching');
    }
    console.log({email});
    const response = await axios
      .post(
        `${baseUrl}/change-password`,
        {
          email: email,
          currentPassword: currentPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        },
      )
      .then(res => res.data);
    if (response?.error) {
      return alert(response?.error);
    }
    if (response?.message) {
      handleCloseModal();
      return alert(response?.message);
    }
  };

  const handleCloseModal = () => {
    setNewPassword('');
    setCurrentPassword('');
    setNewPasswordAgain('');
    setModalOpen(false);
  };
  const navigation = useNavigation();

  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Edit Profile',
        screen_class: 'EditProfileScreen',
      })
    } catch (e) {
      console.log({e});
    }
  };

  useEffect(() => {
    firebaseAnalyticsLog();
  }, []);

  return (
    <SafeAreaView style={{marginHorizontal: wp(5)}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: '6%',
          marginBottom: '5%',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
            color: '#000000',
          }}>
          Your Account Settings
        </Text>
      </View>
      <View style={styles.middleContainer}>
        <View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('NotificationScreen')}>
            <Text style={styles.profileText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteProfile}
            onPress={() => setDeleteConfirmationModal(true)}>
            <Text style={styles.profileText}>Delete Account</Text>
          </TouchableOpacity>
          <Modal
            visible={deleteConfirmationModal}
            animationType="fade"
            transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  onPress={() => setDeleteConfirmationModal(false)}
                  style={styles.closeButton}>
                  <Text style={styles.buttonText2}>x</Text>
                </TouchableOpacity>
                <Text
                  style={{
                    textAlign: 'center',
                    marginVertical: '20%',
                    fontSize: wp(4.8),
                  }}>
                  Are you sure you want to delete your account?
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => setDeleteConfirmationModal(false)}
                    style={styles.deleteModalButton}>
                    <Text style={styles.buttonText1}>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={DeleteAccount}
                    style={[
                      styles.deleteModalButton,
                      {backgroundColor: 'red'},
                    ]}>
                    <Text style={styles.buttonText1}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  listContainer: {
    position: 'absolute',
    bottom: '8%',
    left: '2%',
    width: '10%',
    top: '30%',
    width: '100%',
  },
  container: {
    flex: 0.1,
  },

  circle: {
    width: 180,
    height: 180,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rowContainer: {
    flexDirection: 'row', // Display buttons in a row
    justifyContent: 'space-between', // Add space between the buttons
    width: '100%',
    paddingHorizontal: 20, // Add horizontal spacing between buttons
  },
  draggableArea: {
    width: 132,
    height: 32,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragHandle: {
    width: 100,
    height: 6,
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
  },
  profile: {
    flex: 1,
  },

  downContainer: {
    width: '90%',
    alignSelf: 'center',
  },

  greetingTextDown: {
    fontSize: 23,
    fontWeight: 'bold',
    left: '6%',
    color: COLORS.primary,
  },

  profilePictureDown: {
    width: '18%',
    left: '76%',
    bottom: '50%',
  },

  greetingTextUp: {
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: 'bold',
  },

  topContainer: {
    marginTop: '5%',
    height: 'auto',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileNameStyle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  profileTitleStyle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  profilePictureUp: {
    width: '30%',
    height: '20%',
    alignSelf: 'center',
  },

  middleContainer: {
    marginTop: '1%',
    height: 'auto',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomContainer: {
    top: '1%',
    left: '4%',
    right: '4%',
    width: '92%',
    height: '30%',
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomTitleContainer: {
    position: 'absolute',
    left: '3%',
    right: '28%',
    top: '8%',
    width: 'auto',
  },
  bottomTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: '3%',
    marginBottom: '13%',
    left: '2%',
  },

  scannedImage1: {
    marginLeft: wp(4),
  },

  locationText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    margin: 0,
  },

  signOutButton: {
    backgroundColor: 'red',
    bottom: 3,
    padding: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 70,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '4%',
  },
  profileButton: {
    backgroundColor: '#682BF7',
    width: wp(83),
    paddingVertical: hp(2),
    borderRadius: hp(2.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4%',
  },

  deleteProfile: {
    backgroundColor: 'red',
    width: wp(83),
    paddingVertical: hp(2),
    borderRadius: hp(2.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4%',
  },
  profile1Button: {
    backgroundColor: '#EAEAEA',
    padding: 12,
    marginLeft: '2%',
    marginRight: '2%',
    width: '96%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
    paddingHorizontal: 142,
  },

  logOutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileText: {
    color: '#FFFFFF',
    fontSize: wp(4),
    fontWeight: 'bold',
  },

  deleteText: {
    color: '#000000',
    fontSize: 11,
    alignSelf: 'center',
    marginTop: 45,
  },

  buttonText1: {
    color: '#FFFFFF',
    fontSize: wp(4.5),
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  buttonText2: {
    color: '#FFFFFF',
    fontSize: wp(5),
    fontWeight: 'bold',
    lineHeight: wp(4),
    marginVertical: wp(2),
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: '8%',
    borderRadius: 25,
    width: '94%',
    paddingVertical: hp(4),
  },

  modalButton: {
    paddingVertical: hp(1),
    backgroundColor: 'green',
    borderRadius: 5,
    alignSelf: 'flex-start',
    width: wp(78),
    marginTop: hp(2),
  },

  deleteModalButton: {
    backgroundColor: 'green',
    paddingHorizontal: '18%',
    paddingVertical: '5%',
    borderRadius: 5,
  },

  closeButton: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(7),
    backgroundColor: 'red',
    alignSelf: 'flex-end',
    // justifyContent: 'center',
    alignItems: 'center',
  },

  textAreaContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: wp(2),
    marginTop: hp(1),
    paddingVertical: hp(1.5),
    borderColor: '#8e93a1',
    marginBottom: hp(2),
    fontSize: wp(3.5),
  },
});
