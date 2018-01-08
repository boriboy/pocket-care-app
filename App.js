import React from 'react';
import { StyleSheet, Modal, Alert, TextInput, Button, Text, View } from 'react-native';
import NavigationBar from './components/nav';
import Medications from './components/lists/medications';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {newMedModalActive: false}
  }

  _getModalContent() {
    return (
      <View style={styles.newMedModalContainer}>
        <TextInput style={[styles.input, styles.title]} placeholder={'medication name'} />
        <TextInput style={[styles.input, styles.freq]} placeholder={'daily intake frequency'} />
        <TextInput style={[styles.input, styles.notes]} placeholder={'notes'} multiline={true} />
      </View>
    )
  }

  render() {
    return (
       <View style={styles.global}>
        <NavigationBar />

        <View style={styles.mainContainer}>
          <View style={styles.medsScrollView}>
            <Medications />
          </View>

          <Button title={'CREATE MED'} onPress={() => this.setState({newMedModalActive: true})} />
        </View>

        <Modal
          style={{backgroundColor: 'black', margin:10}}
          visible={this.state.newMedModalActive}
          onRequestClose={() => this.setState({newMedModalActive:false})}
          animationType={'slide'}
          hardwareAccelerated={true}>
          {this._getModalContent()}
          </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccdae7',
  },

  global: {
    backgroundColor: '#ccdae7',
    flex: 1
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },

  medsScrollView: {
    flex:1,
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },

  /* new medication inputs */
  input: {
    borderWidth: 1,
    borderColor: 'black',
  },

  newMedModalContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 20
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
});
