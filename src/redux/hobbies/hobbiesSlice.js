import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addHobbyToFirestore, logPracticeInFirestore } from '../../utils/firebase';
import { deleteHobbyFromFirestore } from '../../utils/firebase';
import { updateHobbyInFirestore } from '../../utils/firebase';

export const addHobby = createAsyncThunk(
  'hobbies/addHobby',
  async ({ user, hobby }, thunkAPI) => {
    console.log("addHobby action called", user, hobby);
    try {
      console.log("Entering try block in addHobby");
      const response = await addHobbyToFirestore(user, hobby);
      console.log("Received response in addHobby", response);
      return response;
    } catch (error) {
      console.error("Error caught in addHobby", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteHobby = createAsyncThunk(
  'hobbies/deleteHobby',
  async ({user, hobbyId}, thunkAPI) => {
    try {
      await deleteHobbyFromFirestore(user, hobbyId);
      // If deleting hobby from Firestore was successful, return the hobbyId
      return hobbyId;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const updateHobby = createAsyncThunk(
  'hobbies/updateHobby',
  async ({user, hobby}, thunkAPI) => {
    try {
      console.log('update hobbies slice: ', hobby);
      await updateHobbyInFirestore(user, hobby);
      return hobby;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const logPractice = createAsyncThunk(
  'hobbies/logPractice',
  async ({ user, hobbyId, logEntry }, thunkAPI) => {
    console.log("logPractice action called", user, hobbyId, logEntry);
    try {
      console.log("Entering try block in logPractice");

      const updatedHobby = await logPracticeInFirestore(user, hobbyId, logEntry);

      return { hobbyId, updatedHobby };

    } catch (error) {
      console.error("Error caught in logPractice", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const hobbiesSlice = createSlice({
  name: 'hobbies',
  initialState: { 
    status: 'idle', 
    error: null,
    hobbies: [] 
  },  
  reducers: {
  setHobbies: (state, action) => {
    state.hobbies = action.payload
  },

  
  deletePracticeLogEntry: (state, action) => {
    const hobby = state.find((h) => h.id === action.payload.hobbyId);
    if (hobby) {
      const logIndex = hobby.practiceLog.findIndex((log) => log.id === action.payload.logId);
      if (logIndex !== -1) {
        hobby.practiceLog.splice(logIndex, 1);
      }
    }
  },
},
extraReducers: (builder) => {
  builder
  //-------create--------
  .addCase('persist/REHYDRATE', (state, action) => {
    // Initialize hobbies if it's undefined after rehydration
    if (!state.hobbies) {
      state.hobbies = [];
    }
  })
    .addCase(addHobby.pending, (state) => {
      state.status = 'loading';
      console.log(state.status);
    })
    .addCase(addHobby.fulfilled, (state, action) => {
      state.status = 'idle';
      console.log('fulfilled payload: ',action.payload.newHobby);
      console.log('-------this is the STATE ------', state)
      state.hobbies.push(action.payload.newHobby);
    })
    .addCase(addHobby.rejected, (state, action) => {
      state.status = 'idle';
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = action.error;
      }
    })
    //-------create--------
    //-------delete--------
    .addCase(deleteHobby.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(deleteHobby.fulfilled, (state, action) => {
      state.status = 'idle';
      const index = state.hobbies.findIndex((h) => h.firestoreId  === action.payload);
      if (index !== -1) {
        state.hobbies.splice(index, 1);
      }
      console.log('delete successful (redux)');
    })
    .addCase(deleteHobby.rejected, (state, action) => {
      state.status = 'idle';
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = action.error;
      }
    })
    //-------delete--------
    //-------update--------
    .addCase(updateHobby.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(updateHobby.fulfilled, (state, action) => {
      const index = state.hobbies.findIndex((h) => h.firestoreId === action.payload.firestoreId);
      if (index !== -1) {
        state.hobbies[index] = action.payload;
      }
    })
    .addCase(updateHobby.rejected, (state, action) => {
      state.status = 'idle';
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = action.error;
      }
    })
    //-------update--------
    //-------practicLog--------
    .addCase(logPractice.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(logPractice.fulfilled, (state, action) => {
      state.status = 'idle';
      const index = state.hobbies.findIndex((hobby) => hobby.firestoreId === action.payload.hobbyId);
      if (index !== -1) {
        state.hobbies[index] = action.payload.updatedHobby;
      }
    })
    .addCase(logPractice.rejected, (state, action) => {
      state.status = 'idle';
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = action.error;
      }
    })
    //-------practicLog--------

}

});

export const { setHobbies, deletePracticeLogEntry } = hobbiesSlice.actions;

export default hobbiesSlice.reducer;
