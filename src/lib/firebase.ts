import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA4TxygJh5zvbRbwMwFavX3WHYbuIDTViY',
  authDomain: 'critiquepeak.firebaseapp.com',
  projectId: 'critiquepeak',
  storageBucket: 'critiquepeak.appspot.com',
  messagingSenderId: '83785915216',
  appId: '1:83785915216:web:1d71c59a7e9db9e781ea55',
  measurementId: 'G-58CYQT9PYM',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
