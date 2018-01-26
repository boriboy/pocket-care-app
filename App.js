import React from 'react';
import { StyleSheet, Modal, Alert, TextInput, Button, Text, View, ScrollView } from 'react-native';
import NavigationBar from './components/nav';
import Medications from './components/lists/medications';
import Fetcher from './app/logic/fetcher';

export default class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = defaultState

    // call server for medications
    Fetcher.get('med').then(res => {
      console.log('fetched meds in App.js')
      this.setState(Object.assign(defaultState, {meds: res.data, medsLoaded: true}))
    })
  }

  __onChangeText(name, value) {
    this.setState(prevState => Object.assign(prevState, {[name]: value}))
  }

  _resetState() {
    this.setState(defaultState)
  }

  _onMedCreate(res) {
    this.setState({newMedModalActive: false, meds: res.data, updateMedicationsComponent: true})
    // todo: add ui ack
  }

  _createMed() {
    Fetcher.post('med', this.state)
      // .then(this._onMedCreate)
      .then(res => this._onMedCreate(res))
      .catch(err => Alert.alert('Something went wrong :('))
  }

  _getModalContent() {
    return (
        <View style={styles.modalBackground}>
          <ScrollView>
            <View style={styles.modalInnerContainer}>
              <NavigationBar title={'NEW MEDICATION'} height={0}/>
              <View style={styles.inputsContainer}>
                <TextInput style={[styles.input, styles.title]} placeholder={'medication name'} onChangeText={text => this.__onChangeText('title', text)} />
                <TextInput style={[styles.input, styles.freq]} placeholder={'daily intake frequency'} onChangeText={text => this.__onChangeText('freq', text)} 
					keyboardType={'numeric'}/>
                <TextInput style={[styles.input, styles.notes]} placeholder={'notes'} multiline={true} onChangeText={text => this.__onChangeText('notes', text)} />
              </View>

              <Button title={'do it'} onPress={() => this._createMed()} />
            </View>
          </ScrollView>
        </View>
    )
  }

  render() {
    return (
       <View style={styles.global}>
        <NavigationBar title={'MY MEDS'} height={'11%'}/>

        <View style={styles.mainContainer}>
          <View style={styles.medsScrollView}>
            <Medications data={this.state.meds} loaded={this.state.medsLoaded}/>
          </View>

		  <Button title={'CREATE MEDICATION'} onPress={() => this.setState({newMedModalActive: true})} />
        </View>

        <Modal
          style={styles.modal}
          visible={this.state.newMedModalActive}
          onRequestClose={() => this.setState({newMedModalActive:false})}
          animationType={'slide'}
          hardwareAccelerated={true}
          transparent={true}>
          {this._getModalContent()}
        </Modal>

      </View>
    )
  }
}

const defaultState = {
  newMedModalActive: false,
  medsLoaded: false,
  meds: [],
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

  /* modal */
  modal: {
    backgroundColor: '#000',
    margin:10,
  },

  modalBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor:'rgba(0,0,0,0.5)'
  },

  modalInnerContainer: {
    flex: 1,
    minHeight: 400,
    maxHeight: 500,
    flexDirection: 'column',
    margin: 20,
    backgroundColor:'#fff',
    borderRadius: 10,
  },

  inputsContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
  },

  /* new medication inputs */
  input: {
    padding: 20,
  },

  title: {
    flex: 1
  },

  freq: {
    flex: 1
  },

  notes: {
    flex: 2
  }
});
