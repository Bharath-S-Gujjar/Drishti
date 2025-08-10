// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCFQw2m8A30H1R_ngAPdqJf5LE2rrhh4Eg",
  authDomain: "project-drishti-a6830.firebaseapp.com",
  projectId: "project-drishti-a6830",
  storageBucket: "project-drishti-a6830.appspot.com",
  messagingSenderId: "486936271277",
  appId: "1:486936271277:web:b326567e07c6611c392924",
  measurementId: "G-K1NGX4EVYJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
