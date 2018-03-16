import React, { Component } from 'react'
import { AppRegistry, FlatList, Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import Fetcher from '../app/logic/fetcher'
import IntakeIndicator from './intakeIndicator'
import _ from 'lodash'

// firebase
import * as firebase from 'firebase'

// models
import Medication from '../app/models/medication'

// logic
import Normalizer from '../app/logic/normalizer'

export default class MedicationItem extends Component {
    constructor(props) {
        super(props)

        this.take = this.take.bind(this)
        this.update = this.update.bind(this)
        
        // count taken today
        let taken = this.takenToday(props.medication)
        let isDone = this.isDone(props.medication)

        this.state = {
            data: props.medication,
            taken,
            isDone,
        }
    }

    componentDidMount() {
        // create reference & subscribe to changes on med
        let medRef = firebase.database().ref(`meds/${firebase.auth().currentUser.uid}/${this.props.medication.key}`)
        // attach listener
        medRef.on('value', this.update)

        // add medication database reference to state
        this.setState(prevState => Object.assign(prevState, {medRef}))
    }
    
    componentWillUnmount() {
        console.log('unmounting ', this.props.medication.key)
        this.state.medRef.off()
    }

    shouldComponentUpdate(nextProps, nextState) {
        // true if should
        // should only if state changed
        console.log('should med item update?', nextState.data !== this.state.data)
        return nextState.data !== this.state.data
    }

    update(snapshot) {
        if (snapshot) {
            console.log('INSIDE MED UPDATE WITH SNAPSHOT -', snapshot)
            // update med and intakes count
            let med = Normalizer.adoptKey(snapshot.val(), snapshot.key)
            let taken = this.takenToday(med)
            let isDone = this.isDone(med, taken)
            this.setState(prevState => Object.assign(prevState, {data: med, taken, isDone}))
        }
    }

    take() {
        if (this.state.isDone) {
            // dont allow more intakes
            return Alert.alert('HOORAY', 'You\'ve taken all your medication for today, way to go!')
        }

        // server call to create intake
        Medication.take(this.state.data).catch(err => console.log('error taking med ', this.state.data.key))
    }

    promptDelete() {
        Alert.alert(`Delete ${this.state.data.name}`, `are you sure?`, [
			{text: 'Nah', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			{text: 'Yep', onPress: () => {
                this.state.medRef.off()
				this.props.deleteMethod(this.state.data.key)
			}}
		])
    }

    takenToday(med) {
        // init start of day
        let today = new Date()
        today.setHours(0)
        today.setMinutes(0)
        today.setSeconds(0)

        // count intakes occured since start of day
        var takenToday = _.filter(med.intakes, intake => {
            return new Date(intake) > today.getTime()
        })

        // TODO delete previous day's intakes here
        // return intake count
        return takenToday.length
    }

    isDone(med, takenToday) {
        console.log('is done', Number(med.freq) <= takenToday)
        return Number(med.freq) <= takenToday
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
            paddingRight: 5,
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
                    <Text>{this.state.taken ? this.state.taken : 0}/{med.freq ? med.freq : 1}</Text>
                    
                    <IntakeIndicator medication={med} onTake={this.take} isEven={this.props.isEven} isDone={this.state.isDone}/>
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