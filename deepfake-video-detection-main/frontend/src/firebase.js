import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBblo_uWN2zDX8gD-rdk5rBpeVddOzjji8",
  authDomain: "deepfake-detection-349612.firebaseapp.com",
  projectId: "deepfake-detection-349612",
  storageBucket: "deepfake-detection-349612.appspot.com",
  messagingSenderId: "325592588646",
  appId: "1:325592588646:web:cd950769a8defe2881e8a7"
};

const firebaseApp = initializeApp(firebaseConfig);
// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage(firebaseApp);

export { storage };
