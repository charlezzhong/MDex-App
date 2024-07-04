import {
  Button,
  FlatList,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Categories} from '../data/dummy-data';
import CategoryGrid from '../components/CategoryGrid';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Report2Screen from './Report2Screen';
import Entypo from 'react-native-vector-icons/Entypo';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SHADOW} from '../context/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import analytics from '@react-native-firebase/analytics';

const Report3Screen = ({route}) => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);
  console.log('HELLO', route?.params?.report1Content);
  const selectTheTitle = name => {
    setSelected(name);
  };

  const firebaseAnalyticsLog = async () => {
    try {
      await analytics().logScreenView({
        screen_name: 'Posting Screens',
        screen_class: 'PostingScreens',
      });
    } catch (e) {
      console.log({e});
    }
  };

  useEffect(() => {
    firebaseAnalyticsLog();
  }, []);

  return (
    <SafeAreaView style={styles.formalContent}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{marginTop: hp(2), width: wp(8), marginHorizontal: wp(4)}}>
        <Entypo name="chevron-with-circle-left" size={wp(8)} color="#7541FF" />
      </TouchableOpacity>
      <View style={{height: hp(73)}}>
        <Text style={styles.title}>Select the category</Text>
        <FlatList
          data={Categories}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <CategoryGrid
              title={item.title}
              color={item.color}
              select={name => selectTheTitle(name)}
              selectedTitle={selected}
            />
          )}
          numColumns={2}
          horizontal={false}
        />
      </View>
      {/* <Button
          disabled={selected ? false : true}
          title="Next"
          color={selected ? 'white' : 'teal'}
          onPress={() => {
            navigation.navigate('Report4', {
              report3Content: {
                ...route?.params?.report2Content,
                category: selected,
              },
            });
          }}
        /> */}
      <View style={{marginTop: hp(1), marginBottom: hp(3), ...SHADOW.darkest}}>
        <TouchableOpacity
          disabled={selected ? false : true}
          style={[
            styles.buttonStyle,
            // {backgroundColor: selected ? '#0C0C52' : 'grey'},
          ]}
          onPress={() => {
            navigation.navigate('Report4', {
              report3Content: {
                ...route?.params?.report1Content,
                category: selected,
              },
            });
          }}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  formalContent: {
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontSize: wp(7),
    fontWeight: 'bold',
    color: '#7541FF',
    marginTop: hp(2),
    marginHorizontal: wp(4),
  },
  buttonStyle: {
    backgroundColor: '#7541FF',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    marginTop: hp(2),
    marginHorizontal: wp(4),
  },
  buttonText: {
    fontSize: wp(4.9),
    color: '#FFFFFF',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});

export default Report3Screen;
