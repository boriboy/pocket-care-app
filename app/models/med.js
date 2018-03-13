import * as firebase from 'firebase'

export default class MedicationModel {
    static create(name = '', freq = 1, notes = '') {
        var isNew = true
        return firebase.database().ref(`meds/${firebase.auth().currentUser.uid}`).push({name, freq, notes, isNew})
    }

    static delete(key) {
        return firebase.database().ref(`meds/${firebase.auth().currentUser.uid}/${key}`).remove()
    }

    static take(medication, callback) {
        let date = new Date()
        console.log('MEDICATION KEY IS', medication.key)
        let ref = firebase.database().ref(`meds/${firebase.auth().currentUser.uid}/${medication.key}`)

        if (medication.isNew) {
            // create intakes object and get key 
            var intakeKey = ref.child('intakes').push().key
            console.log('INTAKE KEY IS', intakeKey)

            // set isNew = false and add date to intake
            let updates = {}
            updates['isNew'] = false
            updates[`intakes/${intakeKey}`] = date.toISOString()

            // update
            return ref.update(updates)
        } else {
            // medication is not new, push date to intakes
            return ref.child('intakes').push(date.toISOString())
        }
    }

    // ----- [listeners] ----- //

    // returns all meds of a user
    static get(callback) {
        return firebase.database().ref(`meds/${firebase.auth().currentUser.uid}`).once('value', callback)
    }

}