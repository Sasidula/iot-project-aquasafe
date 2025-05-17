// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBsTOoycYMWw_Zfw0YG6JL5RKcyoHXn_ng",
    authDomain: "riversafetymonitor.firebaseapp.com",
    databaseURL: "https://riversafetymonitor-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "riversafetymonitor",
    storageBucket: "riversafetymonitor.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue };
