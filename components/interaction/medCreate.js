import React, { Component } from 'react';
import { AppRegistry, Alert, Button, Text, View, StyleSheet} from 'react-native';
// import Fetcher from 'app/logic/fetcher'

export default class MedCreate extends Component {
  render() {
    return (
      <Button
        onPress={() => {
          Alert.alert('create med');
        }}
        title="Press Me"
      />
    )
  }
}

const styles = StyleSheet.create({})
