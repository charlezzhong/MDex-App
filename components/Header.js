import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Header = () => {
    return (
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.rowContainer}>
          <Image source={require('./Media/BlueLogo.png')} style={styles.image} />
          <TouchableOpacity onPress={() => navigation.navigate('Lock')} style={styles.button}>
            <Text>Add</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

export default Header

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 50,
        alignSelf: 'center',
        padding: 10,
    },
})