// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZZdzRyVdsGa6OOoOdaTV89b-RFAY5uHg",
  authDomain: "projetfinalnative.firebaseapp.com",
  projectId: "projetfinalnative",
  storageBucket: "projetfinalnative.appspot.com",
  messagingSenderId: "978534470418",
  appId: "1:978534470418:web:e0c969c9679365fbef19cb",
  measurementId: "G-4JYC3YQ40G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);