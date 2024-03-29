import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getFirestore, updateDoc } from "firebase/firestore";
import {db} from '../../utils/firebase'
import { getHobbiesFromFirestore } from "../../utils/hobbiesBase";
import { setHobbies } from "../hobbies/hobbiesSlice";
import { getCompletedTasksFromFirestore, getTasksFromFirestore } from "../../utils/tasksBase";
import {setCompletedTasks, setTasks} from '../tasks/tasksSlice'
import { getEventsFromFirestore } from "@/src/utils/eventsBase";
import { setEvents } from "../events/eventsSlice";
import { DUMMY_USER } from "@/src/utils/demoData";
import {demoSlice} from "../demo/demoSlice";



const initialState = {
  user: null,
  status: 'idle',
  error: null, 
  demo: false 
};

export const signInAsync = createAsyncThunk(
  'user/signIn',
  async ({email: inputEmail, password}, thunkAPI) => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, inputEmail, password);
      const firebaseUser = userCredential.user;
      const { displayName, email: firebaseEmail, uid, photoURL } = firebaseUser;
      
      const hobbies = await getHobbiesFromFirestore(firebaseUser);
      const tasks = await getTasksFromFirestore(firebaseUser.uid)
      const completedTasks = await getCompletedTasksFromFirestore(firebaseUser.uid)
      const events = await getEventsFromFirestore(firebaseUser.uid)
      thunkAPI.dispatch(setHobbies(hobbies))
      thunkAPI.dispatch(setTasks(tasks))
      thunkAPI.dispatch(setCompletedTasks(completedTasks))
      thunkAPI.dispatch(setEvents(events))
      // Instead of dispatching the action, return the user object
      return { displayName, email: firebaseEmail, uid, photoURL };
    } catch (error) {
      console.error('Error during signInAsync:', error);
      return thunkAPI.rejectWithValue({ error: 'Invalid email or password. Please try again.' });
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
      await updateProfile(userCredential.user, { 
        displayName: name,
        photoURL: "3" });

      // Return the user object instead of dispatching the action 
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: name,
        photoURL: "3"
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ uid, newName, newImageNumber }, thunkAPI) => {
    if (uid === "demo_user") {
      // Bypass the update in demo mode and just return the new values.
      return {
        displayName: newName,
        photoURL: newImageNumber
      };
    }

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser && currentUser.uid === uid) {
        await updateProfile(currentUser, { 
            displayName: newName,
            photoURL: String(newImageNumber)
        });
        return {
          displayName: newName,
          photoURL: newImageNumber
        };
      }
      throw new Error("User not found");
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

  
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      console.log('userLoggedIn', action.payload); 
      state.user = action.payload;
      state.status = 'loggedIn';
    },
    userLoggedOut: (state) => {
      if (!state.demo){

      console.log('userLoggedOut'); 
      return initialState 
    }
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(demoSlice.actions.toggleDemoMode, (state, action) => {
      state.demo = !state.demo;
      if (state.demo) {
        state.user = DUMMY_USER
      } else {
        state.user=null,
        state.status='idle',
        state.error=null
        //moved right here
      }
    })
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
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user.displayName = action.payload.displayName;
          state.user.photoURL = action.payload.photoURL;
        }
      })
  
      
  }
});

export const { userLoggedIn, userLoggedOut } = userSlice.actions;

export default userSlice.reducer;
