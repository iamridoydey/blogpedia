// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAi5LjOLUE5XMVYVaVPm4EZUIbXaLVYPz0",
  authDomain: "blogpedia21.firebaseapp.com",
  projectId: "blogpedia21",
  storageBucket: "blogpedia21.firebasestorage.app",
  messagingSenderId: "367326244492",
  appId: "1:367326244492:web:5d4db01e58962fc44615a9",
  measurementId: "G-3TMZK2RKV8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
