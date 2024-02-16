// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs,setDoc,getDoc,orderBy,query  } from 'firebase/firestore/lite';
import { getDownloadURL, getStorage, ref ,uploadBytesResumable } from 'firebase/storage';
import { getAuth,signInWithEmailAndPassword } from 'firebase/auth'
import dotenv from 'dotenv';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
dotenv.config();
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth(app)

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
export async function getNews(db) {
  const newsCol = query(collection(db, 'news'),orderBy('createdAt', 'asc'));
  const newsSnapshot = await getDocs(newsCol);
  const newsList = newsSnapshot.docs.map(doc => doc.data());
  return newsList;
};
export async function uploadImage(file, quantity) {
  const storageFB = getStorage();
  await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER, process.env.FIREBASE_AUTH);

  if (quantity === 'single') {
      const dateTime = Date.now();
      const fileName = `images/${dateTime}`
      const storageRef = ref(storageFB, fileName)
      const metadata = {
          contentType: file.type,
      }
      const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
      const downloadUrl = getDownloadURL(snapshot.ref)
      return downloadUrl
  }

}