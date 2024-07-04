import React, {useState} from 'react';

import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {COLORS} from '../utils/Constant';
import {Text} from 'react-native-paper';
import {SHADOW} from '../context/theme';
export const dateFormatter = (value, format) => {
  try {
    if (typeof value == 'string') {
      value = parseISOString(value);
    }
    let year = value.getFullYear();
    let month = value.getMonth() + 1;
    let day = value.getDate();

    day = day.toString().padStart(2, '0');
    month = month.toString().padStart(2, '0');

    if (format == 'yyyy/mm/dd') {
      return `${year}/${month}/${day}`;
    } else if (format == 'mm/dd/yyyy') {
      return `${month}/${day}/${year}`;
    }
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.log('ERRRO', error);
  }
};
export const parseISOString = s => {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
};
export const timeformatter = value => {
  try {
    if (typeof value == 'string') {
      value = parseISOString(value);
    }
    let hours = value.getHours();
    let minutes = value.getMinutes();

    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  } catch (error) {
    console.log('ERROR', error);
  }
};

const CustomDatePicker = props => {
  const {
    value,
    mode = 'date',
    onChange,
    label,
    containerStyle,
    placeholder,
    required = true,
  } = props;

  const [show, setShow] = useState(false);
  const [errortxt, setError] = useState(null);

  const onChangeDate = (event, selectedDate) => {
    console.log('event', selectedDate);
    Platform.OS == 'android' && setShow(false);

    if (event.type != 'dismissed') {
      onChange(() => selectedDate);
    }
    setError(null);
  };

  const showMode = () => {
    onChange(() => new Date());

    setShow(true);
  };

  return (
    <>
      <View style={[styles.container, containerStyle]}>
        <Text
          style={{
            fontSize: wp(4.1),
            color: '#8e93a1',
            marginBottom: 4,
          }}>
          Event {placeholder}{' '}
          {required && <Text style={{color: 'red'}}>*</Text>}
        </Text>

        <TouchableOpacity onPress={showMode} style={[styles.date]}>
          <Text style={styles.text}>
            {value
              ? mode == 'time'
                ? timeformatter(value)
                : dateFormatter(value, 'mm/dd/yyyy')
              : 'Select Here'}
          </Text>
          <MaterialCommunityIcons
            name="calendar"
            color={COLORS.primary}
            disabled
            size={wp(6)}
          />
        </TouchableOpacity>
      </View>

      {Platform.OS == 'ios' ? (
        <Modal style={{flex: 1, margin: 0}} isVisible={show}>
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 10,
              width: wp(95),
              alignSelf: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingHorizontal: wp(4),
              }}>
              <Entypo
                name="cross"
                size={wp(8)}
                marginTop={wp(2)}
                alignItems='flex-end'
                color='#000000'
                onPress={() => {
                  setShow(false);
                }}
              />
            </View>
            {DatePicker({date: value, mode, onChange: onChangeDate})}
            <Text
              onPress={() => setShow(false)}
              style={styles.confirmText}
              bold>
              OK
            </Text>
          </View>
        </Modal>
      ) : (
        show && DatePicker({date: value, mode, onChange: onChangeDate})
      )}
    </>
  );
};

const DatePicker = props => {
  const {date, mode, onChange} = props;
  return (
    <DateTimePicker
      testID="dateTimePicker"
      themeVariant="light"
      value={date || new Date()}
      mode={mode}
      is24Hour={true}
      onChange={onChange}
      // minimumDate={new Date()}
      display="spinner"
      //   maximumDate={new Date()}
    />
  );
};

export default CustomDatePicker;

const styles = StyleSheet.create({
  container: {},
  date: {
    backgroundColor: '#fff',
    color: 'black',
    padding: 5,
    flexDirection: 'row',
    borderRadius: 8,
    // marginTop: 7,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    ...SHADOW.medium,
    height: heightPercentageToDP(5),
    marginBottom: hp(2),
    marginHorizontal: wp(0.5),
    fontSize: wp(3.5),
  },
  text: {
    fontSize: wp(3.5),
    color: 'black',
  },
  confirmText: {
    textAlign: 'right',
    paddingRight: wp(5),
    color: COLORS.primary,
    marginTop: hp(-1),
    fontSize: wp(6),
    paddingBottom: hp(1),
    fontWeight: 'bold',
  },
});
