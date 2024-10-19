// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "firebase/firestore"; 
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize DB
let db;
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

try {
    const app = initializeApp(firebaseConfig);
    console.log(firebaseConfig);
    console.log("app initiated")


    db = getFirestore(app);
    console.log("db initiated")
  } catch (err) {
    console.log("Error initializing Firebase or Firestore: ", err);
  }
  
  export { db };