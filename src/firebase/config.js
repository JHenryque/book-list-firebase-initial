import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdCI-Rvxb6sE8e24TeNmQkYAwZPCVCcVg",
  authDomain: "books-firebase-cb3e6.firebaseapp.com",
  projectId: "books-firebase-cb3e6",
  storageBucket: "books-firebase-cb3e6.firebasestorage.app",
  messagingSenderId: "60365119006",
  appId: "1:60365119006:web:ecece22628a8ccf5af980f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
