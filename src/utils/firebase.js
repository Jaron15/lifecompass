import { initializeApp, getApps } from "firebase/app";
import { getFirestore, addDoc, getDocs, collection } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check if Firebase app is already initialized
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app);

export function getUserHobbiesCollection(user) {
  return collection(db, 'users', user.uid, 'hobbies');
}

export async function getHobbiesFromFirestore(userId) {
  try {
    const hobbiesCollection = getUserHobbiesCollection(userId);
    console.log(hobbiesCollection);
    const snapshot = await getDocs(hobbiesCollection);
  
    // Transform the snapshot to an array of hobbies
    const hobbies = snapshot.docs.map(doc => doc.data());
  
    return hobbies;
  } catch (error) {
    console.error('Error getting hobbies from Firestore:', error);
    throw error;  // Re-throw the error so it can be handled upstream
  }
}

export async function addHobbyToFirestore(user, hobby) {
  console.log('INSIDE addHobbyToFirestore', user);
  const hobbiesCollection = getUserHobbiesCollection(user);
  try {
    await addDoc(hobbiesCollection, hobby);
    return { user, hobby };  
  } catch (error) {
    // Handle or throw the error
    console.error("Error adding document: ", error);
    throw error; // Rethrow the error so it can be handled by your action
  }
}



export { db, auth };

