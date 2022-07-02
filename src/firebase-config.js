import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAi9HN2Z8h7u6_vO_H6MJvaHAsZYWLbCww",
  authDomain: "social-videoblog.firebaseapp.com",
  databaseURL: "https://social-videoblog-default-rtdb.firebaseio.com",
  projectId: "social-videoblog",
  storageBucket: "social-videoblog.appspot.com",
  messagingSenderId: "1055227983756",
  appId: "1:1055227983756:web:e6976b8660a9ebcb6488a9"
};

export const firebaseApp = initializeApp(firebaseConfig);