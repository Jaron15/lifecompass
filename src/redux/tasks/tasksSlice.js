import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTasksFromFirestore, addTaskToFirestore, deleteTaskFromFirestore, markTaskAsCompletedInFirestore, addCompletedTaskToFirestore, getCompletedTasksFromFirestore, deleteCompletedTaskFromFirestore, updateTaskInFirestore, updateCompletedTaskInFirestore } from '../../utils/tasksBase';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', 
  async (userId, thunkAPI) => {
    try {
      const tasks = await getTasksFromFirestore(userId);
      return tasks;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async ({userId, task}, thunkAPI) => {
    try {
      const newTask = await addTaskToFirestore(userId, task);
      return newTask;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({userId, taskId, updatedTask}, thunkAPI) => {
    try {
      await updateTaskInFirestore(userId, taskId, updatedTask);
      return { taskId, updatedTask };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const updateCompletedTask = createAsyncThunk(
  'tasks/updateCompletedTask',
  async ({ userId, taskId, updatedFields }, thunkAPI) => {
    try {
      const updatedTask = await updateCompletedTaskInFirestore(userId, taskId, updatedFields);
      return updatedTask;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const deleteTask = createAsyncThunk('tasks/deleteTask', 
  async ({userId, taskId}, thunkAPI) => {
    try {
      await deleteTaskFromFirestore(userId, taskId);
      return taskId;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);


export const markTaskAsCompleted = createAsyncThunk('tasks/markTaskAsCompleted', 
  async ({userId, taskId, completedDate}, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const taskData = state.tasks.tasks.find((task) => task.id === taskId);
      
      const completedTask = await markTaskAsCompletedInFirestore(userId, taskId, completedDate);
      
      return {completedTask, originalTask: taskData};
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);


export const addCompletedTask = createAsyncThunk('tasks/addCompletedTask', 
  async ({userId, task}, thunkAPI) => {
    try {
      const completedTask = await addCompletedTaskToFirestore(userId, task);
      return completedTask;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const deleteCompletedTask = createAsyncThunk(
  'tasks/deleteCompletedTask',
  async ({userId, taskId}, thunkAPI) => {
    try {
      await deleteCompletedTaskFromFirestore(userId, taskId);
      return taskId;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);


export const getCompletedTasks = createAsyncThunk('tasks/getCompletedTasks', 
  async (userId, thunkAPI) => {
    try {
      const completedTasks = await getCompletedTasksFromFirestore(userId);
      return completedTasks;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);



const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    completedTasks: [],
    status: 'idle',
    error: null
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },    
    setCompletedTasks: (state, action) => {
      state.completedTasks = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase("persist/REHYDRATE", (state, action) => {
      if (!state.tasks) {
        state.tasks = [];
      }
    })
    //------------get------------------
    .addCase(fetchTasks.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
    })
    .addCase(fetchTasks.rejected, (state, action) => {
      state.status = "idle";
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = action.error;
      }
    })
    //------------get------------------
    //------------create------------------
    .addCase(addTask.pending, (state) => {
      state.status = "loading";
    })
    .addCase(addTask.fulfilled, (state, action) => {
      state.tasks.push(action.payload);
    })
    .addCase(addTask.rejected, (state, action) => {
      state.status = "idle";
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = action.error;
      }
    })
    //------------create------------------
    //------------update------------------
    .addCase(updateTask.pending, (state) => {
      state.status = "loading";
    })
    .addCase(updateTask.fulfilled, (state, action) => {
      const { taskId, updatedTask } = action.payload;
      const task = state.tasks.find((task) => task.id === taskId);
      if (task) {
        Object.assign(task, updatedTask);
      }
    })
    .addCase(updateTask.rejected, (state, action) => {
      state.status = "idle";
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = action.error;
      }
    })
    .addCase(updateCompletedTask.pending, (state) => {
      state.status = "loading";
    })
    .addCase(updateCompletedTask.fulfilled, (state, action) => {
      const updatedTask = action.payload;
      const index = state.completedTasks.findIndex((task) => task.id === updatedTask.id);

      if (index > -1) {
        state.completedTasks[index] = updatedTask;
      }
    })
    .addCase(updateCompletedTask.rejected, (state, action) => {
      state.status = "idle";
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = action.error;
      }
    })
    //------------update------------------
    //------------delete------------------
    .addCase(deleteTask.pending, (state) => {
      state.status = "loading";
    })
    .addCase(deleteTask.fulfilled, (state, action) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload);
      if (index !== -1) {
        state.tasks.splice(index, 1);
      }
    })
    .addCase(deleteTask.rejected, (state, action) => {
      state.status = "idle";
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = action.error;
      }
    })
    //------------delete------------------
    //------------mark complete------------------
    .addCase(markTaskAsCompleted.pending, (state) => {
      state.status = "loading";
    })
    .addCase(markTaskAsCompleted.fulfilled, (state, action) => {
      const completedTask = {...action.payload.completedTask, name: action.payload.originalTask.name}
  
      state.tasks = state.tasks.filter((task) => task.id !== action.payload.originalTask.id);
      state.completedTasks = [...state.completedTasks, completedTask];
    })
    .addCase(markTaskAsCompleted.rejected, (state, action) => {
      state.status = "idle";
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = action.error;
      }
    })
    .addCase(addCompletedTask.pending, (state) => {
      state.status = "loading";
    })
    .addCase(addCompletedTask.fulfilled, (state, action) => {
      state.completedTasks.push(action.payload);
    })
    .addCase(addCompletedTask.rejected, (state, action) => {
      state.status = "idle";
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = action.error;
      }
    })
    //------------mark complete------------------
    //------------delete complete------------------
    .addCase(deleteCompletedTask.pending, (state) => {
      state.status = "loading";
    })
    .addCase(deleteCompletedTask.fulfilled, (state, action) => {
      state.completedTasks = state.completedTasks.filter((task) => task.id !== action.payload);
    })
    .addCase(deleteCompletedTask.rejected, (state, action) => {
      state.status = "idle";
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = action.error;
      }
    })
    //------------delete complete------------------
    //------------get complete------------------
    .addCase(getCompletedTasks.pending, (state) => {
      state.status = "loading";
    })
    .addCase(getCompletedTasks.fulfilled, (state, action) => {
      state.completedTasks = action.payload;
    })
    .addCase(getCompletedTasks.rejected, (state, action) => {
      state.status = "idle";
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = action.error;
      }
    })
    //------------get complete------------------
  },
});

export const { setTasks, setCompletedTasks, clearError } = taskSlice.actions;

export default taskSlice.reducer;
