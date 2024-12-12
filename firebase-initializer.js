// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDGNzk7B7aohxMwkZs0gxGjphQ3caGM3EM",
  authDomain: "fiction-hub-library.firebaseapp.com",
  projectId: "fiction-hub-library",
  storageBucket: "fiction-hub-library.firebasestorage.app",
  messagingSenderId: "1055642342111",
  appId: "1:1055642342111:web:54e8c279df6fceb3620f6a",
  measurementId: "G-HEWV7EY4WE"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth(); // Get the Firebase Authentication instance

// Export the Firebase objects for use in other scripts
export { db, auth };

