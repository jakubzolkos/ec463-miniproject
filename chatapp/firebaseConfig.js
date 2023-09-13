import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import Constants from 'expo-constants'
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBk-qINpI6XiNABTe_wbKfZykvQdvUWWlk",
  authDomain: "chatapp-398518.firebaseapp.com",
  projectId: "chatapp-398518",
  storageBucket: "chatapp-398518.appspot.com",
  messagingSenderId: "194340734719",
  appId: "1:194340734719:web:7e54196b990c5d56932eca",
};

//const app = initializeApp(firebaseConfig);
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage();
export const db = getFirestore();
