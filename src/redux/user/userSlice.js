import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import {db} from '../../utils/firebase'


const initialState = {
  user: null,
  status: 'idle',
  error: null
};

export const signInAsync = createAsyncThunk(
  'user/signIn',
  async ({email: inputEmail, password}, thunkAPI) => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, inputEmail, password);
      const firebaseUser = userCredential.user;
      const { displayName, email: firebaseEmail, uid } = firebaseUser;
      
      // Instead of dispatching the action, return the user object
      return { displayName, email: firebaseEmail, uid };
    } catch (error) {
      console.error('Error during signInAsync:', error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);




  
export const signUpAsync = createAsyncThunk(
  'user/signUpAsync',
  async ({ email, password, name }, thunkAPI) => {
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Setting the user's name
      await updateProfile(userCredential.user, { displayName: name });

      // Return the user object instead of dispatching the action here
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: name
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);


  
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      console.log('userLoggedIn', action.payload); 
      state.user = action.payload;
      state.status = 'loggedIn';
    },
    userLoggedOut: (state) => {
      console.log('userLoggedOut'); 
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signInAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // update the user state with the user object from Firebase
        state.user = action.payload;
      })
      .addCase(signInAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update the user state with the returned user object
        state.user = action.payload;
      })
  
      
  }
});

export const { userLoggedIn, userLoggedOut } = userSlice.actions;

export default userSlice.reducer;
