import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addHobbyToFirestore, deletePracticeLogFromFirestore, logPracticeInFirestore, updatePracticeLogInFirestore, deleteHobbyFromFirestore, updateHobbyInFirestore } from '../../utils/hobbiesBase';

export const addHobby = createAsyncThunk(
  'hobbies/addHobby',
  async ({ user, hobby }, thunkAPI) => {
    try {
      const response = await addHobbyToFirestore(user, hobby);
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
      return { ...response, hobbyId }; //response + the hobbyId so the reducer can use it 
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
    })
    .addCase(addHobby.fulfilled, (state, action) => {
      state.status = 'idle';
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
      const hobby = state.hobbies.find(h => h.firestoreId === action.payload.hobbyId);
    
      // add the log
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
      const hobbyIndex = state.hobbies.findIndex(hobby => hobby.firestoreId === action.payload.hobbyId);      
      if (hobbyIndex !== -1) {
        const logIndex = state.hobbies[hobbyIndex].practiceLog.findIndex(log => log.id === action.payload.logEntryId);

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
