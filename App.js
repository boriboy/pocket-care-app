import React from 'react'
import { StyleSheet, Modal, Alert, TextInput, Button, Text, View, ScrollView, Image } from 'react-native'
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
		title: 'MY MEDS',
		headerStyle: {
			backgroundColor: '#698baa',
		},
		headerTitleStyle: {
			fontWeight: 'bold',
		},
	}

	state = defaultState

	constructor(props) {
		super(props)

		// bind methods
		this._onMedCreated = this._onMedCreated.bind(this)
		this.updateMedList = this.updateMedList.bind(this)
		this.createMed = this.createMed.bind(this)
		this.test = this.test.bind(this)
		this.test2 = this.test2.bind(this)
		this.onSignout = this.onSignout.bind(this)

		// register expo push token
		RegisterNotifications()
			.then(token => Notification.save(token))
			.catch(err => console.log('error getting token: ', err))

		// ignoring warnings
		console.ignoredYellowBox = ['Setting a timer'];
	}

	componentDidMount() {
		// call database for medications
		Medication.getAndListen(this.updateMedList)
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

	test() {
		firebase.auth().signOut().then(this.onSignout)
	}

	test2() {
		console.log(this.props.navigation.state)
	}

	render() {
		return (
			 <View style={styles.global}>
				{/* <NavigationBar title={'MY MEDS'} height={'11%'}/> */}

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

class Login extends React.Component {
	static navigationOptions = {
		title: 'Login',
	}

	constructor(props) {
		super(props)

		this.onLogin = this.onLogin.bind(this)
	}

	componentDidMount() {
		// console.log('Login mounted')

		//  else {
		// 		// logout
		// 		console.log('user is out')

		// 		// change to Login screen if not current
		// 		if (navigation.state.routeName !== 'Login') {
		// 			const resetToLogin = NavigationActions.reset({
		// 				index: 0,
		// 				actions: [NavigationActions.navigate({ routeName: 'Login' })],
		// 			})
	
		// 			// dispatch reset
		// 			navigation.dispatch(resetToLogin)
		// 		}
		// 	}
		// })
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
			<View style={{flex: 1, flexDirection: 'column'}}>
				<Button title={'google'} onPress={() => this.googleLogin()}/>
				<Button title={'facebook'} onPress={() => this.facebookLogin()}/>
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
		return (<LoginAsRootStack />)
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

const LoginAsRootStack = StackNavigator(routeConfigMap, {
	initialRouteName : "PostSplash",
});

const HomeAsRootStack = StackNavigator(routeConfigMap, {
	initialRouteName : "Home",
});

const defaultState = {
	newMedModalActive: false,
	medsLoaded: false,
	meds: [],
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
