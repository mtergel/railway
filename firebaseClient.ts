import firebaseClient from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// IF NOT SSR
const CLIENT_CONFIG = {
  apiKey: "AIzaSyBPvjoCfU4S1ulBqntjAB9uB4YEXQi8DQQ",
  authDomain: "railway-93c4c.firebaseapp.com",
  databaseURL:
    "https://railway-93c4c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "railway-93c4c",
  storageBucket: "railway-93c4c.appspot.com",
  messagingSenderId: "584699026385",
  appId: "1:584699026385:web:e54e3115a3d86690649ef0",
  measurementId: "G-4K7RKYY8QZ",
};

if (typeof window !== "undefined" && !firebaseClient.apps.length) {
  firebaseClient.initializeApp(CLIENT_CONFIG);
  firebaseClient.auth();
  (window as any).firebase = firebaseClient;
}

export { firebaseClient };
