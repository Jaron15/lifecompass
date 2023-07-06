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
  async ({email, password}, thunkAPI) => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log(firebaseUser);
      const { displayName, email,  uid } = firebaseUser;
      return { displayName, email, uid };
    } catch (error) {
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
      userCredential.user.updateProfile({
        displayName: name
      });



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
      state.user = action.payload;
      state.status = 'loggedIn';
    },
    userLoggedOut: (state) => {
      state.user = null;
      state.status = 'loggedOut';
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
      });
  }
});

export const { userLoggedIn, userLoggedOut } = userSlice.actions;

export default userSlice.reducer;
