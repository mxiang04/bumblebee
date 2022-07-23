import { initializeApp, firebase } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTq7-h4a5Ja1Sm2Ml--dxBUMRbBvKpOl8",
  authDomain: "whats-app2-bf0c9.firebaseapp.com",
  projectId: "whats-app2-bf0c9",
  storageBucket: "whats-app2-bf0c9.appspot.com",
  messagingSenderId: "758692889228",
  appId: "1:758692889228:web:e169e956ad5ff3a11b31a9",
  measurementId: "G-QMLG1WKCFV",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
