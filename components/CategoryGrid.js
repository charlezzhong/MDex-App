import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
// category
const CategoryGrid = ({title, color, select, selectedTitle}) => {
  return (
    <TouchableOpacity
      android_ripple={{color: '#ccc'}}
      style={[
        styles.gridItem,
        {backgroundColor: color},
        title == selectedTitle
          ? {borderWidth: 4, borderColor: '#00008B'}
          : {backgroundColor: color},
      ]}
      onPress={() => select(title)}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    marginHorizontal: widthPercentageToDP(4),
    paddingVertical: heightPercentageToDP(1),
    marginVertical: heightPercentageToDP(1.5),
    borderRadius: 20,
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    backgroundColor: 'white',
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: widthPercentageToDP(4.5),
  },
});

export default CategoryGrid;
