import React, { Component } from 'react';
import { AppRegistry, Text, View, StyleSheet} from 'react-native';

export default class NavigationBar extends Component {
  _containerStyle() {
    let height = this.props.height
    return {flex: 1, backgroundColor: '#698baa', maxHeight: height}
  }

  render() {
    return (
      <View style={this._containerStyle()}>
        <View style={styles.marginedView}>
          <Text style={styles.title}>{this.props.title}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  marginedView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '4%',

  },

  title: {
    flex: 8,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold'
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
