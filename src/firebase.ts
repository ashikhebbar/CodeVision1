// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXtPtm-A5Dq4lC4H2oxZ6Fqt9K3OlYlI0",
  authDomain: "sihcodevision-391de.firebaseapp.com",
  projectId: "sihcodevision-391de",
  storageBucket: "sihcodevision-391de.firebasestorage.app",
  messagingSenderId: "677813649923",
  appId: "1:677813649923:web:6fc1c2c8d40ed43ec20436",
  measurementId: "G-N3WHK7151C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only works in browser)
const analytics = getAnalytics(app);

// ✅ Authentication setup
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
