// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, off } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeLoctEeEf9cBJv7p0SShciRl94rn9QEI",
  authDomain: "test-78631.firebaseapp.com",
  databaseURL: "https://test-78631-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "test-78631",
  storageBucket: "test-78631.firebasestorage.app",
  messagingSenderId: "665142772640",
  appId: "1:665142772640:web:1296fa5597db9bf2eadac5",
  measurementId: "G-R3L6LB3KXN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };