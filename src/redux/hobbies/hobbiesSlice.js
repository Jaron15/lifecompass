import { createSlice } from '@reduxjs/toolkit';

const hobbiesSlice = createSlice({
  name: 'hobbies',
  initialState: [],
  reducers: {
    addHobby: (state, action) => {
      
      state.push({
        id: action.payload.id,
        hobbyName: action.payload.hobbyName,
        practiceTimeGoal: action.payload.practiceTimeGoal,
        daysOfWeek: action.payload.daysOfWeek,
        practiceLog: [], // Will hold objects with fields like {date: "2023-01-01", timeSpent: 120}
      });
    },
    logPractice: (state, action) => {
      const hobby = state.find((h) => h.id === action.payload.id);
      if (hobby) {
        hobby.practiceLog.push({
          date: action.payload.date,
          timeSpent: action.payload.timeSpent,
        });
      }
    },
    // Other actions can be added here as per your needs
  },
});

export const { addHobby, logPractice } = hobbiesSlice.actions;

export default hobbiesSlice.reducer;
