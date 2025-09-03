// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v9-compat and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJ56TdQzSoqDtgy2w9CYKUpV2rOe4uKvg",
  authDomain: "timetable-68968.firebaseapp.com",
  projectId: "timetable-68968",
  storageBucket: "timetable-68968.firebasestorage.app",
  messagingSenderId: "107477407319",
  appId: "1:107477407319:web:2c3a79a0a915554e997512",
  measurementId: "G-FN9H2NVSCG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
