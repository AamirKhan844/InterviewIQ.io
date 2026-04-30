import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "interviewiq-4b87b.firebaseapp.com",
  projectId: "interviewiq-4b87b",
  storageBucket: "interviewiq-4b87b.firebasestorage.app",
  messagingSenderId: "201515281831",
  appId: "1:201515281831:web:d0626836925be047191a82",
  measurementId: "G-J9XN2N8B0F",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
