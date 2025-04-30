// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';   // ← make sure this line is here

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIRESTORE_KEY,
    authDomain: "socrates-backend-7eabc.firebaseapp.com",
    projectId: "socrates-backend-7eabc",
    storageBucket: "socrates-backend-7eabc.firebasestorage.app",
    messagingSenderId: "610358048373",
    appId: process.env.NEXT_PUBLIC_FIRESTORE_APP_ID,
    measurementId: "G-3XPEFM1KTQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);