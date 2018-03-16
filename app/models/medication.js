import * as firebase from 'firebase'

export default class MedicationModel {
    static create(name = '', freq = 1, notes = '') {
        let isNew = true
        let uid = firebase.auth().currentUser.uid

        // create med key
        let medKey = firebase.database().ref(`/meds/${uid}`).push().key

        // create med, add med key under users
        let updates = {}
        updates[`/users/${uid}/meds/${medKey}`] = true
        updates[`/meds/${uid}/${medKey}`] = {name, freq, notes, isNew}

        // update
        return firebase.database().ref().update(updates)
    }

    static delete(key) {
        let uid = firebase.auth().currentUser.uid

        // delete med from meds and user listed
        let update = {}
        update[`/meds/${uid}/${key}`] = null
        update[`/users/${uid}/meds/${key}`] = null

        // trigger update
        return firebase.database().ref().update(update)
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
    static getOnce(callback) {
        return firebase.database().ref(`meds/${firebase.auth().currentUser.uid}`).once('value', callback)
    }

}