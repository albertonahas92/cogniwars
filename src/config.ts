// Import the functions you need from the SDKs you need
import firebase from "firebase"
import "firebase/storage"
import "firebase/messaging"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjPtOcRDwPdVv4jCHyWk6NQPze8aK35Wg",
  authDomain: "cogniwars.firebaseapp.com",
  databaseURL: "https://cogniwars-default-rtdb.firebaseio.com",
  projectId: "cogniwars",
  storageBucket: "cogniwars.appspot.com",
  messagingSenderId: "222519570643",
  appId: "1:222519570643:web:02d096faa9ebc758b72426",
  measurementId: "G-9VY81Y1KS7",
}

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
} else {
  firebase.app() // if already initialized, use that one
}
if (window.location.hostname === "localhost") {
  firebase.auth().useEmulator("http://localhost:9099")
  firebase.firestore().useEmulator("localhost", 8081)
  firebase.firestore().settings({
    experimentalForceLongPolling: true,
    merge: true,
  })
  firebase.functions().useEmulator("localhost", 5001)
  firebase.database().useEmulator("localhost", 9000)
  firebase.storage().useEmulator("localhost", 9199)
}
let messaging: any

try {
  messaging = firebase.messaging()
} catch (error) {
  console.log(error)
}

export const getToken = () => {
  if (!messaging) return
  return messaging
    .getToken({
      vapidKey:
        "BB-ZtExWjS9k8CCdK1gMs-adp2YAzKC7jAK53xD4BgiFP--4AvHUt3ZPI0oKeg1ALVz7VY85mEVNkAF_Dm45B2I",
    })
    .then((currentToken: any) => {
      if (currentToken) {
        return currentToken
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        return undefined
        // shows on the UI that permission is required
      }
    })
    .catch((err: any) => {
      console.log("An error occurred while retrieving token. ", err)
      // catch error while creating client token
    })
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging &&
      messaging.onMessage((payload: any) => {
        resolve(payload)
      })
  })

export default firebase
