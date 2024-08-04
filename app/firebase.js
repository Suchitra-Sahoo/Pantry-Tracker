// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvoxyF4hBRIafWV90eloo4Ymen0nn9_H8",
  authDomain: "pantry-tracker-4dd4e.firebaseapp.com",
  projectId: "pantry-tracker-4dd4e",
  storageBucket: "pantry-tracker-4dd4e.appspot.com",
  messagingSenderId: "203703334510",
  appId: "1:203703334510:web:faf91c1dd166e07a20d87f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
