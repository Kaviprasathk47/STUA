import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-ecfwHjVXZN0-fF861Tn00r4A_BH5pvc",
  authDomain: "stua-da096.firebaseapp.com",
  projectId: "stua-da096",
  storageBucket: "stua-da096.firebasestorage.app",
  messagingSenderId: "671031846859",
  appId: "1:671031846859:web:79f5c7faaf9753c566b84e",
  measurementId: "G-3C0ZV4QJXR"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth ,provider}