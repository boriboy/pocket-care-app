import React, { Component } from 'react';
import { AppRegistry, FlatList, Text, View, StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native';
import Fetcher from '../../app/logic/fetcher';
import IntakeIndicator from '../../components/intakeIndicator';

export default class Medications extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: props.data,
      loaded: props.data
    }
  }

  _renderItem(title, freq) {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.medicationTitle}>{title}</Text>
        <IntakeIndicator freq={freq} taken={freq} />
        {/*+<Text style={styles.medicationTitle}>0</Text>*/}
      </View>
    )
  }

  _renderLoader() {
    return (
      <View style={styles.loaderContainer}>
        <Text>{'fetching meds'}</Text>
      </View>
    )
  }

  shouldComponentUpdate(nextProps) {
    console.log('inside componentWillReceiveProps')
    console.log(this.props.data !== nextProps.data)

    return this.props.data !== nextProps.data
  }

  render() {
    console.log('rendering medications')

    // loader while async request processing
    if (!this.props.loaded) {
      return (this._renderLoader())
    } else {
      return (
        <FlatList
          data={this.props.data}
          renderItem={({item}) => {
            if (item.title)
              return (this._renderItem(item.title, item.freq))
          }}
          keyExtractor={(item, index) => index}
        />
    )}
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    borderBottomColor: '#6f777e',
    borderBottomWidth: 1,
    paddingLeft: 30,
    paddingRight: 30,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  medicationTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
  }
})
