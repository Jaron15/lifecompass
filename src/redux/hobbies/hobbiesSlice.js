import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addHobbyToFirestore, deletePracticeLogFromFirestore, logPracticeInFirestore, updatePracticeLogInFirestore } from '../../utils/firebase';
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
    try {
      const updatedLogEntry = await logPracticeInFirestore(user, hobbyId, logEntry);
      return { hobbyId, logEntry: updatedLogEntry };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);



export const deletePracticeLog = createAsyncThunk(
  'hobbies/deletePracticeLog',
  async ({user, hobbyId, logEntryId}, thunkAPI) => {
    try {
      console.log('IN REDUX ', logEntryId);
      await deletePracticeLogFromFirestore(user, hobbyId, logEntryId);
      return { user, hobbyId, logEntryId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updatePracticeLog = createAsyncThunk(
  'hobbies/updatePracticeLog',
  async ({ user, hobbyId, logEntryId, newLogEntry }, thunkAPI) => {
    try {
      const response = await updatePracticeLogInFirestore(user, hobbyId, logEntryId, newLogEntry);
      return { ...response, hobbyId }; // include the hobbyId in the response for the reducer to use
    } catch (error) {
      console.error("Error caught in updatePracticeLog", error);
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
    builder.addCase(logPractice.fulfilled, (state, action) => {
      // Find the hobby
      const hobby = state.hobbies.find(h => h.firestoreId === action.payload.hobbyId);
    
      // Update the practice log of the hobby
      if (hobby) {
        hobby.practiceLog.push(action.payload.logEntry);
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
    .addCase(deletePracticeLog.fulfilled, (state, action) => {
      console.log("Payload in deletePracticeLog: ", action.payload); // Let's see what we get

      const hobbyIndex = state.hobbies.findIndex(hobby => hobby.firestoreId === action.payload.hobbyId);

      console.log("HobbyIndex: ", hobbyIndex); // Let's confirm we find the hobby
      
      if (hobbyIndex !== -1) {
        const logIndex = state.hobbies[hobbyIndex].practiceLog.findIndex(log => log.id === action.payload.logEntryId);

        console.log("LogIndex: ", logIndex); // And the log entry

        if (logIndex !== -1) {
          state.hobbies[hobbyIndex].practiceLog.splice(logIndex, 1);
        }
      }
    })
    .addCase(updatePracticeLog.fulfilled, (state, action) => {
      const hobbyIndex = state.hobbies.findIndex(hobby => hobby.firestoreId === action.payload.hobbyId);
      if (hobbyIndex !== -1) {
        const logIndex = state.hobbies[hobbyIndex].practiceLog.findIndex(log => log.id === action.payload.logEntryId);
        if (logIndex !== -1) {
          state.hobbies[hobbyIndex].practiceLog[logIndex] = action.payload.updatedLog;
        }
      }
    })
    
    //-------practicLog--------

}

});

export const { setHobbies } = hobbiesSlice.actions;

export default hobbiesSlice.reducer;
