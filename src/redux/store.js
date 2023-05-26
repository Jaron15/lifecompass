import { configureStore } from '@reduxjs/toolkit'
import taskReducer from './tasks/tasksSlice'
import hobbiesReducer from './hobbies/hobbiesSlice'

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    hobbies: hobbiesReducer
  },
})
