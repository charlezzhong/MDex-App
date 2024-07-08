import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Marker } from 'react-native-maps';

// Define the icons and their colors
const getIcons = require('./Icons/getIcons')
const icons = getIcons()
// const icons = {
//   party: {
//     poi: require('./IconImages/party.png'), // Replace with your traffic POI icon path
//   },
//   pizza: {
//     poi: require('./IconImages/pizza.png'), // Replace with your pizza POI icon path
//   },
//   donut: {
//     poi: require('./IconImages/donut.png'), // Replace with your pizza POI icon path
//   },
//   // Add other icons here as needed
// };

// Define the colors for the icons

// Function to get the appropriate icon based on zoom level
const getIcon = (type, zoom) => {
  if (!icons[type] || !icons[type].color) {
    console.error(`Icon or color not defined for type: ${type}`);
    return { isDot: true, color: 'gray' }; // Fallback to a default gray dot
  }
  if (zoom >= 15) {
    return { color: icons[type].color, icon: icons[type].poi, isDot: false };
  } else {
    return { color: icons[type].color, isDot: true };
  }
};
// Function to create a Marker component with the appropriate icon and color
const createMarker = (key, coordinate, type, zoom, onPress) => {
  const { icon, color, isDot } = getIcon(type, zoom);

    return (
      <Marker
      key={key}
      coordinate={coordinate} 
      onPress={onPress}
    >
      {isDot ? (
        <View style={[styles.dot, { backgroundColor: color }]} />
      ) : (
        <View style={styles.shadowContainer}>
        <View style={styles.markerContainer}>
          <View style={styles.circleWrapper}>
            <View style={[styles.circle, { backgroundColor: color }]}>
              <Image source={icon} style={styles.icon} resizeMode="contain" />
            </View>
            <View style={styles.arrow} />
          </View>
        </View>
        </View>
      )}
    </Marker>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1.8, height: 4 },
    shadowOpacity: 0.33,
    shadowRadius: 2.4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleWrapper: {
    alignItems: 'center',
  },
  circle: {
    width: 41,
    height: 41,
    borderRadius: 20,
    borderWidth: 3.5,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 27,
    height: 27,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 5,
    borderWidth: 1.7,
    borderColor: '#ffffff',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ffffff',
    marginTop: -3.8,
  },
});

export { createMarker };