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
import User from './app/models/user'
import Medication from './app/models/medication'
import Notification from './app/models/notification';

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

	defaultState = {
		backgroundImageIndex: 4,
		newMedModalActive: false,
		medsLoaded: false,
		meds: {},
	}

	constructor(props) {
		super(props)

		// bind methods
		this.onMedsRetreived = this.onMedsRetreived.bind(this)
		this.onMedsAltered = this.onMedsAltered.bind(this)
		this.listenToUserMeds = this.listenToUserMeds.bind(this)
		this.promptLogout = this.promptLogout.bind(this)
		this.logout = this.logout.bind(this)
		this.onLogout = this.onLogout.bind(this)

		// sets one of background images for current session
		let backgroundImageIndex = getRandomInt(0,7)
		this.state = Object.assign(this.defaultState, {backgroundImageIndex})
		
		// ignoring warnings
		console.ignoredYellowBox = ['Setting a timer'];
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
				Medication.getOnce(this.onMedsRetreived)
				// listener below will be triggered after all components tree finish rendering
				.then(this.listenToUserMeds)
				
			}
		})

		this.setState(prevState => Object.assign(prevState, {authSubscribtion}))
	}

	listenToUserMeds() {
		User.medsListener(this.onMedsAltered)
	}

	onMedsAltered(snapshot) {
		if (snapshot) {
			let userMeds = snapshot.val()

			// refetch meds once only if user's meds has altered (added/removed)
			if (this.didMedsAlter(userMeds)) {
				Medication.getOnce(this.onMedsRetreived)
			}
		}
	}

	didMedsAlter(userMeds) {
		let updatedCount;
		if (!userMeds) updatedCount = 0
		else updatedCount = Object.keys(userMeds).length

		// meds treated as altered if local state med count doesn't equal to server med count
		if (this.state.meds)
			return Object.keys(this.state.meds).length !== updatedCount
		else
			return 0 !== updatedCount
	}

	componentWillUnmount() {
		this.state.authSubscribtion()
	}

	setBackgroundImage() {
		let backgroundImageIndex = getRandomInt(0,7)
		this.state = Object.assign(this.state, {backgroundImageIndex})
	}

	getBackground() {
		return this.backgroundsIndexMap[this.state.backgroundImageIndex]
	}

	onMedsRetreived(snapshot) {
		this.setState(prevState => {
			return Object.assign(prevState, {meds: snapshot.val(), medsLoaded: true})
		})
	}

	promptLogout() {
		Alert.alert('Logout', 'don\'t leave for long', [
			{text: 'I promise', onPress:() => {this.logout()}, style: 'cancel'},
		])
	}

	logout() {
		firebase.auth().signOut().then(this.onLogout)
	}

	onLogout() {
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

						{/* avatar */}
						<TouchableOpacity activeOpacity={0.6} onLongPress={this.promptLogout}>
							<Image style={{height:100, width:100, borderRadius: 50}}
								source={{uri: firebase.auth().currentUser ? firebase.auth().currentUser.photoURL : ''}}/>
						</TouchableOpacity>
						{/* user name */}
						<Text style={{fontSize: 20}}>{firebase.auth().currentUser ? firebase.auth().currentUser.displayName : ''}</Text>
					</View>
				{/* meds list */}
					<View style={{flex:2, backgroundColor: 'rgba(255,255,255,0.5)'}}>
					{/* list */}
						<Medications meds={this.state.meds} loaded={this.state.medsLoaded}/>

					{/* add med button */}
						<TouchableNativeFeedback onPress={() => {this.props.navigation.navigate('CreateMedicationScreen')}}>
							<View style={{
								alignItems: 'center',
								justifyContent: 'center',
								height: 50,
								paddingLeft: 30,
								paddingRight: 30,
								backgroundColor: '#5585542A'}}>
								<Text>+ Add Medication</Text>
							</View>
						</TouchableNativeFeedback>
					</View>
			</View>
		)
	}
}

class CreateMedicationScreen extends React.Component {
	constructor(props) {
		super(props)

		this.submit = this.submit.bind(this)

		this.state = {
			name: '',
			freq: 3,
			reminder: false
		}
	}

	submit() {
		Medication.create(this.state.name, this.state.freq, this.state.reminder)
			.then(() => this.props.navigation.goBack())
			.catch(err => Alert.alert('Something went wrong :('))
	}

	render() {
	  return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
		  <Text style={{ fontSize: 30 }}>Create med</Text>

			{/* timepicker test */}
			<TouchableOpacity onPress={() => {
				try {
					TimePickerAndroid.open({
						hour: 14,
						minute: 0,
						is24Hour: true, // Will display '2 PM'
						mode: 'spinner'
					}).then(({action, hour, minute}) => {
						if (action !== TimePickerAndroid.dismissedAction) {
							// hour minute are set
							var reminder = new Date()
							reminder.setHours(hour)
							reminder.setMinutes(minute)

							console.log('the final date is: ', reminder)
							this.setState({reminder})
						}
					})

				} catch({code, message}) {
					console.warn('Cannot open time picker', message)
				}
				
			}}>
				<View style={{height:50, width:50, backgroundColor:'#fff'}}>
					<Text>Add Time</Text>
				</View>
			</TouchableOpacity>

			
			<TextInput 
				style={styles.textInput}
				onChangeText={name => this.setState(prevState => Object.assign(prevState, {name}))}
				value={this.state.name}
				/>

			<TextInput 
				onChangeText={freq => this.setState(prevState => Object.assign(prevState, {freq}))}
				value={String(this.state.freq)}
				keyboardType={'numeric'}
				maxLength={20}
				/>

				
			<Button
				onPress={this.submit}
				title="Alright"
			/>

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

		// this.onLogin = this.onLogin.bind(this)
	}

	componentDidMount() {
		let authUnsubscriber = firebase.auth().onAuthStateChanged(user => {
			if (user) {
				resetNavigationStack('Home', this.props.navigation)
			}
		})
		
		this.setState({authUnsubscriber})
	}

	componentWillUnmount() {
		this.state.authUnsubscriber()
	}

	googleLogin() {
		Google.login()
	}
	
	
	facebookLogin() {
		Facebook.login()
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

				{/* content */}
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
		var unsubscriber = firebase.auth().onAuthStateChanged(user => {
			console.log('firebase authentication state updated')
			let goTo = user ? 'Home' : 'Login'
			
			resetNavigationStack(goTo, this.props.navigation)

			// trigger unsubscriber
			this.unsubscribeAfterAuthResolved()
		})

		// save unsubscriber
		this.setState({unsubscriber})
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
	  CreateMedicationScreen: {
		screen: CreateMedicationScreen,
	  },
	},
	{
	  mode: 'modal',
	  headerMode: 'none',
	}
  );


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

	textInput: {
		width: 200,
		height: 50,
		margin: 20,
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
