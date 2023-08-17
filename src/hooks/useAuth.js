'use client'
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import { signInAsync, signUpAsync, userLoggedOut, userLoggedIn } from '../redux/user/userSlice';
import { persistor } from '../redux/store';

import { useSelector, useDispatch } from 'react-redux';
import { toggleDemoMode } from '../redux/demo/demoSlice';





export function useAuth() {
    const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('onAuthStateChanged', user); 
      if(!user) {
        dispatch(userLoggedOut());
      }
    });
    return () => unsubscribe();
  }, [auth, dispatch]);
  
  

  
  
  const signIn = async (email, password) => {
    try {
      if (user )
      {
      if (user.uid === 'demo_user') {
        dispatch(toggleDemoMode())
      }
    }
      return await dispatch(signInAsync({ email, password }));
    } catch (error) {
      console.error('Failed to sign in:', error);
      throw error;
    }
  };
  
  
  const signUp = async (email, password, name) => {
    try {
      if (user )
      {
      if (user.uid === 'demo_user') {
        dispatch(toggleDemoMode())
      }
    }
    
      dispatch(signUpAsync({ email, password, name }));
    } catch (error) {
      console.error('Failed to sign up:', error);
      throw error;
    }
  };

  


  const signOutUser = async () => {
    try {
      await signOut(auth);
      dispatch(userLoggedOut());
      persistor.purge(); 
      console.log("User signed out");
      console.log("Current State After Logout: ", store.getState());
    } catch (error) {
      console.error("Sign out Error", error);
    }
};

  
  
  return {
    user,
    signIn,
    signOutUser,
    signUp
  };
}
