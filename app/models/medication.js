import * as firebase from 'firebase'
import Config from '../config'

export default class MedicationModel {
    static create(name = '', freq = 1, remind = false, reminders = {}) {
        let isNew = true
        let uid = firebase.auth().currentUser.uid

        // create med key
        let medKey = firebase.database().ref(`${Config.DatabasePrefix}/meds/${uid}`).push().key

        // create med, add med key under users
        let updates = {}
        updates[`${Config.DatabasePrefix}/users/${uid}/meds/${medKey}`] = true
        updates[`${Config.DatabasePrefix}/meds/${uid}/${medKey}`] = {name, freq, isNew, remind, reminders}

        // update
        return firebase.database().ref().update(updates)
    }

    static delete(key) {
        let uid = firebase.auth().currentUser.uid

        // delete med from meds and user listed
        let update = {}
        update[`${Config.DatabasePrefix}/meds/${uid}/${key}`] = null
        update[`${Config.DatabasePrefix}/users/${uid}/meds/${key}`] = null

        // trigger update
        return firebase.database().ref().update(update)
    }

    static take(medication) {
        let date = new Date()
        let ref = firebase.database().ref(`${Config.DatabasePrefix}/meds/${firebase.auth().currentUser.uid}/${medication.key}`)

        if (medication.isNew) {
            // create intakes object and get key 
            var intakeKey = ref.child('intakes').push().key

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
        console.log('Config', Config.DatabasePrefix)
        return firebase.database().ref(`${Config.DatabasePrefix}/meds/${firebase.auth().currentUser.uid}`).once('value', callback)
    }

}