import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBTspXsZXVFVN3bmipiqx35YgV5-MP_HBY",
  authDomain: "appfotos-975a9.firebaseapp.com",
  projectId: "appfotos-975a9",
  storageBucket: "appfotos-975a9.appspot.com",
  messagingSenderId: "276283101338",
  appId: "1:276283101338:web:5cde809df552b0963a0f23"
};
  
  const app = initializeApp(firebaseConfig);
  
  export const storage = getStorage(app)

  export const fire = getFirestore(app)