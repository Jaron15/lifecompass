import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addHobbyToFirestore,
  deletePracticeLogFromFirestore,
  logPracticeInFirestore,
  updatePracticeLogInFirestore,
  deleteHobbyFromFirestore,
  updateHobbyInFirestore,
  addGoalToHobbyInFirestore,
  removeGoalFromHobbyInFirestore,
  updateGoalInHobbyInFirestore,
  deleteNoteFromFirestore,
  updateNoteInFirestore,
  addNoteToFirestore,
} from "../../utils/hobbiesBase";
import { userLoggedOut } from '../user/userSlice';
import { demoSlice, toggleDemoMode } from '../demo/demoSlice';
import {DUMMY_HOBBIES} from '../../utils/demoData';
import {generateDynamicHobby} from '../../utils/demoData'
import { calculateDailyProductivityForHobby } from "../productivity/prodSlice";
import {  format,  parseISO, formatISO, isToday, isYesterday} from 'date-fns';

//----------hobby core------------
export const addHobby = createAsyncThunk(
  "hobbies/addHobby",
  async ({ user, hobby }, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.hobbies.demo) {
      const mockRefId = 'demo_' + Date.now();
      const newHobby = { ...hobby, refId: mockRefId };
      const hobbyWithCreatedDate = {
        ...newHobby,
        createdDate: new Date().toISOString().split('T')[0] 
      };
      return { newHobby: hobbyWithCreatedDate };
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
//----------hobby core------------

//----------practice logs------------
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
      const updatedData = await logPracticeInFirestore(user, hobbyId, logEntry);
        console.log('made it to slice');
        return { hobbyId, logEntry: updatedData.logEntry };
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
//----------practice logs------------

//----------streaks------------
export const calculateHobbyStreak = createAsyncThunk(
  'hobbies/calculateHobbyStreak',
  async ({ user, hobbyId }, thunkAPI) => {
      const state = thunkAPI.getState();
      const uid = user.uid;
      let streakChanged = false;  
      let currentStreak = 0;
      let bestStreak = 0;
      let lastUpdatedDate = null;
console.log('CALCULATING');
      //---------demo-----------
      if (state.demo) {
        const hobby = state.hobbies.hobbies.find(h => h.refId === hobbyId);
        console.log(hobby);
        if (!hobby) {
          console.log('hobby doesnt exisst');
            return { streak: 0, lastUpdatedDate: null, bestStreak: 0 };
        }
        console.log(hobby.lastUpdatedDate);
        currentStreak = hobby.streak || 0;
        bestStreak = hobby.bestStreak || 0;
        lastUpdatedDate = hobby.lastUpdatedDate ? parseISO(hobby.lastUpdatedDate) : null;
        if (lastUpdatedDate && isToday(lastUpdatedDate)) {
          return { streak: currentStreak, bestStreak, lastUpdatedDate: hobby.lastUpdatedDate };
        }
        
        if (lastUpdatedDate && !isYesterday(lastUpdatedDate) && !isToday(lastUpdatedDate)) {
          currentStreak = 0;
        }
          const dailyHobbyProductivity = calculateDailyProductivityForHobby(state, hobbyId);
          console.log(dailyHobbyProductivity);
          if (dailyHobbyProductivity >= 100) {
              if (lastUpdatedDate && isYesterday(lastUpdatedDate)) {
                console.log('increased');
                  currentStreak += 1;
                  bestStreak = Math.max(bestStreak, currentStreak);
              } else {
                  currentStreak = 1;
              }
              streakChanged = true;
          }
          if (streakChanged) {
              const todayDateISO = formatISO(new Date(), 'yyyy-MM-dd');
              return { streak: currentStreak, bestStreak, lastUpdatedDate: todayDateISO };
          }
          
          return { streak: currentStreak, bestStreak, lastUpdatedDate: hobby.lastUpdatedDate };
            //--------DEMO end-----------
      } else {
        const hobbyStreakDocRef = doc(db, 'users', uid, 'hobbies', hobbyId, 'streak');
        const hobbyStreakDocSnap = await getDoc(hobbyStreakDocRef);
        
        if (!hobbyStreakDocSnap.exists()) {
            await setDoc(hobbyStreakDocRef, {
              streak: 0,
              bestStreak: 0,
              lastUpdatedDate: null,
            });
        } else {
            currentStreak = hobbyStreakDocSnap.data().streak;
            bestStreak = hobbyStreakDocSnap.data().bestStreak;
            lastUpdatedDate = hobbyStreakDocSnap.data().lastUpdatedDate ? parseISO(hobbyStreakDocSnap.data().lastUpdatedDate) : null;
        }

        if (lastUpdatedDate && isToday(lastUpdatedDate)) {
            return { streak: currentStreak, bestStreak, lastUpdatedDate: lastUpdatedDate };
        }

        if (lastUpdatedDate && !isYesterday(lastUpdatedDate) && !isToday(lastUpdatedDate)) {
            currentStreak = 0;
        }

        const dailyHobbyProductivity = calculateDailyProductivityForHobby(state, hobbyId);
        if (dailyHobbyProductivity >= 100) {
            if (lastUpdatedDate && isYesterday(lastUpdatedDate)) {
                currentStreak += 1;
                bestStreak = Math.max(bestStreak, currentStreak);
            } else {
                currentStreak = 1;
            }
            streakChanged = true;
        }

        if (streakChanged) {
            const todayDateISO = format(new Date(), 'yyyy-MM-dd');
            await setDoc(hobbyStreakDocRef, { streak: currentStreak, bestStreak, lastUpdatedDate: todayDateISO });
            return { streak: currentStreak, bestStreak, lastUpdatedDate: formatISO(new Date()) };
        }
        
        return { streak: currentStreak, bestStreak, lastUpdatedDate: lastUpdatedDate };
      }
  }
);
//----------streaks------------

//----------goals------------
export const addGoal = createAsyncThunk(
  "hobbies/addGoal",
  async ({ user, hobbyId, goal }, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.hobbies.demo) {
      return { hobbyId, goal };  
    } else {
      try {
        await addGoalToHobbyInFirestore(user, hobbyId, goal);
        return { user, hobbyId, goal };
      } catch (error) {
        return thunkAPI.rejectWithValue({ error: error.message });
      }
    }
  }
);



export const removeGoal = createAsyncThunk(
  "hobbies/removeGoal",
  async ({ user, hobbyId, goalId }, thunkAPI) => {
    if (thunkAPI.getState().hobbies.demo) {
      return { hobbyId, goalId };
    } else {
      try {
        await removeGoalFromHobbyInFirestore(user, hobbyId, goalId);
        return { user, hobbyId, goalId };
      } catch (error) {
        return thunkAPI.rejectWithValue({ error: error.message });
      }
    }
  }
);


export const updateGoal = createAsyncThunk(
  "hobbies/updateGoal",
  async ({ user, hobbyId, goal }, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.hobbies.demo) {
      return { hobbyId, goal };
    } else {
      try {
        await updateGoalInHobbyInFirestore(user, hobbyId, goal);
        return { user, hobbyId, goal };
      } catch (error) {
        return thunkAPI.rejectWithValue({ error: error.message });
      }
    }
  }
);
//----------goals------------
//----------Notes------------
export const addNote = createAsyncThunk(
  "hobbies/addNote",
  async ({ user, hobbyId, note }, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.hobbies.demo) {
      return { hobbyId, note };
    } else {
      try {
        await addNoteToFirestore(user, hobbyId, note);
        return { user, hobbyId, note };
      } catch (error) {
        return thunkAPI.rejectWithValue({ error: error.message });
      }
    }
  }
);

