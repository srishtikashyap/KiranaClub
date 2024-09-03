import React, { useEffect } from 'react';
import { View, Image, StyleSheet,Text } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('NewsList');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../images/splash.png')} style={styles.logo} resizeMode="contain" />
    </View>
  ); 
}; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 287,
    height: 144,
  },
});

export default SplashScreen;
