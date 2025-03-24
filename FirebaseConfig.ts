import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADqy52p8xC2YPkJj-SvVEKAVYu3SHQKcs",
  authDomain: "reactnativeproject-820f2.firebaseapp.com",
  projectId: "reactnativeproject-820f2",
  storageBucket: "reactnativeproject-820f2.appspot.com",
  messagingSenderId: "727385911892",
  appId: "1:727385911892:web:61e437716cb31287c973c1",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
