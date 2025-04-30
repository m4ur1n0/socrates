// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIRESTORE_KEY,
    authDomain: "socrates-backend-7eabc.firebaseapp.com",
    databaseURL: "https://socrates-backend-7eabc-default-rtdb.firebaseio.com/",
    projectId: "socrates-backend-7eabc",
    storageBucket: "socrates-backend-7eabc.firebasestorage.app",
    messagingSenderId: "610358048373",
    appId: process.env.NEXT_PUBLIC_FIRESTORE_APP_ID,
    measurementId: "G-3XPEFM1KTQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);

export const database = getDatabase(app)

// Initialize Authentication
export const auth = getAuth(app)

export const firestore = getFirestore(app);
