// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js")

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyCjPtOcRDwPdVv4jCHyWk6NQPze8aK35Wg",
  authDomain: "cogniwars.firebaseapp.com",
  databaseURL: "https://cogniwars-default-rtdb.firebaseio.com",
  projectId: "cogniwars",
  storageBucket: "cogniwars.appspot.com",
  messagingSenderId: "222519570643",
  appId: "1:222519570643:web:02d096faa9ebc758b72426",
  measurementId: "G-9VY81Y1KS7",
}

firebase.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