export const updateNote = createAsyncThunk(
  "hobbies/updateNote",
  async ({ user, hobbyId, noteId, updatedNote }, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.hobbies.demo) {
      return { hobbyId, noteId, updatedNote };
    } else {
      try {
        await updateNoteInFirestore(user, hobbyId, noteId, updatedNote);
        return { user, hobbyId, noteId, updatedNote };
      } catch (error) {
        return thunkAPI.rejectWithValue({ error: error.message });
      }
    }
  }
);

export const deleteNote = createAsyncThunk(
  "hobbies/deleteNote",
  async ({ user, hobbyId, noteId }, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.hobbies.demo) {
      return { hobbyId, noteId };
    } else {
      try {
        await deleteNoteFromFirestore(user, hobbyId, noteId);
        return { user, hobbyId, noteId };
      } catch (error) {
        return thunkAPI.rejectWithValue({ error: error.message });
      }
    }
  }
);
//----------Notes------------

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
      })

    //-------practicLog--------
    //-------Streak-----------
    .addCase(calculateHobbyStreak.fulfilled, (state, action) => {
      const { streak, bestStreak, lastUpdatedDate } = action.payload;
      const hobby = state.hobbies.find(h => h.refId === action.meta.arg.hobbyId);
      if (hobby) {
          hobby.streak = streak;
          hobby.bestStreak = bestStreak;
          hobby.lastUpdatedDate = lastUpdatedDate;
      }
  })
  //-------Goal--------
