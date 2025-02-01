import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAAabRiihdDLm-ksS22y5c7M5yVQjaVgUI',
  authDomain: 'home-marketplace-153f1.firebaseapp.com',
  projectId: 'home-marketplace-153f1',
  storageBucket: 'home-marketplace-153f1.firebasestorage.app',
  messagingSenderId: '1073152081457',
  appId: '1:1073152081457:web:1188581c4f0326103adf10',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
