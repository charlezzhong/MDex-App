import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
  View,
  Image,
  StatusBar,
  Platform,
  Pressable,
  ImageBackground,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import apartments from '../../data/apartments.json';
import {getIconName} from './helpers/houseIcons';

const AmenitiesHousing = () => {
  const navigation = useNavigation();
  const amenitiesData = ['Pool', 'Hot tub', 'Rooftop', 'Gym', 'Dance Room'];

  const AmenityItem = ({icon, title}) => (
    <View style={styles.amenityContainer}>
      <MaterialCommunityIcons name={icon} size={24} style={styles.icon} />
      <Text style={styles.amenityText}>{title}</Text>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#FAF9F5'}}>
      <ScrollView
        contentContainerStyle={{paddingBottom: hp(10), flexGrow: 1}}
        style={{backgroundColor: '#FAF9F5'}}>
        <StatusBar hidden={true} />
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>What this place offers</Text>

          {apartments[0].m.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.infoSectionTitle}>Unique</Text>
              {apartments[0].m.map((amenity, index) => (
                <View key={index}>
                  <AmenityItem icon={getIconName(amenity)} title={amenity} />
                  <View style={styles.spaceBar} />
                </View>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.infoSectionTitle}>Bathroom</Text>
            <View>
              <AmenityItem
                icon={getIconName(apartments[0].p)}
                title={apartments[0].p}
              />
              <View style={styles.spaceBar} />
            </View>
            {apartments[0].n.map((amenity, index) => (
              <View key={index}>
                <AmenityItem icon={getIconName(amenity)} title={amenity} />
                <View style={styles.spaceBar} />
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.infoSectionTitle}>Bedroom</Text>
            <View>
              <AmenityItem
                icon={getIconName(apartments[0].o)}
                title={apartments[0].o}
              />
              <View style={styles.spaceBar} />
            </View>
            {apartments[0].q.map((amenity, index) => (
              <View key={index}>
                <AmenityItem icon={getIconName(amenity)} title={amenity} />
                <View style={styles.spaceBar} />
              </View>
            ))}
          </View>

          {apartments[0].r.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.infoSectionTitle}>Entertainment</Text>
              {apartments[0].r.map((amenity, index) => (
                <View key={index}>
                  <AmenityItem icon={getIconName(amenity)} title={amenity} />
                  <View style={styles.spaceBar} />
                </View>
              ))}
            </View>
          )}

          {apartments[0].w.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.infoSectionTitle}>Kitchen</Text>
              {apartments[0].w.map((amenity, index) => (
                <View key={index}>
                  <AmenityItem icon={getIconName(amenity)} title={amenity} />
                  <View style={styles.spaceBar} />
                </View>
              ))}
            </View>
          )}

          {apartments[0].s.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.infoSectionTitle}>Heating and Cooling</Text>
              {apartments[0].s.map((amenity, index) => (
                <View key={index}>
                  <AmenityItem icon={getIconName(amenity)} title={amenity} />
                  <View style={styles.spaceBar} />
                </View>
              ))}
            </View>
          )}

          {apartments[0].t.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.infoSectionTitle}>Safety</Text>
              {apartments[0].t.map((amenity, index) => (
                <View key={index}>
                  <AmenityItem icon={getIconName(amenity)} title={amenity} />
                  <View style={styles.spaceBar} />
                </View>
              ))}
            </View>
          )}

          {Object.keys(apartments[0].u.b).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.infoSectionTitle}>
                Utilities{'  '}
                {apartments[0].u.a > 0 ? (
                  <Text style={{color: 'red'}}>
                    {`$${apartments[0].u.a} per month`}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: 'green',
                      borderWidth: 1,
                      borderColor: 'green',
                      padding: 3,
                    }}>
                    included
                  </Text>
                )}
              </Text>
              {apartments[0].u.b.map((amenity, index) => (
                <View key={index}>
                  <AmenityItem icon={getIconName(amenity)} title={amenity} />
                  <View style={styles.spaceBar} />
                </View>
              ))}
            </View>
          )}

          {Object.keys(apartments[0].v.b).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.infoSectionTitle}>
                Laundry{'  '}
                {apartments[0].v.a > 0 ? (
                  <Text style={{color: 'red'}}>
                    {`$${apartments[0].v.a} per wash`}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: 'green',
                      borderWidth: 1,
                      borderColor: 'green',
                      padding: 3,
                    }}>
                    included
                  </Text>
                )}
              </Text>
              {apartments[0].v.b.map((amenity, index) => (
                <View key={index}>
                  <AmenityItem icon={getIconName(amenity)} title={amenity} />
                  <View style={styles.spaceBar} />
                </View>
              ))}
            </View>
          )}

          {apartments[0].y.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.infoSectionTitle}>Accessibility</Text>
              {apartments[0].y.map((amenity, index) => (
                <View key={index}>
                  <AmenityItem icon={getIconName(amenity)} title={amenity} />
                  <View style={styles.spaceBar} />
                </View>
              ))}
            </View>
          )}

          {Object.keys(apartments[0].x).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.infoSectionTitle}>Parking {'  '}
                {apartments[0].x.a > 0 ? (
                  <Text style={{color: 'red'}}>
                    {`$${apartments[0].x.a} per month`}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: 'green',
                      borderWidth: 1,
                      borderColor: 'green',
                      padding: 3,
                    }}>
                    included
                  </Text>
                )}</Text>
              {apartments[0].x.b.map((amenity, index) => (
                <View key={index}>
                  <AmenityItem icon={getIconName(amenity)} title={amenity} />
                  <View style={styles.spaceBar} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AmenitiesHousing;

const styles = StyleSheet.create({
  infoSection: {
    // backgroundColor: 'pink',
    marginHorizontal: wp(4),
  },

  infoSectionTitle: {
    fontSize: wp(4),
    fontWeight: 'bold',
    marginBottom: hp(1.5),
  },

  infoTitle: {
    fontSize: wp(6),
    fontWeight: 'bold',
  },

  spaceBar: {
    borderBottomWidth: 1,
    borderColor: '#dadce0',
    marginHorizontal: wp(1),
    marginVertical: wp(2),
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    // backgroundColor: 'red',
  },

  amenityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  amenityText: {
    fontSize: 16,
  },

  section: {
    marginTop: hp(2.5),
  },
});
