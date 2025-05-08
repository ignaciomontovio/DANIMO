import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

import icon from './assets/icon.png';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={{ color: "black" }}> Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      <Image source={icon} style={styles.icon1} />
      <Image source={icon} style={styles.icon2} />
      <Image source={icon} style={styles.icon1} />
      <Image source={icon} style={styles.icon1} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon1: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  icon2: {
    width: 300,
    height: 100,
    resizeMode: 'repeat',
  },
});
