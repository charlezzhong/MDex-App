import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

export const usePushNotificationIos = navigation => {
  // const {requestUserPermission} = notification();
  // useEffect(() => {
  // 	AvoidSoftInput.setEnabled(true);
  // 	requestUserPermission();
  // }, []);
  // exit if it's a debug

  console.log('-----> notification onOpened');
  // Must be outside of any component LifeCycle (such as `componentDidMount`).
  PushNotification.configure({
    // onRegister: function (token: string) {},
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      let data = null;
      try {
        if (notification?.foreground) {
          if (notification?.data?.navigate == 'EventDetails') {
            data = {post: notification?.data?.post};
          } else {
            data = {};
          }
        } else {
          data = JSON.parse(notification?.data?.data);
        }

        if (
          data?.navigate == 'EventDetails' ||
          notification?.data?.navigate == 'EventDetails'
        ) {
          console.log('HERE I AM');
          setTimeout(() => {
            navigation.navigate('EventDetail', {
              name: data?.post?.title,
              date: data?.post?.eventDate,
              time: data?.post?.eventTime,
              image: data?.post?.image,
              location: data?.post?.eventLocation,
              description: data?.post?.description,
              organizationName: data?.post?.organizationName,
              instagram: data?.post?.instagram,
              website: data?.post?.website,
              category: data?.post?.category,
              postId: data?.post?._id,
              link: data?.post?.link,
              eventEndTime: data?.post?.eventEndTime,
              campus: data?.post?.campus,
            });
          }, 500);
        } else if (
          data?.navigate == 'ExploreScreen' ||
          notification?.data?.navigate == 'ExploreScreen'
        ) {
          navigation.navigate('HottestPosts');
        } else {
          navigation.navigate('Home');
        }
      } catch (err) {
        navigation.navigate('Home');
      }

      // process the notification

      // (required) Called when a remote is received or opened, or local notification is opened
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATION:', notification);

      // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err) {
      console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     * requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
  });
  return {};
};
