import React, { Component } from 'react';
import { AppRegistry, FlatList, Button, Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Fetcher from '../../app/logic/fetcher';
import MedicationItem from '../../components/medicationItem';

// logic
import Normalizer from '../../app/logic/normalizer'

// models
import Medication from '../../app/models/medication'

// ext libs
import _ from 'lodash'

export default class Medications extends Component {
	constructor(props) {
		super(props)

		// bind methods
		this.deleteMedication = this.deleteMedication.bind(this)

		// inject med id into data
		var mappedMeds = _.map(props.meds, Normalizer.adoptKey)

		console.log('inside medications list constructor - ', mappedMeds)
		this.state = {
			meds: mappedMeds,
			loaded: props.loaded
		}
	}

	__syncState(data) {
		this.setState(data)
	}

	loader() {
		return (
		<View style={styles.loaderContainer}>
			<Text>{'fetching meds'}</Text>
		</View>
		)
	}
	
	emptyList() {
		return (
		<View style={styles.loaderContainer}>
			<Text>{'No medications yet'}</Text>
		</View>
		)
	}

	componentWillReceiveProps(nextProps) {
		var mappedMeds = _.map(nextProps.meds, Normalizer.adoptKey)
		this.setState({
			meds: mappedMeds,
			loaded: nextProps.loaded
		})
	}

	shouldComponentUpdate(nextProps, nextState) {
		// allow only new props to influence rerendering - med items rerender independantly
		console.log('should med list update? ', nextProps.meds !== this.props.meds)
		return nextProps.meds !== this.props.meds
	}
  
  	deleteMedication(key) {
		console.log(`Deleting ${key}`)
		Medication.delete(key).catch(err => {
			console.log(err)
			Alert.alert('Deleting went wrong :(')
		})
	}

		
	render() {
		// loader while async request processing
		if (!this.state.loaded) {
			return (this.loader())
		} else if (this.state.meds.length === 0) {
			return (this.emptyList())
		} else {
			var isEven = false
			return (
				<FlatList
					data={this.state.meds}
					keyExtractor={item => item.key}
					renderItem={({item}) => {
						isEven = !isEven
						return (<MedicationItem medication={item} deleteMethod={this.deleteMedication} isEven={isEven}/>)
					}}
				/>
			)}
	}
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
