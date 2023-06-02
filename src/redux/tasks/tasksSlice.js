import { createSlice, nanoid } from '@reduxjs/toolkit';


const taskSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      state.push({
        id:nanoid(),
        name: action.payload.name,
        isCompleted: false,
        recurringDay: action.payload.recurringDay,
        dueDate: action.payload.dueDate
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
