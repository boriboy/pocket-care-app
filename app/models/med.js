import * as firebase from 'firebase'

export default class MedicationModel {
    static create(name = '', freq = 1, notes = '') {
        return firebase.database().ref(`meds/${firebase.auth().currentUser.uid}`).push({name, freq, notes})
    }

    static delete(key) {
        return firebase.database().ref(`meds/${firebase.auth().currentUser.uid}/${key}`).remove()
    }

    // returns all meds of a user
    static getAndListen(callback) {
        return firebase.database().ref(`meds/${firebase.auth().currentUser.uid}`).on('value', callback)
    }

    static take(id, callback){
        return firebase.database().ref(`intakes/${id}`).push({date: new Date()})
    }
}