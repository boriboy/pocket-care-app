import React, { Component } from 'react';
import { AppRegistry, FlatList, Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Fetcher from '../../app/logic/fetcher';
import IntakeIndicator from '../../components/intakeIndicator';

export default class Medications extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: props.data,
      loaded: props.loaded
    }
  }

  __syncState(data) {
    console.log(`inside sync state - ${data}`)
    this.setState(data)
  }

  _deleteItem(id) {
    console.log(`Deleting ${id}`);
    Fetcher.del(`med/${id}`)
      .then(res => {
        this.__syncState({data: res.data, loaded:true})
    }).catch(err => console.log(err))
  }

  promptDelete(med) {
    Alert.alert(`Delete ${med.title}`, `are you sure?`, [
      {text: 'Nah', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      {text: 'Yep', onPress: () => this._deleteItem(med._id)}
    ])
  }

  _renderItem(med) {
    return (
      <TouchableOpacity style={styles.itemContainer}
        onLongPress={() => this.promptDelete(med)}>
        <Text style={styles.medicationTitle}>{med.title}</Text>
        <IntakeIndicator freq={med.freq} taken={med.freq} />
        {/*+<Text style={styles.medicationTitle}>0</Text>*/}
      </TouchableOpacity>
    )
  }

  _renderLoader() {
    return (
      <View style={styles.loaderContainer}>
        <Text>{'fetching meds'}</Text>
      </View>
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('inside medications shouldComponentUpdate')

    if (this.props.data !== nextProps.data) {
      this.__syncState(nextProps)
      return true
    } else {
      return this.state.data !== nextState.data
    }
  }

  render() {
    console.log('rendering medications')

    // loader while async request processing
    if (!this.state.loaded) {
      return (this._renderLoader())
    } else {
      return (
        <FlatList
          data={this.state.data}
          renderItem={({item}) => {
            if (item.title)
              return (this._renderItem(item))
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