.addCase(addGoal.fulfilled, (state, action) => {
  const { hobbyId, goal } = action.payload;
  const hobby = state.hobbies.find(h => h.refId === hobbyId);
  if (hobby) {
    hobby.goals = hobby.goals || [];
    hobby.goals.push(goal);
  }
})

.addCase(removeGoal.fulfilled, (state, action) => {
  const { hobbyId, goalId } = action.payload;
  const hobby = state.hobbies.find(h => h.refId === hobbyId);
  if (hobby && hobby.goals) {
    hobby.goals = hobby.goals.filter(g => g.id !== goalId);
  }
})
.addCase(updateGoal.fulfilled, (state, action) => {
  const { hobbyId, goal } = action.payload;
  const hobby = state.hobbies.find(h => h.refId === hobbyId);
  if (hobby && hobby.goals) {
    const goalIndex = hobby.goals.findIndex(g => g.id === goal.id);
    if (goalIndex !== -1) {
      hobby.goals[goalIndex] = goal;
    }
  }
})
.addCase(addGoal.rejected, (state, action) => {
  state.status = "idle";
  if (action.payload) {
    state.error = action.payload.error;
  } else {
    state.error = action.error;
  }
})

.addCase(removeGoal.rejected, (state, action) => {
  state.status = "idle";
  if (action.payload) {
    state.error = action.payload.error;
  } else {
    state.error = action.error;
  }
})

.addCase(updateGoal.rejected, (state, action) => {
  state.status = "idle";
  if (action.payload) {
    state.error = action.payload.error;
  } else {
    state.error = action.error;
  }
})
//-------Goal--------;
//-------Notes--------;
.addCase(addNote.fulfilled, (state, action) => {
  const hobby = state.hobbies.find(hobby => hobby.refId === action.payload.hobbyId);
  if (hobby) {
    if (!hobby.notes) {  
      hobby.notes = []; 
    }
    hobby.notes.push(action.payload.note);
  
  }
})
.addCase(updateNote.fulfilled, (state, action) => {
  const { hobbyId, updatedNote, noteId } = action.payload;
  console.log(updatedNote);
  const hobby = state.hobbies.find(h => h.refId === hobbyId);
  if (hobby) {
    const noteIndex = hobby.notes.findIndex(n => n.id === noteId);
    if (noteIndex !== -1) {
      hobby.notes[noteIndex] = updatedNote;
    }
  }
})
.addCase(deleteNote.fulfilled, (state, action) => {
  const hobby = state.hobbies.find(hobby => hobby.refId === action.payload.hobbyId);
  if (hobby) {
    hobby.notes = hobby.notes.filter(note => note.id !== action.payload.noteId);
  }
});
  },
})


export const { setHobbies, clearError, setDemo  } = hobbiesSlice.actions;

export default hobbiesSlice.reducer;
