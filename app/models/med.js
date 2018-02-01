import * as firebase from 'firebase'

export default class MedicationModel {
    static create() {
        firebase.database().ref('pen').set('is')
    }
}