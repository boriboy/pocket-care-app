import * as firebase from 'firebase'
import { initializeApp } from 'firebase'
import {Constants as ExpoConstants} from 'expo'

/**
 * determine which environment app runs
 * 
 * @param {*} releaseChannel 
 * @returns {string} 
 */
const determineEnv = function (releaseChannel) {
    let env

    switch(releaseChannel) {
        case undefined:
            env = 'development'
            break;

        case 'staging':
            env = 'staging'
            break;

        default:
        case 'production':
            env = 'production'
            break;
    }

    console.log('environment set to:', env)
    return env
}

// set env
let env = determineEnv(ExpoConstants.manifest.releaseChannel)
// set database prefix
let DatabasePrefix = `${env}`

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

console.log('DatabasePrefixDatabasePrefix', DatabasePrefix)

export default {
    facebookAppId,
    googleSocial,
    DatabasePrefix
}