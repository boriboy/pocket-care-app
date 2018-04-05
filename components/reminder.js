import React from 'react'
import { Alert, Text, View, TouchableNativeFeedback, TimePickerAndroid, CheckBox } from 'react-native'

export default class Reminder extends React.Component{

    constructor(props) {
        super(props)

        this.state = {
            hour: '',
            minute: '',
        }
    }

    openOSClock() {
		try {
			return TimePickerAndroid.open({
				hour: 14,
				minute: 0,
				is24Hour: true, // Will display '2 PM'
				mode: 'spinner'
			}).then(({action, hour, minute}) => {
                console.log('TIME PICKER ACTION', action, hour, minute)
				if (action !== TimePickerAndroid.dismissedAction) {
					// hour minute are set
					var date = new Date()
					date.setHours(hour)
					date.setMinutes(minute)
					return {date, hour, minute}
				}
			})
		} catch({code, message}) {
			console.warn('Cannot open time picker', message)
		}
    }
    
    render() {
        return (
            <View style={{flex:1, alignItems:'center'}} >
                {/* reminder header */}
                <Text style={{flex:1, }}>reminder {this.props.index + 1}</Text>
    
                {/* native clock trigger */}
                <TouchableNativeFeedback style={{borderRadius:50}} onPress={() => {
                    this.openOSClock()
                        .then(({date, hour, minute}) => {
                            // update med data
                            if(date) {
                                console.log('the final date is: ', date)
                                this.props.addReminder(this.props.index, date)
                            }

                            // display hour minute
                            console.log('hour minute: ', hour, minute)
                            this.setState({hour, minute})
                        }).catch(({code, message}) => {
                            console.warn('Cannot open time picker', message)
                        })
                }}>
                    <View style={{justifyContent:'center', alignItems:'center', width:200, height:50, borderColor:'#555', borderWidth:1, borderRadius:50, marginBottom:'3%'}}>
                        <Text style={{flex:1}}>
                            {(String(this.state.hour).length != 0 && String(this.state.minute).length != 0) ? `${prefixZeros(this.state.hour)}:${prefixZeros(this.state.minute)}` : ''}
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    }
}

const prefixZeros = function (num) {
    let stringedNumber = String(num)

    if (stringedNumber.length === 1) {
        return `0${stringedNumber}`
    } else {
        return stringedNumber
    }
}