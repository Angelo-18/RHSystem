// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwKje48SbcsMnKpJRDhJXe-heD00EHaX0",
  authDomain: "rh-system-6b29a.firebaseapp.com",
  projectId: "rh-system-6b29a",
  storageBucket: "rh-system-6b29a.firebasestorage.app",
  messagingSenderId: "376090179636",
  appId: "1:376090179636:web:2ba5480559aa806478b261"
};


// Initialize Firebase
export const FirebaseApp  = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth( FirebaseApp );
export const FirebaseDB   = getFirestore( FirebaseApp );
export const FirebaseStorage = getStorage( FirebaseApp );