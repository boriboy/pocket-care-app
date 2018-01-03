import React from 'react';
import { StyleSheet, Alert, Button, Text, View } from 'react-native';
import NavigationBar from './components/nav';
import MedCreate from './components/interaction/medCreate';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.global}>
        <NavigationBar />

        <MedCreate />

      </View>

      // <View style={styles.container}>
        // <Text>Lika rules </Text>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  global: {
    backgroundColor: '#ccdae7',
    flex: 1
  }
});
