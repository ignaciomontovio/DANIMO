import { Text, View, StyleSheet, Image } from "react-native";

// const icon1 = require('../assets/images/splash-icon.png')
import icon2 from '../assets/images/splash-icon.png'

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Image source={icon2} style ={styles.logos}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logos:{
    width: 100, 
    height: 100,
  }
})