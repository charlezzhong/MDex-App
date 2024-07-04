import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useState} from 'react';

GoogleSignin.configure({
  // androidClientId:
  //   '1096811347098-7lio780toquec8k7282ba20tinvkqb33.apps.googleusercontent.com',
  // iosClientId:
  //   '1096811347098-c2ii5hh3l0bv8vu0fvgcq4pldcfglct7.apps.googleusercontent.com',
  webClientId:
    '1096811347098-1mhpfdp94th2gqj26ujqe9dcuaqeo459.apps.googleusercontent.com',
});

const useGoogle = () => {
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const GoogleLogin = async () => {
    // As precaution we are revoking access and signing out before signing in
    await GoogleSignin.hasPlayServices()
      .then(async hasPlayService => {
        if (hasPlayService) {
          const user = await GoogleSignin.getCurrentUser();
          // console.log({user});
          if (user) {
            user?.accessToken &&
              (await GoogleSignin.clearCachedAccessToken(user?.accessToken));
          }
          GoogleSignin.signIn()
            .then(async userInfo => {
              console.log({userInfo});
              setUserInfo(userInfo);
            })
            .catch(e => {
              setError('Something went wrong');
              console.log('ERROR IS: ' + JSON.stringify(e));
            });
        } else {
          setError('Play services error');
        }
      })
      .catch(e => {
        setError('Play services error');
        console.log('ERROR IS: ' + JSON.stringify(e));
      });
  };

  return {
    GoogleLogin,
    userInfo,
    error,
  };
};

export default useGoogle;
