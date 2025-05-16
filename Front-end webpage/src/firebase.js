// src/firebase.js

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; 

const firebaseConfig = {
  apiKey: "AIzaSyDleCwr2Yf0GMV6kfq52yU1A5x8DI3JvEA",
  authDomain: "arducambase.firebaseapp.com",
  databaseURL: "https://arducambase-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "arducambase",
  storageBucket: "arducambase.firebasestorage.app",
  messagingSenderId: "3843950284",
  appId: "1:3843950284:web:bbd03e1ae6ff79a58d2469",
  measurementId: "G-DBDW5E5E64"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);  

export { database };
