import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useContext, useEffect} from 'react';
import CustomWebView from './components/CustomWebView';
import {AuthContext} from './context/auth';
import EditProfileScreen from './screens/EditProfileScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import HomeScreen from './screens/HomeScreen';
import LockScreen from './screens/LockScreen';
import LogInScreen from './screens/LoginScreen';
import Report1Screen from './screens/Report1Screen';
import Report2Screen from './screens/Report2Screen';
import Report3Screen from './screens/Report3Screen';
import Report4Screen from './screens/Report4Screen';
import Report5Screen from './screens/Report5Screen';
import Report6Screen from './screens/Report6Screen';
import Report7Screen from './screens/Report7Screen';
import Report8Screen from './screens/Report8Screen';
import Report9Screen from './screens/Report9Screen';
import SignUpProgress from './screens/SignUpProgress';
import BusinessPage from './screens/BusinessPage';
import DetailsHousing from './screens/housing/DetailsHousing';
import AmenitiesHousing from './screens/housing/AmenitiesHousing';
import Filters from './screens/Filters';
import Map from './screens/Map';
import Report10Screen from './screens/Report10Screen';
import SignUpScreen from './screens/SignUpScreen';
// import {usePushNotificationIos} from './utils/usePushNotifcation_ios';
import NotificationScreen from './screens/NotificationScreen';
import {GetFCMToken} from './utils/PushNotification_Helper';
import {baseUrl} from './utils/Constant';
import {Alert, Image, View} from 'react-native';
import SignupSuccess from './screens/SignupSuccess';
import BottomTabNavigator from './bottomTabNavigation';
// import LottieView from 'lottie-react-native';
import LottieSplashScreen from 'react-native-lottie-splash-screen';

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import WhatsNew from './screens/WhatsNew';

const {createBottomTabNavigator} = require('@react-navigation/bottom-tabs');

const Stack = createStackNavigator();

const Navigation = () => {
  const [state, setState] = useContext(AuthContext);
  const authenticated = state && state.token !== '' && state.user !== null;
  const navigation = useNavigation();
  const [splashScreen, setSplashScreen] = React.useState(false);
  useEffect(() => {
    setTimeout(() => {
      LottieSplashScreen.hide();
    }, 2000);
  }, []);
  return (
    <>
      {splashScreen && (
        <>
          {/* <LottieView
            source={require('./screens/Media/loading.json')}
            loop={false}
            autoPlay={true}
            style={{
              flex: 1,
              backgroundColor: '#fff',
              position: 'absolute',
              bottom: 0,
              top: 0,
              left: 0,
              right: 0,
              zIndex: 8888,
            }}
          /> */}
          <View
            style={{
              position: 'absolute',
              bottom: heightPercentageToDP(5),
              alignSelf: 'center',
              left: 0,
              right: 0,
              zIndex: 9999,
            }}>
            <Image
              source={require('./screens/Logo.png')}
              style={{
                alignSelf: 'center',
                height: heightPercentageToDP(5),
                width: widthPercentageToDP(20),
              }}
              tintColor={'blue'}
            />
          </View>
        </>
      )}
      <Stack.Navigator initialRouteName="Home">
        {authenticated ? (
          <>
            {/* Done with analytics */}
            <Stack.Screen
              name="bottomTab"
              component={BottomTabNavigator}
              options={{headerShown: false}}
            />
            {/* Remaining analytics  */}
            <Stack.Screen
              name="EventDetail"
              component={EventDetailScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="DetailsHousing"
              component={DetailsHousing}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AmenitiesHousing"
              component={AmenitiesHousing}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name="Map"
              component={Map}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name="Report1"
              component={Report1Screen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Report2"
              component={Report2Screen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Report3"
              component={Report3Screen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Report4"
              component={Report4Screen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Report5"
              component={Report5Screen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Report6"
              component={Report6Screen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Report7"
              component={Report7Screen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Report8"
              component={Report8Screen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Report9"
              component={Report9Screen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Report10"
              component={Report10Screen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="NotificationScreen"
              component={NotificationScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Business"
              component={BusinessPage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Filters"
              component={Filters}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="WhatsNew"
              component={WhatsNew}
              options={{headerShown: false}}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Lock"
              component={LockScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={LogInScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SignupSuccess"
              component={SignupSuccess}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="WebView"
              component={CustomWebView}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SignUpProgress"
              component={SignUpProgress}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

/*function Navigation() {
  const { token } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Report2" component={Report2Screen} />
          </>
        ) : (
          <Stack.Screen name="Lock" component={LockScreen} options={{ headerShown: false }} />
        )}
        <Stack.Screen name="Login" component={LogInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EventDetail" component={EventDetailScreen}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}*/
/*
function Navigation(){
    return(
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
            
                
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="EventDetail" component={EventDetailScreen}/>
            <Stack.Screen name="Report1" component={Report1Screen}/>
            <Stack.Screen name="Report2" component={Report2Screen}/>
            <Stack.Screen name="Report3" component={Report3Screen}/>
            <Stack.Screen name="Report4" component={Report4Screen}/>
            <Stack.Screen name="Report5" component={Report5Screen}/>
            <Stack.Screen name="Report6" component={Report6Screen}/>
            <Stack.Screen name="Report7" component={Report7Screen}/>
            <Stack.Screen name="HappeningNow" component={HappeningNow}/>
                {/*Screens not in view:
                <Stack.Screen name ="Login" component={LoginScreen} options={{headerShown:false}}/>
                <Stack.Screen name="Main" component={BottomTabs} options={{headerShown:false}}/>
                <Stack.Screen name="SignUp" component={SignUpScreen}/>
                <Stack.Screen name="Main" component={HomeScreen} options={{headerShown:false}}/>
                <Stack.Screen name="EventDetail" component={EventDetailScreen}/>
                <Stack.Screen name="Report1" component={Report1Screen}/>
                <Stack.Screen name="Report2" component={Report2Screen}/>
                <Stack.Screen name="Report5" component={Report5Screen}/>
                <Stack.Screen name="Report6" component={Report6Screen}/>
                <Stack.Screen name="Report7" component={Report7Screen}/>
                }
            </Stack.Navigator>
        </NavigationContainer>
    )
}
*/
export default Navigation;
{
  /*Screens not in view:
                <Stack.Screen name ="Login" component={LoginScreen} options={{headerShown:false}}/>
                <Stack.Screen name="SignUp" component={SignUpScreen}/>
                <Stack.Screen name="Main" component={HomeScreen} options={{headerShown:false}}/>
                <Stack.Screen name="EventDetail" component={EventDetailScreen}/>
                <Stack.Screen name="Report2" component={Report7Screen}/>
                <Stack.Screen name="Report5" component={Report5Screen}/>
                <Stack.Screen name="Report6" component={Report6Screen}/>
                <Stack.Screen name="Report7" component={Report7Screen}/>
                */
}
