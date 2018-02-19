import { Facebook as ExpoFacebook } from 'expo';
import Config from './config'
import * as firebase from 'firebase'

export class Facebook {
    static async login() {
        ExpoFacebook.logInWithReadPermissionsAsync(Config.facebookAppId, {
			permissions: ['public_profile', 'email'],
        }).then(res => {
            if (res.type === 'success') {
                // exchange token for creds via firebase
                const auth = firebase.auth()
                const credentials = firebase.auth.FacebookAuthProvider.credential(res.token)

                // sign in via firebase, auth state listener will handle screen traversal
                auth.signInWithCredential(credentials)
            }
        }).catch(err => {
            console.log('bad fb login', err)
        });
    }
}