import React, { Component } from 'react';
import { AppRegistry, StyleSheet, TouchableWithoutFeedback, View, Text } from 'react-native';
import Fetcher from '../app/logic/fetcher'

export default class IntakeIndicator extends Component {

  _indicatorStyle() {
    // let color = this.state.complete ? maxIntakeCount : minIntakeCount
    let color = '#a8e4a8'

    return {
      borderRadius:50,
      backgroundColor: color,
      width:50,
      height:50
    }
  }

  _tempToggle() {
    this.setState({complete: !this.state.complete})
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.props.onTake(this.props.medication)}>
        <View style={this._indicatorStyle()}><Text></Text></View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    height: 50,
    borderRadius :50,
    backgroundColor: '#000'
  }
})

const maxIntakeCount = '#a8e4a8'
const minIntakeCount = '#b5c7d8'
