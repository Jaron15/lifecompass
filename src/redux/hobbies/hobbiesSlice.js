import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addHobbyToFirestore,
  deletePracticeLogFromFirestore,
  logPracticeInFirestore,
  updatePracticeLogInFirestore,
  deleteHobbyFromFirestore,
  updateHobbyInFirestore,
} from "../../utils/hobbiesBase";
import { userLoggedOut } from '../user/userSlice';
import { createSelector } from '@reduxjs/toolkit';
import { startOfWeek, eachDayOfInterval, format, isBefore, endOfDay, startOfMonth } from 'date-fns';
import { demoSlice, toggleDemoMode } from '../demo/demoSlice';
import {DUMMY_HOBBIES} from '../../utils/demoData';
import {generateDynamicHobby} from '../../utils/demoData'

export const calculateDailyHobbiesProductivity = (state) => {
  let totalPossiblePoints = 0;
  let pointsEarned = 0;

  const today = new Date();
  const formattedToday = format(today, 'yyyy-MM-dd');

  state.hobbies.hobbies.forEach(hobby => {
    if (hobby.daysOfWeek.includes(format(today, 'EEEE'))) {
      totalPossiblePoints += 1;
      const practiceLog = hobby.practiceLog.find(log => log.date === formattedToday);
      if (practiceLog && practiceLog.timeSpent >= hobby.practiceTimeGoal) {
        pointsEarned += 1;
      }
    }
  });

  const dailyProductivityScore = (totalPossiblePoints > 0) ? (pointsEarned / totalPossiblePoints) * 100 : 0;
  return dailyProductivityScore;
};

export const calculateDailyProductivityForHobby = (state, hobbyId) => {
  let totalPossiblePoints = 0;
  let pointsEarned = 0;

  const today = new Date();
  const formattedToday = format(today, 'yyyy-MM-dd');

  const hobby = state.hobbies.hobbies.find(h => h.id === hobbyId);
  if (hobby && hobby.daysOfWeek.includes(format(today, 'EEEE'))) {
    totalPossiblePoints += 1;
    const practiceLog = hobby.practiceLog.find(log => log.date === formattedToday);
    if (practiceLog && practiceLog.timeSpent >= hobby.practiceTimeGoal) {
      pointsEarned += 1;
    }
  }

  const dailyProductivityScore = (totalPossiblePoints > 0) ? (pointsEarned / totalPossiblePoints) * 100 : 0;
  return dailyProductivityScore;
};



export const selectWeeklyProductivityScores = (state) => {
  let totalPossiblePoints = 0;
  let pointsEarned = 0;
  
  const today = new Date();
  const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });
  const daysSoFarThisWeek = eachDayOfInterval({ start: startOfWeekDate, end: endOfDay(today) });
  
  state.hobbies.hobbies.forEach(hobby => {
    hobby.daysOfWeek.forEach((day) => {
      const practiceDate = daysSoFarThisWeek.find(date => 
        format(date, 'EEEE') === day
      );
      
      if (practiceDate && isBefore(practiceDate, endOfDay(today))) {
        totalPossiblePoints += 1;
        
        const formattedPracticeDate = format(practiceDate, 'yyyy-MM-dd');
      
      const practiceLog = hobby.practiceLog.find(log => {
    
        return log.date === formattedPracticeDate;
      });
      
        
        if (practiceLog) {
          pointsEarned += (practiceLog.timeSpent >= hobby.practiceTimeGoal) ? 1 : 0.5;
        }
      }
    });
  });
  
  // console.log('Total Possible Points So Far: ', totalPossiblePoints);
  // console.log('Points Earned: ', pointsEarned); 
  const weeklyProductivityScore = (pointsEarned / totalPossiblePoints) * 100 || 0;
  return weeklyProductivityScore;
};

