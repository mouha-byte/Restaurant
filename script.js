// firebase-config.js ou firestore.js

// Importez les modules nécessaires du SDK Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; // Pour Analytics
import { getFirestore } from "firebase/firestore"; // Pour Firestore

// Vos informations de configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_-HbKHMUbNiX6pvw5d9t73oqTvFjp7Co",
  authDomain: "restaurant-896d0.firebaseapp.com",
  projectId: "restaurant-896d0",
  storageBucket: "restaurant-896d0.firebasestorage.app",
  messagingSenderId: "1037108801190",
  appId: "1:1037108801190:web:9a2308dc0cb53b29854e67",
  measurementId: "G-ESNJW4VC0Y"
};

// Initialisez votre application Firebase
const app = initializeApp(firebaseConfig);

// Initialisez Analytics
const analytics = getAnalytics(app);

// Initialisez Firestore
const db = getFirestore(app);

// Exportez la base de données Firestore et Analytics pour pouvoir les utiliser dans d'autres fichiers
export { db, analytics };