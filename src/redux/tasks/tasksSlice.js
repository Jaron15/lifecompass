import { createSlice, nanoid } from '@reduxjs/toolkit';


const taskSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    addTask: (state, action) => {
        const { type, name, schedule } = action.payload;
        state.push({
          id: nanoid(),
          name,
          isCompleted: false,
          recurringDay: type === 'recurring' ? schedule : null,
          dueDate: type === 'singular' ? schedule : null
        });
      },
  
    deleteTask: (state, action) => {
      return state.filter((task) => task.id !== action.payload);
    },
    completeTask: (state, action) => {
      const task = state.find((task) => task.id === action.payload);
      if (task) {
        task.isCompleted = true;
      }
    },
  },
});

export const { addTask, deleteTask, completeTask } = taskSlice.actions;

export default taskSlice.reducer;
