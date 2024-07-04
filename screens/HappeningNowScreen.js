import { StyleSheet, Text, View, Button, TextInput } from 'react-native'
import React from 'react'
import { useNavigation } from "@react-navigation/native";

const HappeningNowScreen= () => {
  
  
  const navigation = useNavigation();
  return (
    <View>
      <Text style={styles.title1}>
            Upload images of what's happening now
        </Text>
    

        
        <TextInput
        style={styles.textAreaContainer}
        underlineColorAndroid="transparent"
        placeholder="Upload your image"
        placeholderTextColor="grey"
        numberOfLines={10}
        multiline={true}
        
        />
      <View style={styles.buttonstyle}>
         <Button title="Next"
         style={styles.buttonstyle}
         onPress={()=>{
         navigation.navigate("Report4")
      }}/>
      </View>
    </View>
  )
}

export default HappeningNowScreen

const styles = StyleSheet.create({
  title1:{
    fontSize:25,
    fontWeight:'bold',
    color: 'black',
    paddingLeft:15,
    paddingTop:20
},
title2:{
    fontSize:25,
    fontWeight:'bold',
    color: 'black',
    paddingLeft:15,
    
},

textAreaContainer: {
  borderColor: 'grey',
  borderWidth: 1,
  padding: 5,
  borderRadius: 8,
  
  marginTop:20,
  marginLeft:15,
  marginRight:15,
  textAlignVertical: 'top',
  //in ios, it should be multiline={true},
  paddingTop:10,
  paddingLeft:10
  
},
  buttonstyle:{

  }
})