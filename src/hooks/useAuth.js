'use client'
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebase'; 
import {store} from '../redux/store';
import { signInAsync, signUpAsync, userLoggedOut, userLoggedIn } from '../redux/user/userSlice';

import { useSelector, useDispatch } from 'react-redux';





export function useAuth() {
    const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user) {
        const { displayName, email, uid } = user;
        const userForRedux = { displayName, email, uid };
        dispatch(userLoggedIn(userForRedux)); 
      } else {
        dispatch(userLoggedOut()); 
      }
    });
    return () => unsubscribe();
  }, [auth, dispatch]);  
  

  
  const signUp = async (email, password, name) => {
    try {
      await dispatch(signUpAsync({ email, password, name }));
    } catch (error) {
      console.error('Failed to sign up:', error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      await dispatch(signInAsync({ email, password }));
    } catch (error) {
      console.error('Failed to sign in:', error);
      throw error;
    }
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
