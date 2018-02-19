import * as firebase from 'firebase'

export default class NotificationModel {
    static save(token) {
        console.log('push token:', token)
        firebase.database().ref(`tokens/${token.substring(token.indexOf('[') + 1, token.indexOf(']'))}`).set(token)
    }
}