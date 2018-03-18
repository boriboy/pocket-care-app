import * as firebase from 'firebase'

export default class NotificationModel {
    static save(token) {
        console.log('registering push token:', token)
        var strippedToken = token.substring(token.indexOf('[') + 1, token.indexOf(']'))
        firebase.database().ref(`tokens/${firebase.auth().currentUser.uid}`).set(strippedToken)
    }
}