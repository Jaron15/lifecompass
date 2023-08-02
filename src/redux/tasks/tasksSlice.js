import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTasksFromFirestore, addTaskToFirestore, deleteTaskFromFirestore, markTaskAsCompletedInFirestore, addCompletedTaskToFirestore, getCompletedTasksFromFirestore } from '../../utils/tasksBase';

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

//=======================================================
export const markTaskAsCompleted = createAsyncThunk('tasks/markTaskAsCompleted', 
  async ({userId, taskId, completedDate}, thunkAPI) => {
    console.log('function entered ');
    try {
      console.log('trying');
      const completedTask = await markTaskAsCompletedInFirestore(userId, taskId, completedDate);
      console.log(completedTask);  
      return completedTask;
    } catch (error) {
      console.log('error occured');
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const addCompletedTask = createAsyncThunk('tasks/addCompletedTask', 
  async ({userId, task}, thunkAPI) => {
    try {
      await addCompletedTaskToFirestore(userId, task);
      return task;
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

  },
  extraReducers: (builder) => {
    builder
    .addCase("persist/REHYDRATE", (state, action) => {
      if (!state.tasks) {
        state.tasks = [];
      }
    })
    .addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
    })
    .addCase(fetchTasks.rejected, (state, action) => {
      console.error("Failed to get tasks:", action.error.message);
    })
    .addCase(addTask.fulfilled, (state, action) => {
      state.tasks.push(action.payload);
    })
    .addCase(addTask.rejected, (state, action) => {
      console.error("Failed to add task:", action.error.message);
    })

    .addCase(deleteTask.fulfilled, (state, action) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload);
      if (index !== -1) {
        state.tasks.splice(index, 1);
      }
    })
    
    .addCase(deleteTask.rejected, (state, action) => {
      console.error("Failed to delete task:", action.error.message);
    })

    .addCase(markTaskAsCompleted.fulfilled, (state, action) => {
      console.log('action.payload.id:', action.payload.id);
      state.tasks.forEach(task => console.log('task.id:', task.id));
 
      const task = state.tasks.find((task) => task.id === action.payload.task.id);
      const completedTask = {...action.payload.completedTask,name: task.name}
      console.log(task);
      if (task) {
        task.isCompleted = true;
        state.completedTasks.push(completedTask)
      }

    })
    .addCase(markTaskAsCompleted.rejected, (state, action) => {
      console.error("Failed to complete task:", action.error.message);
    })
    .addCase(addCompletedTask.fulfilled, (state, action) => {
      // We don't need to change the state here
    })
    .addCase(addCompletedTask.rejected, (state, action) => {
      console.error("Failed to add completed task:", action.error.message);
    })
    .addCase(getCompletedTasks.fulfilled, (state, action) => {
      state.completedTasks = action.payload;
    })
    .addCase(getCompletedTasks.rejected, (state, action) => {
      console.error("Failed to get completed tasks:", action.error.message);
    })
      
  },
});

export const { setTasks, setCompletedTasks } = taskSlice.actions;

export default taskSlice.reducer;
