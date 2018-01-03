import React, { Component } from 'react';
import { AppRegistry, Text, View, StyleSheet} from 'react-native';

export default class NavigationBar extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.marginedView}>
          <Text style={styles.title}>MY MEDS</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#698baa',
    maxHeight: '11%'
  },

  marginedView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '4%',

  },

  title: {
    flex: 8,
    textAlign: 'center'
    // justifyContent: 'center',
    // width: '50%'
    // fontFamily: 'Maiandra',
  },

  addMed: {
    flex: 1,
    textAlign: 'center'
    // justifyContent: 'center',
    // width: '10%'
  }
})
