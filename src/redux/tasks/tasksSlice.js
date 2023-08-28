import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTasksFromFirestore, addTaskToFirestore, deleteTaskFromFirestore, markTaskAsCompletedInFirestore, addCompletedTaskToFirestore, getCompletedTasksFromFirestore, deleteCompletedTaskFromFirestore, updateTaskInFirestore, updateCompletedTaskInFirestore } from '../../utils/tasksBase';
import { userLoggedOut } from '../user/userSlice';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, eachWeekOfInterval, parse, isWithinInterval, eachDayOfInterval, endOfDay, isBefore, parseISO, isAfter  } from 'date-fns';
import {demoSlice} from '../demo/demoSlice';
import { generateDynamicDummyTasks } from '../../utils/demoData';


export const calculateDailyTaskProductivity = (state) => {
  let totalPossiblePoints = 0;
  let pointsEarned = 0;
  
  const today = new Date();
  const formattedToday = format(today, 'yyyy-MM-dd');

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
  
  
  // console.log('Total Possible Points So Far: ', totalPossiblePoints);
  // console.log('Points Earned: ', pointsEarned);
  // Calculate Productivity Score
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
  // console.log('Total Possible Points So Far: ', totalPossiblePoints);
  // console.log('Points Earned: ', pointsEarned);
  // Calculate Productivity Score for This Month
  const monthlyProductivityScore = (totalPossiblePoints > 0) ? (pointsEarned / totalPossiblePoints) * 100 : 0;

  return monthlyProductivityScore;
};


export const fetchTasks = createAsyncThunk('tasks/fetchTasks', 
  async (userId, thunkAPI) => { 
    const state = thunkAPI.getState();
    if (state.tasks.demo) {
      return DUMMY_TASKS;
    } else {
    try {
      const tasks = await getTasksFromFirestore(userId);
      return tasks;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
}
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async ({userId, task}, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.tasks.demo) {
      const refId = `demo-task-id-${Date.now()}`;    
      const newTask = {
        id: refId, 
        ...task,
        isCompleted: false,
        refId: refId,
        createdDate: new Date().toISOString().split('T')[0]
      };
      return newTask;
    } else {
    try {
      const newTask = await addTaskToFirestore(userId, task);
      return newTask;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
}
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({userId, taskId, updatedTask}, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.tasks.demo) {
      return { taskId, updatedTask };
    } else {
    try {
      await updateTaskInFirestore(userId, taskId, updatedTask);
      return { taskId, updatedTask };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
}
);
//has extra logic
export const updateCompletedTask = createAsyncThunk(
  'tasks/updateCompletedTask',
  async ({ userId, taskId, updatedFields }, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.tasks.demo) {
      
      const task = state.tasks.completedTasks.find((task) => task.id === taskId);

      const updatedTask = {
        ...task,
        ...updatedFields,
      };
      return { id: taskId, ...updatedTask };
    } else {
    try {
      const updatedTask = await updateCompletedTaskInFirestore(userId, taskId, updatedFields);
      return updatedTask;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
}
);

export const deleteTask = createAsyncThunk('tasks/deleteTask', 
  async ({userId, taskId}, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.tasks.demo) {
      return taskId;
    } else {
    try {
      await deleteTaskFromFirestore(userId, taskId);
      return taskId;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
}
);


export const markTaskAsCompleted = createAsyncThunk('tasks/markTaskAsCompleted', 
  async ({userId, taskId, completedDate}, thunkAPI) => {
    const state = thunkAPI.getState();
    const taskData = state.tasks.tasks.find((task) => task.refId === taskId);
    if (state.tasks.demo) {
      const currentDate = new Date();
      const dateString = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const [month, day, year] = dateString.split('/');
      const formattedDate = `${year}-${month}-${day}`;
      
      const completedTask = {
        ...taskData,
        completedDate: formattedDate,
        isCompleted: true,
      };
      
      return {completedTask: completedTask, originalTask: taskData}; 
    } else {
    try {
      const completedTask = await markTaskAsCompletedInFirestore(userId, taskId, completedDate);
      
      return {completedTask, originalTask: taskData};
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
}
);


export const addCompletedTask = createAsyncThunk('tasks/addCompletedTask', 
  async ({userId, task, dueDate}, thunkAPI) => {
    const state = thunkAPI.getState();
    
    if (state.tasks.demo) {
      const currentDate = new Date();
      const dateString = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const [month, day, year] = dateString.split('/');
      const formattedDate = `${year}-${month}-${day}`;

      const { id, ...otherFields } = task;
      const completedTask = {
        ...otherFields,
        isCompleted: true, 
        completedDate: formattedDate,
      };
      if (task.type === 'recurring') {
        completedTask.dueDate = dueDate;
      }
      const mockId = `mock-${Date.now()}`;
      return { ...completedTask, id: mockId, docId: mockId };  

    } else {
    try {
      const completedTask = await addCompletedTaskToFirestore(userId, task, dueDate);
      return completedTask;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
}
);

export const deleteCompletedTask = createAsyncThunk(
  'tasks/deleteCompletedTask',
  async ({userId, taskId}, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.tasks.demo) {
      return taskId;
    } else {
    try {
      await deleteCompletedTaskFromFirestore(userId, taskId);
      return taskId;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
}
);


export const getCompletedTasks = createAsyncThunk('tasks/getCompletedTasks', 
  async (userId, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.tasks.demo) {
      return state.tasks.completedTasks;
    } else {
    try {
      const completedTasks = await getCompletedTasksFromFirestore(userId);
      return completedTasks;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
}
);

const initialState = {
  tasks: [],
  completedTasks: [],
  status: 'idle',
  error: null,
  demo: false
};


const taskSlice = createSlice({
  name: 'tasks',
  initialState: initialState,
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
    .addCase(demoSlice.actions.toggleDemoMode, (state, action,) => {
      
      state.demo = !state.demo;
      if (state.demo) {
        const { DUMMY_TASKS, DUMMY_COMPLETED_TASKS } = generateDynamicDummyTasks();
        state.tasks = DUMMY_TASKS;
        state.completedTasks= DUMMY_COMPLETED_TASKS;
      } else {
        state.tasks= [],
        state.completedTasks= [],
        state.status= 'idle',
        state.error= null
      }

    })
    .addCase(userLoggedOut, (state) => {
      if (!state.demo) {
      return {
        tasks: [],
        completedTasks: [],
        status: 'idle',
        error: null
      };
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
  
      const taskIndex = state.tasks.findIndex(task => task.id === action.payload.originalTask.id);
      if (taskIndex !== -1) {
          state.tasks[taskIndex].isCompleted = true;
      }
      state.completedTasks.push(completedTask);

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
