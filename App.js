import React from 'react'
import { StyleSheet, Modal, Alert, TextInput, Button, Text, View, ScrollView, Image, TouchableOpacity, TouchableNativeFeedback, TimePickerAndroid } from 'react-native'
import NavigationBar from './components/nav'
import Medications from './components/lists/medications'
import Fetcher from './app/logic/fetcher'
import Config from './app/config'
import RegisterNotifications from './app/notifications'
import { StackNavigator, NavigationActions } from 'react-navigation'
import { Facebook, Google } from './app/social'

// firebase
import * as firebase from 'firebase'

// models
import Medication from './app/models/med'
import Notification from './app/models/notification';

// ext libs
import _ from 'lodash'

class Home extends React.Component {

	static navigationOptions = {
		header: null
	}

	backgroundsIndexMap = {
		0: require('./app/img/backgrounds/0.jpg'),
		1: require('./app/img/backgrounds/1.jpg'),
		2: require('./app/img/backgrounds/2.jpg'),
		3: require('./app/img/backgrounds/3.jpg'),
		4: require('./app/img/backgrounds/4.jpg'),
		5: require('./app/img/backgrounds/5.jpg'),
		6: require('./app/img/backgrounds/6.jpg'),
		7: require('./app/img/backgrounds/7.jpg'),
	}

	state = defaultState

	constructor(props) {
		super(props)

		// bind methods
		this._onMedCreated = this._onMedCreated.bind(this)
		this.updateMedList = this.updateMedList.bind(this)
		this.createMed = this.createMed.bind(this)
		this.onSignout = this.onSignout.bind(this)

		// sets one of background images for current session
		this.setBackgroundImage()

		// ignoring warnings
		console.ignoredYellowBox = ['Setting a timer'];
	}

	setBackgroundImage() {
		let backgroundImageIndex = getRandomInt(0,7)
		this.state = Object.assign(this.state, {backgroundImageIndex})
	}

	getBackground() {
		return this.backgroundsIndexMap[this.state.backgroundImageIndex]
	}

	componentDidMount() {
		// register auth listener
		let authSubscribtion = firebase.auth().onAuthStateChanged(user => {
			if (user) {
				// register expo push token
				RegisterNotifications()
					.then(token => Notification.save(token))
					.catch(err => console.log('error getting token: ', err))

				// call database for medications
				Medication.getAndListen(this.updateMedList)
			}
		})
	}

	updateMedList(snapshot) {
		// inject med key into med object
		let mapped = _.map(snapshot.val(), (item, index) => {
			item.key = index
			return item
		})

		this.setState({meds: Object.values(mapped), medsLoaded: true, newMedModalActive: false})
	}

	__onChangeText(name, value) {
		this.setState(prevState => Object.assign(prevState, {[name]: value}))
	}

	_onMedCreated(res) {
		// ON MED CREATE "https://pocketcare-2d66d.firebaseio.com/meds/-L4GWuunyZx02ms49RzN"

		this.setState({newMedModalActive: false, meds: res.data})
	}

