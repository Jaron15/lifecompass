import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addHobbyToFirestore } from '../../utils/firebase';

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
    deleteHobby: (state,action) => {
        const index = state.findIndex((h) => h.id === action.payload.id);
        if (index !== -1) {
            state.splice(index, 1)
        }
    },

  updateHobby: (state, action) => {
    // Find the index of the hobby with the given id
    const index = state.findIndex(hobby => hobby.id === action.payload.id);
  
    // If the hobby is found, update it
    if (index !== -1) {
      if (action.payload.hobbyName !== undefined) {
        state[index].hobbyName = action.payload.hobbyName;
      }
      if (action.payload.practiceTimeGoal !== undefined) {
        state[index].practiceTimeGoal = action.payload.practiceTimeGoal;
      }
      if (action.payload.daysOfWeek !== undefined) {
        state[index].daysOfWeek = action.payload.daysOfWeek;
      }
      // if (action.payload.practiceLog !== undefined) {
      //   state[index].practiceLog = action.payload.practiceLog;
      // }
    } else {
      console.log('Hobby with this id does not exist');
    }
  },
  logPractice: (state, action) => {
    const hobby = state.find((h) => h.id === action.payload.hobbyId);
    if (hobby) {
      hobby.practiceLog.push({
        id: `${hobby.id}_${Date.now()}`, // Creates a unique id based on the hobby id and the current timestamp
        date: action.payload.date,
        timeSpent: action.payload.timeSpent,
      });
    }
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
      console.log('fulfilled payload: ',action.payload.hobby);
      console.log('-------this is the STATE ------', state)
      state.hobbies.push(action.payload.hobby);
    })
    .addCase(addHobby.rejected, (state, action) => {
      state.status = 'idle';
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = action.error;
      }
    });
}

});

export const { setHobbies, updateHobby, deleteHobby, logPractice, deletePracticeLogEntry } = hobbiesSlice.actions;

export default hobbiesSlice.reducer;
