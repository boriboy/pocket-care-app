import * as firebase from 'firebase'
import { initializeApp } from 'firebase'

const facebookAppId = '1824628664238434'

const firebaseConfig = {
    apiKey: "AIzaSyC7J1L3-3VsksKfPF-XDq7RJbo86q4pYkM",
    authDomain: "pocketcare-2d66d.firebaseapp.com",
    databaseURL: "https://pocketcare-2d66d.firebaseio.com",
    projectId: "pocketcare-2d66d",
    storageBucket: "pocketcare-2d66d.appspot.com",
    messagingSenderId: "615758584151"
}

// init firebase
firebase.initializeApp(firebaseConfig)

export default {
    facebookAppId
}