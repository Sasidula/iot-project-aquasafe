// src/utils/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, push } from "firebase/database";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBsTOoycYMWw_Zfw0YG6JL5RKcyoHXn_ng",
    authDomain: "riversafetymonitor.firebaseapp.com",
    databaseURL: "https://riversafetymonitor-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "riversafetymonitor",
    storageBucket: "riversafetymonitor.appspot.com",
    messagingSenderId: "72269252425",
    appId: "1:72269252425:web:eced3f4fc865bda09e7c98",
    measurementId: "G-2KN80V7SNP"
};

// Initialize only if no apps exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export database and utilities
const db = getDatabase(app);
export { db, ref, onValue, push };