	createMed() {
		Medication.create(this.state.title, this.state.freq, this.state.notes)
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

						<Button title={'do it'} onPress={this.createMed} />
					</View>
				</ScrollView>
			</View>
		)
	}

	onSignout() {
		resetNavigationStack('Login', this.props.navigation)
	}

	render() {
		return (
			<View style={{flex: 1, flexDirection: 'column'}}>
				{/* background image */}
				<View style={{position: 'absolute',width: '100%',height: '100%',}}>
					<Image style={{flex: 1, resizeMode:'cover'}}
						source={this.getBackground()}/>
				</View>

				{/* personal area */}
					<View style={{flex:1, flexDirection: 'column', justifyContent:'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)'}}>
						<Text style={{fontSize: 40}}>My Meds</Text>

						<Image 
							style={{height:100, width:100, borderRadius: 50}}
							source={{uri: firebase.auth().currentUser.photoURL}}/>

						<Text style={{fontSize: 20}}>{firebase.auth().currentUser.displayName}</Text>
					</View>
				{/* meds list */}
					<View style={{flex:2}}>
						<Medications data={this.state.meds} loaded={this.state.medsLoaded}/>
						<TouchableNativeFeedback onPress={() => {this.props.navigation.navigate('CreateModal')}}
							background={TouchableNativeFeedback.SelectableBackground()}>
							<View style={{
								alignItems: 'center',
								justifyContent: 'center',
								height: 50,
								paddingLeft: 30,
								paddingRight: 30,
								backgroundColor: 'rgba(255,255,255,0.9)'}}>
								<Text>+ Add Medication</Text>
							</View>
						</TouchableNativeFeedback>
					</View>
			</View>
		)
	}

	OLD_render() {
		return (
			 <View style={styles.global}>

				<View style={styles.mainContainer}>
					<View style={styles.medsScrollView}>
						<Medications data={this.state.meds} loaded={this.state.medsLoaded}/>
					</View>

					<Button title={'CREATE MEDICATION'} onPress={() => this.setState({newMedModalActive: true})} />
					<Button title={'logout'} onPress={this.test} />
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

class CreateMedicationScreen extends React.Component {
	render() {
	  return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
		  <Text style={{ fontSize: 30 }}>This is a modal!</Text>
		  <Button
			onPress={() => this.props.navigation.goBack()}
			title="Dismiss"
		  />
		</View>
	  );
	}
}

class Login extends React.Component {
	static navigationOptions = {
		header: null,
	}

	constructor(props) {
		super(props)

		this.onLogin = this.onLogin.bind(this)
	}

	onLogin() {
		resetNavigationStack('Home', this.props.navigation)
	}

	googleLogin() {
		Google.login().then(this.onLogin)
	}
	
	
	facebookLogin() {
		Facebook.login().then(this.onLogin)
	}


	render() {
		return (
			<View style={{flex: 1}}>
				{/* background image */}
				<View
					style={{
						position: 'absolute',
						width: '100%',
						height: '100%',
					}}
					>
					<Image
						style={{
						flex: 1,
						resizeMode:'cover',
						opacity: 0.60,
						}}
						blurRadius={0.5}
						source={require('./app/img/login-background.jpg')}
					/>
				</View>

				<View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
				
				{/* header */}
					<View style={{flex: 1, height: 50}}>
						<Text style={{fontSize: 50, padding: 50}}>PocketCare</Text>
					</View>
	
				{/* social login section */}
					<View style={{flex: 2, width: '100%', flexDirection: 'column', justifyContent: 'center'}}>
						<Text style={{paddingBottom: 30, alignSelf: 'center'}}>
							connect with
						</Text>

						{/* social images */}
						<View style={{flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 100}}>
							<TouchableOpacity onPress={() => this.facebookLogin()}>
								<Image
									style={styles.socialImage}
									source={require('./app/img/fb.png')}
								/>
							</TouchableOpacity>

							<TouchableOpacity onPress={() => this.googleLogin()}>
								<Image
									style={styles.socialImage}
									source={require('./app/img/google.png')}
								/>
							</TouchableOpacity>

							{/* timepicker test */}
							<TouchableOpacity onPress={() => {
								try {
									TimePickerAndroid.open({
										hour: 14,
										minute: 0,
										is24Hour: true, // Will display '2 PM'
										mode: 'spinner'
									}).then(({action, hour, minute}) => {
										console.log(action, hour, minute);
										if (action !== TimePickerAndroid.dismissedAction) {
											// hour minute are set
											var date = new Date()
											date.setHours(hour)
											date.setMinutes(minute)

											console.log('the final date is: ', date)
										}
									})
	
									// console.log(action, hour, minute);
								} catch({code, message}) {
									console.warn('Cannot open time picker', message)
								}
								
							}}>
								<View style={{height:50, width:50, backgroundColor:'#fff'}}>

								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		)
	}
}

class PostSplash extends React.Component {
	static navigationOptions = {
		header: null
	}
	
	render() {
		return (
			<View style={{flex:1}}>
				<Image
					resizeMode={'cover'}
					style={{height:'100%', width:'100%'}}
					source={require('./app/img/splash.png')}
				/>
			</View>
		)
	}

	unsubscribeAfterAuthResolved() {
		this.state.unsubscriber()
	}

	componentDidMount() {
		var unsubscribeAuthObserver = firebase.auth().onAuthStateChanged(user => {
			console.log('POST SPLASHES AUTHSTATECHANGE')
			let goTo = user ? 'Home' : 'Login'
			
			resetNavigationStack(goTo, this.props.navigation)

			// trigger unsubscriber
			this.unsubscribeAfterAuthResolved()
		})

		// save unsubscriber
		this.setState({unsubscriber: unsubscribeAuthObserver})
	}
}

export default class App extends React.Component {
	render() {
		return (<RootStack />)
	}
}

const resetNavigationStack = function(to, navigation) {
	var navigationActions = NavigationActions.reset({
		index: 0,
		actions: [NavigationActions.navigate({ routeName: to })],
	})

	// dispatch reset
	navigation.dispatch(navigationActions)
}

const routeConfigMap = {
	PostSplash: {
		screen: PostSplash,
	},

	Login: {
		screen: Login,
	},

	Home: {
		screen: Home,
	}
}
const MainStack = StackNavigator({
	PostSplash: {
		screen: PostSplash,
	},

	Login: {
		screen: Login,
	},

	Home: {
		screen: Home,
	}
},{
	initialRouteName : "PostSplash",
})

const RootStack = StackNavigator(
	{
	  Main: {
		screen: MainStack,
	  },
	  CreateModal: {
		screen: CreateMedicationScreen,
	  },
	},
	{
	  mode: 'modal',
	  headerMode: 'none',
	}
  );

const defaultState = {
	backgroundImageIndex: 4,
	newMedModalActive: false,
	medsLoaded: false,
	meds: [],
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

	socialImage : {
		height: 85,
		width: 85,
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
