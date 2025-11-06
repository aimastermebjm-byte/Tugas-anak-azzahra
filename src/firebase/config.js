// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkojLN8lXW1ka7D9Ffb87txY4zIbEIMmA",
  authDomain: "tugas-anak-azzahra.firebaseapp.com",
  projectId: "tugas-anak-azzahra",
  storageBucket: "tugas-anak-azzahra.firebasestorage.app",
  messagingSenderId: "114614677823",
  appId: "1:114614677823:web:03600bfeb3306d2f37a38a",
  measurementId: "G-9CCEW42GW2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);

export { analytics };