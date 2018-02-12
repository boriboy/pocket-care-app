import React, { Component } from 'react'
import { AppRegistry, FlatList, Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import Fetcher from '../app/logic/fetcher'
import IntakeIndicator from './intakeIndicator'
import _ from 'lodash'

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
        // server call to create intake
        Fetcher.put(`med/take/${item._id}/${new Date().getTime()}`)
            // .then(res => this.update(res.data))
            .then(res => this.update(res.data))
    }

    promptDelete() {
        Alert.alert(`Delete ${this.state.data.name}`, `are you sure?`, [
			{text: 'Nah', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			{text: 'Yep', onPress: () => {
				this.props.deleteMethod(this.state.data.key)
			}}
		])
    }

    takenToday() {
        // init start of day
        let today = new Date()
        today.setHours(0)
        today.setMinutes(0)
        today.setSeconds(0)

        // count intakes occured since start of day
        let takenToday = _.filter(this.state.data.intakes, intake => {
            return new Date(intake.created_at) > today.getTime()
        })

        // return intake count
        return takenToday.length
    }

    render() {
        let med = this.state.data;

        return (
            <TouchableOpacity style={styles.itemContainer}
                onLongPress={() => this.promptDelete()}>
                <Text style={styles.medicationTitle}>{med.name}</Text>
                <Text>{1}/{med.frequency ? med.frequency : 1}</Text>
                <Text>{this.takenToday()}/{med.frequency ? med.frequency : 1}</Text>
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