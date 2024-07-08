import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Marker } from 'react-native-maps';
getIcons=require('./Icons/getIcons')
const icons = getIcons()
// const icons = {
//   coffee: require('./icons/coffee.png'), // Replace with the path to your icon
//   briefcase: require('./icons/briefcase.png'), // Replace with the path to your icon
//   lunch: require('./icons/lunch.png'), // Replace with the path to your icon
//   meeting: require('./icons/meeting.png'), // Replace with the path to your icon
//   dinner: require('./icons/dinner.png') // Replace with the path to your icon
// };

const getIcon = (type, zoom) => {
    if (!icons[type]) {
      console.error(`Icon not defined for type: ${type}`);
      return { isDot: true, color: 'gray' }; // Fallback to a default gray dot
    }
    if (zoom >= 15) {
      return { color: icons[type].color, icon: icons[type].poi, isDot: false, eventStart: icons[type].eventStart, eventEnd: icons[type].eventEnd,};
    } else {
      return { color: icons[type].color, isDot: true };
    }
  };

const MapEventIcon = (key, coordinate, type, startTime, endTime, zoom, onPress) => {
    const { icon, color, isDot } = getIcon(type, zoom);

    if (!startTime) {
        return (
            <Marker
            key={key}
            coordinate={coordinate} 
            onPress={onPress}
          >
            {isDot ? (
              <View style={[styles.dot, { backgroundColor: color }]} />
            ) : (           
              <View style={styles.markerContainer}>
                <View style={styles.circleWrapper}>
                  <View style={[styles.circle, { backgroundColor: color }]}>
                    <Image source={icon} style={styles.icon} resizeMode="contain" />
                  </View>
                  <View style={styles.arrow} />
                </View>
              </View>
            )}
          </Marker>
        );
      }
    
    return (
    <Marker
      key={key}
      coordinate={coordinate} 
      onPress={onPress}
    >
        {isDot ? (
              <View style={[styles.dot, { backgroundColor: color }]} />
            ) : (
        
        <View style={styles.wrapper}>
        <Image source={icon} style={styles.iconwstart} resizeMode="contain"/>
            {/* <View style={[styles.container, { borderColor: '#ffffff', backgroundColor: color }]}> */}
            <View style={[styles.container, { borderColor: '#ffffff', backgroundColor: '#4f4f4f' }]}>  
                <View>
                    <Text style={styles.starttime}>{startTime}</Text>
                    {/* <Text style={styles.endtime}>{endTime}</Text> */}
                </View>
            </View>
            <View style={styles.triangleWrapper}>
            <View style={[styles.triangle, { borderTopColor: '#ffffff' }]} />
      </View>
    </View>

            )}
    </Marker>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center'
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  iconwstart: {
    width: 27,
    height: 27,
    marginBottom: 1,
  },
  starttime: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  endtime: {
    color: '#000',
    fontSize: 9
  },
  triangleWrapper: {
    marginTop: -1,
    alignItems: 'center'
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    shadowColor: 'black',
    shadowOpacity: 0.33,
    shadowOffset: {width: 1, height: 1},
    shadowRadius: 2.4,
  },
//   shadowContainer: {
//     padding: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 1.8, height: 4 },
//     shadowOpacity: 0.33,
//     shadowRadius: 2.4,
//     elevation: 3,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'transparent', // Add background color here
//   },
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
    zIndex: 2,
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
    shadowColor: 'black',
    shadowOpacity: 0.33,
    shadowOffset: {width: 1, height: 1},
    shadowRadius: 2.4,
    zIndex: 1,
  },
});

export {MapEventIcon};