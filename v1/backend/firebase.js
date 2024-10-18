
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Your web app's Firebase configuration
import { firebaseConfig } from "./config.js";

// Initialize Firebase
let db;

try {
  const app = initializeApp(firebaseConfig);
  console.log("app initiated")
  // Initialize Firestore
  db = getFirestore(app);
  console.log("db initiated")
} catch (err) {
  console.log("Error initializing Firebase or Firestore: ", err);
}

export { db };