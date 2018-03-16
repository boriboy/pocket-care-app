import * as firebase from 'firebase'

export default class UserModel {
    static medsListener(callback) {
        return firebase.database().ref(`users/${firebase.auth().currentUser.uid}/meds`).on('value', callback)
    }
}