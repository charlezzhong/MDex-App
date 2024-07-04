import React from 'react'
import {View, Text, TextInput, StyleSheet, Pressable} from 'react-native'

const CustomerButton = ({onPress, text}) => {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Text style={styles.text}>{text}</Text>
        </Pressable>
    )
}

const styles=StyleSheet.create({
    container:{
        backgroundColor:'#ff00ff',
        width:'100%',

        padding:15,
        marginVertical: 10,

        alignItems:'center',
        borderRadius:5,
    },
    text:{
        fontWeight: 'bold',
        color: 'white',
    },

});
export default CustomerButton