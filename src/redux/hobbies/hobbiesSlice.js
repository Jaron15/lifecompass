import { createSlice } from '@reduxjs/toolkit';

const hobbiesSlice = createSlice({
  name: 'hobbies',
  initialState: [],
  reducers: {
    addHobby: (state, action) => {
        //safeguard to stop multiple hobbies with same id 
    const existingHobby = state.find(hobby => hobby.id === action.payload.id);

    if (!existingHobby) {
      state.push({
        id: action.payload.id,
        hobbyName: action.payload.hobbyName,
        practiceTimeGoal: action.payload.practiceTimeGoal,
        daysOfWeek: action.payload.daysOfWeek,
        practiceLog: [], // Will hold objects with fields like {date: "2023-01-01", timeSpent: 120}
      });
    }
    },
    deleteHobby: (state,action) => {
        const index = state.findIndex((h) => h.id === action.payload.id);
        if (index === -1) {
            state.splice(index, 1)
        }
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
  
  
  
  
});

export const { addHobby, logPractice } = hobbiesSlice.actions;

export default hobbiesSlice.reducer;
