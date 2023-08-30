import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { startOfWeek, eachDayOfInterval, format, isBefore, endOfDay, startOfMonth, parseISO, isAfter, formatISO, isToday, isYesterday} from 'date-fns';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import {db} from '../../utils/firebase'

const initialState = {
  overallStreak: 0,
  dailyProductivity: 0, 
  weeklyProductivity: [], 
  status: 'idle',
  error: null,
};

//---------weekly/monthly scores-----------
//------hobbies-----

export const selectWeeklyHobbyProductivityScores = (state) => {
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
        
          const practiceLog = (hobby.practiceLog || []).find(log => {
            return log.date === formattedPracticeDate;
        });
        
        
          
          if (practiceLog) {
            pointsEarned += (practiceLog.timeSpent >= hobby.practiceTimeGoal) ? 1 : 0.5;
          }
        }
      });
    });
    

    const weeklyProductivityScore = (pointsEarned / totalPossiblePoints) * 100 || 0;
    return weeklyProductivityScore;
  };
  
  export const selectMonthlyHobbyProductivityScores = (state) => {
    let totalPossiblePoints = 0;
    let pointsEarned = 0;
    
    const today = new Date();
    const firstOfMonth = startOfMonth(today);
    const daysSoFarThisMonth = eachDayOfInterval({ start: firstOfMonth, end: today });
  
    state.hobbies.hobbies.forEach(hobby => {
      daysSoFarThisMonth.forEach(day => {
        if (hobby.daysOfWeek.includes(format(day, 'EEEE'))) {
          totalPossiblePoints += 1;
          
          const practiceLog = (hobby.practiceLog || []).find(log => 
            log.date === format(day, 'yyyy-MM-dd')
          );
  
          
          if (practiceLog) {
            pointsEarned += (practiceLog.timeSpent >= hobby.practiceTimeGoal) ? 1 : 0.5;
          }
        }
      });
    });

    const monthlyProductivityScore = (pointsEarned / totalPossiblePoints) * 100 || 0;
    
    return monthlyProductivityScore;
  };
  //------hobbies-----
  //------tasks-----
  export const calculateWeeklyTaskProductivity = (state) => {
      let totalPossiblePoints = 0;
      let pointsEarned = 0;
      
      const today = new Date();
      const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });
      const daysSoFarThisWeek = eachDayOfInterval({ start: startOfWeekDate, end: endOfDay(today) });
      // Calculate Total Possible Points So Far
      daysSoFarThisWeek.forEach(dayDate => {
        state.tasks.tasks.forEach(task => {
          if (task.type === 'recurring' && dayDate.toLocaleDateString('en-US', { weekday: 'long' }) === task.recurringDay) {
            totalPossiblePoints += 1;
          }
    
        });
      });
      
      state.tasks.tasks.forEach(task => {
        if (task.type === 'singular' && task.dueDate) {
          const dueDate = parseISO(task.dueDate);
          if (isBefore(dueDate, endOfDay(today))) {
            totalPossiblePoints += 1;
          }
        }
      });
      
      // Calculate Points Earned So Far
      daysSoFarThisWeek.forEach(dayDate => {
        state.tasks.completedTasks.forEach(completedTask => {
          const completedDate = parseISO(completedTask.completedDate);
          const dueDate = parseISO(completedTask.dueDate);
          const formatedDay = format(dayDate, 'yyyy-MM-dd');
          
          if (completedDate.getTime() <= dueDate.getTime() && completedTask.dueDate === formatedDay) {
            pointsEarned += 1;
          } else if (isAfter(completedDate, dueDate) && completedTask.dueDate === formatedDay) {
            pointsEarned += 0.5;
          }
        });
      });
      
      const weeklyProductivityScore = (totalPossiblePoints > 0) ? (pointsEarned / totalPossiblePoints) * 100 : 0;
      
      return weeklyProductivityScore;
    };
    
    export const calculateMonthlyTaskProductivity = (state) => {
      let totalPossiblePoints = 0;
      let pointsEarned = 0;
      
      const today = new Date();
      const firstOfMonth = startOfMonth(today);
      const daysSoFarThisMonth = eachDayOfInterval({ start: firstOfMonth, end: today });
      
      // Calculate Total Possible Points for This Month
      daysSoFarThisMonth.forEach(dayDate => {
        state.tasks.tasks.forEach(task => {
          if (task.type === 'recurring' && dayDate.toLocaleDateString('en-US', { weekday: 'long' }) === task.recurringDay) {
            totalPossiblePoints += 1;
          }
        });
      });
    
      state.tasks.tasks.forEach(task => {
        if (task.type === 'singular' && task.dueDate) {
          const dueDate = parseISO(task.dueDate);
          if (isBefore(dueDate, endOfDay(today))) {
            totalPossiblePoints += 1;
          }
        }
      });
    
      // Calculate Points Earned So Far for This Month
      daysSoFarThisMonth.forEach(dayDate => {
        state.tasks.completedTasks.forEach(completedTask => {
          const completedDate = parseISO(completedTask.completedDate);
          const dueDate = parseISO(completedTask.dueDate);
          const formattedDay = format(dayDate, 'yyyy-MM-dd');
          
          if (completedDate.getTime() <= dueDate.getTime() && completedTask.dueDate === formattedDay) {
            pointsEarned += 1;
          } else if (isAfter(completedDate, dueDate) && completedTask.dueDate === formattedDay) {
            pointsEarned += 0.5;
          }
        });
      });
    
      const monthlyProductivityScore = (totalPossiblePoints > 0) ? (pointsEarned / totalPossiblePoints) * 100 : 0;
    
      return monthlyProductivityScore;
    };
    //------tasks-----
    //---------weekly/monthly scores-----------

    //-----------daily----------
    export const calculateDailyHobbiesProductivity = (state) => {
        let totalPossiblePoints = 0;
        let pointsEarned = 0;
      
        const today = new Date();
        const formattedToday = format(today, 'yyyy-MM-dd');
      console.log(formattedToday);
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
      export const calculateDailyTaskProductivity = (state) => {
        let totalPossiblePoints = 0;
        let pointsEarned = 0;
        
        const today = new Date();
        const formattedToday = format(today, 'yyyy-MM-dd');
        console.log(formattedToday);
        state.tasks.tasks.forEach(task => {
          if (task.type === 'recurring' && today.toLocaleDateString('en-US', { weekday: 'long' }) === task.recurringDay) {
            totalPossiblePoints += 1;
          } else if (task.type === 'singular' && task.dueDate === formattedToday) {
            totalPossiblePoints += 1;
          }
      
          // Check for completed tasks
          const completedTask = state.tasks.completedTasks.find(completedTask => 
            completedTask.dueDate === formattedToday && completedTask.completedDate === formattedToday
          );
          if (completedTask) {
            if (completedTask.dueDate === formattedToday) {
              pointsEarned += 1;
            }
          }
        });
      
        const dailyProductivityScore = (totalPossiblePoints > 0) ? (pointsEarned / totalPossiblePoints) * 100 : 0;
        return dailyProductivityScore;
      };
      
      //-----for an individual hobby------
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
      //-----for an individual hobby------
    //-----------daily----------

    //--------overall----------
    export const calculateOverallStreak = createAsyncThunk(
        'productivity/calculateOverallStreak',
        async ({ user }, thunkAPI) => {
            const state = thunkAPI.getState();
            const uid = user.uid;
          const streakDocRef = doc(db, 'users', uid, 'productivity', 'streaks');
          const streakDocSnap = await getDoc(streakDocRef);
          console.log(state);
          let currentStreak = 0;
          let lastUpdatedDate = null;
          if (!streakDocSnap.exists()) {
            await setDoc(streakDocRef, {
              overallStreak: 0,
              lastUpdatedDate: null,  // Initialize to null
            });
          } else {
            currentStreak = streakDocSnap.data().overallStreak;
            lastUpdatedDate = streakDocSnap.data().lastUpdatedDate ? parseISO(streakDocSnap.data().lastUpdatedDate) : null;
          }
        
          console.log(isToday(lastUpdatedDate));
          console.log('still going'); 
          // Skip further processing if the streak has already been updated today
            if (lastUpdatedDate && isToday(lastUpdatedDate)) {
                return currentStreak;
            }

            if (lastUpdatedDate && !isYesterday(lastUpdatedDate) && !isToday(lastUpdatedDate)) {
                currentStreak = 0;
            } 

            let streakChanged = false;  
          // Calculate streak based on today's activities
          const dailyHobbyProductivity = calculateDailyHobbiesProductivity(state);
          const dailyTaskProductivity = calculateDailyTaskProductivity(state);
          console.log(dailyHobbyProductivity);
          console.log(dailyTaskProductivity);
          if (dailyHobbyProductivity >= 100 && dailyTaskProductivity >= 100) {
            // If productivity for both hobbies and tasks is at least 100%
            if (lastUpdatedDate && isYesterday(lastUpdatedDate)) {
                currentStreak += 1;  // Increment if last update was yesterday
              } else {
                currentStreak = 1;  // Reset streak to 1 if last update was NOT yesterday
              }
              streakChanged = true;
            } 
         
      
          // Save the updated overallStreak and lastUpdatedDate back to Firebase
          if (streakChanged) {
            const todayDateISO = format(new Date(), 'yyyy-MM-dd');
            await setDoc(streakDocRef, { overallStreak: currentStreak, lastUpdatedDate: todayDateISO });
          }      
      
          return currentStreak;  // Return the updated streak
        }
      );
      
      

const productivitySlice = createSlice({
  name: 'productivity',
  initialState,
  reducers: {
    setOverallStreak: (state, action) => {
      state.overallStreak = action.payload;
    },
    // Add other reducers for daily and weekly productivity here
  },
  extraReducers: (builder) => {
    builder.addCase(calculateOverallStreak.fulfilled, (state, action) => {
        state.overallStreak = action.payload;
      });
  },
});

export const { setOverallStreak } = productivitySlice.actions;

export default productivitySlice.reducer;
