import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {PERMISSIONS, request} from 'react-native-permissions';
import PushNotification from 'react-native-push-notification';

// Request user permission for push notifications
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  console.log('HEREEE =====> ', authStatus, ' || ', enabled);
  if (enabled) {
    console.log('Authorization status:', authStatus);
    return true;
  }
}

export const requestAndroidUserPermission = async () => {
  const isPermission = await messaging().hasPermission();
  if (isPermission == 0) {
    let res = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    if (res == 'denied') {
      let res = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    }
  }
  return isPermission;
};

// Retrieve FCM token and store it in AsyncStorage
export async function GetFCMToken() {
  let fcmtoken = await AsyncStorage.getItem('fcmtoken');
  console.log('old token', fcmtoken);

  if (!fcmtoken) {
    try {
      const fcmtoken = await messaging().getToken();

      if (fcmtoken) {
        await AsyncStorage.setItem('fcmtoken', fcmtoken);
        console.log('new token1', fcmtoken);
      }
    } catch (error) {
      return null;
      console.log('error in fcm token', error);
    }
  }
  return fcmtoken;
}

// Set up the notification channel
const channelSetup = () => {
  PushNotification.getChannels(function (channel_ids) {
    console.log('channels', channel_ids);
    if (!channel_ids.includes('channel-1')) {
      PushNotification.createChannel(
        {
          channelId: 'channel-1',
          channelName: 'Members Activities',
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        created => console.log(`createChannel returned '${created}'`),
      );
    }
  });
};

// Send local push notification
const sendLocalPushNotification = (title, message, data) => {
  console.log('local data', data, ' =>', title, ' =>', message);
  let userInfo = null;
  try {
    userInfo = JSON.parse(data?.data);
  } catch (err) {}

  try {
    PushNotification.localNotification({
      channelId: 'channel-1',
      autoCancel: true,
      bigText: message,
      title: title,
      userInfo: userInfo,
      message: 'Click to see more',
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'default',
    });
  } catch (error) {
    console.log('push error', error);
  }
};

// Initialize notification listener
export const NotificationListener = navigation => {
  messaging().onMessage(async remoteMessage => {
    console.log(
      'A new FCM message arrived!',
      JSON.stringify(remoteMessage, null, 2),
    );

    //foreground
    sendLocalPushNotification(
      remoteMessage.notification?.title,
      remoteMessage.notification?.body,
      remoteMessage.data,
    );
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('HEELLOOOO 12222222');
    console.log('onNotificationOpenedApp OPEN');
    console.log('onNotificationOpenedApp', JSON.stringify(remoteMessage));
    console.log('remotemessage', remoteMessage.data);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('remotemessage killed', remoteMessage.data);
        console.log(
          'Notification caused app to open from quit state:',
          JSON.stringify(remoteMessage),
        );
      }
    });

  // Call channel setup during the initialization of your application
  channelSetup();
};
