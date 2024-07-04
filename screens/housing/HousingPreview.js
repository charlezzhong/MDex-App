import {StyleSheet, Text, View, Image} from 'react-native';
import React, { useEffect, useState } from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { convertDateString } from '../../components/DateConverters/Datetostring';

const HousingPreview = ({apartment, onPress}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        currentIndex => (currentIndex + 1) % apartment.e.length,
      );
    }, 550); // Change image every 1000 milliseconds (1 second)

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{uri: apartment.e[currentImageIndex]}} style={styles.image} />
      <View style={styles.rightContainer}>
        <Text style={styles.title}>{apartment.c}</Text>
        <Text style={styles.description}>{apartment.d}</Text>
        {/* <Text style={styles.rating}>
          {apartment.sublettingRooms} Rooms Available
        </Text> */}
        <View style={styles.bottomRow}></View>
        <View style={styles.footer}>
          <Text>
            <Text style={styles.price}>${apartment.f}</Text>
            <Text> month</Text>
          </Text>
        </View>
        <Text>
            <Text style={styles.price}>
            {apartment?.z
                        ? `${convertDateString(apartment.z)}`
                        : 'Update app'}
            {apartment?.aa
                        ? ` - ${convertDateString(apartment.aa)}`
                        : ' - Update app'}
            </Text>
          </Text>
      </View>
    </TouchableOpacity>
  );
};

export default HousingPreview;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    position: 'absolute',
    bottom: 50,
    left: 10,
    right: 10,
    borderRadius: 20,

    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  title: {
    marginBottom: 2,
    fontSize: 16,
  },
  rating: {
    marginBottom: 10,
    fontSize: 12,
    color: 'green',
  },
  description: {
    color: 'gray',
    marginBottom: 5,
  },
  image: {
    width: 140,
    aspectRatio: 1,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  price: {
    fontWeight: 'bold',
  },
  rightContainer: {
    padding: 10,
    flex: 1,
  },
  footer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 3,
  },
  bottomRow: {
    marginTop: 'auto',
    flexDirection: 'row',
  },
});
