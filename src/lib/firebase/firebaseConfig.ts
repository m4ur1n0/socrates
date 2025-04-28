// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_FIRESTORE_KEY,
    authDomain: "socrates-backend-7eabc.firebaseapp.com",
    projectId: "socrates-backend-7eabc",
    storageBucket: "socrates-backend-7eabc.firebasestorage.app",
    messagingSenderId: "610358048373",
    appId: "1:610358048373:web:b8134aa01351f6bf6cea3c",
    measurementId: "G-3XPEFM1KTQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);