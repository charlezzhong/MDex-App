import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {COLORS} from '../utils/Constant';
import {SHADOW} from '../context/theme';

const CustomSearchDropDown = ({
  data = [],
  setSelected,
  onChangeText,
  value,
}) => {
  const [focus, setFocus] = useState(false);

  const turnFocusOn = () => {
    setFocus(true);
  };

  return (
    <View style={{marginBottom: hp(2)}}>
      <TextInput
        style={styles.textAreaContainer}
        underlineColorAndroid="transparent"
        placeholder="Central Campus or North Campus or Address"
        placeholderTextColor="grey"
        numberOfLines={10}
        multiline={true}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => turnFocusOn()}
        onBlur={() => setFocus(false)}
      />

      {focus && value && (
        <View style={styles.listContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={({item, index}) => (
              <TouchableOpacity
                key={item.mapbox_id}
                style={[styles.textStyle, index == 0 && {borderTopWidth: 0}]}
                onPress={() => {
                  setFocus(false);
                  Keyboard.dismiss();
                  setSelected(item);
                }}>
                <Text style={styles.text} numberOfLines={2}>
                  {item.name}
                  {item?.address && `, ${item.address}`}
                </Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled={true}
            keyExtractor={(item, index) => index.toString()}
            // ListEmptyComponent={() => (
            //   <View
            //     style={[
            //       styles.textStyle,
            //       {
            //         alignItems: 'center',
            //         borderTopWidth: 0,
            //       },
            //     ]}>
            //     <Text style={{color: '#989898'}}>No Data Found</Text>
            //   </View>
            // )}
          />
        </View>
      )}
    </View>
  );
};

export default CustomSearchDropDown;

const styles = StyleSheet.create({
  textStyle: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderTopColor: 'lightgrey',
    borderTopWidth: 1,
    justifyContent: 'center',
  },
  listContainer: {
    width: '100%',
    flex: 1,
    overflow: 'hidden', // Prevents list from overflowing
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  text: {
    color: '#888888',
    fontWeight: '500',
  },
  textAreaContainer: {
    marginTop: hp(1),
    backgroundColor: '#fff',
    color: COLORS.primary,
    height: hp(5),
    borderRadius: 8,
    marginHorizontal: wp(0.5),
    justifyContent: 'center',
    ...SHADOW.medium,
    paddingHorizontal: wp(2),
    fontSize: wp(3.5),
  },
});
