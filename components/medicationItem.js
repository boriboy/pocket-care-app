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
        // Fetcher.put(`med/take/${item._id}/${new Date().getTime()}`)
            // .then(res => this.update(res.data))
            // .then(res => this.update(res.data))
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

    getStyle() {
        let opacity = this.props.isEven ? '0.75' : '0.90'

        return {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 50,
            paddingLeft: 30,
            paddingRight: 30,
            backgroundColor: `rgba(255,255,255,${opacity})`
          }
    }

    render() {
        let med = this.state.data;

        return (
            <TouchableOpacity activeOpacity={0.9} style={this.getStyle()} onLongPress={() => this.promptDelete()}>
                {/* med name */}
                <View style={{flex: 2}}>
                    <Text style={styles.medicationTitle}>{med.name}</Text>
                </View>

                {/* count & intake */}
                <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-around', alignItems: 'center'}}>
                    <Text>{this.takenToday()}/{med.frequency ? med.frequency : 1}</Text>
                    <IntakeIndicator medication={med} onTake={this.take} />
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = {
    medicationTitle: {
        fontSize: 20,
        color: '#000',
    }
}