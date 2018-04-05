import * as firebase from 'firebase'
import Config from '../config'

export default class UserModel {
    static medsListener(callback) {
        return firebase.database().ref(`${Config.DatabasePrefix}/users/${firebase.auth().currentUser.uid}/meds`).on('value', callback)
    }
}