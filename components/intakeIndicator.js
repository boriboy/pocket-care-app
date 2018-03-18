import React, { Component } from 'react';
import { AppRegistry, StyleSheet, TouchableNativeFeedback, View, Text, Image } from 'react-native';

// models
import Medication from '../app/models/medication'

export default class IntakeIndicator extends Component {

	constructor(props) {
		super(props)

		let recentlyTaken = IntakeIndicator.isRecentlyTaken(props.medication) 
		this.state = {recentlyTaken}
	}

	componentWillReceiveProps(nextProps) {
		let recentlyTaken = IntakeIndicator.isRecentlyTaken(nextProps.medication) 
		this.setState({recentlyTaken})
	}

	_indicatorStyle() {
		return {
			width:50,
			height:50,
			justifyContent:'center',
			alignItems:'center',
		}
	}

	_vStyle() {
		return {
			width:50,
			height:50
		}
	}

	static isRecentlyTaken = function (med) {
		if (!med.intakes) {
			return false
		}

		var intakesArray = Object.values(med.intakes)
		var lastIntake = intakesArray[intakesArray.length - 1]
		var lastIntakeDate = new Date(lastIntake)
		var now = new Date()

		// set comparison to 6 minutes ago
		now.setMinutes(now.getMinutes() - 6)

		// console.log(lastIntakeDate >= now)
		return lastIntakeDate >= now
	}

	render() {
		// isDone
		if (this.state.recentlyTaken || this.props.isDone) {
			return (<TouchableNativeFeedback onPress={this.props.take}>
				<View style={this._vStyle()}>
					<Image style={{height:50, width:50}} source={require('../app/img/icons/v.png')} />
				</View>
			</TouchableNativeFeedback>
		)} else {
			return (
			<TouchableNativeFeedback onPress={this.props.take}>
				<View style={this._indicatorStyle()}>
					<Text style={{height: 10, width: 10, borderRadius:50, backgroundColor:'#FF9797'}}></Text>
				</View>
			</TouchableNativeFeedback>
	)}
	}
}
