import React, { Component } from 'react';
import { AppRegistry, FlatList, Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Fetcher from '../../app/logic/fetcher';
import MedicationItem from '../../components/medicationItem';

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
		console.log(`inside sync state - ${data}`)
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
		console.log('inside medications shouldComponentUpdate')

		if (this.props.data !== nextProps.data) {
			console.log('props changed')
			this.__syncState(nextProps)
			return true
		} else {
			return this.state.data !== nextState.data
		}
	}
  
  	deleteMedication(item) {
		console.log(`Deleting ${item._id}`)
		Fetcher.del(`med/${item._id}`)
			.then(res => {
				console.log(`Success deleting ${item._id}`)
				this.setState({data: res.data, loaded: true})
		}).catch(err => console.log(err))
	}

	render() {
		console.log('rendering medications with data', this.state.data)

		// loader while async request processing
		if (!this.state.loaded) {
			return (this._renderLoader())
		} else {
			return (
				<FlatList
				data={this.state.data}
				renderItem={({item}) => {
					return (<MedicationItem medication={item} deleteMethod={this.deleteMedication}/>)
				}}
				keyExtractor={(item, index) => item._id}
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
