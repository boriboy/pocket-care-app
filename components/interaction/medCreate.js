import React, { Component } from 'react';
import { AppRegistry, Text, Modal, Alert, Button, TextInput, View, StyleSheet} from 'react-native';
import Fetcher from '../../app/logic/fetcher'

export default class MedicationCreate extends Component {
  state = {
    modalActive: false,
    titleValue: '',
    freqValue: '',
    notesValue: ''
  }

  _getModalContent = () => {
    return (
      <View style={styles.container}>
        <TextInput style={styles.title} placeholder={'medication name'} />
        <TextInput style={styles.freq} placeholder={'daily intake frequency'} />
        <TextInput style={styles.notes} placeholder={'notes'} multiline={true}/>
      </View>
    )
  }

  clear = () => {

  }


  // sends med create request to server
  _submit = () => {

  }

  render() {
    return (
      <View style={styles.fuck}>
        <Button style={{flex:1}}
          onPress={() => this.setState(prevState => {
            let newState = Object.assign(prevState, {modalActive: true})
            console.log(prevState)
            console.log(newState)
            return newState
          })}
          title={"Create Medication"}
        />

      // <View style={styles.fuck}>
      //     <Modal style={{flex:1}}>
      //       visible={this.state.modalActive}
      //       onRequestClose={() => this.setState(prevState => prevState)}>
      //       <View><Text>{'test'}</Text></View>
      //     </Modal>
      //   </View>
      // </View>
    )
  }
}

/**
 * Full screen modal
 */

const styles = StyleSheet.create({
  fuck: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },

  title: {
    flex: 1
  },

  freq: {
    flex: 1
  },

  notes: {
    flex: 3
  }
})
