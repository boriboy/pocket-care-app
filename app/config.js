import * as firebase from 'firebase'
import { initializeApp } from 'firebase'

const facebookAppId = '1824628664238434'
const googleSocial = {
    webClientId: '615758584151-52erc5itf74vulgnv5ou7ho2ltu6o1vp.apps.googleusercontent.com',
    androidClientId: '615758584151-j80t53ogg3sia1f0g2kvk910ndds6da7.apps.googleusercontent.com',
    // androidClientId: '615758584151-u8eq0f9bdadb7l2jgllcae7lapkli0g4.apps.googleusercontent.com',
    iosClientId: '615758584151-4apq46kdgg9kpajtpt2thf52t3nvoonl.apps.googleusercontent.com',
    scopes: ['profile', 'email']
}

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
    facebookAppId,
    googleSocial
}