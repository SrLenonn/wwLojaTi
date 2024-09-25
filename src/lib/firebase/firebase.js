// Import the functions you need from the SDKs you need
import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRDD7_x9sDIzvuZ_ZNjwAnzCy2Piibkto",
  authDomain: "lojati.firebaseapp.com",
  projectId: "lojati",
  storageBucket: "lojati.appspot.com",
  messagingSenderId: "405092601135",
  appId: "1:405092601135:web:015f1137a017b00471e5da",
  measurementId: "G-QM750S43G6"
}


// Initialize Firebase
let firebaseApp
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApp()
    deleteApp(firebaseApp)
    firebaseApp = initializeApp(firebaseConfig)
}

export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp);
export const auth = getAuth(firebaseApp)
