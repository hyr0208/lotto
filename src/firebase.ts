import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBXdZ6OeijPc8CVkmwEQ69OjBE4xjVmQjA",
  authDomain: "coffee-lotto.firebaseapp.com",
  databaseURL:
    "https://coffee-lotto-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "coffee-lotto",
  storageBucket: "coffee-lotto.firebasestorage.app",
  messagingSenderId: "618927257902",
  appId: "1:618927257902:web:e6387c02660f08741522bf",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
