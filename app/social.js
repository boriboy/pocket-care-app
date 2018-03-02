import { Facebook as ExpoFacebook, Google as ExpoGoogle } from 'expo';
import Config from './config'
import * as firebase from 'firebase'

export class Facebook {
    static async login() {
        ExpoFacebook.logInWithReadPermissionsAsync(Config.facebookAppId, {
			permissions: ['public_profile', 'email'],
        }).then(res => {
            if(res.type === 'success') {
                registerToken(res.token, 'FacebookAuthProvider')
            }
        }).catch(err => {
            console.log('bad fb login', err)
        });
    }
}

export class Google {
    static async login() {
        try {
            return ExpoGoogle.logInAsync(Config.googleSocial).then(res => {
                if(res.type === 'success') {
                    registerToken(res.idToken, 'GoogleAuthProvider')
                }
            })
            .catch(err => {
                console.log('Google login error:', err)
            })
        } catch (e) {
            console.log('error on google login:', e)
            return Promise.reject(new Error (e))
        }
    }
}

const registerToken = function (token, provider) {
    // exchange token for creds via firebase
    var credentials = firebase.auth[provider].credential(token)

    // sign in via firebase, auth state listener will handle screen traversal
    firebase.auth().signInWithCredential(credentials)
}