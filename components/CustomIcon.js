import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import {TouchableOpacity} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Octicons from 'react-native-vector-icons/Octicons';

const CustomIcon = props => {
  const {icon, type, color, onPress, size, disabled, style, source, ...rest} =
    props;
  return (
    <TouchableOpacity style={style} onPress={onPress} disabled={disabled}>
      {type == 'entypo' && (
        <Entypo
          name={icon}
          color={color || 'black'}
          size={size || wp(5)}
          {...rest}
        />
      )}
      {type == 'ionicons' && (
        <Ionicons
          name={icon}
          color={color || 'black'}
          size={size || wp(5)}
          {...rest}
        />
      )}
      {type == 'fontawesome' && (
        <FontAwesome
          name={icon}
          color={color || 'black'}
          size={size || wp(5)}
          {...rest}
        />
      )}
      {type == 'fontisto' && (
        <Fontisto
          name={icon}
          color={color || 'black'}
          size={size || wp(5)}
          {...rest}
        />
      )}
      {type == 'font-awesome5' && (
        <FontAwesome5
          name={icon}
          color={color || 'black'}
          size={size || wp(5)}
          {...rest}
        />
      )}
      {type == 'feather' && (
        <Feather
          name={icon}
          color={color || 'black'}
          size={size || wp(5)}
          {...rest}
        />
      )}
      {type == 'material-icons' && (
        <MaterialIcons
          name={icon}
          color={color || 'black'}
          size={size || wp(5)}
          {...rest}
        />
      )}
      {type == 'materialCommunityIcons' && (
        <MaterialCommunityIcons
          disabled
          name={icon}
          color={color || 'black'}
          size={size || wp(5)}
          {...rest}
        />
      )}
      {type == 'foundation' && (
        <Foundation
          name={icon}
          color={color || 'black'}
          size={size || wp(5)}
          {...rest}
        />
      )}
      {type == 'antdesign' && (
        <AntDesign
          name={icon}
          color={color || 'black'}
          size={size || wp(5)}
          {...rest}
        />
      )}
      {type == 'simplelineicons' && (
        <SimpleLineIcons
          name={icon}
          color={color || 'black'}
          size={size || wp(5)}
          {...rest}
        />
      )}
      {type == 'evilIcons' && (
        <EvilIcons
          name={icon}
          color={color || 'black'}
          size={size || wp(5)}
          {...rest}
        />
      )}
      {type == 'octicons' && (
        <Octicons
          name={icon}
          color={color || 'black'}
          size={size || wp(5)}
          {...rest}
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomIcon;