export const selectMonthlyProductivityScores = (state) => {
  let totalPossiblePoints = 0;
  let pointsEarned = 0;
  
  const today = new Date();
  const firstOfMonth = startOfMonth(today);
  const daysSoFarThisMonth = eachDayOfInterval({ start: firstOfMonth, end: today });

  state.hobbies.hobbies.forEach(hobby => {
    daysSoFarThisMonth.forEach(day => {
      if (hobby.daysOfWeek.includes(format(day, 'EEEE'))) {
        totalPossiblePoints += 1;
        
        const practiceLog = hobby.practiceLog.find(log => 
          log.date === format(day, 'yyyy-MM-dd')
        );

        
        if (practiceLog) {
          pointsEarned += (practiceLog.timeSpent >= hobby.practiceTimeGoal) ? 1 : 0.5;
        }
      }
    });
  });

  // console.log('Total Possible Points So Far: ', totalPossiblePoints);
  // console.log('Points Earned: ', pointsEarned);
  
  const monthlyProductivityScore = (pointsEarned / totalPossiblePoints) * 100 || 0;
  
  return monthlyProductivityScore;
};



export const addHobby = createAsyncThunk(
  "hobbies/addHobby",
  async ({ user, hobby }, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.hobbies.demo) {
      const mockRefId = 'demo_' + Date.now();
      const newHobby = { ...hobby, refId: mockRefId };
      
      return { newHobby: newHobby };
    } else {
    try {
      const response = await addHobbyToFirestore(user, hobby);
      return response;
    } catch (error) {
      console.error("Error caught in addHobby", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
}
);

export const deleteHobby = createAsyncThunk(
  "hobbies/deleteHobby",
  async ({ user, hobbyId }, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.hobbies.demo) {
      return hobbyId;
    } else {
    try {
      await deleteHobbyFromFirestore(user, hobbyId);

      return hobbyId;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
}
);

export const updateHobby = createAsyncThunk(
  "hobbies/updateHobby",
  async ({ user, hobby }, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.hobbies.demo) {
      return hobby;
    } else {

    try {
      await updateHobbyInFirestore(user, hobby);
      return hobby;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
}
);

export const logPractice = createAsyncThunk(
  "hobbies/logPractice",
  async ({ user, hobbyId, logEntry }, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.hobbies.demo) {

      const logEntryId = Date.now().toString();
     
      const logEntryWithId = { ...logEntry, id: logEntryId };
      return { hobbyId, logEntry: logEntryWithId };
    } else {

    try {
      const updatedLogEntry = await logPracticeInFirestore(
        user,
        hobbyId,
        logEntry
        );
        console.log('made it to slice');
      return { hobbyId, logEntry: updatedLogEntry };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
}
);

export const deletePracticeLog = createAsyncThunk(
  "hobbies/deletePracticeLog",
  async ({ user, hobbyId, logEntryId }, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.hobbies.demo) {
    
      return { user, hobbyId, logEntryId };
    } else {

    try {
      await deletePracticeLogFromFirestore(user, hobbyId, logEntryId);
      return { user, hobbyId, logEntryId };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
}
);

export const updatePracticeLog = createAsyncThunk(
  "hobbies/updatePracticeLog",
  async ({ user, hobbyId, logEntryId, newLogEntry }, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.hobbies.demo) {
      // In demo mode, we find the correct log entry in our Redux state and update it.
      const hobby = state.hobbies.hobbies.find(h => h.refId === hobbyId);
      if (!hobby) {
        throw new Error('No hobby found with this ID');
      }
      
      const logIndex = hobby.practiceLog.findIndex(log => log.id === logEntryId);
      if (logIndex === -1) {
        throw new Error('Log entry not found!');
      }

      const updatedLogEntry = { ...hobby.practiceLog[logIndex], ...newLogEntry };
      hobby.practiceLog[logIndex] = updatedLogEntry;
      
      return { hobbyId, logEntryId, updatedLog: updatedLogEntry };

    } else {
    try {
      const response = await updatePracticeLogInFirestore(
        user,
        hobbyId,
        logEntryId,
        newLogEntry
      );
      return { ...response, hobbyId }; //response + the hobbyId so the reducer can use it
    } catch (error) {
      console.error("Error caught in updatePracticeLog", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
}
);

export const hobbiesSlice = createSlice({
  name: "hobbies",
  initialState: {
    status: "idle",
    error: null,
    hobbies: [],
    demo: false,
  },
  reducers: {
    setHobbies: (state, action) => {
      state.hobbies = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase("persist/REHYDRATE", (state, action) => {
      // Initialize hobbies if it's undefined after rehydration
      console.log("Rehydrated State", action.payload);

      if (!state.hobbies) {
        state.hobbies = [];
      }
    })
    .addCase(demoSlice.actions.toggleDemoMode, (state, action,) => {
      // Toggle the demo status in response to the toggleDemoMode action
      state.demo = !state.demo;
      if (state.demo) {
        const demoHobby1 = generateDynamicHobby();
        
        state.hobbies = [demoHobby1]; 
        
      } else {
        state.hobbies = [],
        state.status='idle',
        state.error=null
      }
    })
      //-------create--------
      .addCase(userLoggedOut, (state) => {
        if (!state.demo) {
          return {
            status: "idle",
            error: null,
            hobbies: [],
          };
        }
      })
      .addCase(addHobby.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addHobby.fulfilled, (state, action) => {
        state.status = "idle";
        state.hobbies.push(action.payload.newHobby);
      })
      .addCase(addHobby.rejected, (state, action) => {
        state.status = "idle";
        if (action.payload) {
          state.error = action.payload.error;
        } else {
          state.error = action.error;
        }
      })
      //-------create--------
      //-------delete--------
      .addCase(deleteHobby.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteHobby.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.hobbies.findIndex(
          (h) => h.refId === action.payload
        );
        if (index !== -1) {
          state.hobbies.splice(index, 1);
        }
      })
      .addCase(deleteHobby.rejected, (state, action) => {
        state.status = "idle";
        if (action.payload) {
          state.error = action.payload.error;
        } else {
          state.error = action.error;
        }
      })
      //-------delete--------
      //-------update--------
      .addCase(updateHobby.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateHobby.fulfilled, (state, action) => {
        const index = state.hobbies.findIndex(
          (h) => h.refId === action.payload.refId
        );
        if (index !== -1) {
          state.hobbies[index] = action.payload;
        }
      })
      .addCase(updateHobby.rejected, (state, action) => {
        state.status = "idle";
        if (action.payload) {
          state.error = action.payload.error;
        } else {
          state.error = action.error;
        }
      })
      //-------update--------
      //-------practicLog--------
      .addCase(logPractice.pending, (state) => {
        state.status = "loading";
      });
    builder
      .addCase(logPractice.fulfilled, (state, action) => {
        const hobby = state.hobbies.find(
          (h) => h.refId === action.payload.hobbyId
        );

        // add the log
        if (hobby) {
          hobby.practiceLog.push(action.payload.logEntry);
        }
      })
      .addCase(logPractice.rejected, (state, action) => {
        state.status = "idle";
        if (action.payload) {
          state.error = action.payload.error;
        } else {
          state.error = action.error;
        }
      })
      .addCase(deletePracticeLog.fulfilled, (state, action) => {
        const hobbyIndex = state.hobbies.findIndex(
          (hobby) => hobby.refId === action.payload.hobbyId
        );
        if (hobbyIndex !== -1) {
          const logIndex = state.hobbies[hobbyIndex].practiceLog.findIndex(
            (log) => log.id === action.payload.logEntryId
          );

          if (logIndex !== -1) {
            state.hobbies[hobbyIndex].practiceLog.splice(logIndex, 1);
          }
        }
      })
      .addCase(deletePracticeLog.rejected, (state, action) => {
        state.status = "idle";
        if (action.payload) {
          state.error = action.payload.error;
        } else {
          state.error = action.error;
        }
      })
      .addCase(updatePracticeLog.fulfilled, (state, action) => {
        const hobbyIndex = state.hobbies.findIndex(
          (hobby) => hobby.refId === action.payload.hobbyId
        );
        if (hobbyIndex !== -1) {
          const logIndex = state.hobbies[hobbyIndex].practiceLog.findIndex(
            (log) => log.id === action.payload.logEntryId
          );
          if (logIndex !== -1) {
            state.hobbies[hobbyIndex].practiceLog[logIndex] =
              action.payload.updatedLog;
          }
        }
      })
      .addCase(updatePracticeLog.rejected, (state, action) => {
        state.status = "idle";
        if (action.payload) {
          state.error = action.payload.error;
        } else {
          state.error = action.error;
        }
      });

    //-------practicLog--------
  },
});

export const { setHobbies, clearError, setDemo  } = hobbiesSlice.actions;

export default hobbiesSlice.reducer;
