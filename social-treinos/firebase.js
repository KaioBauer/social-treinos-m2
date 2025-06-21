import { initializeApp } from "firebase/app";
import {
    initializeAuth,
    getReactNativePersistence
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';




const app = initializeApp({
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_PROJECT_ID,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_PROJECT_ID,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID
});

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);
const storage = getStorage(app);
const storageRef = ref(storage);

export { auth, db, storage, storageRef, doc, setDoc, collection, addDoc };
