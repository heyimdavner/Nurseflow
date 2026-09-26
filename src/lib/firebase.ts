import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA-ISX0LYEiUmB9d7QrN7tqtuWTey0AFaM',
  authDomain: 'nurseflow-38c13.firebaseapp.com',
  projectId: 'nurseflow-38c13',
  storageBucket: 'nurseflow-38c13.firebasestorage.app',
  messagingSenderId: '1084670519249',
  appId: '1:1084670519249:web:d963b2bd116b670b0c62f0',
  measurementId: 'G-K17PRRX2QK'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

try {
  enableIndexedDbPersistence(db).catch((err) => {
    console.error('Firebase persistence error:', err);
  });
} catch (e) {
  console.error('Failed to enable persistence', e);
}
