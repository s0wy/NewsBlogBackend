// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs,setDoc,getDoc } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJcTMSeiMvWD3G3U-nSwv_Io6arvOgkSM",
  authDomain: "basekurator.firebaseapp.com",
  projectId: "basekurator",
  storageBucket: "basekurator.appspot.com",
  messagingSenderId: "535688510843",
  appId: "1:535688510843:web:4da1f208d2b3ac7ed451de",
  measurementId: "G-JZ9S9MQZJK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export async function getCategory(db) {
  const categorysCol = collection(db, 'category');
  const categorySnapshot = await getDocs(categorysCol);
  const categoryList = categorySnapshot.docs.map(doc => doc.data());
  return categoryList;
};
export async function getUsers(db) {
  const usersCol = collection(db, 'users');
  const userSnapshot = await getDocs(usersCol);
  const userList = userSnapshot.docs.map(doc => doc.data());
  return userList;
};
