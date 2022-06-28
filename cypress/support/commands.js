/* eslint-disable no-undef */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/firestore"
import { attachCustomCommands } from "cypress-firebase"

const fbConfig = {
  apiKey: "AIzaSyCjPtOcRDwPdVv4jCHyWk6NQPze8aK35Wg",
  authDomain: "cogniwars.firebaseapp.com",
  databaseURL: "https://cogniwars-default-rtdb.firebaseio.com",
  projectId: "cogniwars",
  storageBucket: "cogniwars.appspot.com",
  messagingSenderId: "222519570643",
  appId: "1:222519570643:web:02d096faa9ebc758b72426",
  measurementId: "G-9VY81Y1KS7",
}

// Emulate RTDB if Env variable is passed
const rtdbEmulatorHost = Cypress.env("FIREBASE_DATABASE_EMULATOR_HOST")
if (rtdbEmulatorHost) {
  fbConfig.databaseURL = `http://${rtdbEmulatorHost}?ns=${fbConfig.projectId}`
}

firebase.initializeApp(fbConfig)

// Emulate Firestore if Env variable is passed
const firestoreEmulatorHost = Cypress.env("FIRESTORE_EMULATOR_HOST")
if (firestoreEmulatorHost) {
  firebase.firestore().settings({
    host: firestoreEmulatorHost,
    ssl: false,
  })
}

const authEmulatorHost = Cypress.env("FIREBASE_AUTH_EMULATOR_HOST")
if (authEmulatorHost) {
  firebase.auth().useEmulator(`http://${authEmulatorHost}/`)
  console.debug(`Using Auth emulator: http://${authEmulatorHost}/`)
}

attachCustomCommands({ Cypress, cy, firebase })

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})
