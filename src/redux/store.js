import { configureStore } from '@reduxjs/toolkit'
import taskReducer from './tasks/tasksSlice'

export const store = configureStore({
  reducer: {
    tasks: taskReducer
  },
})
