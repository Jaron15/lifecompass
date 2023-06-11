'use client'
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebase'; 


export function useAuth() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, [auth]);
  
  const signUp = async (email, password, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const user = userCredential.user;
        setDoc(doc(db, 'users', user.uid), {
            displayName: name,

          });
      
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
      }
  };

  const signIn = async (email, password) => {

  };

  const signOut = async () => {
 
  };
  
  
  return {
    user,
    signIn,
    signOut,
    signUp
  };
}
