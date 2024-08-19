import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

  const app = initializeApp ({
    apiKey: "AIzaSyA4Vkfs7jSzhY_NgRiCXgUa6noBeecG6A8",
    authDomain: "tuprimererp-18f3c.firebaseapp.com",
    projectId: "tuprimererp-18f3c",
    storageBucket: "tuprimererp-18f3c.appspot.com",
    messagingSenderId: "637646534408",
    appId: "1:637646534408:web:8fa4ddc69ad5087dee9ebd"
    });

// Firebase storage reference
const storage = getStorage(app);
export default storage;