import * as firebase from 'firebase'
import Config from '../config'

export default class NotificationModel {
    static save(token) {
        console.log('registering push token:', token)
        var strippedToken = token.substring(token.indexOf('[') + 1, token.indexOf(']'))
        firebase.database().ref(`${Config.DatabasePrefix}/users/${firebase.auth().currentUser.uid}/token`).set(strippedToken)
    }
}