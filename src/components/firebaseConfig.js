import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

  const app = initializeApp ({
    apiKey: "AIzaSyCbQ3JuAa-RD4-f0YTEIrke6TcKfw_JNGY",
    authDomain: "vdvapp-e99ff.firebaseapp.com",
    projectId: "vdvapp-e99ff",
    storageBucket: "vdvapp-e99ff.appspot.com",
    messagingSenderId: "547989772566",
    appId: "1:547989772566:web:51b61fe3b946e3d4061837"
    });

// Firebase storage reference
const storage = getStorage(app);
export default storage;



