import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTasksFromFirestore, addTaskToFirestore, deleteTaskFromFirestore, completeTaskInFirestore } from '../../utils/tasksBase';


export const addTask = createAsyncThunk(
  'tasks/addTask',
  async ({task, user}, thunkAPI) => {
    try {
      await addTaskToFirestore(user,task);
      return task
    } catch (error) {
      console.error('failed to add task: ', error);
      return thunkAPI.rejectWithValue({error: error.message})
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async ({taskId, user}, thunkAPI) => {
    try {
      await deleteTaskFromFirestore(user, taskId);
      return taskId
    } catch (error) {
      console.error('Failed to delete task: ', error);
      return thunkAPI.rejectWithValue({error: error.message})
    }
  }
);

export const completeTask = createAsyncThunk(
  'tasks/completeTask',
  async ({taskId, user}, thunkAPI) => {
    try {
      await completeTaskInFirestore(user, taskId);
      return taskId
    } catch (error) {
      console.error('failed to complete task: ', error );
      return thunkAPI.rejectWithValue({error: error.message})
    }
  }
)

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTask.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        console.error("Failed to add task:", action.error.message);
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        return state.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        console.error("Failed to delete task:", action.error.message);
      })

      .addCase(completeTask.fulfilled, (state, action) => {
        const task = state.find((task) => task.id === action.payload);
        if (task) {
          task.isCompleted = true;
        }
      })
      .addCase(completeTask.rejected, (state, action) => {
        console.error("Failed to complete task:", action.error.message);
      });
  },
});





export default taskSlice.reducer;
