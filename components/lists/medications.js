import React, { Component } from 'react';
import { AppRegistry, FlatList, Button, Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Fetcher from '../../app/logic/fetcher';
import MedicationItem from '../../components/medicationItem';

// models
import Medication from '../../app/models/med'

export default class Medications extends Component {
	constructor(props) {
		super(props)

		// bind methods
		this.deleteMedication = this.deleteMedication.bind(this)

		this.state = {
			data: props.data,
			loaded: props.loaded
		}
	}

	__syncState(data) {
		this.setState(data)
	}

	_renderLoader() {
		return (
		<View style={styles.loaderContainer}>
			<Text>{'fetching meds'}</Text>
		</View>
		)
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.data !== nextProps.data) {
			this.__syncState(nextProps)
			return true
		} else {
			return this.state.data !== nextState.data
		}
	}
  
  	deleteMedication(key) {
		console.log(`Deleting ${key}`)
		Medication.delete(key).catch(err => {
			console.log(err)
			Alert.alert('Deleting went wrong :(')
	})

		// Fetcher.del(`med/${item._id}`)
		// 	.then(res => {
		// 		console.log(`Success deleting ${item._id}`)
		// 		this.setState({data: res.data, loaded: true})
		// }).catch(err => console.log(err))
	}

	render() {
		// loader while async request processing
		if (!this.state.loaded) {
			return (this._renderLoader())
		} else {
			return (
				<FlatList
					data={this.state.data}
					keyExtractor={item => item.key}
					renderItem={({item}) => {
						return (<MedicationItem medication={item} deleteMethod={this.deleteMedication}/>)
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
