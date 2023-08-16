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
    try {
      const response = await addHobbyToFirestore(user, hobby);
      return response;
    } catch (error) {
      console.error("Error caught in addHobby", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const deleteHobby = createAsyncThunk(
  "hobbies/deleteHobby",
  async ({ user, hobbyId }, thunkAPI) => {
    try {
      await deleteHobbyFromFirestore(user, hobbyId);

      return hobbyId;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const updateHobby = createAsyncThunk(
  "hobbies/updateHobby",
  async ({ user, hobby }, thunkAPI) => {
    try {
      await updateHobbyInFirestore(user, hobby);
      return hobby;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const logPractice = createAsyncThunk(
  "hobbies/logPractice",
  async ({ user, hobbyId, logEntry }, thunkAPI) => {
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
);

export const deletePracticeLog = createAsyncThunk(
  "hobbies/deletePracticeLog",
  async ({ user, hobbyId, logEntryId }, thunkAPI) => {
    try {
      await deletePracticeLogFromFirestore(user, hobbyId, logEntryId);
      return { user, hobbyId, logEntryId };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const updatePracticeLog = createAsyncThunk(
  "hobbies/updatePracticeLog",
  async ({ user, hobbyId, logEntryId, newLogEntry }, thunkAPI) => {
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
);

export const hobbiesSlice = createSlice({
  name: "hobbies",
  initialState: {
    status: "idle",
    error: null,
    hobbies: [],
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
      //-------create--------
      .addCase("persist/REHYDRATE", (state, action) => {
        // Initialize hobbies if it's undefined after rehydration
        if (!state.hobbies) {
          state.hobbies = [];
        }
      })
      .addCase(userLoggedOut, () => {
        return {
          status: "idle",
          error: null,
          hobbies: [],
        };
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

export const { setHobbies, clearError } = hobbiesSlice.actions;

export default hobbiesSlice.reducer;
