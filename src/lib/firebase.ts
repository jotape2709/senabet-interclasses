// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDWJZbXSAt0RoU5wCQmuVACrOuSiTN7DQ",
  authDomain: "senabet-3bd86.firebaseapp.com",
  projectId: "senabet-3bd86",
  storageBucket: "senabet-3bd86.firebasestorage.app",
  messagingSenderId: "1035741065112",
  appId: "1:1035741065112:web:63f8508a30c2dc0ef945ed",
  measurementId: "G-H9GQ6D7BL2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

