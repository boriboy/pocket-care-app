import React, { Component } from 'react';
import { AppRegistry, FlatList, Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Fetcher from '../app/logic/fetcher';
import IntakeIndicator from './intakeIndicator';

export default class MedicationItem extends Component {
    constructor(props) {
      super(props)
  
      this.take = this.take.bind(this)
      
      this.state = {
        data: props.medication,
      }
    }

    update(med) {
        this.setState({data: med})
    }

    take(item) {
        console.log('inside take')
        // server call to create intake
        Fetcher.put(`med/take/${item._id}/${new Date().getTime()}`)
            // .then(res => this.update(res.data))
            .then(res => this.update(res.data))
    }

    promptDelete() {
        Alert.alert(`Delete ${this.state.data.title}`, `are you sure?`, [
			{text: 'Nah', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			{text: 'Yep', onPress: () => {
				this.props.deleteMethod(this.state.data)
			}}
		])
    }

    render() {
        let med = this.state.data;

        return (
            <TouchableOpacity style={styles.itemContainer}
                onLongPress={() => this.promptDelete()}>
                <Text style={styles.medicationTitle}>{med.title}</Text>
                <Text>{med.intakes.length}/{med.frequency ? med.frequency : 1}</Text>
                <IntakeIndicator medication={med} onTake={this.take} />
            </TouchableOpacity>
        )
    }
}

const styles = {
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
      
    medicationTitle: {
        fontSize: 20,
        textAlign: 'center',
        color: '#000',
    }
}